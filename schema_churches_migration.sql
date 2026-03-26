-- Run this script in the Supabase SQL Editor

-- 1. Create the churches table
CREATE TABLE IF NOT EXISTS public.churches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- The unique church code (e.g., AD123)
  name TEXT NOT NULL,
  logo_url TEXT,
  banner_urls JSONB DEFAULT '[]'::jsonb, -- Array of strings for rotating banners
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Protect the table with RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Allow public read of church profiles (so members can see logo/banners)
CREATE POLICY "Churches are viewable by everyone." ON public.churches 
  FOR SELECT USING (true);

-- 2. Add church_id to profiles, referencing the churches table
-- Assuming the public.profiles table exists from standard setup
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS church_id UUID REFERENCES public.churches(id);

-- 3. Create Agenda table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  schedule_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for agenda
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own agenda." ON public.agenda 
  FOR ALL USING (auth.uid() = user_id);

-- 4. Insert a mock church for testing
INSERT INTO public.churches (code, name, logo_url, banner_urls)
VALUES (
  'DEMO_123',
  'Comunidade Caverna',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
  '["https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=300&fit=crop", "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&h=300&fit=crop"]'
) ON CONFLICT (code) DO NOTHING;

-- NOTE: If you have an existing user in `profiles`, you can run manually:
-- UPDATE public.profiles SET church_id = (SELECT id FROM public.churches WHERE code = 'DEMO_123') WHERE id = 'YOUR_USER_ID';
