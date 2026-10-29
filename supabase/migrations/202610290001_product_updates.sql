-- Allow authenticated admins to edit existing products, including installations
-- where the original schema's management policy has not been applied.
begin;

drop policy if exists "Admins update products" on public.products;
create policy "Admins update products"
  on public.products for update to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create or replace function public.set_product_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_product_updated_at on public.products;
create trigger set_product_updated_at
before update on public.products
for each row execute function public.set_product_updated_at();

commit;
