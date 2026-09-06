-- ============================================================================
-- YOURS CLINIC - CENTRALIZED SUPABASE DATABASE & REALTIME SCHEMA
-- Run this complete SQL script in your Supabase Dashboard SQL Editor
-- (https://app.supabase.com/project/_/sql)
-- ============================================================================

-- 1. CLINICIANS & DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.clinicians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    reg TEXT NOT NULL,
    photo TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENT RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.patient_records (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    reason TEXT DEFAULT '',
    status TEXT DEFAULT 'Consultation',
    reports JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PATIENT REPORTS & PRESCRIPTIONS METADATA TABLE
CREATE TABLE IF NOT EXISTS public.patient_reports (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patient_records(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'prescription',
    file_url TEXT NOT NULL,
    file_path TEXT DEFAULT '',
    file_name TEXT DEFAULT '',
    file_size NUMERIC DEFAULT 0,
    mime_type TEXT DEFAULT '',
    uploaded_by TEXT DEFAULT 'Doctor / Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEDICINE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.medicine_orders (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    medicines TEXT DEFAULT '',
    prescription_note TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending',
    courier_name TEXT DEFAULT '',
    tracking_number TEXT DEFAULT '',
    estimated_delivery TEXT DEFAULT '',
    total_amount NUMERIC DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT NOT NULL,
    password_hash TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_clinicians_updated_at ON public.clinicians;
CREATE TRIGGER set_clinicians_updated_at
BEFORE UPDATE ON public.clinicians
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_patient_records_updated_at ON public.patient_records;
CREATE TRIGGER set_patient_records_updated_at
BEFORE UPDATE ON public.patient_records
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_medicine_orders_updated_at ON public.medicine_orders;
CREATE TRIGGER set_medicine_orders_updated_at
BEFORE UPDATE ON public.medicine_orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SUPABASE REALTIME REPLICATION CONFIGURATION
-- Enables live cross-device multi-browser updates
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clinicians;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_records;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_reports;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.medicine_orders;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- STORAGE BUCKETS SETUP
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('clinician-photos', 'clinician-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('doctor-profile-images', 'doctor-profile-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('prescriptions', 'prescriptions', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('patient-reports', 'patient-reports', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.clinicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Clinicians Table RLS
DROP POLICY IF EXISTS "Public Read Clinicians" ON public.clinicians;
CREATE POLICY "Public Read Clinicians" ON public.clinicians FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Clinicians" ON public.clinicians;
CREATE POLICY "Public Write Clinicians" ON public.clinicians FOR ALL USING (true);

-- Patient Records Table RLS
DROP POLICY IF EXISTS "Public Read Patient Records" ON public.patient_records;
CREATE POLICY "Public Read Patient Records" ON public.patient_records FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Patient Records" ON public.patient_records;
CREATE POLICY "Public Write Patient Records" ON public.patient_records FOR ALL USING (true);

-- Patient Reports Table RLS
DROP POLICY IF EXISTS "Public Read Patient Reports" ON public.patient_reports;
CREATE POLICY "Public Read Patient Reports" ON public.patient_reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Patient Reports" ON public.patient_reports;
CREATE POLICY "Public Write Patient Reports" ON public.patient_reports FOR ALL USING (true);

-- Medicine Orders Table RLS
DROP POLICY IF EXISTS "Public Read Medicine Orders" ON public.medicine_orders;
CREATE POLICY "Public Read Medicine Orders" ON public.medicine_orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Medicine Orders" ON public.medicine_orders;
CREATE POLICY "Public Write Medicine Orders" ON public.medicine_orders FOR ALL USING (true);

-- Admin Users Table RLS
DROP POLICY IF EXISTS "Public Read Admin Users" ON public.admin_users;
CREATE POLICY "Public Read Admin Users" ON public.admin_users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Admin Users" ON public.admin_users;
CREATE POLICY "Public Write Admin Users" ON public.admin_users FOR ALL USING (true);

-- Storage Objects RLS Policies
DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id IN ('clinician-photos', 'doctor-profile-images', 'prescriptions', 'patient-reports'));

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('clinician-photos', 'doctor-profile-images', 'prescriptions', 'patient-reports'));

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id IN ('clinician-photos', 'doctor-profile-images', 'prescriptions', 'patient-reports'));

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id IN ('clinician-photos', 'doctor-profile-images', 'prescriptions', 'patient-reports'));
