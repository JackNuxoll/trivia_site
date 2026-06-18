// Auto-generated types matching the Supabase schema from quiz_backend_architecture.pdf
// Regenerate with: npx supabase gen types typescript --project-id <your-project-id>

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          body: string;
          correct_answer: string;
          category: string;
          difficulty: number;
          created_at: string;
          image_url: string | null;
          wrong_answers: string[] | null;
          explanation: string | null;
        };
        Insert: {
          id?: string;
          body: string;
          correct_answer: string;
          category: string;
          difficulty: number;
          created_at?: string;
          image_url?: string | null;
          wrong_answers?: string[] | null;
          explanation?: string | null;
        };
        Update: {
          id?: string;
          body?: string;
          correct_answer?: string;
          category?: string;
          difficulty?: number;
          created_at?: string;
          image_url?: string | null;
          wrong_answers?: string[] | null;
          explanation?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string | null;
          quiz_id: string;
          started_at: string;
          ended_at: string | null;
          total_questions: number;
          total_correct: number;
          time_spent_seconds: number | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          quiz_id: string;
          started_at?: string;
          ended_at?: string | null;
          total_questions: number;
          total_correct: number;
          time_spent_seconds?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          quiz_id?: string;
          started_at?: string;
          ended_at?: string | null;
          total_questions?: number;
          total_correct?: number;
          time_spent_seconds?: number | null;
        };
      };
      responses: {
        Row: {
          id: string;
          session_id: string;
          user_id: string | null;
          question_id: string | null;
          is_correct: boolean;
          answered_at: string;
          response_value: string;
          time_spent_ms: number | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id?: string | null;
          question_id?: string | null;
          is_correct: boolean;
          answered_at?: string;
          response_value: string;
          time_spent_ms?: number | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string | null;
          question_id?: string | null;
          is_correct?: boolean;
          answered_at?: string;
          response_value?: string;
          time_spent_ms?: number | null;
        };
      };
    };
    Views: {
      question_accuracy_by_user: {
        Row: {
          user_id: string;
          question_id: string;
          attempts: number;
          correct: number;
          accuracy_pct: number;
          last_seen: string;
        };
      };
    };
  };
}
