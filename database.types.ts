export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      branch_manager: {
        Row: {
          created_at: string
          id: number
          profile_id: string | null
          store_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id?: string | null
          store_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branch_manager_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "branch_manager_store_id_stores_store_id_fk"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["store_id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_posts_post_id_fk"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_likes_user_id_profiles_profile_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          available_stores: Json | null
          color: string | null
          content: string | null
          created_at: string
          images: Json
          is_published: boolean
          like_count: number
          post_id: string
          post_type: string
          price: number | null
          product_name: string | null
          size: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          available_stores?: Json | null
          color?: string | null
          content?: string | null
          created_at?: string
          images?: Json
          is_published?: boolean
          like_count?: number
          post_id?: string
          post_type: string
          price?: number | null
          product_name?: string | null
          size?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          available_stores?: Json | null
          color?: string | null
          content?: string | null
          created_at?: string
          images?: Json
          is_published?: boolean
          like_count?: number
          post_id?: string
          post_type?: string
          price?: number | null
          product_name?: string | null
          size?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_profiles_profile_id_fk"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          createdAt: string
          is_banned: boolean | null
          location_name: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          updated_at: string | null
          updatedAt: string
        }
        Insert: {
          avatar?: string | null
          createdAt?: string
          is_banned?: boolean | null
          location_name: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
          updatedAt?: string
        }
        Update: {
          avatar?: string | null
          createdAt?: string
          is_banned?: boolean | null
          location_name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
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
      stores: {
        Row: {
          address: string
          branch: string
          close_time: string
          created_at: string
          description: string
          directions: string[]
          latitude: string
          location: string
          longitude: string
          open_time: string
          profile_id: string
          store_id: string
          store_image: string
          updated_at: string
        }
        Insert: {
          address: string
          branch?: string
          close_time: string
          created_at?: string
          description: string
          directions?: string[]
          latitude: string
          location: string
          longitude: string
          open_time: string
          profile_id: string
          store_id?: string
          store_image: string
          updated_at?: string
        }
        Update: {
          address?: string
          branch?: string
          close_time?: string
          created_at?: string
          description?: string
          directions?: string[]
          latitude?: string
          location?: string
          longitude?: string
          open_time?: string
          profile_id?: string
          store_id?: string
          store_image?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_profile_id_profiles_profile_id_fk"
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
    Enums: {
      role: ["admin", "manager", "user"],
    },
  },
} as const
