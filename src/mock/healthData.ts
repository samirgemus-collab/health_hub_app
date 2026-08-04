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
  ClinicalTimelineEvent,
  HealthMetricIndicator,
  PersonalHealthPlanGoal,
  ClinicalEvidenceRule,
  VaccinationRecord,
  VaccinationDocument,
  VaccinationAuditLog,
  VaccinationReminder,
  RndsIntegrationQueueItem,
  VaccineProtocolRule,
  FamilyHealthHistory,
  HealthAssessmentResult,
  HistoricalConsultationRecord,
  HealthMapDomainState,
  PreventiveAction,
  PreventivePlanTask,
  ProtocolRule
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
    birthDate: '1981-05-14',
    addressFormatted: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    riskLevel: 'moderate_risk',
    careTeamName: 'Equipe Alpha de Cuidados Cardiovasculares & Saúde da Família',
    lastCheckInHoursAgo: 4,
    emergencyContacts: [
      {
        id: 'emg_01',
        name: 'Pedro Silva',
        relationship: 'Esposo / Acompanhante Legal',
        phoneFormatted: '(11) 99842-1020',
        notifyBySms: true,
        notifyByWhatsapp: true
      }
    ],
    familySharingConsentActive: true,
    authorizedFamilyMembers: [
      {
        id: 'fam_auth_01',
        name: 'Pedro Silva',
        relationship: 'Esposo',
        cpfMasked: '***.331.401-**',
        email: 'pedro.silva@email.com',
        phoneFormatted: '(11) 99842-1020',
        accessLevel: 'full_access',
        authorizedAt: '2026-02-01T10:00:00Z',
        consentHash: '0x8f7a91c4b2e519d0',
        status: 'active'
      },
      {
        id: 'fam_auth_02',
        name: 'Ana Clara Silva',
        relationship: 'Filha',
        cpfMasked: '***.892.104-**',
        email: 'anaclara.silva@email.com',
        phoneFormatted: '(11) 97120-4912',
        accessLevel: 'read_only',
        authorizedAt: '2026-03-10T14:30:00Z',
        consentHash: '0x3c11a49f82d109b4',
        status: 'active'
      }
    ]
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

export const mockTeamMembers: TeamMemberProfile[] = [
  {
    id: 'team_01',
    name: 'Enf. Fernando Alencar',
    role: 'nurse',
    councilId: 'COREN/SP 482.910',
    teamName: 'Equipe de Saúde da Família (ESF II)',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    currentAssignedPatients: 124,
    maxPatientCapacity: 150
  },
  {
    id: 'team_02',
    name: 'Joana Martins (ACS)',
    role: 'community_health_worker',
    councilId: 'ACS Matrícula 884.102',
    teamName: 'Microárea 04 • Unidade Básica de Saúde',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    currentAssignedPatients: 85,
    maxPatientCapacity: 100
  }
];

