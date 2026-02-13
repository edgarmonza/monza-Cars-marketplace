## Testscript: Garage Advisory Schema Alignment (Read-only + Minimal Inserts)

Objective: Inventory the current Supabase Postgres schema for "Garage Advisory" and validate a proposed additive migration aligns with `BASE_DATOS_COMPLETA_TODOS_LUJO.md` and `QUICK_START_CAMILO_1PAGE.md`.

Prerequisites:
- Supabase project access (SQL editor or `supabase db` access)
- A safe environment to run writes (recommended: Supabase dev branch)

Setup:
1) Open Supabase SQL editor for the target environment.
2) Start a transaction for the write section so you can rollback.

Run (Read-only Inventory SQL):
```sql
-- Environment matrix
select version();
show server_version;
show server_version_num;
show TimeZone;

-- Extensions
select extname, extversion
from pg_extension
order by extname;

-- Tables (public)
select table_name
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE'
order by table_name;

-- Enums / custom types (public)
select
  n.nspname as schema,
  t.typname as type_name,
  e.enumlabel as enum_label,
  e.enumsortorder as sort
from pg_type t
join pg_namespace n on n.oid = t.typnamespace
join pg_enum e on e.enumtypid = t.oid
where n.nspname = 'public'
order by t.typname, e.enumsortorder;

-- Column inventory for core tables (if present)
select
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'listings','vehicle_specs','pricing','auction_info','location_data',
    'provenance_data','vehicle_history','photos_media','price_history',
    'market_segments','market_analytics'
  )
order by table_name, ordinal_position;

-- Indexes
select schemaname, tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'listings','vehicle_specs','pricing','auction_info','location_data',
    'provenance_data','vehicle_history','photos_media','price_history',
    'market_segments','market_analytics'
  )
order by tablename, indexname;

-- Foreign keys
select
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name as foreign_table_name,
  ccu.column_name as foreign_column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema = tc.table_schema
where tc.table_schema = 'public'
  and tc.constraint_type = 'FOREIGN KEY'
  and tc.table_name in (
    'listings','vehicle_specs','pricing','auction_info','location_data',
    'provenance_data','vehicle_history','photos_media','price_history',
    'market_segments','market_analytics'
  )
order by tc.table_name, tc.constraint_name, kcu.ordinal_position;
```

Run (Minimal Inserts + Constraint Checks - recommended in dev branch only):
```sql
begin;

-- Create a minimal listing (adjust required columns if your schema differs)
insert into public.listings (
  source,
  source_id,
  source_url,
  year,
  make,
  model,
  sale_date,
  country,
  status
) values (
  'BaT',
  'bat-0001',
  'https://example.invalid/listing/bat-0001',
  extract(year from current_date)::int,
  'Ferrari',
  'F355',
  current_date,
  'Germany',
  'sold'
) returning id;

-- 1:1 tables (should enforce uniqueness on listing_id)
insert into public.vehicle_specs (listing_id) values ((select id from public.listings where source='BaT' and source_id='bat-0001'));
insert into public.pricing (listing_id, original_currency) values ((select id from public.listings where source='BaT' and source_id='bat-0001'), 'USD');
insert into public.auction_info (listing_id, auction_house) values ((select id from public.listings where source='BaT' and source_id='bat-0001'), 'Bring a Trailer');
insert into public.location_data (listing_id, country) values ((select id from public.listings where source='BaT' and source_id='bat-0001'), 'Germany');
insert into public.provenance_data (listing_id) values ((select id from public.listings where source='BaT' and source_id='bat-0001'));

-- 0:N tables
insert into public.photos_media (listing_id, photo_url) values ((select id from public.listings where source='BaT' and source_id='bat-0001'), 'https://example.invalid/photo/1.jpg');
insert into public.vehicle_history (listing_id) values ((select id from public.listings where source='BaT' and source_id='bat-0001'));
insert into public.price_history (time, listing_id, status) values (now(), (select id from public.listings where source='BaT' and source_id='bat-0001'), 'active');

-- Query plans: verify the critical indexes exist / are used
explain (analyze, buffers)
select id
from public.listings
where year = extract(year from current_date)::int
  and make = 'Ferrari'
  and model = 'F355';

explain (analyze, buffers)
select id
from public.listings
where country = 'Germany'
  and sale_date >= current_date - interval '365 days';

rollback;
```

Expected Observations:
- Inventory SQL returns: Postgres version, extensions list (look for `pgcrypto` and optionally `timescaledb`), core table presence, enum types (if used), FK relationships, and critical indexes from `QUICK_START_CAMILO_1PAGE.md`.
- Insert section: FKs enforce referential integrity; 1:1 tables reject duplicate `listing_id` when attempted.
- Explain plans: `Index Scan` or `Bitmap Index Scan` for the critical predicates when the relevant indexes exist.

Artifacts:
- Copy/paste results of the Inventory SQL into the discussion thread.
- Copy/paste `EXPLAIN (ANALYZE, BUFFERS)` output for the two example queries.

Cleanup:
- The script uses `rollback;` so no rows persist.

Known Limitations:
- The insert block assumes the target schema uses `country` and `status` in `public.listings` and that `public.pricing.original_currency` exists. Adjust required columns to match your current schema.
