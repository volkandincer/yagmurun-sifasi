import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase'i optional yap - eğer env variables yoksa null döndür
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Veri tipleri
export interface RecoveryData {
  smell: number;
  taste: number;
  cough: number;
  weakness: number;
  sneeze: number;
  overall_progress: number;
  created_at?: string;
}

export interface CinemaSelection {
  movie_title: string;
  selected_date: string;
  selected_time: string;
  created_at?: string;
}

export interface PuzzleResult {
  matches: number;
  wrong_attempts: number;
  completion_time?: number;
  created_at?: string;
}

export interface UserSession {
  session_id: string;
  completed_steps: number[];
  total_steps: number;
  started_at: string;
  completed_at?: string;
}

// Veri kaydetme fonksiyonları
export const saveRecoveryData = async (data: RecoveryData) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping data save");
    return { success: false, error: "Supabase not configured" };
  }

  const { error } = await supabase.from("recovery_data").insert([data]);

  if (error) {
    console.error("Error saving recovery data:", error);
    return { success: false, error };
  }

  return { success: true };
};

export const saveCinemaSelection = async (data: CinemaSelection) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping data save");
    return { success: false, error: "Supabase not configured" };
  }

  const { error } = await supabase.from("cinema_selections").insert([data]);

  if (error) {
    console.error("Error saving cinema selection:", error);
    return { success: false, error };
  }

  return { success: true };
};

export const savePuzzleResult = async (data: PuzzleResult) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping data save");
    return { success: false, error: "Supabase not configured" };
  }

  const { error } = await supabase.from("puzzle_results").insert([data]);

  if (error) {
    console.error("Error saving puzzle result:", error);
    return { success: false, error };
  }

  return { success: true };
};

export const saveUserSession = async (
  data: Omit<UserSession, "created_at" | "completed_at" | "started_at">
) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping data save");
    return { success: false, error: "Supabase not configured" };
  }

  const { error } = await supabase.from("user_sessions").insert([
    {
      ...data,
      started_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error saving user session:", error);
    return { success: false, error };
  }

  return { success: true };
};

export const updateUserSession = async (
  sessionId: string,
  completedSteps: number[]
) => {
  if (!supabase) {
    console.warn("Supabase not configured, skipping data update");
    return { success: false, error: "Supabase not configured" };
  }

  const { error } = await supabase
    .from("user_sessions")
    .update({
      completed_steps: completedSteps,
      completed_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId);

  if (error) {
    console.error("Error updating user session:", error);
    return { success: false, error };
  }

  return { success: true };
};
