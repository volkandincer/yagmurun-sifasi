-- Supabase Tabloları
-- Bu SQL script'ini Supabase SQL Editor'da çalıştırarak tabloları oluşturabilirsiniz

-- 1. İyileşme Takibi Verileri
CREATE TABLE IF NOT EXISTS recovery_data (
  id BIGSERIAL PRIMARY KEY,
  smell INTEGER NOT NULL,
  taste INTEGER NOT NULL,
  cough INTEGER NOT NULL,
  weakness INTEGER NOT NULL,
  sneeze INTEGER NOT NULL,
  overall_progress INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sinema Seçimleri
CREATE TABLE IF NOT EXISTS cinema_selections (
  id BIGSERIAL PRIMARY KEY,
  movie_title TEXT NOT NULL,
  selected_date TIMESTAMP WITH TIME ZONE NOT NULL,
  selected_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Puzzle Oyun Sonuçları
CREATE TABLE IF NOT EXISTS puzzle_results (
  id BIGSERIAL PRIMARY KEY,
  matches INTEGER NOT NULL,
  wrong_attempts INTEGER NOT NULL,
  completion_time INTEGER, -- saniye cinsinden
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Kullanıcı Session'ları
CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  completed_steps INTEGER[] DEFAULT '{}',
  total_steps INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_recovery_data_created_at ON recovery_data(created_at);
CREATE INDEX IF NOT EXISTS idx_cinema_selections_created_at ON cinema_selections(created_at);
CREATE INDEX IF NOT EXISTS idx_puzzle_results_created_at ON puzzle_results(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at);

-- Row Level Security (RLS) - İsteğe bağlı, güvenlik için
-- Eğer herkesin veri görebilmesini istiyorsanız bu kısmı atlayabilirsiniz
-- Eğer sadece authenticated kullanıcılar görebilsin istiyorsanız:

-- ALTER TABLE recovery_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cinema_selections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE puzzle_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy örnekleri (herkese açık okuma/yazma için):
-- CREATE POLICY "Allow public read access" ON recovery_data FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert access" ON recovery_data FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public read access" ON cinema_selections FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert access" ON cinema_selections FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public read access" ON puzzle_results FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert access" ON puzzle_results FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public read access" ON user_sessions FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert access" ON user_sessions FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public update access" ON user_sessions FOR UPDATE USING (true);

