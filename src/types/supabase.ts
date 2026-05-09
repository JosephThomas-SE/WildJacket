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
      camp_packages: {
        Row: {
          id: number;
          title: string;
          slug: string;
          description: string;
          location: string;
          price_per_person: number;
          max_capacity: number;
          is_active: boolean;
        };
        Insert: {
          id?: number;
          title: string;
          slug: string;
          description: string;
          location: string;
          price_per_person: number;
          max_capacity: number;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          location?: string;
          price_per_person?: number;
          max_capacity?: number;
          is_active?: boolean;
        };
      };
      bookings: {
        Row: {
          id: number;
          booking_reference: string;
          user_id: string;
          package_id: number;
          availability_id: number;
          guest_count: number;
          total_amount: number;
          advance_amount: number;
          payment_status: string;
          booking_status: string;
          special_requests: string | null;
          booked_for_date: string;
        };
        Insert: {
          id?: number;
          booking_reference?: string;
          user_id: string;
          package_id: number;
          availability_id: number;
          guest_count: number;
          total_amount: number;
          advance_amount?: number;
          payment_status?: string;
          booking_status?: string;
          special_requests?: string | null;
          booked_for_date: string;
        };
        Update: {
          booking_reference?: string;
          user_id?: string;
          package_id?: number;
          availability_id?: number;
          guest_count?: number;
          total_amount?: number;
          advance_amount?: number;
          payment_status?: string;
          booking_status?: string;
          special_requests?: string | null;
          booked_for_date?: string;
        };
      };
      availability: {
        Row: {
          package_id: number;
          available_date: string;
          total_slots: number;
          booked_slots: number;
        };
        Insert: {
          package_id: number;
          available_date: string;
          total_slots: number;
          booked_slots?: number;
        };
        Update: {
          package_id?: number;
          available_date?: string;
          total_slots?: number;
          booked_slots?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
