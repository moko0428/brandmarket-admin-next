export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      manager_permissions: {
        Row: {
          assigned_stores: string[] | null
          can_edit_products: boolean
          can_manage_inventory: boolean
          can_view_reports: boolean
          created_at: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          assigned_stores?: string[] | null
          can_edit_products?: boolean
          can_manage_inventory?: boolean
          can_view_reports?: boolean
          created_at?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          assigned_stores?: string[] | null
          can_edit_products?: boolean
          can_manage_inventory?: boolean
          can_view_reports?: boolean
          created_at?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manager_permissions_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          createdAt: string
          is_active: boolean
          last_login: string | null
          name: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          storename: string
          updatedAt: string
        }
        Insert: {
          avatar?: string | null
          createdAt?: string
          is_active?: boolean
          last_login?: string | null
          name: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          storename: string
          updatedAt?: string
        }
        Update: {
          avatar?: string | null
          createdAt?: string
          is_active?: boolean
          last_login?: string | null
          name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          storename?: string
          updatedAt?: string
        }
        Relationships: []
      }
      receipt_items: {
        Row: {
          created_at: string
          id: number
          name: string
          price: number
          quantity: number
          receipt_id: number
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          price: number
          quantity: number
          receipt_id: number
          total_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          price?: number
          quantity?: number
          receipt_id?: number
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipt_items_receipt_id_receipts_id_fk"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          id: number
          store_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          store_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          store_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_change_logs: {
        Row: {
          changed_by: string
          created_at: string
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          role_change_type: Database["public"]["Enums"]["role_change_type"]
        }
        Insert: {
          changed_by: string
          created_at?: string
          id?: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          role_change_type: Database["public"]["Enums"]["role_change_type"]
        }
        Update: {
          changed_by?: string
          created_at?: string
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          role_change_type?: Database["public"]["Enums"]["role_change_type"]
        }
        Relationships: [
          {
            foreignKeyName: "role_change_logs_changed_by_profiles_profile_id_fk"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "role_change_logs_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
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
      role: "admin" | "manager" | "user"
      role_change_type: "promotion" | "demotion" | "initial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role: ["admin", "manager", "user"],
      role_change_type: ["promotion", "demotion", "initial"],
    },
  },
} as const
