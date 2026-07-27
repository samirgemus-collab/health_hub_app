import { 
  UserProfile, 
  DoctorProfile, 
  TeamMemberProfile, 
  MultidisciplinaryNote, 
  PatientInactivityAlert, 
  TelehealthChatMessage, 
  LgpdConsent, 
  AuditLogEntry, 
  ChronicCondition, 
  Allergy, 
  SurgicalHistory, 
  FamilyHistoryItem, 
  Medication, 
  MedicationReminder, 
  PreventiveCareRecommendation, 
  MedicalReport, 
  VitalMetric, 
  WearableDevice, 
  SecuritySettings,
  PlatformSubscription,
  ChronicCareProtocol,
  PrescribedProtocol,
  MedicationRefillRequest,
  ClinicalTimelineEvent
} from '../types/health';

export const mockProfiles: UserProfile[] = [
  {
    id: 'user_maria_01',
    name: 'Maria Silva',
    age: 45,
    sex: 'female',
    bloodType: 'A+',
    heightCm: 165,
    weightKg: 64,
    bmi: 23.5,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    cpfMasked: '***.482.910-**',
    phoneFormatted: '(11) 98482-9102',
    riskLevel: 'moderate_risk',
    careTeamName: 'Equipe Alpha de Cuidados Cardiovasculares & Saúde da Família',
    lastCheckInHoursAgo: 4
  },
  {
    id: 'user_carlos_02',
    name: 'Carlos Oliveira',
    age: 52,
    sex: 'male',
    bloodType: 'O+',
    heightCm: 178,
    weightKg: 82,
    bmi: 25.9,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    cpfMasked: '***.194.832-**',
    phoneFormatted: '(11) 99194-8321',
    riskLevel: 'high_risk',
    careTeamName: 'Equipe Beta de Prevenção Metabólica',
    lastCheckInHoursAgo: 48
  }
];

export const mockTimelineEvents: ClinicalTimelineEvent[] = [
  {
    id: 'evt_01',
    patientId: 'user_maria_01',
    tenantId: 'tenant_fleury_sp',
    eventType: 'lab_test',
    eventDate: '2026-07-18',
    title: 'Exame de Sangue: Hemoglobina Glicada (HbA1c) & Creatinina',
    professionalSummary: 'HbA1c subiu para 6,6% (Março: 5,9% → Julho: 6,2% → Dezembro: 6,6%). Creatinina subiu para 1,4 mg/dL (anterior: 1,1 mg/dL). Elevação progressiva do risco metabólico e discreta redução da filtração renal.',
    patientSummary: 'Seu exame de sangue mostrou aumento nos níveis de açúcar no sangue (glicose). O resultado foi enviado para avaliação do seu médico.',
    sourceSystem: 'Fleury LIS / FHIR',
    sourceRecordId: 'lab_rec_9481',
    clinicalStatus: 'confirmed',
    priority: 'high',
    visibilityToPatient: 'visible',
    validatedBy: 'Dr. Roberto Mendes',
    validatedAt: '2026-07-19T10:00:00Z',
    createdAt: '2026-07-18T14:30:00Z',
    trend: 'worsening',
    comparisons: {
      previousValue: '6.2% (Julho)',
      currentValue: '6.6% (Dezembro)',
      changeDetails: 'Tendência de elevação glicêmica nos últimos 9 meses (+0.7%).'
    },
    actionsRecommended: ['Revisar dieta com Nutricionista', 'Avaliar associação de Metformina com Dr. Roberto']
  },
  {
    id: 'evt_02',
    patientId: 'user_maria_01',
    tenantId: 'tenant_sirio_sp',
    eventType: 'imaging',
    eventDate: '2026-07-20',
    title: 'Tomografia de Tórax de Alta Resolução (TAC)',
    professionalSummary: 'Nódulo pulmonar sólido no lobo superior direito (LSD). Comparação: 2025 (6 mm) → 2026 (8 mm). Mudança relevante com aumento dimensional. Recomendada Tomografia de controle em 6 meses ou PET-CT.',
    patientSummary: 'Seu exame de imagem identificou uma pequena alteração no pulmão. O laudo está em análise pelo seu médico para orientação dos próximos passos.',
    sourceSystem: 'Sírio-Libanês RIS / PACS',
    sourceRecordId: 'img_tac_048',
    clinicalStatus: 'finding',
    priority: 'critical',
    visibilityToPatient: 'hidden_pending_validation', // GATEKEEPER CONTROL
    createdAt: '2026-07-20T16:00:00Z',
    trend: 'worsening',
    comparisons: {
      previousValue: '6 mm (2025)',
      currentValue: '8 mm (2026)',
      changeDetails: 'Aumento dimensional relevante (+2 mm em 12 meses).'
    },
    actionsRecommended: ['Consulta presencial de retorno com Pneumologia', 'Reavaliação tomográfica em 6 meses']
  },
  {
    id: 'evt_03',
    patientId: 'user_maria_01',
    tenantId: 'tenant_hub_sp',
    eventType: 'consultation',
    eventDate: '2026-07-12',
    title: 'Consulta Médica de Acompanhamento (Cardiologia)',
    professionalSummary: 'Consulta presencial com Dr. Roberto Mendes. Hipótese: HAS Estágio I controlada. Ajustada dosagem de Enalapril de 5mg para 10mg ao dia. Solicitado retorno em 90 dias com exames atualizados.',
    patientSummary: 'Sua pressão arterial foi avaliada pelo Dr. Roberto Mendes e o tratamento foi ajustado. Próximo passo: agendar retorno em 90 dias.',
    sourceSystem: 'HealthHub EMR',
    sourceRecordId: 'cons_cardio_12',
    clinicalStatus: 'confirmed',
    priority: 'medium',
    visibilityToPatient: 'visible',
    validatedBy: 'Dr. Roberto Mendes',
    validatedAt: '2026-07-12T11:00:00Z',
    createdAt: '2026-07-12T11:00:00Z',
    trend: 'stable'
  },
  {
    id: 'evt_04',
    patientId: 'user_maria_01',
    tenantId: 'tenant_hub_sp',
    eventType: 'medication',
    eventDate: '2026-07-22',
    title: 'Alteração Posológica de Medicamento (Enalapril)',
    professionalSummary: 'Ajuste de prescrição: Enalapril 10mg 1x ao dia. Notificado alerta de estoque baixo (restam 4 comprimidos) e gerada solicitação automática de receita.',
    patientSummary: 'A dose do seu medicamento para pressão foi modificada. Consulte a sua receita no aplicativo para verificar o novo horário.',
    sourceSystem: 'HealthHub Pharmacy Engine',
    sourceRecordId: 'med_rx_901',
    clinicalStatus: 'confirmed',
    priority: 'medium',
    visibilityToPatient: 'visible',
    validatedBy: 'Dr. Roberto Mendes',
    validatedAt: '2026-07-22T08:00:00Z',
    createdAt: '2026-07-22T08:00:00Z'
  }
];

