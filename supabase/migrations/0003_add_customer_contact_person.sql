-- Zion Trading Company CRM — add a contact person field to customers
-- Run this after 0002_stock_and_invoice_gst_fields.sql on projects that already applied it.

alter table customers
  add column contact_person text not null default '';
