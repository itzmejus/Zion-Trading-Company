export type BillType = "cash" | "credit"

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: {
      next_document_number: {
        Args: { counter_key: string }
        Returns: number
      }
    }
    Tables: {
      company_profile: {
        Row: {
          id: string
          company_name: string
          address: string
          city: string
          state: string
          pincode: string
          gstin: string
          phone: string
          email: string
          logo_url: string | null
          seal_url: string | null
          signature_url: string | null
          bank_name: string
          account_holder: string
          account_number: string
          ifsc: string
          branch: string
          invoice_prefix: string
          quote_prefix: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["company_profile"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["company_profile"]["Row"]>
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          name: string
          contact_person: string
          address: string
          city: string
          state: string
          pincode: string
          gstin: string
          phone: string
          email: string
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["customers"]["Row"]> & {
          name: string
        }
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          hsn_code: string
          unit: string
          landing_cost: number
          selling_cost: number
          supplier_name: string
          sgst_percent: number
          cgst_percent: number
          stock_qty: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          name: string
        }
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>
        Relationships: []
      }
      numbering_counters: {
        Row: {
          id: string
          next_number: number
        }
        Insert: Database["public"]["Tables"]["numbering_counters"]["Row"]
        Update: Partial<Database["public"]["Tables"]["numbering_counters"]["Row"]>
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          invoice_date: string
          bill_type: BillType
          customer_id: string
          subtotal: number
          discount_total: number
          cgst_total: number
          sgst_total: number
          igst_total: number
          grand_total: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["invoices"]["Row"]> & {
          invoice_number: string
          customer_id: string
        }
        Update: Partial<Database["public"]["Tables"]["invoices"]["Row"]>
        Relationships: []
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_id: string | null
          item_name: string
          hsn_code: string
          qty: number
          rate: number
          discount_percent: number
          sgst_percent: number
          cgst_percent: number
          cgst_amount: number
          sgst_amount: number
          igst_amount: number
          gross_amount: number
          total_amount: number
          sort_order: number
        }
        Insert: Partial<Database["public"]["Tables"]["invoice_items"]["Row"]> & {
          invoice_id: string
          item_name: string
        }
        Update: Partial<Database["public"]["Tables"]["invoice_items"]["Row"]>
        Relationships: []
      }
      quotations: {
        Row: {
          id: string
          quote_number: string
          quote_date: string
          customer_id: string
          subtotal: number
          discount_total: number
          grand_total: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["quotations"]["Row"]> & {
          quote_number: string
          customer_id: string
        }
        Update: Partial<Database["public"]["Tables"]["quotations"]["Row"]>
        Relationships: []
      }
      quotation_items: {
        Row: {
          id: string
          quotation_id: string
          product_id: string | null
          item_name: string
          qty: number
          rate: number
          discount_percent: number
          total_amount: number
          sort_order: number
        }
        Insert: Partial<Database["public"]["Tables"]["quotation_items"]["Row"]> & {
          quotation_id: string
          item_name: string
        }
        Update: Partial<Database["public"]["Tables"]["quotation_items"]["Row"]>
        Relationships: []
      }
    }
  }
}

export type CompanyProfile = Database["public"]["Tables"]["company_profile"]["Row"]
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"]
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"]
export type Quotation = Database["public"]["Tables"]["quotations"]["Row"]
export type QuotationItem = Database["public"]["Tables"]["quotation_items"]["Row"]