export const mockRefillRequests: MedicationRefillRequest[] = [];
export const mockChronicProtocols: ChronicCareProtocol[] = [];
export const mockPrescribedProtocols: PrescribedProtocol[] = [];
export const mockSubscriptions: PlatformSubscription[] = [];

export const mockVitalMetrics: VitalMetric[] = [
  { timestamp: '08:00', heartRateBpm: 68, spO2Percent: 99, hrvMs: 54, sleepHours: 7.5, stepsCount: 1200, bodyTempC: 36.5, bloodPressureSystolic: 118, bloodPressureDiastolic: 76 }
];

export const mockAuditLogs: AuditLogEntry[] = [];
export const mockInactivityAlerts: PatientInactivityAlert[] = [];
export const mockChatMessages: TelehealthChatMessage[] = [];
export const mockDoctors: DoctorProfile[] = [
  {
    id: 'doc_roberto_01',
    name: 'Dr. Roberto Mendes',
    crm: 'CRM/SP 148.920',
    specialty: 'Cardiologia & Medicina Preventiva',
    hospitalAffiliation: 'Hospital Sírio-Libanês / Fleury',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
  }
];

export const mockTeamMembers: TeamMemberProfile[] = [];
export const mockMultidisciplinaryNotes: MultidisciplinaryNote[] = [];
export const mockLgpdConsents: LgpdConsent[] = [];
export const mockChronicConditions: Record<string, ChronicCondition[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockAllergies: Record<string, Allergy[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockSurguries: Record<string, SurgicalHistory[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockFamilyHistory: Record<string, FamilyHistoryItem[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockMedications: Record<string, Medication[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockMedicationReminders: Record<string, MedicationReminder[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockPreventiveRecommendations: Record<string, PreventiveCareRecommendation[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockMedicalReports: Record<string, MedicalReport[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockWearableDevices: WearableDevice[] = [];
export const mockSecuritySettings: SecuritySettings = { e2eeEnabled: true, biometricAuthEnabled: true, lgpdConsentGranted: true, lastDataAuditDate: '2026-07-26T20:00:00Z', authorizedDoctors: [] };
