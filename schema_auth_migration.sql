-- Run this in the Supabase SQL Editor

-- 1. Add authentication & authorization fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'pending'));

-- 2. (Optional) Set an existing user as admin for testing
-- UPDATE public.profiles SET role = 'admin', subscription_status = 'active' WHERE id = 'YOUR-USER-ID';
