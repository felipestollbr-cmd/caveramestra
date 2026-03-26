-- Caverna Mestra Supabase Schema
-- Cole este código no SQL Editor do seu projeto Supabase e clique em "Run".

-- 1. Tabela de Perfis de Usuários (Profiles)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users on delete cascade NOT NULL PRIMARY KEY,
  name text,
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin', 'financeiro')),
  avatar_url text,
  streak_days integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS e Políticas para Perfis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Tabela de Rituais Diários
CREATE TABLE public.rituais (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  period text CHECK (period IN ('matinal', 'noturno')),
  completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.rituais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users map manage their own rituais" ON public.rituais FOR ALL USING (auth.uid() = user_id);

-- 3. Tabela de Agenda do Dia
CREATE TABLE public.agenda (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  schedule_time timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users map manage their own agenda" ON public.agenda FOR ALL USING (auth.uid() = user_id);

-- 4. Tabela de Metas Anuais (Ordem no Caos)
CREATE TABLE public.metas_anuais (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_value integer DEFAULT 100,
  current_value integer DEFAULT 0,
  color text DEFAULT 'bg-caverna-accent',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.metas_anuais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users map manage their own metas" ON public.metas_anuais FOR ALL USING (auth.uid() = user_id);

-- Trigger Automático para criar perfil ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'member');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