export const mockMultidisciplinaryNotes: MultidisciplinaryNote[] = [
  {
    id: 'note_01',
    patientId: 'user_maria_01',
    authorId: 'team_02',
    authorName: 'Joana Martins (ACS)',
    authorRole: 'community_health_worker',
    category: 'community_visit',
    title: 'Visita Domiciliar Preventiva de Rotina',
    content: 'Realizada visita à residência do paciente. Verificada boa adesão aos medicamentos prescritos para hipertensão. Orientado sobre agendamento do exame de sangue anual.',
    recommendations: 'Manter visitas mensais e monitoramento de PA.',
    timestamp: '2026-07-20T10:30:00Z'
  },
  {
    id: 'note_02',
    patientId: 'user_maria_01',
    authorId: 'team_01',
    authorName: 'Enf. Fernando Alencar',
    authorRole: 'nurse',
    category: 'nursing',
    title: 'Avaliação de Enfermagem & Acompanhamento de Sinais Vitais',
    content: 'Paciente contatado por tele-enfermagem. Nega queixas agudas. Sinais vitais de amostragem domiciliar estáveis (PA 122x78 mmHg).',
    recommendations: 'Manter monitoramento semanal no aplicativo.',
    timestamp: '2026-07-22T14:15:00Z'
  }
];
export const mockLgpdConsents: LgpdConsent[] = [];
export const mockChronicConditions: Record<string, ChronicCondition[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockAllergies: Record<string, Allergy[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockSurguries: Record<string, SurgicalHistory[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockFamilyHistory: Record<string, FamilyHistoryItem[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockMedications: Record<string, Medication[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockMedicationReminders: Record<string, MedicationReminder[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockPreventiveRecommendations: Record<string, PreventiveCareRecommendation[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockMedicalReports: Record<string, MedicalReport[]> = { user_maria_01: [], user_carlos_02: [] };
export const mockWearableDevices: WearableDevice[] = [
  {
    id: 'dev_apple_watch',
    name: 'Apple Watch Series 9',
    brand: 'Apple Watch',
    platform: 'Apple HealthKit',
    connectionType: 'healthkit',
    deviceCategory: 'wellness_fitness',
    anvisaFdaApprovalStatus: 'Notificação Anvisa (Dispositivo de Bem-Estar)',
    batteryPercent: 84,
    lastSync: 'Há 12 minutos',
    status: 'connected',
    metricsProvided: ['Frequência Cardíaca', 'SpO2', 'Passos', 'Qualidade do Sono', 'VHR'],
    permissionsGranted: ['heart_rate', 'spo2', 'steps', 'sleep'],
    sharingWithCareTeam: true
  },
  {
    id: 'dev_omron_ble',
    name: 'Omron Evolv BLE (Monitor de Pressão)',
    brand: 'Omron BLE',
    platform: 'Bluetooth LE Direct',
    connectionType: 'ble_direct',
    deviceCategory: 'medical_grade',
    anvisaFdaApprovalStatus: 'Homologado Anvisa 80548020044 & FDA 510(k)',
    batteryPercent: 92,
    lastSync: 'Hoje, 08:30',
    status: 'connected',
    metricsProvided: ['Pressão Arterial Sistólica / Diastólica', 'Frequência Cardíaca'],
    permissionsGranted: ['blood_pressure', 'heart_rate'],
    sharingWithCareTeam: true
  },
  {
    id: 'dev_accu_chek',
    name: 'Accu-Chek Instant Bluetooth',
    brand: 'Accu-Chek BLE',
    platform: 'Bluetooth LE Direct',
    connectionType: 'ble_direct',
    deviceCategory: 'medical_grade',
    anvisaFdaApprovalStatus: 'Homologado Anvisa 80017000102 (Finalidade Médica)',
    batteryPercent: 78,
    lastSync: '15/07/2026',
    status: 'connected',
    metricsProvided: ['Glicemia Capilar de Jejum', 'Glicemia Pós-prandial'],
    permissionsGranted: ['glycemia'],
    sharingWithCareTeam: true
  },
  {
    id: 'dev_tanita',
    name: 'Balança de Bioimpedância Tanita Smart',
    brand: 'Tanita Smart',
    platform: 'Google Health Connect',
    connectionType: 'google_health_connect',
    deviceCategory: 'wellness_fitness',
    anvisaFdaApprovalStatus: 'Equipamento de Acompanhamento de Bem-Estar',
    batteryPercent: 65,
    lastSync: '22/07/2026',
    status: 'connected',
    metricsProvided: ['Peso Corporal', 'Gordura Corporal %', 'Massa Magra'],
    permissionsGranted: ['weight', 'body_fat'],
    sharingWithCareTeam: false
  }
];
export const mockSecuritySettings: SecuritySettings = { e2eeEnabled: true, biometricAuthEnabled: true, lgpdConsentGranted: true, lastDataAuditDate: '2026-07-26T20:00:00Z', authorizedDoctors: [] };

export const mock11HealthIndicators: HealthMetricIndicator[] = [
  {
    id: 'ind_bp',
    categoryKey: 'bp',
    title: 'Pressão Arterial',
    subtitle: 'Medição contínua via Omron BLE',
    status: 'green',
    currentValue: '118/76',
    unit: 'mmHg',
    targetRange: '< 120/80 mmHg',
    reassuranceMessage: 'Sua pressão arterial está excelente e dentro da meta recomendada pelas diretrizes da SBC/AHA.',
    lastUpdated: 'Hoje, 08:30',
    historicalTrajectory: [
      { date: 'Jan/26', valueDisplay: '124/80', numericValue: 124 },
      { date: 'Abr/26', valueDisplay: '120/78', numericValue: 120 },
      { date: 'Jul/26', valueDisplay: '118/76', numericValue: 118 }
    ]
  },
  {
    id: 'ind_weight',
    categoryKey: 'weight_bmi',
    title: 'Peso, IMC & Circunferência',
    subtitle: 'Composição Corporal & Gordura Visceral',
    status: 'green',
    currentValue: '64.0 kg (IMC 23.5)',
    unit: 'kg / m²',
    targetRange: 'IMC 18.5 - 24.9 kg/m²',
    reassuranceMessage: 'Seu IMC e peso encontram-se na faixa saudável. Manter acompanhamento de hábitos.',
    lastUpdated: '22/07/2026',
    historicalTrajectory: [
      { date: 'Jan/26', valueDisplay: '66.5 kg', numericValue: 66.5 },
      { date: 'Abr/26', valueDisplay: '65.2 kg', numericValue: 65.2 },
      { date: 'Jul/26', valueDisplay: '64.0 kg', numericValue: 64.0 }
    ]
  },
  {
    id: 'ind_glycemia',
    categoryKey: 'glycemia_hba1c',
    title: 'Glicemia & Hemoglobina Glicada',
    subtitle: 'Perfil Glicêmico de Jejum',
    status: 'yellow',
    currentValue: '105 mg/dL (HbA1c 5.8%)',
    unit: 'mg/dL',
    targetRange: 'Glicemia < 100 mg/dL | HbA1c < 5.7%',
    reassuranceMessage: 'Foi identificada elevação discreta na glicemia nos últimos exames. Este achado isoladamente não estabelece diagnóstico. Recomenda-se avaliação clínica e orientação nutricional.',
    lastUpdated: '15/07/2026',
    historicalTrajectory: [
      { date: 'Jan/26', valueDisplay: '98 mg/dL', numericValue: 98 },
      { date: 'Abr/26', valueDisplay: '102 mg/dL', numericValue: 102 },
      { date: 'Jul/26', valueDisplay: '105 mg/dL', numericValue: 105 }
    ]
  },
  {
    id: 'ind_cholesterol',
    categoryKey: 'cholesterol',
    title: 'Colesterol & Triglicérides',
    subtitle: 'Perfil Lipídico Completo',
    status: 'green',
    currentValue: 'LDL 92 mg/dL | HDL 58 mg/dL',
    unit: 'mg/dL',
    targetRange: 'LDL < 100 mg/dL | HDL > 50 mg/dL',
    reassuranceMessage: 'Perfil lipídico em conformidade com as metas de prevenção cardiovascular de baixo risco.',
    lastUpdated: '15/07/2026',
    historicalTrajectory: [
      { date: 'Jan/26', valueDisplay: 'LDL 98', numericValue: 98 },
      { date: 'Jul/26', valueDisplay: 'LDL 92', numericValue: 92 }
    ]
  },
  {
    id: 'ind_renal',
    categoryKey: 'renal_function',
    title: 'Função Renal',
    subtitle: 'Creatinina & Taxa de Filtração Glomerular (TFGe)',
    status: 'green',
    currentValue: '88 mL/min/1.73m²',
    unit: 'mL/min',
    targetRange: 'TFGe > 60 mL/min/1.73m²',
    reassuranceMessage: 'Função renal preservada (Estágio G1 KDIGO). Manter hidratação adequada.',
    lastUpdated: '15/07/2026'
  },
  {
    id: 'ind_hepatic',
    categoryKey: 'hepatic_health',
    title: 'Saúde Hepática',
    subtitle: 'Transaminases (TGO / TGP / Gama-GT)',
    status: 'green',
    currentValue: 'TGO 22 U/L | TGP 24 U/L',
    unit: 'U/L',
    targetRange: 'TGO < 35 U/L | TGP < 35 U/L',
    reassuranceMessage: 'Enzimas hepáticas dentro dos limites normais de referência.',
    lastUpdated: '15/07/2026'
  },
  {
    id: 'ind_sleep',
    categoryKey: 'sleep_quality',
    title: 'Qualidade do Sono',
    subtitle: 'Telemetria Smartband',
    status: 'yellow',
    currentValue: '6.2 h / noite (Sono REM 18%)',
    unit: 'horas',
    targetRange: '7.0 - 9.0 h / noite',
    reassuranceMessage: 'Média de sono ligeiramente abaixo da meta semanal. Recomenda-se higiene do sono e ajuste na rotina noturna.',
    lastUpdated: 'Ontem',
    historicalTrajectory: [
      { date: 'Seg', valueDisplay: '6.5 h', numericValue: 6.5 },
      { date: 'Qua', valueDisplay: '5.8 h', numericValue: 5.8 },
      { date: 'Sex', valueDisplay: '6.2 h', numericValue: 6.2 }
    ]
  },
  {
    id: 'ind_activity',
    categoryKey: 'physical_activity',
    title: 'Nível de Atividade Física',
    subtitle: 'Minutos de Atividade Moderada / Passo Diário',
    status: 'green',
    currentValue: '185 min / semana',
    unit: 'min/sem',
    targetRange: '> 150 min / semana (OMS)',
    reassuranceMessage: 'Você atingiu a meta recomendada pela Organização Mundial da Saúde para atividade física.',
    lastUpdated: 'Hoje'
  },
  {
    id: 'ind_vaccination',
    categoryKey: 'vaccination',
    title: 'Carteira de Vacinação',
    subtitle: 'Imunização do Adulto (SBIm / SUS)',
    status: 'green',
    currentValue: 'Atualizada (Gripe 2026 & Tétano)',
    unit: 'Status',
    targetRange: 'Todas as doses em dia',
    reassuranceMessage: 'Sua carteira de vacinação está completa para sua faixa etária.',
    lastUpdated: 'Maio/2026'
  },
  {
    id: 'ind_meds',
    categoryKey: 'current_meds',
    title: 'Medicamentos em Uso',
    subtitle: 'Adesão Posológica & Estoque',
    status: 'green',
    currentValue: '1 Medicamento (Losartana 50mg)',
    unit: 'Uso contínuo',
    targetRange: 'Adesão > 90%',
    reassuranceMessage: 'Uso regular confirmado. Restam 22 doses em estoque.',
    lastUpdated: 'Hoje, 08:00'
  },
  {
    id: 'ind_exams',
    categoryKey: 'pending_exams',
    title: 'Exames Pendentes & Check-up',
    subtitle: 'Rastreamento Preventivo Anual',
    status: 'gray',
    currentValue: '1 Exame Sugerido (Mamografia Eletiva)',
    unit: 'Pendente',
    targetRange: 'Anual',
    reassuranceMessage: 'Exame preventivo de rotina sugerido para agendamento nos próximos 60 dias.',
    lastUpdated: 'Pendente'
  }
];

export const mockPersonalHealthGoals: PersonalHealthPlanGoal[] = [
  {
    id: 'goal_cv',
    title: 'Melhorar Saúde Cardiovascular & Controle de PA',
    categoryName: 'Cardiovascular',
    iconName: 'Heart',
    description: 'Manter a pressão arterial sistólica abaixo de 120 mmHg com hábitos saudáveis.',
    adherencePercentage: 80,
    status: 'active',
    weeklyActions: [
      { id: 'act_1', title: 'Caminhada moderada de 30 minutos', targetDaysPerWeek: 5, completedDaysThisWeek: 4 },
      { id: 'act_2', title: 'Registrar medição de pressão arterial', targetDaysPerWeek: 3, completedDaysThisWeek: 3 },
      { id: 'act_3', title: 'Reduzir consumo de bebidas açucaradas', targetDaysPerWeek: 7, completedDaysThisWeek: 6 }
    ]
  },
  {
    id: 'goal_glycemia',
    title: 'Estabilizar Glicemia de Jejum',
    categoryName: 'Metabólico',
    iconName: 'Activity',
    description: 'Manter controle glicêmico e evitar picos de insulina após as refeições.',
    adherencePercentage: 70,
    status: 'active',
    weeklyActions: [
      { id: 'act_4', title: 'Caminhada de 15 min pós-almoço', targetDaysPerWeek: 5, completedDaysThisWeek: 3 },
      { id: 'act_5', title: 'Incluir fibras solúveis nas refeições', targetDaysPerWeek: 7, completedDaysThisWeek: 5 }
    ]
  }
];

export const mockClinicalEvidenceRules: ClinicalEvidenceRule[] = [
  {
    id: 'evid_bp_01',
    title: 'Diretriz Brasileira de Hipertensão Arterial (SBC/SBD 2023)',
    alertLevel: 'level_1_education',
    guidelineSource: 'Diretrizes da Sociedade Brasileira de Cardiologia (SBC)',
    scientificReference: 'Arq Bras Cardiol. 2023; 116(3):516-658.',
    recommendingSociety: 'Sociedade Brasileira de Cardiologia',
    lastReviewedDate: 'Janeiro/2026',
    targetPopulation: 'Adultos de 18 a 75 anos sem doença cardiovascular estabelecida.',
    contraindications: 'Pacientes em crise hipertensiva sintomática devem ser encaminhados imediatamente.',
    validatingPhysicianName: 'Dr. Roberto Mendes',
    validatingPhysicianCrm: 'CRM/SP 148.920',
    version: 'v2.4.1'
  },
  {
    id: 'evid_renal_02',
    title: 'Avaliação de Doença Renal Crônica (KDIGO 2023 Guidelines)',
    alertLevel: 'level_3_professional_review',
    guidelineSource: 'Kidney Disease: Improving Global Outcomes (KDIGO)',
    scientificReference: 'Kidney Int Suppl. 2023; 13(1):1-145.',
    recommendingSociety: 'KDIGO Global Clinical Practice Guidelines',
    lastReviewedDate: 'Março/2026',
    targetPopulation: 'Adultos com diabetes ou hipertensão para cálculo de TFGe (CKD-EPI 2021).',
    contraindications: 'Insuficiência renal aguda súbita requer atendimento hospitalar imediato.',
    validatingPhysicianName: 'Dra. Camila Vasconcelos',
    validatingPhysicianCrm: 'CRM/SP 162.401',
    version: 'v3.1.0'
  }
];

export const mockVaccinationRecords: VaccinationRecord[] = [
  {
    id: 'vac_rec_01',
    patientId: 'user_maria_01',
    vaccineCode: 'INFLUENZA_2026',
    vaccineName: 'Influenza Quadrivalente (Gripe 2026)',
    doseCode: 'ANNUAL_2026',
    doseDescription: 'Dose Anual de Outono',
    applicationDate: '2026-05-10',
    applicationTime: '09:30',
    manufacturer: 'Instituto Butantan / Sanofi Pasteur',
    batchNumber: '26B842A',
    expirationDate: '2026-11-30',
    administrationRoute: 'Intramuscular',
    applicationSite: 'Deltoide Esquerdo',
    establishmentName: 'UBS Jardim das Flores - SUS',
    establishmentCnes: '2048910',
    professionalId: 'enf_luciana',
    professionalName: 'Luciana Santos (Enfermeira)',
    professionalRegistration: 'COREN-SP 184920',
    sourceType: 'official_imported',
    validationStatus: 'validated',
    integrationStatus: 'synced_rnds',
    rndsProtocol: 'RNDS-BR-2026-891042',
    rndsSentAt: '2026-05-10T10:00:00Z',
    rndsConfirmedAt: '2026-05-10T10:01:15Z',
    createdBy: 'system_rnds_sync',
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:01:15Z',
    notes: 'Imunização anual do Programa Nacional de Imunizações (PNI).'
  },
  {
    id: 'vac_rec_02',
    patientId: 'user_maria_01',
    vaccineCode: 'COVID19_BIVALENT',
    vaccineName: 'COVID-19 Bivalente (Pfizer/BioNTech)',
    doseCode: 'BOOSTER_2',
    doseDescription: 'Reforço Bivalente XBB.1.5',
    applicationDate: '2025-11-15',
    manufacturer: 'Pfizer Inc',
    batchNumber: 'FF8192',
    establishmentName: 'Clínica de Vacinação Imune & Vida',
    establishmentCnes: '7481920',
    professionalName: 'Dra. Camila Vasconcelos',
    professionalRegistration: 'CRM/SP 162.401',
    sourceType: 'clinic_applied',
    validationStatus: 'validated',
    integrationStatus: 'synced_rnds',
    rndsProtocol: 'RNDS-BR-2025-774109',
    rndsSentAt: '2025-11-15T14:30:00Z',
    rndsConfirmedAt: '2025-11-15T14:30:45Z',
    createdBy: 'doc_camila',
    createdAt: '2025-11-15T14:30:00Z',
    updatedAt: '2025-11-15T14:30:45Z',
    evidenceDocumentId: 'doc_vac_01',
    evidenceDocumentName: 'comprovante_pfizer_bivalente.pdf'
  },
  {
    id: 'vac_rec_03',
    patientId: 'user_maria_01',
    vaccineCode: 'DENGUE_QDENGA',
    vaccineName: 'Dengue Tetravalente Atenuada (QDENGA)',
    doseCode: 'DOSE_1',
    doseDescription: '1ª Dose do Esquema (0-3 meses)',
    applicationDate: '2026-03-20',
    manufacturer: 'Takeda Pharmaceuticals',
    batchNumber: 'TAK991A',
    establishmentName: 'Farmácia & Vacinas Fleury',
    sourceType: 'user_reported',
    validationStatus: 'awaiting_validation',
    integrationStatus: 'not_integrated',
    evidenceDocumentId: 'doc_vac_02',
    evidenceDocumentName: 'foto_carteira_qdenga.jpg',
    createdBy: 'user_maria_01',
    createdAt: '2026-03-22T19:00:00Z',
    updatedAt: '2026-03-22T19:00:00Z',
    notes: 'Informado pela usuária e aguardando conferência do comprovante por profissional de saúde.'
  },
  {
    id: 'vac_rec_04',
    patientId: 'user_maria_01',
    vaccineCode: 'DTPA_ADULT',
    vaccineName: 'Tríplice Acelular do Adulto (dTpa - Difteria, Tétano e Coqueluche)',
    doseCode: 'BOOSTER_10Y',
    doseDescription: 'Reforço Decenal (10 em 10 anos)',
    applicationDate: '2021-08-10',
    manufacturer: 'GSK Biologicals',
    batchNumber: 'GSK334B',
    establishmentName: 'Posto de Saúde Central',
    sourceType: 'document_attached',
    validationStatus: 'validated',
    integrationStatus: 'not_integrated',
    createdBy: 'user_maria_01',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
    evidenceDocumentId: 'doc_vac_03',
    evidenceDocumentName: 'carteira_vacina_antiga.pdf'
  }
];

export const mockVaccinationDocuments: VaccinationDocument[] = [
  {
    id: 'doc_vac_01',
    patientId: 'user_maria_01',
    fileReference: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    fileType: 'application/pdf',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    originalFilename: 'comprovante_pfizer_bivalente.pdf',
    uploadedBy: 'user_maria_01',
    uploadedByName: 'Maria Silva',
    uploadedAt: '2025-11-15T15:00:00Z',
    validationStatus: 'validated',
    validatedBy: 'Dra. Camila Vasconcelos',
    validatedAt: '2025-11-15T16:00:00Z',
    linkedVaccineRecordIds: ['vac_rec_02']
  },
  {
    id: 'doc_vac_02',
    patientId: 'user_maria_01',
    fileReference: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=800',
    fileType: 'image/jpeg',
    fileHash: 'a8f5f167f44f4964e6c998dee827110c',
    originalFilename: 'foto_carteira_qdenga.jpg',
    uploadedBy: 'user_maria_01',
    uploadedByName: 'Maria Silva',
    uploadedAt: '2026-03-22T19:00:00Z',
    validationStatus: 'pending',
    linkedVaccineRecordIds: ['vac_rec_03']
  }
];

export const mockVaccinationAuditLogs: VaccinationAuditLog[] = [
  {
    id: 'aud_vac_01',
    vaccinationRecordId: 'vac_rec_03',
    action: 'record_created',
    userId: 'user_maria_01',
    userName: 'Maria Silva',
    userRole: 'patient',
    newData: 'Vacina QDENGA 1ª dose cadastrada via formulário manual',
    ipAddress: '189.120.45.12',
    createdAt: '2026-03-22T19:00:00Z'
  },
  {
    id: 'aud_vac_02',
    vaccinationRecordId: 'vac_rec_01',
    action: 'rnds_synced',
    userId: 'system_rnds',
    userName: 'Conector RNDS / DATASUS',
    userRole: 'system',
    newData: 'Protocolo RNDS-BR-2026-891042 gerado e confirmado',
    ipAddress: '10.0.4.1',
    createdAt: '2026-05-10T10:01:15Z'
  }
];

export const mockVaccinationReminders: VaccinationReminder[] = [
  {
    id: 'rem_vac_01',
    patientId: 'user_maria_01',
    vaccinationRecordId: 'vac_rec_03',
    vaccineName: 'Dengue Tetravalente (QDENGA)',
    doseDescription: '2ª Dose (3 meses após 1ª dose)',
    expectedDate: '2026-06-20',
    reminderDate: '2026-06-13',
    channel: 'in_app',
    status: 'active',
    createdAt: '2026-03-22T19:05:00Z'
  }
];

export const mockVaccineProtocolRules: VaccineProtocolRule[] = [
  {
    id: 'prot_vac_dengue',
    title: 'Protocolo SBIm / MS 2026 - Vacinação Contra Dengue (QDENGA)',
    vaccineCode: 'DENGUE_QDENGA',
    vaccineName: 'Dengue (QDENGA Takeda)',
    guidelineSource: 'Sociedade Brasileira de Imunizações (SBIm) & Ministério da Saúde',
    version: 'v2026.1',
    effectiveDate: 'Janeiro/2026',
    targetPopulation: 'Indivíduos de 4 a 60 anos, independentemente de exposição prévia à dengue.',
    minAgeYears: 4,
    maxAgeYears: 60,
    contraindications: 'Gestantes, lactantes e pessoas com imunodeficiência primária ou adquirida.',
    doseSchedule: 'Esquema de 2 doses (Intervalo de 3 meses entre a 1ª e a 2ª dose).',
    recommendedIntervalDays: 90,
    reassuringNotes: 'A segunda dose garante proteção ampliada contra os 4 sorotipos da dengue.',
    validatingPhysicianName: 'Dr. Roberto Mendes',
    lastReviewedDate: '2026-01-15',
    status: 'published'
  },
  {
    id: 'prot_vac_flu',
    title: 'Protocolo SBIm / OMS - Imunização Anual contra Influenza',
    vaccineCode: 'INFLUENZA_ANNUAL',
    vaccineName: 'Gripe / Influenza (Quadrivalente)',
    guidelineSource: 'SBIm & Programa Nacional de Imunizações (PNI/SUS)',
    version: 'v2026.2',
    effectiveDate: 'Março/2026',
    targetPopulation: 'Toda a população a partir dos 6 meses de idade.',
    minAgeYears: 0,
    contraindications: 'Histórico de reação anafilática grave a componentes de doses anteriores.',
    doseSchedule: 'Dose única anual durante a campanha de outono/inverno.',
    recommendedIntervalDays: 365,
    reassuringNotes: 'Proteção essencial contra cepas sazonais em circulação no Brasil.',
    validatingPhysicianName: 'Dra. Camila Vasconcelos',
    lastReviewedDate: '2026-03-01',
    status: 'published'
  }
];

export const mockFamilyHealthHistory: FamilyHealthHistory[] = [
  {
    id: 'fam_hist_01',
    patientId: 'user_maria_01',
    relationship: 'mother',
    relationshipLabel: 'Mãe',
    conditionCode: 'HAS_ICD10',
    conditionName: 'Hipertensão Arterial Sistêmica',
    ageAtDiagnosis: 54,
    maternalOrPaternalBranch: 'maternal',
    notes: 'Diagnóstico por volta dos 50 anos, sob controle farmacológico.',
    sourceType: 'manual_user',
    validationStatus: 'pending_review',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'fam_hist_02',
    patientId: 'user_maria_01',
    relationship: 'maternal_grandmother',
    relationshipLabel: 'Avó Materna',
    conditionCode: 'DM2_ICD10',
    conditionName: 'Diabetes Mellitus Tipo 2',
    ageAtDiagnosis: 62,
    maternalOrPaternalBranch: 'maternal',
    notes: 'Tratamento com medicação oral.',
    sourceType: 'manual_user',
    validationStatus: 'verified',
    createdAt: '2026-02-10T11:20:00Z',
    updatedAt: '2026-02-10T11:20:00Z'
  }
];

export const mockCheckupResult: HealthAssessmentResult = {
  id: 'chk_res_01',
  patientId: 'user_maria_01',
  completedPercentage: 75,
  lastUpdated: '2026-05-18T16:00:00Z',
  sourceType: 'manual_user',
  validationStatus: 'pending_review',
  categoryResults: [
    {
      category: 'in_order',
      title: 'Em Dia',
      description: 'Dados ou ações preventivas que estão atualizados e em conformidade.',
      itemCount: 4,
      items: [
        {
          id: 'item_01',
          title: 'Pressão Arterial Monitorada',
          description: 'Sua medição mais recente (118/76 mmHg) está na faixa ideal de acompanhamento.',
          recommendedAction: 'Manter rotina de medições quinzenais e hábitos saudáveis.',
          domain: 'Cardiovascular'
        },
        {
          id: 'item_02',
          title: 'Vacinação COVID-19 & Dengue',
          description: 'Doses de reforço bivalente e 1ª dose QDENGA devidamente registradas.',
          recommendedAction: 'Acompanhar calendário para 2ª dose contra dengue em 06/2026.',
          domain: 'Imunizações'
        }
      ]
    },
    {
      category: 'needs_update',
      title: 'Precisa Atualizar',
      description: 'Informações antigas ou exames preventivos que aguardam atualização de data.',
      itemCount: 2,
      items: [
        {
          id: 'item_03',
          title: 'Perfil Lipídico / Colesterol',
          description: 'Último exame de colesterol foi registrado há mais de 12 meses.',
          recommendedAction: 'Atualizar resultados no próximo check-up de rotina.',
          domain: 'Metabólica'
        }
      ]
    },
    {
      category: 'deserves_conference',
      title: 'Merece Conferência',
      description: 'Hábito ou parâmetro que merece atenção educativa e revisão preventiva.',
      itemCount: 2,
      items: [
        {
          id: 'item_04',
          title: 'Tempo Sentado e Hidratação Informada',
          description: 'Relato de mais de 7 horas diárias sentada no trabalho com consumo d\'água moderado.',
          recommendedAction: 'Pausas ativas a cada 90 minutos e aumentar hidratação fracionada.',
          domain: 'Estilo de Vida'
        }
      ]
    },
    {
      category: 'professional_evaluation_recommended',
      title: 'Avaliação Profissional Recomendada',
      description: 'Tópicos preventivos sugeridos para compartilhar com sua equipe médica na próxima consulta.',
      itemCount: 1,
      items: [
        {
          id: 'item_05',
          title: 'Histórico Familiar de Hipertensão (Mãe)',
          description: 'Histórico de HAS materna aos 54 anos associado a episódios esporádicos de estresse laboral.',
          recommendedAction: 'Conversar com seu médico assistente sobre mapa de rastreio de médio prazo.',
          domain: 'Prevenção Familiar'
        }
      ]
    }
  ]
};

export const mockHistoricalConsultations: HistoricalConsultationRecord[] = [
  {
    id: 'hist_cons_01',
    patientId: 'user_maria_01',
    patientName: 'Maria Silva',
    patientAge: 45,
    patientSex: 'female',
    consultationDate: '2026-03-10T14:00:00Z',
    consultationEpoch: '2026-Q1',
    consultationType: 'presencial',
    doctorName: 'Dr. Roberto Mendes',
    doctorCrm: 'CRM/SP 148.920',
    specialty: 'Cardiologia & Medicina Preventiva',
    mainDiagnosisCid10: 'I10 (Hipertensão Essencial Primária)',
    diagnosisDescription: 'Acompanhamento preventivo cardiometabólico de rotina.',
    soapNotes: {
      subjective: 'Paciente relata boa evolução geral, sem queixas precordiais ou de dispneia aos esforços. Mantém rotina de caminhadas 3x por semana. Refere episódio isolado de estresse laboral.',
      objective: 'BEG, corada, acianótica, anictérica. RCR 2EF BNF sem sopros. AP MV+ sem ruídos adventícios. Edema de MMII ausente. PA: 122/78 mmHg, FC: 70 bpm, Peso: 64.2 kg.',
      assessment: 'Hipertensão Arterial Sistêmica Estágio 1 sob excelente controle preventivo e hábitos de vida adequados.',
      plan: 'Manter Losartana Potássica 50mg/dia. Solicitado controle quinquenal de perfil lipídico e HbA1c. Orientado manter atividade física e retorno em 6 meses.'
    },
    vitalsAtEpoch: {
      bloodPressure: '122/78',
      heartRateBpm: 70,
      weightKg: 64.2,
      spO2Percent: 99,
      glycemiaMgDl: 94
    },
    prescriptionsIssued: [
      {
        id: 'rx_h_01',
        medicationName: 'Losartana Potássica 50mg',
        dosageInstruction: 'Tomar 1 comprimido via oral pela manhã diariamente.',
        duration: 'Uso contínuo (90 dias)'
      }
    ],
    examsRequested: ['Perfil Lipídico Completo', 'Hemoglobina Glicada (HbA1c)', 'Creatinina Sérica'],
    integrityHash: '0x9a8f4b12c58e190a',
    signedWithIcpBrasil: true,
    signedAt: '2026-03-10T14:35:00Z'
  },
  {
    id: 'hist_cons_02',
    patientId: 'user_maria_01',
    patientName: 'Maria Silva',
    patientAge: 44,
    patientSex: 'female',
    consultationDate: '2025-09-18T10:30:00Z',
    consultationEpoch: '2025-Q3',
    consultationType: 'telemedicina',
    doctorName: 'Dra. Juliana Santos',
    doctorCrm: 'CRM/SP 198.420',
    specialty: 'Medicina de Família & Comunidade',
    mainDiagnosisCid10: 'Z00.0 (Exame Médico Geral)',
    diagnosisDescription: 'Revisão anual de exames de rastreio e check-up.',
    soapNotes: {
      subjective: 'Atendimento via telemedicina para revisão de exames laboratoriais anuais e renovação de acompanhamento.',
      objective: 'Exames apresentados: Glicemia 92 mg/dL, Colesterol Total 188 mg/dL, HDL 54 mg/dL, LDL 112 mg/dL. PA informada via dispositivo conectado: 118/76 mmHg.',
      assessment: 'Perfil metabólico dentro das metas de prevenção primária.',
      plan: 'Mantidas orientações dietéticas. Orientada vacinação de reforço bivalente COVID-19.'
    },
    vitalsAtEpoch: {
      bloodPressure: '118/76',
      heartRateBpm: 68,
      weightKg: 65.0,
      spO2Percent: 98,
      glycemiaMgDl: 92
    },
    prescriptionsIssued: [],
    examsRequested: ['Eletrocardiograma de Repouso'],
    integrityHash: '0x3b1c8f90a44e7192',
    signedWithIcpBrasil: true,
    signedAt: '2025-09-18T10:50:00Z'
  },
  {
    id: 'hist_cons_03',
    patientId: 'user_carlos_02',
    patientName: 'Carlos Oliveira',
    patientAge: 52,
    patientSex: 'male',
    consultationDate: '2024-11-05T15:15:00Z',
    consultationEpoch: '2024-Q4',
    consultationType: 'presencial',
    doctorName: 'Dr. Roberto Mendes',
    doctorCrm: 'CRM/SP 148.920',
    specialty: 'Cardiologia',
    mainDiagnosisCid10: 'E11 (Diabetes Mellitus Tipo 2)',
    diagnosisDescription: 'Ajuste inicial de esquema terapêutico metabólico.',
    soapNotes: {
      subjective: 'Paciente relata boca seca esporádica e ganho de peso nos últimos 6 meses. Negou episódios de hipoglicemia.',
      objective: 'Peso 84 kg, Altura 1.78m, IMC 26.5 kg/m². PA: 134/86 mmHg, FC: 76 bpm. Glicemia de jejum recente: 138 mg/dL, HbA1c: 7.1%.',
      assessment: 'DM2 em diagnóstico recente com controle metabólico a otimizar.',
      plan: 'Iniciada Metformina 850mg 2x/dia. Encaminhamento para acompanhamento nutricional e prescrição de programa de atividade física.'
    },
    vitalsAtEpoch: {
      bloodPressure: '134/86',
      heartRateBpm: 76,
      weightKg: 84.0,
      glycemiaMgDl: 138
    },
    prescriptionsIssued: [
      {
        id: 'rx_h_02',
        medicationName: 'Cloridrato de Metformina 850mg',
        dosageInstruction: 'Tomar 1 comprimido via oral após o almoço e 1 comprimido após o jantar.',
        duration: 'Uso contínuo'
      }
    ],
    examsRequested: ['Microalbuminúria de 24h', 'Fundo de Olho / Retinografia'],
    integrityHash: '0x7a4192b0c114f881',
    signedWithIcpBrasil: true,
    signedAt: '2024-11-05T15:45:00Z'
  }
];

// ============================================================================
// MOCK DATA FOR ETAPA 2 — MAPA DE SAÚDE, AGENDA PREVENTIVA & PLANO DE AÇÕES
// ============================================================================

export const mock13HealthMapDomains: HealthMapDomainState[] = [
  {
    id: 'domain_cv',
    domainKey: 'cardiovascular',
    title: 'Saúde Cardiovascular',
    iconName: 'Heart',
    description: 'Acompanhamento da pressão arterial, ritmo cardíaco e fatores de risco circulatório.',
    status: 'up_to_date',
    infoAvailablePercentage: 90,
    protectiveFactors: ['Pressão arterial normalizada (118/76 mmHg)', 'Não fumante', 'Caminhadas regulares 3x/semana'],
    modifiableFactors: ['Picos de estresse no trabalho', 'Consumo moderado de sódio'],
    missingInformation: ['Eletrocardiograma de repouso atualizado (último há +18 meses)'],
    consideredData: ['Pressão arterial (Omron BLE)', 'Frequência cardíaca (Apple Watch)', 'Histórico familiar (HAS mãe)'],
    relatedActionIds: ['act_01', 'act_02'],
    lastUpdated: '2026-05-18T10:00:00Z',
    sourceType: 'connected_device',
    validationStatus: 'verified',
    sourceProtocol: 'Atualização da Diretriz de Prevenção Cardiovascular (SBC 2024/2026)',
    protocolVersion: 'v2026.2'
  },
  {
    id: 'domain_meta',
    domainKey: 'metabolic',
    title: 'Saúde Metabólica',
    iconName: 'Activity',
    description: 'Monitoramento da glicemia, hemoglobina glicada, perfil lipídico e controle glicêmico.',
    status: 'needs_attention',
    infoAvailablePercentage: 75,
    protectiveFactors: ['Glicemia de jejum recente normal (92 mg/dL)', 'IMC adequado (23.4 kg/m²)'],
    modifiableFactors: ['Perfil lipídico completo pendente há 12 meses', 'Consumo fracionado de açúcares simples'],
    missingInformation: ['Dosagem recente de Colesterol HDL/LDL e Triglicerídeos'],
    consideredData: ['Glicemia de jejum recente', 'Peso corporal (64 kg)', 'Histórico de Diabetes Tipo 2 (Avó materna)'],
    relatedActionIds: ['act_03'],
    lastUpdated: '2026-04-12T14:30:00Z',
    sourceType: 'laboratory',
    validationStatus: 'official',
    sourceProtocol: 'Diretriz da Sociedade Brasileira de Diabetes (SBD 2025/2026)',
    protocolVersion: 'v2026.1'
  },
  {
    id: 'domain_renal',
    domainKey: 'renal',
    title: 'Saúde Renal',
    iconName: 'Droplet',
    description: 'Avaliação da taxa de filtração glomerular (eGFR), creatinina e rastreio de albuminúria.',
    status: 'up_to_date',
    infoAvailablePercentage: 85,
    protectiveFactors: ['Creatinina sérica dentro do valor de referência (0.8 mg/dL)', 'Hidratação informada regular'],
    modifiableFactors: ['Uso eventual de anti-inflamatórios em episódios de dor de cabeça'],
    missingInformation: ['Relação Albuminúria/Creatininúria em amostra isolada'],
    consideredData: ['Creatinina sérica', 'Histórico medicamentoso', 'Pressão arterial sistêmica'],
    relatedActionIds: ['act_04'],
    lastUpdated: '2026-03-15T09:00:00Z',
    sourceType: 'laboratory',
    validationStatus: 'verified',
    sourceProtocol: 'Diretriz de Rastreamento da Função Renal KDIGO / SBN',
    protocolVersion: 'v2026.1'
  },
  {
    id: 'domain_resp',
    domainKey: 'respiratory',
    title: 'Saúde Respiratória',
    iconName: 'Wind',
    description: 'Acompanhamento da saturação de oxigênio (SpO2), capacidade pulmonar e histórico tabágico.',
    status: 'up_to_date',
    infoAvailablePercentage: 95,
    protectiveFactors: ['Saturação SpO2 constante em 98-99%', 'Não fumante', 'Sem sintomas de dispneia ou sibilos'],
    modifiableFactors: ['Pouca exposição a ambientes arborizados durante a semana'],
    missingInformation: [],
    consideredData: ['SpO2 (Apple Watch / Telemetria)', 'Questionário de estilo de vida', 'Vacinação contra Influenza e COVID-19'],
    relatedActionIds: [],
    lastUpdated: '2026-05-20T11:15:00Z',
    sourceType: 'connected_device',
    validationStatus: 'verified',
    sourceProtocol: 'Guia de Saúde Respiratória e Prevenção Primária SBPT',
    protocolVersion: 'v2025.4'
  },
  {
    id: 'domain_musc',
    domainKey: 'musculoskeletal',
    title: 'Saúde Musculoesquelética',
    iconName: 'Dumbbell',
    description: 'Monitoramento de força, flexibilidade, dor crônica e prevenção de dor lombar postural.',
    status: 'needs_attention',
    infoAvailablePercentage: 65,
    protectiveFactors: ['Prática de caminhadas 3x por semana', 'Ausência de fraturas prévias'],
    modifiableFactors: ['Permanece mais de 7 horas sentada diariamente em trabalho de escritório', 'Ausência de fortalecimento muscular específico'],
    missingInformation: ['Avaliação postural e de força de quadríceps com fisioterapeuta'],
    consideredData: ['Check-up preventivo (Estilo de vida)', 'Horas sentadas informadas (7-8h)'],
    relatedActionIds: ['act_05'],
    lastUpdated: '2026-05-01T08:00:00Z',
    sourceType: 'manual_user',
    validationStatus: 'pending_review',
    sourceProtocol: 'Recomendações da Sociedade Brasileira de Ergonometria e Reabilitação',
    protocolVersion: 'v2026.1'
  },
  {
    id: 'domain_bone',
    domainKey: 'bone',
    title: 'Saúde Óssea',
    iconName: 'Shield',
    description: 'Prevenção de osteopenia, acompanhamento de densitometria e ingesta de cálcio/vitamina D.',
    status: 'needs_information',
    infoAvailablePercentage: 40,
    protectiveFactors: ['Caminhadas regulares (exercício de impacto moderado)', 'Sem relato de quedas recentes'],
    modifiableFactors: ['Ingesta estimada de cálcio abaixo da meta diária', 'Exposição solar restrita a finais de semana'],
    missingInformation: ['Dosagem de 25-OH-Vitamina D', 'Densitometria óssea baseline pós-45 anos'],
    consideredData: ['Idade (45 anos)', 'Sexo feminino', 'Questionário preventivo'],
    relatedActionIds: ['act_06'],
    lastUpdated: '2026-02-14T10:00:00Z',
    sourceType: 'manual_user',
    validationStatus: 'unverified',
    sourceProtocol: 'Consenso Brasileiro de Osteoporose e Saúde Óssea ABRASSO',
    protocolVersion: 'v2025.2'
  },
  {
    id: 'domain_vac',
    domainKey: 'vaccination',
    title: 'Vacinação & Imunologia',
    iconName: 'Syringe',
    description: 'Carteira de vacinação digital, reforços periódicos e proteção contra doenças imunopreveníveis.',
    status: 'up_to_date',
    infoAvailablePercentage: 100,
    protectiveFactors: ['Dose 1 QDENGA (Dengue) realizada', 'Reforço bivalente COVID-19 em dia', 'Tríplice viral atualizada'],
    modifiableFactors: ['Aguardar intervalo para 2ª dose contra dengue em 06/2026'],
    missingInformation: [],
    consideredData: ['Módulo Minha Vacinação', 'Registros validados via comprovante anexado'],
    relatedActionIds: ['act_07'],
    lastUpdated: '2026-05-10T16:00:00Z',
    sourceType: 'uploaded_document',
    validationStatus: 'official',
    sourceProtocol: 'Calendário de Vacinação do Adulto SBIm / PNI 2025/2026',
    protocolVersion: 'v2026.1'
  },
  {
    id: 'domain_sleep',
    domainKey: 'sleep',
    title: 'Saúde do Sono',
    iconName: 'Moon',
    description: 'Acompanhamento da duração, eficiência, regularidade de horários e padrão de reparação do sono.',
    status: 'up_to_date',
    infoAvailablePercentage: 80,
    protectiveFactors: ['Média de 7.2 horas de sono por noite', 'Horário de deitar regular (22:30)', 'Sem histórico de sonolência excessiva diurna'],
    modifiableFactors: ['Uso de telas (celular) até 30 minutos antes de dormir'],
    missingInformation: ['Índice de variabilidade da frequência cardíaca noturna (HRV) completo'],
    consideredData: ['Apple Watch (HealthKit)', 'Questionário do Check-up Preventivo'],
    relatedActionIds: ['act_08'],
    lastUpdated: '2026-05-21T07:00:00Z',
    sourceType: 'connected_device',
    validationStatus: 'verified',
    sourceProtocol: 'Diretriz de Higiene do Sono da Associação Brasileira do Sono (ABS)',
    protocolVersion: 'v2025.3'
  },
  {
    id: 'domain_emo',
    domainKey: 'emotional',
    title: 'Saúde Emocional',
    iconName: 'Smile',
    description: 'Percepção de bem-estar, gerenciamento de estresse laboral, disposição e apoio social.',
    status: 'needs_attention',
    infoAvailablePercentage: 70,
    protectiveFactors: ['Bom suporte familiar e rede de apoio', 'Prática regular de lazer aos finais de semana'],
    modifiableFactors: ['Picos recorrentes de estresse em períodos de fechamento no trabalho'],
    missingInformation: ['Acompanhamento ou momentos formais de descompressão diária'],
    consideredData: ['Autoavaliação de estresse (Moderado)', 'Relato no check-up preventivo'],
    relatedActionIds: ['act_09'],
    lastUpdated: '2026-04-20T18:00:00Z',
    sourceType: 'manual_user',
    validationStatus: 'pending_review',
    sourceProtocol: 'Diretriz de Saúde Mental e Gestão de Estresse em Medicina de Família',
    protocolVersion: 'v2026.1'
  },
  {
    id: 'domain_dent',
    domainKey: 'dental',
    title: 'Saúde Bucal',
    iconName: 'Sparkles',
    description: 'Prevenção de cáries, saúde gengival e acompanhamento odontológico periódico.',
    status: 'up_to_date',
    infoAvailablePercentage: 85,
    protectiveFactors: ['Última avaliação odontológica há 6 meses', 'Escovação 3x ao dia com uso de fio dental'],
    modifiableFactors: ['Agendar limpeza profilática de rotina em 60 dias'],
    missingInformation: [],
    consideredData: ['Registro de check-up preventivo', 'Histórico informado'],
    relatedActionIds: ['act_10'],
    lastUpdated: '2026-01-10T11:00:00Z',
    sourceType: 'manual_user',
    validationStatus: 'verified',
    sourceProtocol: 'Protocolo de Prevenção Bucal e Profilaxia Odontológica ABO',
    protocolVersion: 'v2025.1'
  },
  {
    id: 'domain_life',
    domainKey: 'lifestyle',
    title: 'Hábitos de Vida & Nutrição',
    iconName: 'Compass',
    description: 'Alimentação equilibrada, fracionamento de água, nível de atividade e controle de hábitos.',
    status: 'up_to_date',
    infoAvailablePercentage: 80,
    protectiveFactors: ['Não fumante', 'Consumo fracionado de vegetais e fibras', 'Ingesta hídrica de ~2 litros/dia'],
    modifiableFactors: ['Reduzir tempo contínuo sentado durante o expediente de trabalho'],
    missingInformation: ['Registro detalhado de diário alimentar de 3 dias'],
    consideredData: ['Check-up Preventivo', 'Aferições de peso e IMC'],
    relatedActionIds: ['act_11'],
    lastUpdated: '2026-05-15T09:30:00Z',
    sourceType: 'manual_user',
    validationStatus: 'verified',
    sourceProtocol: 'Guia Alimentar para a População Brasileira / Ministério da Saúde',
    protocolVersion: 'v2025.2'
  },
  {
    id: 'domain_age',
    domainKey: 'age_group_prevention',
    title: 'Prevenção por Faixa Etária',
    iconName: 'Calendar',
    description: 'Rastreamentos indicados pelas sociedades médicas para a faixa etária dos 40 a 50 anos.',
    status: 'professional_review_recommended',
    infoAvailablePercentage: 60,
    protectiveFactors: ['Consultas de rotina realizadas nos últimos 12 meses'],
    modifiableFactors: ['Avaliar calendário de rastreamento ginecológico/mamográfico com médico assistente'],
    missingInformation: ['Comprovante ou data de mamografia recente'],
    consideredData: ['Idade (45 anos)', 'Sexo feminino', 'Histórico de consultas'],
    relatedActionIds: ['act_12'],
    lastUpdated: '2026-03-10T14:35:00Z',
    sourceType: 'manual_professional',
    validationStatus: 'pending_review',
    sourceProtocol: 'Diretriz de Rastreamento em Saúde da Mulher FEBRASGO / INCA',
    protocolVersion: 'v2026.1'
  },
  {
    id: 'domain_prof',
    domainKey: 'professional_followup',
    title: 'Acompanhamento Profissional',
    iconName: 'Stethoscope',
    description: 'Supervisão médica e integração com sua equipe de saúde cadastrada.',
    status: 'up_to_date',
    infoAvailablePercentage: 90,
    protectiveFactors: ['Vínculo ativo com Dr. Roberto Mendes (CRM/SP 148.920)', 'Consentimento LGPD concedido'],
    modifiableFactors: ['Manter agendamento da consulta de retorno semestral'],
    missingInformation: [],
    consideredData: ['Prontuário eletrônico', 'Consentimento LGPD ativo', 'Equipe de saúde cadastrada'],
    relatedActionIds: ['act_13'],
    lastUpdated: '2026-03-10T14:35:00Z',
    sourceType: 'official_source',
    validationStatus: 'official',
    sourceProtocol: 'Protocolo de Navegação do Cuidado e Supervisão Multidisciplinar',
    protocolVersion: 'v2026.1'
  }
];

export const mockPreventiveActions: PreventiveAction[] = [
  {
    id: 'act_01',
    patientId: 'user_maria_01',
    type: 'laboratory_exam',
    title: 'Realizar Perfil Lipídico Completo & Colesterol',
    description: 'Dosagem de Colesterol Total, HDL, LDL, VLDL e Triglicerídeos para atualização do mapa cardiometabólico.',
    clinicalDomain: 'Saúde Metabólica',
    priority: 'recommended',
    status: 'pending',
    expectedDate: '2026-06-15',
    sourceType: 'system_generated',
    sourceProtocolId: 'proto_sbc_cv_risk_2026',
    sourceProtocolName: 'Diretriz de Rastreamento Cardiometabólico e Dislipidemia',
    sourceProtocolOrganization: 'SBC (Sociedade Brasileira de Cardiologia)',
    sourceProtocolVersion: 'v2026.2',
    professionalReviewRequired: false,
    validationStatus: 'calculated',
    createdBy: 'Evidence Rules Engine v2026',
    idempotencyKey: 'user_maria_01:laboratory_exam:proto_sbc_cv_risk_2026:2026-06-15',
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'act_02',
    patientId: 'user_maria_01',
    type: 'vaccination',
    title: 'Aplicar 2ª Dose da Vacina contra Dengue (QDENGA)',
    description: 'Segunda dose do esquema de imunização contra dengue para garantir proteção ampliada.',
    clinicalDomain: 'Vacinação & Imunologia',
    priority: 'routine',
    status: 'scheduled',
    expectedDate: '2026-06-20',
    scheduledDate: '2026-06-20',
    sourceType: 'official_source',
    sourceProtocolId: 'proto_sbim_adult_2026',
    sourceProtocolName: 'Protocolo de Imunização do Adulto e Idoso',
    sourceProtocolOrganization: 'SBIm / PNI',
    sourceProtocolVersion: 'v2026.1',
    professionalReviewRequired: false,
    validationStatus: 'official',
    createdBy: 'Módulo Minha Vacinação',
    idempotencyKey: 'user_maria_01:vaccination:proto_sbim_adult_2026:2026-06-20',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z'
  },
  {
    id: 'act_03',
    patientId: 'user_maria_01',
    type: 'consultation',
    title: 'Consulta Médica de Retorno Semestral',
    description: 'Consulta presencial com Dr. Roberto Mendes para revisão de exames e plano preventivo.',
    clinicalDomain: 'Acompanhamento Profissional',
    priority: 'recommended',
    status: 'scheduled',
    expectedDate: '2026-07-10',
    scheduledDate: '2026-07-10',
    sourceType: 'manual_professional',
    sourceProtocolId: 'proto_sbc_cv_risk_2026',
    sourceProtocolName: 'Acompanhamento Clínico Preventivo',
    sourceProtocolOrganization: 'SBC / CFM',
    sourceProtocolVersion: 'v2026.1',
    professionalReviewRequired: true,
    validationStatus: 'verified',
    createdBy: 'Dr. Roberto Mendes (CRM/SP 148.920)',
    idempotencyKey: 'user_maria_01:consultation:doctor_roberto:2026-07-10',
    createdAt: '2026-03-10T14:35:00Z',
    updatedAt: '2026-03-10T14:35:00Z'
  },
  {
    id: 'act_04',
    patientId: 'user_maria_01',
    type: 'dental_evaluation',
    title: 'Avaliação Odontológica de Profilaxia Semestral',
    description: 'Limpeza e revisão preventiva periódica da saúde gengival.',
    clinicalDomain: 'Saúde Bucal',
    priority: 'routine',
    status: 'pending',
    expectedDate: '2026-07-25',
    sourceType: 'system_generated',
    sourceProtocolId: 'proto_abo_dental_2025',
    sourceProtocolName: 'Protocolo de Profilaxia Bucal Periódica',
    sourceProtocolOrganization: 'Associação Brasileira de Odontologia (ABO)',
    sourceProtocolVersion: 'v2025.1',
    professionalReviewRequired: false,
    validationStatus: 'calculated',
    createdBy: 'Evidence Rules Engine',
    idempotencyKey: 'user_maria_01:dental_evaluation:proto_abo_dental_2025:2026-07-25',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-01-10T11:00:00Z'
  },
  {
    id: 'act_05',
    patientId: 'user_maria_01',
    type: 'physical_activity',
    title: 'Registrar Pausas Ativas e Alongamento Diário',
    description: 'Realizar pausas de 3 minutos a cada 90 minutos de trabalho sentado no computador.',
    clinicalDomain: 'Saúde Musculoesquelética',
    priority: 'informational',
    status: 'completed',
    expectedDate: '2026-05-20',
    completedAt: '2026-05-20T17:30:00Z',
    sourceType: 'manual_user',
    sourceProtocolId: 'proto_ergonomia_2026',
    sourceProtocolName: 'Diretriz de Ergonometria e Pausas Ativas no Trabalho',
    sourceProtocolOrganization: 'Sociedade Brasileira de Ergonometria',
    sourceProtocolVersion: 'v2026.1',
    professionalReviewRequired: false,
    validationStatus: 'verified',
    createdBy: 'Paciente (Check-up Preventivo)',
    idempotencyKey: 'user_maria_01:physical_activity:pausas_ativas:2026-05-20',
    createdAt: '2026-05-18T09:00:00Z',
    updatedAt: '2026-05-20T17:30:00Z'
  },
  {
    id: 'act_06',
    patientId: 'user_maria_01',
    type: 'screening',
    title: 'Revisar Calendário de Rastreamento Feminino (Mamografia)',
    description: 'Discutir com a equipe médica a oportunidade de mamografia preventiva baseline aos 45 anos.',
    clinicalDomain: 'Prevenção por Faixa Etária',
    priority: 'needs_review',
    status: 'needs_review',
    expectedDate: '2026-08-01',
    sourceType: 'calculated',
    sourceProtocolId: 'proto_febrasgo_inca_2026',
    sourceProtocolName: 'Diretriz de Rastreamento Mamográfico em Saúde da Mulher',
    sourceProtocolOrganization: 'FEBRASGO / INCA',
    sourceProtocolVersion: 'v2026.1',
    professionalReviewRequired: true,
    validationStatus: 'pending_review',
    createdBy: 'Evidence Rules Engine',
    idempotencyKey: 'user_maria_01:screening:proto_febrasgo_inca_2026:2026-08-01',
    createdAt: '2026-03-10T14:35:00Z',
    updatedAt: '2026-03-10T14:35:00Z'
  }
];

export const mockPreventivePlanTasks: PreventivePlanTask[] = [
  {
    id: 'task_01',
    patientId: 'user_maria_01',
    title: 'Agendar Perfil Lipídico / Colesterol no Laboratório',
    objective: 'Atualizar exames metabólicos pendentes há 12 meses',
    targetWeek: '2026-W23',
    domainKey: 'metabolic',
    domainTitle: 'Saúde Metabólica',
    priorityOrder: 1,
    status: 'pending',
    assignedRole: 'Você',
    actionIdRef: 'act_01',
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'task_02',
    patientId: 'user_maria_01',
    title: 'Confirmar horário da 2ª Dose da Vacina contra Dengue',
    objective: 'Garantir imunização completa antes de julho',
    targetWeek: '2026-W23',
    domainKey: 'vaccination',
    domainTitle: 'Vacinação & Imunologia',
    priorityOrder: 2,
    status: 'completed',
    completedAt: '2026-05-22T14:00:00Z',
    assignedRole: 'Você',
    actionIdRef: 'act_02',
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'task_03',
    patientId: 'user_maria_01',
    title: 'Aferir Pressão Arterial 2x nesta semana',
    objective: 'Registrar medição de controle no Omron BLE para a consulta',
    targetWeek: '2026-W23',
    domainKey: 'cardiovascular',
    domainTitle: 'Saúde Cardiovascular',
    priorityOrder: 3,
    status: 'completed',
    completedAt: '2026-05-21T08:30:00Z',
    assignedRole: 'Você',
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'task_04',
    patientId: 'user_maria_01',
    title: 'Caminhar 40 minutos em 3 dias da semana',
    objective: 'Manter hábito protetor cardiovascular e musculoesquelético',
    targetWeek: '2026-W23',
    domainKey: 'lifestyle',
    domainTitle: 'Hábitos de Vida',
    priorityOrder: 4,
    status: 'completed',
    completedAt: '2026-05-22T18:00:00Z',
    assignedRole: 'Você',
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    id: 'task_05',
    patientId: 'user_maria_01',
    title: 'Anotar dúvidas para a Consulta com Dr. Roberto Mendes',
    objective: 'Preparar resumo de sintomas e histórico familiar para o retorno',
    targetWeek: '2026-W23',
    domainKey: 'professional_followup',
    domainTitle: 'Acompanhamento Profissional',
    priorityOrder: 5,
    status: 'pending',
    assignedRole: 'Você',
    actionIdRef: 'act_03',
    createdAt: '2026-05-18T10:00:00Z'
  },
  // Secondary Task (Order > 5)
  {
    id: 'task_06',
    patientId: 'user_maria_01',
    title: 'Responder Check-in Semanal de Acompanhamento',
    objective: 'Atualizar registro de disposição e hábitos da semana',
    targetWeek: '2026-W23',
    domainKey: 'lifestyle',
    domainTitle: 'Hábitos de Vida',
    priorityOrder: 6,
    status: 'pending',
    assignedRole: 'Você',
    createdAt: '2026-05-18T10:00:00Z'
  }
];

export const mockProtocolRules: ProtocolRule[] = [
  {
    id: 'rule_lipidic_profile_check',
    protocolId: 'proto_sbc_cv_risk_2026',
    name: 'Rastreio Quinquenal/Anual de Colesterol',
    clinicalDomain: 'Saúde Metabólica',
    conditions: ['age >= 35', 'last_lipidic_profile_days > 365'],
    exclusions: ['pregnancy'],
    requiredData: ['age', 'last_exam_date'],
    outputActionType: 'laboratory_exam',
    outputTitle: 'Realizar Perfil Lipídico Completo & Colesterol',
    outputDescription: 'Dosagem de Colesterol Total, HDL, LDL e Triglicerídeos conforme Diretriz SBC 2024/2026.',
    recommendedInterval: '365 dias',
    professionalReviewRequired: false,
    priority: 'recommended',
    status: 'active',
    version: 'v2026.2',
    createdAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-02-01T09:30:00Z'
  },
  {
    id: 'rule_qdenga_booster',
    protocolId: 'proto_sbim_adult_2026',
    name: 'Esquema de 2ª Dose contra Dengue',
    clinicalDomain: 'Vacinação & Imunologia',
    conditions: ['qdenga_dose_1_applied == true', 'qdenga_dose_2_applied == false', 'days_since_dose_1 >= 90'],
    exclusions: ['anaphylaxis_history'],
    requiredData: ['vaccination_records'],
    outputActionType: 'vaccination',
    outputTitle: 'Aplicar 2ª Dose da Vacina contra Dengue (QDENGA)',
    outputDescription: 'Segunda dose necessária para imunização completa contra a dengue conforme SBIm/PNI.',
    recommendedInterval: '90 dias pós 1ª dose',
    professionalReviewRequired: false,
    priority: 'routine',
    status: 'active',
    version: 'v2026.1',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  }
];

