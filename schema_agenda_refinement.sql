-- Adiciona colunas para suportar a visualização em grade semanal
ALTER TABLE agenda 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Geral',
ADD COLUMN IF NOT EXISTS duration FLOAT DEFAULT 1.0;

-- Comentários para documentação
COMMENT ON COLUMN agenda.category IS 'Categoria do compromisso (Ritual, Treino, Refeição, Geral)';
COMMENT ON COLUMN agenda.duration IS 'Duração em horas (ex: 1.5 para 1h30)';
