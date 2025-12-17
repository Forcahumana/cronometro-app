-- Tabela de cronómetros
CREATE TABLE IF NOT EXISTS timers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  total_seconds INTEGER NOT NULL,
  remaining_seconds INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paused', 'running', 'finished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_timers_status ON timers(status);
CREATE INDEX IF NOT EXISTS idx_timers_created_at ON timers(created_at DESC);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o updated_at
DROP TRIGGER IF EXISTS update_timers_updated_at ON timers;
CREATE TRIGGER update_timers_updated_at
    BEFORE UPDATE ON timers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE timers ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos
CREATE POLICY "Enable read access for all users" ON timers
    FOR SELECT
    USING (true);

-- Política para permitir inserção para todos
CREATE POLICY "Enable insert access for all users" ON timers
    FOR INSERT
    WITH CHECK (true);

-- Política para permitir atualização para todos
CREATE POLICY "Enable update access for all users" ON timers
    FOR UPDATE
    USING (true);

-- Política para permitir exclusão para todos
CREATE POLICY "Enable delete access for all users" ON timers
    FOR DELETE
    USING (true);
