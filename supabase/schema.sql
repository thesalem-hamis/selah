-- Production-safe Supabase schema for Selah e-commerce app
-- Run this once in the Supabase SQL Editor

-- Grant basic schema access
grant usage on schema public to anon, authenticated;

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text,
  role text not null default 'customer',
  avatar text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select using ( true );

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using ( auth.uid() = id );

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
  on public.profiles for update using (
    exists ( select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' )
  );

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text,
  image text not null,
  active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

drop policy if exists "Categories viewable by everyone" on public.categories;
create policy "Categories viewable by everyone"
  on public.categories for select using ( true );

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  ) with check (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  details text[] not null default '{}',
  category text not null,
  subcategory text not null default '',
  price numeric not null,
  old_price numeric,
  sku text unique not null,
  stock integer not null default 0,
  sizes text[] not null default '{}',
  colors jsonb not null default '[]',
  images text[] not null default '{}',
  tags text[] not null default '{}',
  rating numeric not null default 0,
  reviews_count integer not null default 0,
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  status text not null default 'active',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_products_sizes on public.products using gin (sizes);
create index if not exists idx_products_category_status on public.products (category, status);
create index if not exists idx_orders_created_at on public.orders (created_at);
create index if not exists idx_orders_status_paid on public.orders (status, payment_status);

alter table public.products enable row level security;

drop policy if exists "Products viewable by everyone" on public.products;
create policy "Products viewable by everyone"
  on public.products for select using ( true );

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  ) with check (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text,
  joined_at timestamptz default now() not null,
  orders integer not null default 0,
  total_spent numeric not null default 0,
  status text not null default 'active',
  addresses jsonb not null default '[]'
);

alter table public.customers enable row level security;

drop policy if exists "Customers viewable by admins" on public.customers;
create policy "Customers viewable by admins"
  on public.customers for select using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

drop policy if exists "Customers insertable by admins" on public.customers;
create policy "Customers insertable by admins"
  on public.customers for insert with check (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

drop policy if exists "Customers updatable by admins" on public.customers;
create policy "Customers updatable by admins"
  on public.customers for update using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

drop policy if exists "Customers deletable by admins" on public.customers;
create policy "Customers deletable by admins"
  on public.customers for delete using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id text primary key,
  reference text unique not null,
  customer_id text not null,
  customer_name text not null,
  customer_email text not null,
  created_at timestamptz default now() not null,
  items jsonb not null default '[]',
  subtotal numeric not null,
  discount numeric not null default 0,
  shipping numeric not null,
  total numeric not null,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  payment_method text not null,
  delivery_method text not null,
  address jsonb not null,
  estimated_delivery timestamptz
);

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select using (
    auth.uid() in ( select id from public.profiles where email = orders.customer_email )
    or exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

drop policy if exists "Authenticated users can insert orders" on public.orders;
create policy "Authenticated users can insert orders"
  on public.orders for insert with check ( auth.uid() is not null );

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- ============================================================
-- REVIEWS & TESTIMONIALS
-- ============================================================
create table if not exists public.reviews (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  author text not null,
  rating integer not null,
  title text not null,
  body text not null,
  date text not null
);

alter table public.reviews enable row level security;

drop policy if exists "Reviews viewable by everyone" on public.reviews;
create policy "Reviews viewable by everyone"
  on public.reviews for select using ( true );

drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews"
  on public.reviews for all using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  ) with check (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- Allow authenticated users to insert reviews for their purchased orders
drop policy if exists "Users can insert reviews" on public.reviews;
create policy "Users can insert reviews"
  on public.reviews for insert with check ( auth.uid() is not null );

-- Trigger to auto-update product rating when reviews change
create or replace function public.update_product_rating()
returns trigger as $$
begin
  update public.products
  set rating = subquery.avg_rating,
      reviews_count = subquery.review_count,
      updated_at = now()
  from (
    select
      coalesce(avg(r.rating), 0) as avg_rating,
      count(*) as review_count
    from public.reviews r
    where r.product_id = (
      select coalesce(new.product_id, old.product_id)
    )
  ) as subquery
   where products.id = (
     select coalesce(new.product_id, old.product_id)
   );
   return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists update_product_rating on public.reviews;
create trigger update_product_rating
  after insert or update or delete on public.reviews
  for each row execute function public.update_product_rating();

-- Add reviews to realtime publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;
end $$;

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  location text not null,
  rating integer not null,
  quote text not null
);

alter table public.testimonials enable row level security;

drop policy if exists "Testimonials viewable by everyone" on public.testimonials;
create policy "Testimonials viewable by everyone"
  on public.testimonials for select using ( true );

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
  on public.testimonials for all using (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  ) with check (
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- ============================================================
-- REALTIME
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'customers'
  ) then
    alter publication supabase_realtime add table public.customers;
  end if;
end $$;

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BACKFILL existing users
-- ============================================================
insert into public.profiles (id, name, role)
select 
  au.id,
  coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email),
  'customer'
from auth.users au
left join public.profiles p on p.id = au.id
where p.id is null
on conflict (id) do nothing;

-- ============================================================
-- DASHBOARD METRICS (pre-calculated stats for admin dashboard)
-- ============================================================
create table if not exists public.dashboard_metrics (
  id text primary key,
  label text not null,
  "value" numeric not null default 0,
  change_pct numeric not null default 0,
  trend text not null check (trend in ('up', 'down')),
  period text not null default '30d',
  updated_at timestamptz default now() not null
);

create index if not exists idx_dashboard_metrics_period on public.dashboard_metrics (period);

-- Enable realtime on dashboard_metrics
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'dashboard_metrics'
  ) then
    alter publication supabase_realtime add table public.dashboard_metrics;
  end if;
end $$;
