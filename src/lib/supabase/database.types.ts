import type { SavedProgress } from "../progress-storage";

// 마이그레이션과 함께 관리한다. 실제 프로젝트 연결 후 생성 타입과 대조할 것.
export type Database = {
  public: {
    Tables: {
      user_progress: {
        Row: { user_id: string; game_id: string; game_version: string; data: SavedProgress; revision: number; updated_at: string };
        Insert: { user_id: string; game_id: string; game_version: string; data: SavedProgress; revision?: number; updated_at?: string };
        Update: { data?: SavedProgress };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
