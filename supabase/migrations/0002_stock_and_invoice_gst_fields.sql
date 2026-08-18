-- Zion Trading Company CRM — stock detail fields + explicit SGST/CGST rates
-- Run this after 0001_init.sql on projects that already applied it.

-- ---------------------------------------------------------------------------
-- products: landing/selling cost, supplier, explicit SGST% + CGST%
-- ---------------------------------------------------------------------------
alter table products rename column rate to selling_cost;

alter table products
  add column landing_cost numeric(12,2) not null default 0,
  add column supplier_name text not null default '',
  add column sgst_percent numeric(5,2) not null default 0,
  add column cgst_percent numeric(5,2) not null default 0;

update products set sgst_percent = gst_percent / 2, cgst_percent = gst_percent / 2;

alter table products drop column gst_percent;

-- ---------------------------------------------------------------------------
-- invoice_items: store the SGST%/CGST% actually billed, instead of one rate
-- ---------------------------------------------------------------------------
alter table invoice_items
  add column sgst_percent numeric(5,2) not null default 0,
  add column cgst_percent numeric(5,2) not null default 0;

update invoice_items set sgst_percent = gst_percent / 2, cgst_percent = gst_percent / 2;

alter table invoice_items drop column gst_percent;
