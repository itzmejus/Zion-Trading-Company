-- Zion Trading Company CRM — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- company_profile (single row: your own company's details, bank, seal, signature)
-- ---------------------------------------------------------------------------
create table company_profile (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  gstin text not null default '',
  phone text not null default '',
  email text not null default '',
  logo_url text,
  seal_url text,
  signature_url text,
  bank_name text not null default '',
  account_holder text not null default '',
  account_number text not null default '',
  ifsc text not null default '',
  branch text not null default '',
  invoice_prefix text not null default 'ZTC',
  quote_prefix text not null default 'QTN',
  updated_at timestamptz not null default now()
);

create trigger company_profile_set_updated_at
  before update on company_profile
  for each row execute function set_updated_at();

-- seed a single settings row so the app can always UPDATE instead of INSERT
insert into company_profile (company_name) values ('Zion Trading Company');

-- ---------------------------------------------------------------------------
-- customers (the "companies" bills/quotations are made to)
-- ---------------------------------------------------------------------------
create table customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null default '',
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  gstin text not null default '',
  phone text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);

create index customers_name_idx on customers using btree (lower(name));

-- ---------------------------------------------------------------------------
-- products (stock)
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  hsn_code text not null default '',
  unit text not null default 'Nos',
  rate numeric(12,2) not null default 0,
  gst_percent numeric(5,2) not null default 0,
  stock_qty numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create index products_name_idx on products using btree (lower(name));

-- ---------------------------------------------------------------------------
-- sequential numbering for invoices & quotations (per financial year)
-- ---------------------------------------------------------------------------
create table numbering_counters (
  id text primary key, -- e.g. 'invoice-2026-27', 'quote-2026-27'
  next_number integer not null default 1
);

-- Atomically reserves and returns the next number for a given counter key.
create or replace function next_document_number(counter_key text)
returns integer as $$
declare
  result integer;
begin
  insert into numbering_counters (id, next_number)
  values (counter_key, 2)
  on conflict (id) do update set next_number = numbering_counters.next_number + 1
  returning next_number - 1 into result;
  return result;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- invoices (bills)
-- ---------------------------------------------------------------------------
create type bill_type as enum ('cash', 'credit');

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_number text not null unique,
  invoice_date date not null default current_date,
  bill_type bill_type not null default 'cash',
  customer_id uuid not null references customers(id) on delete restrict,
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  cgst_total numeric(12,2) not null default 0,
  sgst_total numeric(12,2) not null default 0,
  igst_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger invoices_set_updated_at
  before update on invoices
  for each row execute function set_updated_at();

create index invoices_customer_idx on invoices (customer_id);
create index invoices_date_idx on invoices (invoice_date desc);

create table invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  item_name text not null,
  hsn_code text not null default '',
  qty numeric(12,2) not null default 1,
  rate numeric(12,2) not null default 0,
  discount_percent numeric(5,2) not null default 0,
  gst_percent numeric(5,2) not null default 0,
  cgst_amount numeric(12,2) not null default 0,
  sgst_amount numeric(12,2) not null default 0,
  igst_amount numeric(12,2) not null default 0,
  gross_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  sort_order integer not null default 0
);

create index invoice_items_invoice_idx on invoice_items (invoice_id);

-- ---------------------------------------------------------------------------
-- quotations
-- ---------------------------------------------------------------------------
create table quotations (
  id uuid primary key default uuid_generate_v4(),
  quote_number text not null unique,
  quote_date date not null default current_date,
  customer_id uuid not null references customers(id) on delete restrict,
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger quotations_set_updated_at
  before update on quotations
  for each row execute function set_updated_at();

create index quotations_customer_idx on quotations (customer_id);
create index quotations_date_idx on quotations (quote_date desc);

create table quotation_items (
  id uuid primary key default uuid_generate_v4(),
  quotation_id uuid not null references quotations(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  item_name text not null,
  qty numeric(12,2) not null default 1,
  rate numeric(12,2) not null default 0,
  discount_percent numeric(5,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  sort_order integer not null default 0
);

create index quotation_items_quotation_idx on quotation_items (quotation_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — single-admin app: any authenticated user has full access.
-- ---------------------------------------------------------------------------
alter table company_profile enable row level security;
alter table customers enable row level security;
alter table products enable row level security;
alter table numbering_counters enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table quotations enable row level security;
alter table quotation_items enable row level security;

create policy "Authenticated full access" on company_profile for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on customers for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on numbering_counters for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on invoices for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on invoice_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on quotations for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on quotation_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage buckets for logo / seal / signature images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('logo', 'logo', true),
  ('seal', 'seal', true),
  ('signature', 'signature', true)
on conflict (id) do nothing;

create policy "Public read logo" on storage.objects for select
  using (bucket_id = 'logo');
create policy "Authenticated write logo" on storage.objects for insert
  with check (bucket_id = 'logo' and auth.role() = 'authenticated');
create policy "Authenticated update logo" on storage.objects for update
  using (bucket_id = 'logo' and auth.role() = 'authenticated');
create policy "Authenticated delete logo" on storage.objects for delete
  using (bucket_id = 'logo' and auth.role() = 'authenticated');

create policy "Public read seal" on storage.objects for select
  using (bucket_id = 'seal');
create policy "Authenticated write seal" on storage.objects for insert
  with check (bucket_id = 'seal' and auth.role() = 'authenticated');
create policy "Authenticated update seal" on storage.objects for update
  using (bucket_id = 'seal' and auth.role() = 'authenticated');
create policy "Authenticated delete seal" on storage.objects for delete
  using (bucket_id = 'seal' and auth.role() = 'authenticated');

create policy "Public read signature" on storage.objects for select
  using (bucket_id = 'signature');
create policy "Authenticated write signature" on storage.objects for insert
  with check (bucket_id = 'signature' and auth.role() = 'authenticated');
create policy "Authenticated update signature" on storage.objects for update
  using (bucket_id = 'signature' and auth.role() = 'authenticated');
create policy "Authenticated delete signature" on storage.objects for delete
  using (bucket_id = 'signature' and auth.role() = 'authenticated');
