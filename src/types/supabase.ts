export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      packages: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description?: string | null;
          location?: string | null;
          price_per_guest: number;
          max_guests: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          location?: string | null;
          price_per_guest: number;
          max_guests: number;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          location?: string | null;
          price_per_guest?: number;
          max_guests?: number;
        };
      };
      bookings: {
        Row: {
          id: string;
          package_id: string;
          user_id: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          guest_count: number;
          total_price: number;
          start_date: string;
          end_date: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          package_id: string;
          user_id: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          guest_count: number;
          total_price: number;
          start_date: string;
          end_date: string;
        };
        Update: {
          package_id?: string;
          user_id?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          guest_count?: number;
          total_price?: number;
          start_date?: string;
          end_date?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
