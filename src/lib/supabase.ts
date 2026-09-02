// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url =
  import.meta.env["VITE_SUPABASE_URL"] ??
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL;
const anonKey =
  import.meta.env["VITE_SUPABASE_ANON_KEY"] ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (and SUPABASE_URL / SUPABASE_ANON_KEY for the server runtime)."
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Type for your database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          role: 'customer' | 'admin';
          avatar: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          avatar?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          avatar?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          details: string[];
          category: string;
          subcategory: string;
          price: number;
          old_price: number | null;
          sku: string;
          stock: number;
          sizes: string[];
          colors: any[];
          images: string[];
          tags: string[];
          rating: number;
          reviews_count: number;
          featured: boolean;
          best_seller: boolean;
          new_arrival: boolean;
          status: 'active' | 'draft' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<{
          id: string;
          slug: string;
          name: string;
          description: string;
          details: string[];
          category: string;
          subcategory: string;
          price: number;
          old_price: number | null;
          sku: string;
          stock: number;
          sizes: string[];
          colors: any[];
          images: string[];
          tags: string[];
          rating: number;
          reviews_count: number;
          featured: boolean;
          best_seller: boolean;
          new_arrival: boolean;
          status: 'active' | 'draft' | 'archived';
        }>;
        Update: Partial<{
          name: string;
          description: string;
          details: string[];
          category: string;
          subcategory: string;
          price: number;
          old_price: number | null;
          stock: number;
          sizes: string[];
          colors: any[];
          images: string[];
          tags: string[];
          rating: number;
          reviews_count: number;
          featured: boolean;
          best_seller: boolean;
          new_arrival: boolean;
          status: 'active' | 'draft' | 'archived';
        }>;
      };
      orders: {
        Row: {
          id: string;
          reference: string;
          customer_id: string;
          customer_name: string;
          customer_email: string;
          created_at: string;
          items: any[];
          subtotal: number;
          discount: number;
          shipping: number;
          total: number;
          status: string;
          payment_status: string;
          payment_method: string;
          delivery_method: string;
          address: any;
          estimated_delivery: string | null;
        };
        Insert: Partial<{
          id: string;
          reference: string;
          customer_id: string;
          customer_name: string;
          customer_email: string;
          items: any[];
          subtotal: number;
          discount: number;
          shipping: number;
          total: number;
          status: string;
          payment_status: string;
          payment_method: string;
          delivery_method: string;
          address: any;
          estimated_delivery: string | null;
        }>;
        Update: Partial<{
          status: string;
          payment_status: string;
          estimated_delivery: string | null;
        }>;
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          joined_at: string;
          orders: number;
          total_spent: number;
          status: string;
          addresses: any[];
        };
        Insert: Partial<{
          id: string;
          name: string;
          email: string;
          phone: string | null;
          orders: number;
          total_spent: number;
          status: string;
          addresses: any[];
        }>;
        Update: Partial<{
          name: string;
          phone: string | null;
          orders: number;
          total_spent: number;
          status: string;
          addresses: any[];
        }>;
      };
    };
  };
};