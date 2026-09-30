-- Collapses the catalogue onto a single storefront category: Women Clothing.
--
-- Run this once in the Supabase SQL Editor. It is idempotent, so re-running it
-- is a no-op.
--
-- Notes on the live schema (it differs from supabase/schema.sql):
--   * public.categories.id is a uuid, not text - so no row id is hardcoded here
--     and new rows get gen_random_uuid().
--   * ON CONFLICT is avoided entirely, so this does not depend on a unique
--     index existing on slug.
--   * products.category is a plain text column holding slug strings ("tops",
--     …). There is no category_id and no foreign key, so existing products keep
--     their values and continue to drive product-level filtering. Only the
--     category list itself changes, which is what the admin product form reads.

-- 1. Update the single category in place if it already exists.
update public.categories
set
  name = 'Women Clothing',
  description = 'Modest dresses, abayas, co-ords and everyday layers - everything we make, in one wardrobe.',
  active = true
where slug = 'women-clothing';

-- 2. Otherwise create it.
insert into public.categories (id, slug, name, description, image, active)
select
  gen_random_uuid(),
  'women-clothing',
  'Women Clothing',
  'Modest dresses, abayas, co-ords and everyday layers - everything we make, in one wardrobe.',
  'https://placehold.co/600x400?text=Women%20Clothing',
  true
where not exists (
  select 1 from public.categories where slug = 'women-clothing'
);

-- 3. Drop the retired rows (dresses, tops, bottoms, outerwear, accessories,
--    shoes, bags). Nothing references these ids, so this orphans no products.
delete from public.categories
where slug <> 'women-clothing';

-- 4. Confirm the result: expect exactly one row.
select id, slug, name, active from public.categories order by slug;
