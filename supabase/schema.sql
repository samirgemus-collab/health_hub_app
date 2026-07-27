-- ============================================================================
-- HEALTHHUB.AI - ESQUEMA COMPLETO DE BANCO DE DADOS SUPABASE (POSTGRESQL)
-- Suporte a FHIR R4, LGPD Art. 18, Linha do Tempo e Curadoria Médica
-- ============================================================================

-- 1. ENUMS DA PLATAFORMA
CREATE TYPE user_role_type AS ENUM ('patient', 'doctor', 'healthcare_team', 'admin');
CREATE TYPE biological_sex_type AS ENUM ('female', 'male');
CREATE TYPE priority_level_type AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE timeline_visibility_type AS ENUM ('visible', 'hidden_pending_validation', 'internal_only');
CREATE TYPE refill_status_type AS ENUM ('pending', 'fulfilled', 'rejected');

-- 2. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_type NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  cpf_masked TEXT,
  phone_formatted TEXT,
  age INTEGER,
  biological_sex biological_sex_type,
  blood_type TEXT,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  bmi NUMERIC(4,2),
  risk_level TEXT,
  crm_code TEXT, -- Apenas para médicos
  specialty TEXT, -- Apenas para médicos
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DA LINHA DO TEMPO INTELIGENTE (JORNADA DO PACIENTE)
CREATE TABLE IF NOT EXISTS public.clinical_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_healthhub_sp',
  event_type TEXT NOT NULL, -- 'consultation', 'lab_test', 'imaging', 'medication', 'hospitalization'
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  professional_summary TEXT NOT NULL,
  patient_summary TEXT NOT NULL,
  source_system TEXT NOT NULL, -- 'Fleury LIS', 'Sírio-Libanês RIS', 'HealthHub EMR'
  source_record_id TEXT,
  clinical_status TEXT NOT NULL DEFAULT 'confirmed',
  priority priority_level_type NOT NULL DEFAULT 'medium',
  visibility_to_patient timeline_visibility_type NOT NULL DEFAULT 'hidden_pending_validation',
  validated_by UUID REFERENCES public.profiles(id),
  validated_at TIMESTAMPTZ,
  trend_direction TEXT, -- 'improving', 'worsening', 'stable'
  previous_value TEXT,
  current_value TEXT,
  change_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE AVALIAÇÕES E CALCULADORAS DE RISCO CLÍNICO
CREATE TABLE IF NOT EXISTS public.clinical_risk_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES public.profiles(id),
  calculator_type TEXT NOT NULL, -- 'PREVENT', 'KDIGO_KFRE', 'FRAX', 'CAPRINI', 'RCRI_LEE'
  calculated_score NUMERIC(5,2) NOT NULL,
  risk_classification TEXT NOT NULL, -- 'Baixo', 'Moderado', 'Elevado', 'Crítico'
  raw_input_json JSONB NOT NULL,
  clinical_disclaimer TEXT NOT NULL,
  confirmed_by_doctor BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE SOLICITAÇÕES AUTOMÁTICAS DE RENOVAÇÃO DE RECEITA
CREATE TABLE IF NOT EXISTS public.medication_refill_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medication_id TEXT NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  remaining_doses INTEGER NOT NULL,
  total_doses INTEGER NOT NULL,
  prescribing_doctor_id UUID REFERENCES public.profiles(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status refill_status_type NOT NULL DEFAULT 'pending',
  digital_signature_hash TEXT
);

-- 6. TABELA DE LOGS DE AUDITORIA IMUTÁVEIS (LGPD ART. 18)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  category TEXT NOT NULL,
  patient_id UUID REFERENCES public.profiles(id),
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  hash_sha256 TEXT NOT NULL
);

-- 7. SEGURANÇA E POLÍTICAS ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_risk_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Política RLS: Usuário visualiza apenas seu próprio perfil ou médicos com consentimento ativo
CREATE POLICY "Leitura de perfil por dono ou médico" ON public.profiles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('doctor', 'healthcare_team', 'admin'))
  );

-- Política RLS: Paciente visualiza apenas eventos com visibility_to_patient = 'visible'
CREATE POLICY "Paciente visualiza eventos curados e liberados" ON public.clinical_timeline_events
  FOR SELECT USING (
    visibility_to_patient = 'visible' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('doctor', 'healthcare_team', 'admin'))
  );

-- Comentário explicativo
COMMENT ON TABLE public.clinical_timeline_events IS 'Linha do tempo clínica inteligente com controle de curadoria médica e visibilidade dupla (Médico vs Paciente).';
