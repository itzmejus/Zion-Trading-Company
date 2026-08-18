# Zion Trading Company — CRM

Internal CRM for stock, customers, GST bills and quotations. Next.js (App Router, TypeScript) + Supabase, deployed on Render.

## Features

- **Stock** — product catalog with HSN code, rate, GST%, quantity on hand.
- **Companies** — customer master (GSTIN, address, state).
- **Bills** — GST tax invoices: pick a company, auto-fills their details; auto CGST+SGST (same state) or IGST (different state); auto sequential numbering per financial year; deducts stock on save.
- **Quotations** — simple price quotes with their own numbering sequence.
- **Print** — every bill/quotation has a dedicated print-formatted page (`/invoices/[id]/print`, `/quotations/[id]/print`) styled for A4 — use the browser's Print (Ctrl/Cmd+P) to save as PDF.
- **Settings** — company & GST details, bank details, seal image upload, and a draw-and-save signature pad (auto-applied to every document afterwards).
- Single admin login (Supabase Auth email/password), responsive sidebar layout.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). This creates all tables, RLS policies, the numbering function, and the `logo` / `seal` / `signature` storage buckets.
3. Go to **Authentication → Users** and manually add yourself as a user (email + password). There is no public sign-up page — this app is single-admin only.
4. Go to **Project Settings → API** and copy the **Project URL** and **anon public key**.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values from step 1:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the user you created in step 1. Fill in **Settings** first (company details, bank details, seal, signature) since bills and quotations pull from there.

## 4. Deploy to Render

This repo includes a [`render.yaml`](render.yaml) blueprint.

1. Push this repo to GitHub.
2. In Render, choose **New → Blueprint** and point it at the repo (or create a Web Service manually with build command `npm install && npm run build` and start command `npm run start`).
3. Set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables on the service (from step 1).
4. Deploy. The health check path is `/login`.

Supabase stays hosted separately on Supabase's own cloud — Render only runs the Next.js app.

## Notes on GST logic

`company_profile.state` (your state, set in Settings) is compared against each customer's `state`. If they match, bill lines split GST into CGST + SGST; otherwise the full amount goes to IGST — matching standard Indian GST invoicing rules. See [`lib/gst.ts`](lib/gst.ts).

Bills and quotations are treated as immutable once created (matching how finalized tax documents are normally handled) — mistakes are corrected by deleting and re-creating rather than editing in place. Deleting a bill restores the stock quantity it had deducted.
