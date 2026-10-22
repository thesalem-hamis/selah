alter table public.orders add column if not exists coupon_code text;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders for select using (
  auth.uid()::text = customer_id
  or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
drop policy if exists "Authenticated users can insert orders" on public.orders;
create policy "Authenticated users can insert orders" on public.orders
  for insert with check (auth.uid()::text = customer_id);

create table if not exists public.customer_reward_accounts (
  id text primary key default gen_random_uuid()::text,
  customer_id uuid unique not null references public.profiles(id) on delete cascade,
  points_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists date_of_birth timestamptz;

create table if not exists public.reward_transactions (
  id text primary key default gen_random_uuid()::text,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  order_id text,
  source_key text,
  type text not null check (type in ('earn', 'redeem', 'refund', 'adjustment')),
  points integer not null,
  description text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists reward_transactions_source_key
  on public.reward_transactions(customer_id, source_key) where source_key is not null;
create unique index if not exists reward_transactions_order_type
  on public.reward_transactions(customer_id, order_id, type) where order_id is not null;
alter table public.reward_transactions add column if not exists source_key text;

create table if not exists public.instagram_posts (
  id text primary key default gen_random_uuid()::text,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  image_url text not null,
  preaching boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  points integer not null default 0,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reward_redemptions (
  id text primary key default gen_random_uuid()::text,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  reward text not null check (reward in ('face_mask', 'spa_day')),
  points_cost integer not null,
  source_key text,
  status text not null default 'pending' check (status in ('pending', 'fulfilled', 'cancelled')),
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz
);
alter table public.reward_redemptions add column if not exists source_key text;
create unique index if not exists reward_redemptions_source_key
  on public.reward_redemptions(customer_id, source_key) where source_key is not null;

alter table public.customer_reward_accounts enable row level security;
alter table public.reward_transactions enable row level security;
alter table public.instagram_posts enable row level security;
alter table public.reward_redemptions enable row level security;

drop policy if exists "Customers view own reward account" on public.customer_reward_accounts;
create policy "Customers view own reward account" on public.customer_reward_accounts
  for select using (auth.uid() = customer_id);
drop policy if exists "Admins manage reward accounts" on public.customer_reward_accounts;
create policy "Admins manage reward accounts" on public.customer_reward_accounts
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Customers view own reward transactions" on public.reward_transactions;
create policy "Customers view own reward transactions" on public.reward_transactions
  for select using (auth.uid() = customer_id);
drop policy if exists "Admins manage reward transactions" on public.reward_transactions;
create policy "Admins manage reward transactions" on public.reward_transactions
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Customers view own instagram posts" on public.instagram_posts;
create policy "Customers view own instagram posts" on public.instagram_posts
  for select using (auth.uid() = customer_id);
drop policy if exists "Customers insert own instagram posts" on public.instagram_posts;
create policy "Customers insert own instagram posts" on public.instagram_posts
  for insert with check (
    auth.uid() = customer_id and status = 'pending' and points = 0 and reviewed_by is null
  );
drop policy if exists "Admins manage instagram posts" on public.instagram_posts;
create policy "Admins manage instagram posts" on public.instagram_posts
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Customers view own reward redemptions" on public.reward_redemptions;
create policy "Customers view own reward redemptions" on public.reward_redemptions
  for select using (auth.uid() = customer_id);
drop policy if exists "Customers insert own reward redemptions" on public.reward_redemptions;
drop policy if exists "Admins manage reward redemptions" on public.reward_redemptions;
create policy "Admins manage reward redemptions" on public.reward_redemptions
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create or replace function public.ensure_reward_account()
returns integer language plpgsql security definer set search_path = public as $$
declare balance integer;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  insert into public.customer_reward_accounts(customer_id) values (auth.uid())
    on conflict (customer_id) do nothing;
  select points_balance into balance from public.customer_reward_accounts where customer_id = auth.uid();
  return balance;
end;
$$;

create or replace function public.save_reward_birthday(p_birthday date)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_birthday > current_date or p_birthday < current_date - interval '120 years' then
    raise exception 'Birthday is invalid';
  end if;
  update public.profiles set date_of_birth = p_birthday where id = auth.uid();
end;
$$;

create or replace function public.claim_birthday_reward()
returns boolean language plpgsql security definer set search_path = public as $$
declare birthday date; reward_key text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select date_of_birth::date into birthday from public.profiles where id = auth.uid();
  if birthday is null or (extract(month from birthday), extract(day from birthday)) <>
    (extract(month from current_date), extract(day from current_date)) then return false; end if;
  reward_key := 'birthday:' || extract(year from current_date)::text;
  insert into public.customer_reward_accounts(customer_id) values (auth.uid())
    on conflict (customer_id) do nothing;
  insert into public.reward_transactions(customer_id, source_key, type, points, description)
    values (auth.uid(), reward_key, 'earn', 5, 'Birthday points')
    on conflict (customer_id, source_key) where source_key is not null do nothing;
  if not found then return false; end if;
  update public.customer_reward_accounts set points_balance = points_balance + 5, updated_at = now()
    where customer_id = auth.uid();
  insert into public.reward_redemptions(customer_id, reward, points_cost, source_key)
    values (auth.uid(), 'face_mask', 0, reward_key);
  return true;
end;
$$;

create or replace function public.process_birthday_rewards()
returns integer language plpgsql security definer set search_path = public as $$
declare customer record; reward_key text; awarded integer := 0;
begin
  reward_key := 'birthday:' || extract(year from current_date)::text;
  for customer in
    select id from public.profiles
    where date_of_birth is not null
      and extract(month from date_of_birth::date) = extract(month from current_date)
      and extract(day from date_of_birth::date) = extract(day from current_date)
  loop
    insert into public.customer_reward_accounts(customer_id) values (customer.id)
      on conflict (customer_id) do nothing;
    insert into public.reward_transactions(customer_id, source_key, type, points, description)
      values (customer.id, reward_key, 'earn', 5, 'Birthday points')
      on conflict (customer_id, source_key) where source_key is not null do nothing;
    if found then
      update public.customer_reward_accounts
        set points_balance = points_balance + 5, updated_at = now()
        where customer_id = customer.id;
      insert into public.reward_redemptions(customer_id, reward, points_cost, source_key)
        values (customer.id, 'face_mask', 0, reward_key)
        on conflict (customer_id, source_key) where source_key is not null do nothing;
      awarded := awarded + 1;
    end if;
  end loop;
  return awarded;
end;
$$;

revoke all on function public.process_birthday_rewards() from public, anon, authenticated;
create extension if not exists pg_cron;
do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'selah-birthday-rewards';
  perform cron.schedule('selah-birthday-rewards', '5 0 * * *',
    'select public.process_birthday_rewards();');
end;
$$;

create or replace function public.redeem_reward(p_reward text)
returns text language plpgsql security definer set search_path = public as $$
declare cost integer; account public.customer_reward_accounts%rowtype; redemption_id text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  cost := case p_reward when 'face_mask' then 7 when 'spa_day' then 15 else null end;
  if cost is null then raise exception 'Reward is not available'; end if;
  insert into public.customer_reward_accounts(customer_id) values (auth.uid()) on conflict (customer_id) do nothing;
  select * into account from public.customer_reward_accounts where customer_id = auth.uid() for update;
  if account.points_balance < cost then raise exception 'You do not have enough points'; end if;
  redemption_id := gen_random_uuid()::text;
  update public.customer_reward_accounts set points_balance = points_balance - cost, updated_at = now()
    where customer_id = auth.uid();
  insert into public.reward_transactions(customer_id, source_key, type, points, description)
    values (auth.uid(), 'redemption:' || redemption_id, 'redeem', -cost, 'Reward redeemed');
  insert into public.reward_redemptions(id, customer_id, reward, points_cost)
    values (redemption_id, auth.uid(), p_reward, cost);
  return redemption_id;
end;
$$;

create or replace function public.review_instagram_post(p_post_id text, p_approve boolean)
returns void language plpgsql security definer set search_path = public as $$
declare post_row public.instagram_posts%rowtype; awarded integer;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Administrator access required';
  end if;
  select * into post_row from public.instagram_posts where id = p_post_id for update;
  if not found or post_row.status <> 'pending' then raise exception 'Submission is no longer pending'; end if;
  awarded := case when post_row.preaching then 10 else 5 end;
  update public.instagram_posts set status = case when p_approve then 'approved' else 'rejected' end,
    points = case when p_approve then awarded else 0 end,
    reviewed_by = auth.uid(), reviewed_at = now() where id = p_post_id;
  if p_approve then
    insert into public.customer_reward_accounts(customer_id) values (post_row.customer_id)
      on conflict (customer_id) do nothing;
    update public.customer_reward_accounts set points_balance = points_balance + awarded, updated_at = now()
      where customer_id = post_row.customer_id;
    insert into public.reward_transactions(customer_id, source_key, type, points, description)
      values (post_row.customer_id, 'instagram:' || p_post_id, 'earn', awarded,
        case when post_row.preaching then 'Approved Instagram post while preaching or evangelising' else 'Approved Instagram post wearing Selah' end);
  end if;
end;
$$;

create or replace function public.award_paid_order_points()
returns trigger language plpgsql security definer set search_path = public as $$
declare points_awarded integer; customer_uuid uuid;
begin
  if new.payment_status = 'paid' and (tg_op = 'INSERT' or old.payment_status is distinct from 'paid') then
    select id into customer_uuid from public.profiles where id::text = new.customer_id;
    if customer_uuid is null then return new; end if;
    insert into public.customer_reward_accounts(customer_id) values (customer_uuid)
      on conflict (customer_id) do nothing;
    perform 1 from public.customer_reward_accounts where customer_id = customer_uuid for update;
    if exists (select 1 from public.reward_transactions where customer_id = customer_uuid and type = 'earn' and order_id is not null)
      or exists (select 1 from public.orders where customer_id = new.customer_id and id <> new.id and payment_status in ('paid', 'refunded')) then
      points_awarded := 3;
    else
      points_awarded := 5;
    end if;
    insert into public.reward_transactions(customer_id, order_id, source_key, type, points, description)
      values (customer_uuid, new.id, 'order:' || new.id, 'earn', points_awarded,
        case when points_awarded = 5 then 'Points for your first purchase' else 'Points for a repeat purchase' end)
      on conflict do nothing;
    if found then
      update public.customer_reward_accounts set points_balance = points_balance + points_awarded, updated_at = now()
        where customer_id = customer_uuid;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.reverse_refunded_order_points()
returns trigger language plpgsql security definer set search_path = public as $$
declare earned integer; customer_uuid uuid;
begin
  if new.payment_status = 'refunded' and old.payment_status is distinct from 'refunded' then
    select id into customer_uuid from public.profiles where id::text = new.customer_id;
    if customer_uuid is null then return new; end if;
    select points into earned from public.reward_transactions
      where customer_id = customer_uuid and order_id = new.id and type = 'earn';
    if earned is not null then
      insert into public.reward_transactions(customer_id, order_id, source_key, type, points, description)
        values (customer_uuid, new.id, 'refund:' || new.id, 'refund', -earned, 'Points returned after order refund')
        on conflict do nothing;
      if found then
        update public.customer_reward_accounts set points_balance = points_balance - earned, updated_at = now()
          where customer_id = customer_uuid;
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists award_paid_order_points on public.orders;
create trigger award_paid_order_points after insert or update of payment_status on public.orders
  for each row execute function public.award_paid_order_points();
drop trigger if exists reverse_refunded_order_points on public.orders;
create trigger reverse_refunded_order_points after update of payment_status on public.orders
  for each row execute function public.reverse_refunded_order_points();

revoke all on function public.ensure_reward_account() from public;
revoke all on function public.save_reward_birthday(date) from public;
revoke all on function public.claim_birthday_reward() from public;
revoke all on function public.redeem_reward(text) from public;
revoke all on function public.review_instagram_post(text, boolean) from public;
grant execute on function public.ensure_reward_account() to authenticated;
grant execute on function public.save_reward_birthday(date) to authenticated;
grant execute on function public.claim_birthday_reward() to authenticated;
grant execute on function public.redeem_reward(text) to authenticated;
grant execute on function public.review_instagram_post(text, boolean) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('rewards-evidence', 'rewards-evidence', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Customers upload own rewards evidence" on storage.objects;
create policy "Customers upload own rewards evidence" on storage.objects for insert to authenticated
  with check (bucket_id = 'rewards-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Customers and admins view rewards evidence" on storage.objects;
create policy "Customers and admins view rewards evidence" on storage.objects for select to authenticated
  using (bucket_id = 'rewards-evidence' and (
    (storage.foldername(name))[1] = auth.uid()::text or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  ));

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'customer_reward_accounts') then
    alter publication supabase_realtime add table public.customer_reward_accounts;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'reward_transactions') then
    alter publication supabase_realtime add table public.reward_transactions;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'instagram_posts') then
    alter publication supabase_realtime add table public.instagram_posts;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'reward_redemptions') then
    alter publication supabase_realtime add table public.reward_redemptions;
  end if;
end;
$$;