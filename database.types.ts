export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      nonces: {
        Row: {
          created_at: string | null
          nonce: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          nonce: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          nonce?: string
          used?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          file_count: number | null
          id: string
          token_balance: number | null
          total_contribution_score: number | null
          updated_at: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          file_count?: number | null
          id: string
          token_balance?: number | null
          total_contribution_score?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          file_count?: number | null
          id?: string
          token_balance?: number | null
          total_contribution_score?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          current_data_usage: number | null
          data_limit: number
          description: string | null
          file_count: number | null
          id: string
          image_url: string | null
          is_full: boolean | null
          name: string
          owner_id: string
          status: Database["public"]["Enums"]["project_status"]
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_data_usage?: number | null
          data_limit: number
          description?: string | null
          file_count?: number | null
          id?: string
          image_url?: string | null
          is_full?: boolean | null
          name: string
          owner_id: string
          status?: Database["public"]["Enums"]["project_status"]
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_data_usage?: number | null
          data_limit?: number
          description?: string | null
          file_count?: number | null
          id?: string
          image_url?: string | null
          is_full?: boolean | null
          name?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["project_status"]
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_buckets: {
        Row: {
          bucket_name: string
          created_at: string | null
          id: string
          project_id: string
        }
        Insert: {
          bucket_name: string
          created_at?: string | null
          id?: string
          project_id: string
        }
        Update: {
          bucket_name?: string
          created_at?: string | null
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_buckets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "storage_buckets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          data_limit: number
          id: string
          price: number
          tier: string
        }
        Insert: {
          created_at?: string | null
          data_limit: number
          id?: string
          price: number
          tier: string
        }
        Update: {
          created_at?: string | null
          data_limit?: number
          id?: string
          price?: number
          tier?: string
        }
        Relationships: []
      }
      user_project_files: {
        Row: {
          contribution_score: number | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          is_revoked: boolean | null
          project_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contribution_score?: number | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          is_revoked?: boolean | null
          project_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contribution_score?: number | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          is_revoked?: boolean | null
          project_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_statistics"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "user_project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_project_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_project_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      project_statistics: {
        Row: {
          avg_contribution_score: number | null
          contributor_count: number | null
          current_data_usage: number | null
          data_limit: number | null
          file_count: number | null
          is_full: boolean | null
          owner_id: string | null
          project_id: string | null
          project_name: string | null
          status: Database["public"]["Enums"]["project_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          file_count: number | null
          id: string | null
          token_balance: number | null
          total_contribution_score: number | null
          updated_at: string | null
          wallet_address: string | null
          web3_password: string | null
        }
        Relationships: []
      }
      user_statistics: {
        Row: {
          email: string | null
          file_count: number | null
          projects_contributed: number | null
          projects_owned: number | null
          token_balance: number | null
          total_contribution_score: number | null
          user_id: string | null
          wallet_address: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_contribution_score: {
        Args: {
          p_file_size: number
          p_project_id: string
        }
        Returns: number
      }
      cleanup_expired_nonces: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      distribute_project_tokens: {
        Args: {
          p_project_id: string
        }
        Returns: undefined
      }
      generate_nonce: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      handle_file_upload: {
        Args: {
          p_user_id: string
          p_project_id: string
          p_file_name: string
          p_file_size: number
          p_file_path: string
        }
        Returns: string
      }
      revoke_file: {
        Args: {
          p_user_id: string
          p_file_id: string
        }
        Returns: boolean
      }
      verify_nonce: {
        Args: {
          nonce_to_verify: string
        }
        Returns: boolean
      }
    }
    Enums: {
      project_status: "Proposed" | "Active" | "Training" | "Complete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

