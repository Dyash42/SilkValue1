export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      clusters: {
        Row: {
          created_at: string | null
          district: string | null
          id: string
          name: string
          region: string | null
          state: string | null
          updated_at: string | null
          variance_tolerance_percent: number | null
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          id?: string
          name: string
          region?: string | null
          state?: string | null
          updated_at?: string | null
          variance_tolerance_percent?: number | null
        }
        Update: {
          created_at?: string | null
          district?: string | null
          id?: string
          name?: string
          region?: string | null
          state?: string | null
          updated_at?: string | null
          variance_tolerance_percent?: number | null
        }
        Relationships: []
      }
      collection_tickets: {
        Row: {
          collection_photo_url: string | null
          collector_id: string | null
          crate_count: number | null
          created_at: string | null
          factory_accepted_weight: number | null
          factory_rejection_reason: string | null
          gps_lat: number | null
          gps_lng: number | null
          grade: string | null
          gross_weight_kg: number | null
          id: string
          moisture_percent: number | null
          net_weight_kg: number | null
          notes: string | null
          price_per_kg: number | null
          quality_deduction_amount: number | null
          reeler_id: string | null
          route_id: string | null
          route_stop_id: string | null
          status: string | null
          sync_status: string | null
          tare_weight_kg: number | null
          ticket_number: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          collection_photo_url?: string | null
          collector_id?: string | null
          crate_count?: number | null
          created_at?: string | null
          factory_accepted_weight?: number | null
          factory_rejection_reason?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          grade?: string | null
          gross_weight_kg?: number | null
          id?: string
          moisture_percent?: number | null
          net_weight_kg?: number | null
          notes?: string | null
          price_per_kg?: number | null
          quality_deduction_amount?: number | null
          reeler_id?: string | null
          route_id?: string | null
          route_stop_id?: string | null
          status?: string | null
          sync_status?: string | null
          tare_weight_kg?: number | null
          ticket_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          collection_photo_url?: string | null
          collector_id?: string | null
          crate_count?: number | null
          created_at?: string | null
          factory_accepted_weight?: number | null
          factory_rejection_reason?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          grade?: string | null
          gross_weight_kg?: number | null
          id?: string
          moisture_percent?: number | null
          net_weight_kg?: number | null
          notes?: string | null
          price_per_kg?: number | null
          quality_deduction_amount?: number | null
          reeler_id?: string | null
          route_id?: string | null
          route_stop_id?: string | null
          status?: string | null
          sync_status?: string | null
          tare_weight_kg?: number | null
          ticket_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_tickets_collector_id_fkey"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_tickets_reeler_id_fkey"
            columns: ["reeler_id"]
            isOneToOne: false
            referencedRelation: "reelers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_tickets_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_entries: {
        Row: {
          actual_arrival_time: string | null
          created_at: string | null
          expected_arrival_time: string | null
          factory_deduction_weight: number | null
          gate_gross_weight: number | null
          gate_net_weight: number | null
          gate_operator_id: string | null
          gate_tare_weight: number | null
          id: string
          qc_foreign_material_percent: number | null
          qc_moisture_percent: number | null
          qc_spoilage_percent: number | null
          qc_status: string | null
          route_id: string | null
          variance_notes: string | null
          vehicle_id: string | null
          weight_variance: number | null
        }
        Insert: {
          actual_arrival_time?: string | null
          created_at?: string | null
          expected_arrival_time?: string | null
          factory_deduction_weight?: number | null
          gate_gross_weight?: number | null
          gate_net_weight?: number | null
          gate_operator_id?: string | null
          gate_tare_weight?: number | null
          id?: string
          qc_foreign_material_percent?: number | null
          qc_moisture_percent?: number | null
          qc_spoilage_percent?: number | null
          qc_status?: string | null
          route_id?: string | null
          variance_notes?: string | null
          vehicle_id?: string | null
          weight_variance?: number | null
        }
        Update: {
          actual_arrival_time?: string | null
          created_at?: string | null
          expected_arrival_time?: string | null
          factory_deduction_weight?: number | null
          gate_gross_weight?: number | null
          gate_net_weight?: number | null
          gate_operator_id?: string | null
          gate_tare_weight?: number | null
          id?: string
          qc_foreign_material_percent?: number | null
          qc_moisture_percent?: number | null
          qc_spoilage_percent?: number | null
          qc_status?: string | null
          route_id?: string | null
          variance_notes?: string | null
          vehicle_id?: string | null
          weight_variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_entries_gate_operator_id_fkey"
            columns: ["gate_operator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_entries_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          collection_ticket_id: string | null
          created_at: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          processed_at: string | null
          processed_by: string | null
          reeler_id: string | null
          transaction_reference: string | null
        }
        Insert: {
          amount?: number | null
          collection_ticket_id?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reeler_id?: string | null
          transaction_reference?: string | null
        }
        Update: {
          amount?: number | null
          collection_ticket_id?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reeler_id?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_collection_ticket_id_fkey"
            columns: ["collection_ticket_id"]
            isOneToOne: false
            referencedRelation: "collection_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reeler_id_fkey"
            columns: ["reeler_id"]
            isOneToOne: false
            referencedRelation: "reelers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cluster_id: string | null
          created_at: string | null
          employee_id: string | null
          full_name: string
          id: string
          is_verified: boolean | null
          paired_scale_mac: string | null
          paired_scale_name: string | null
          phone: string
          preferred_language: string | null
          push_alerts_enabled: boolean | null
          role: string
          short_code: string | null
          sms_alerts_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          cluster_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          full_name: string
          id?: string
          is_verified?: boolean | null
          paired_scale_mac?: string | null
          paired_scale_name?: string | null
          phone: string
          preferred_language?: string | null
          push_alerts_enabled?: boolean | null
          role: string
          short_code?: string | null
          sms_alerts_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          cluster_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean | null
          paired_scale_mac?: string | null
          paired_scale_name?: string | null
          phone?: string
          preferred_language?: string | null
          push_alerts_enabled?: boolean | null
          role?: string
          short_code?: string | null
          sms_alerts_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      reelers: {
        Row: {
          aadhaar_no: string | null
          address_state: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_name: string | null
          cluster_id: string | null
          created_at: string | null
          district: string | null
          dob: string | null
          doc_aadhaar_url: string | null
          doc_pan_url: string | null
          doc_selfie_url: string | null
          farm_lat: number | null
          farm_lng: number | null
          full_name: string | null
          gender: string | null
          id: string
          kyc_status: string | null
          phone: string | null
          qr_code_hash: string | null
          qr_code_url: string | null
          taluk: string | null
          updated_at: string | null
          upi_id: string | null
          village: string | null
        }
        Insert: {
          aadhaar_no?: string | null
          address_state?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          cluster_id?: string | null
          created_at?: string | null
          district?: string | null
          dob?: string | null
          doc_aadhaar_url?: string | null
          doc_pan_url?: string | null
          doc_selfie_url?: string | null
          farm_lat?: number | null
          farm_lng?: number | null
          full_name?: string | null
          gender?: string | null
          id: string
          kyc_status?: string | null
          phone?: string | null
          qr_code_hash?: string | null
          qr_code_url?: string | null
          taluk?: string | null
          updated_at?: string | null
          upi_id?: string | null
          village?: string | null
        }
        Update: {
          aadhaar_no?: string | null
          address_state?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          cluster_id?: string | null
          created_at?: string | null
          district?: string | null
          dob?: string | null
          doc_aadhaar_url?: string | null
          doc_pan_url?: string | null
          doc_selfie_url?: string | null
          farm_lat?: number | null
          farm_lng?: number | null
          full_name?: string | null
          gender?: string | null
          id?: string
          kyc_status?: string | null
          phone?: string | null
          qr_code_hash?: string | null
          qr_code_url?: string | null
          taluk?: string | null
          updated_at?: string | null
          upi_id?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reelers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      route_stops: {
        Row: {
          arrived_at: string | null
          created_at: string | null
          departed_at: string | null
          expected_weight: number | null
          id: string
          reeler_id: string | null
          route_id: string | null
          skip_reason: string | null
          status: string | null
          stop_order: number | null
          updated_at: string | null
        }
        Insert: {
          arrived_at?: string | null
          created_at?: string | null
          departed_at?: string | null
          expected_weight?: number | null
          id?: string
          reeler_id?: string | null
          route_id?: string | null
          skip_reason?: string | null
          status?: string | null
          stop_order?: number | null
          updated_at?: string | null
        }
        Update: {
          arrived_at?: string | null
          created_at?: string | null
          departed_at?: string | null
          expected_weight?: number | null
          id?: string
          reeler_id?: string | null
          route_id?: string | null
          skip_reason?: string | null
          status?: string | null
          stop_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_reeler_id_fkey"
            columns: ["reeler_id"]
            isOneToOne: false
            referencedRelation: "reelers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          cluster_id: string | null
          collector_id: string | null
          created_at: string | null
          date: string | null
          id: string
          name: string | null
          scheduled_date: string | null
          status: string | null
          supervisor_id: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          cluster_id?: string | null
          collector_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string | null
          scheduled_date?: string | null
          status?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          cluster_id?: string | null
          collector_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string | null
          scheduled_date?: string | null
          status?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_collector_id_fkey"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          cluster_id: string | null
          created_at: string | null
          driver_name: string | null
          driver_phone: string | null
          id: string
          registration_number: string
          vehicle_type: string | null
        }
        Insert: {
          cluster_id?: string | null
          created_at?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          registration_number: string
          vehicle_type?: string | null
        }
        Update: {
          cluster_id?: string | null
          created_at?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          registration_number?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "clusters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
