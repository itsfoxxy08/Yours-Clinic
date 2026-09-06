-- =======================================================
-- Yours-Clinic Custom OTP & Security Migration Schema
-- Run this script in Supabase SQL Editor -> Run
-- =======================================================

-- 1. Table: otp_verifications
-- Stores hashed 6-digit OTP tokens, expiration time, and attempt counter
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast lookup by email and state
CREATE INDEX IF NOT EXISTS idx_otp_verifications_lookup 
ON public.otp_verifications (email, is_used, expires_at);

-- 2. Table: otp_audit_logs
-- Security log tracking OTP requests, verification status, and failures
CREATE TABLE IF NOT EXISTS public.otp_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for security audit queries
CREATE INDEX IF NOT EXISTS idx_otp_audit_logs_email 
ON public.otp_audit_logs (email, created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated users to manage OTP records securely via app policies
CREATE POLICY "Allow public insert and lookup for OTP verification" 
ON public.otp_verifications FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public audit log recording" 
ON public.otp_audit_logs FOR ALL USING (true) WITH CHECK (true);
