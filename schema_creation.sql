--- AUDITORIA GERAL: SCHEMA COMPLETO PARA O CAVERNA MESTRA ---

-- 1. Tabela de Cursos
CREATE TABLE IF NOT EXISTS public.cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  instructor TEXT,
  modules INT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.cursos IS 'Armazena os cursos oferecidos na plataforma.';

-- 2. Tabela de Inscrições de Usuários nos Cursos (Progresso)
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id) -- Garante que um usuário só se inscreva uma vez no mesmo curso
);
COMMENT ON TABLE public.course_enrollments IS 'Rastreia o progresso dos usuários nos cursos.';

-- 3. Tabela de Metas Anuais
CREATE TABLE IF NOT EXISTS public.metas_anuais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_value INT DEFAULT 0,
  target_value INT DEFAULT 100,
  year INT DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.metas_anuais IS 'Metas anuais definidas pelos usuários na seção Ordem no Caos.';

-- 4. Tabela de Livros (Fontes de Conhecimento)
CREATE TABLE IF NOT EXISTS public.livros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT,
    cover_url TEXT,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.livros IS 'Livros que o usuário está lendo.';

-- 5. Tabela do Quadro de Visão
CREATE TABLE IF NOT EXISTS public.quadro_visoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    label TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.quadro_visoes IS 'Imagens e promessas do Quadro de Visão do usuário.';

-- 6. Tabela de Plano de Treino
CREATE TABLE IF NOT EXISTS public.treinos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL, -- Ex: 'Segunda', 'Terça'
  focus TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('done', 'pending', 'waiting')),
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE
);
COMMENT ON TABLE public.treinos IS 'Plano de treino semanal do usuário na Forja do Templo.';

-- 7. Tabela de Refeições
CREATE TABLE IF NOT EXISTS public.refeicoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- Ex: 'Café da Manhã'
  time TIME,
  items JSONB, -- Ex: ["4 Ovos mexidos", "Café"]
  done BOOLEAN DEFAULT false,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE
);
COMMENT ON TABLE public.refeicoes IS 'Registro de refeições diárias do usuário.';


--- HABILITAR RLS (ROW LEVEL SECURITY) E DEFINIR POLÍTICAS ---

-- Políticas para CURSOS (Público para leitura, restrito para escrita)
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cursos são visíveis para todos" ON public.cursos FOR SELECT USING (true);
CREATE POLICY "Admins podem criar/alterar cursos" ON public.cursos FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')) WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Políticas para todas as outras tabelas (Restritas ao próprio usuário)
CREATE OR REPLACE FUNCTION configure_rls_for_user_table(table_name TEXT) RETURNS void AS $$
BEGIN
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
  EXECUTE format('CREATE POLICY "Usuários podem ver seus próprios dados" ON public.%I FOR SELECT USING (auth.uid() = user_id);', table_name);
  EXECUTE format('CREATE POLICY "Usuários podem inserir seus próprios dados" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id);', table_name);
  EXECUTE format('CREATE POLICY "Usuários podem atualizar seus próprios dados" ON public.%I FOR UPDATE USING (auth.uid() = user_id);', table_name);
  EXECUTE format('CREATE POLICY "Usuários podem deletar seus próprios dados" ON public.%I FOR DELETE USING (auth.uid() = user_id);', table_name);
END;
$$ LANGUAGE plpgsql;

-- Aplicar políticas de RLS para tabelas de dados do usuário
SELECT configure_rls_for_user_table('course_enrollments');
SELECT configure_rls_for_user_table('metas_anuais');
SELECT configure_rls_for_user_table('livros');
SELECT configure_rls_for_user_table('quadro_visoes');
SELECT configure_rls_for_user_table('treinos');
SELECT configure_rls_for_user_table('refeicoes');
