export type BiologicalSex = 'female' | 'male';
export type UserRole = 'patient' | 'doctor' | 'healthcare_team' | 'admin';
export type TeamMemberRole = 'nurse' | 'pharmacist' | 'nutritionist' | 'physiotherapist' | 'care_navigator' | 'community_health_worker';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sex: BiologicalSex;
  bloodType: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  avatarUrl: string;
  cpfMasked: string;
  phoneFormatted?: string;
  riskLevel?: 'high_risk' | 'moderate_risk' | 'low_risk';
  careTeamName?: string;
  lastCheckInHoursAgo?: number;
}

export interface ClinicalTimelineEvent {
  id: string;
  patientId: string;
  tenantId: string;
  eventType: 'consultation' | 'lab_test' | 'imaging' | 'medication' | 'hospitalization' | 'diagnosis' | 'alert';
  eventDate: string;
  title: string;
  professionalSummary: string;
  patientSummary: string;
  sourceSystem: string;
  sourceRecordId: string;
  clinicalStatus: 'confirmed' | 'hypothesis' | 'finding' | 'self_reported';
  priority: 'low' | 'medium' | 'high' | 'critical';
  visibilityToPatient: 'visible' | 'hidden_pending_validation' | 'internal_only';
  validatedBy?: string;
  validatedAt?: string;
  createdAt: string;
  trend?: 'improving' | 'worsening' | 'stable';
  comparisons?: {
    previousValue: string;
    currentValue: string;
    changeDetails: string;
  };
  actionsRecommended?: string[];
}

export interface MedicationRefillRequest {
  id: string;
  patientId: string;
  patientName: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  remainingDoses: number;
  totalDoses: number;
  prescribingDoctorId: string;
  prescribingDoctorName: string;
  requestedAt: string;
  status: 'pending' | 'fulfilled' | 'rejected';
}

export interface ChronicCareProtocol {
  id: string;
  conditionName: string;
  icdCode: string;
  specialty: string;
  guidelineSource: string;
  recommendedMonitoringFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  requiredVitals: string[];
  alertTriggers: string;
  targetGoals: string;
  teamWorkflows: string;
}

export interface PrescribedProtocol {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  protocolId: string;
  conditionName: string;
  icdCode: string;
  prescribedDate: string;
  monitoringFrequency: string;
  targetGoals: string;
  customAlertThresholds: string;
  status: 'active' | 'completed' | 'paused';
}

export type SubscriptionPlanTier = 'basic_free' | 'patient_family_premium' | 'doctor_pro' | 'clinic_enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface PlatformSubscription {
  id: string;
  subscriberId: string;
  subscriberName: string;
  subscriberType: 'patient' | 'doctor' | 'clinic';
  planTier: SubscriptionPlanTier;
  planName: string;
  monthlyPriceBrl: number;
  status: SubscriptionStatus;
  paymentMethod: 'Credit Card' | 'Pix Direct' | 'Boleto' | 'Stripe SaaS';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
}

export interface CookieSettings {
  essential: boolean;
  healthTelemetry: boolean;
  analytics: boolean;
  communications: boolean;
  acceptedAt?: string;
  hasScrolledToEnd: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: 'Super Administrator / Chief Security Officer';
  email: string;
  avatarUrl: string;
}

export interface PatientInactivityAlert {
  id: string;
  patientId: string;
  patientName: string;
  alertType: 'medication_missed' | 'vitals_unsynced' | 'preventive_overdue';
  title: string;
  description: string;
  missedHours: number;
  severity: 'high' | 'medium';
  createdAt: string;
}

export interface TelehealthChatMessage {
  id: string;
  patientId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | TeamMemberRole | 'doctor';
  text: string;
  timestamp: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  hospitalAffiliation: string;
  avatarUrl: string;
}

export interface TeamMemberProfile {
  id: string;
  name: string;
  role: TeamMemberRole;
  councilId: string;
  teamName: string;
  avatarUrl: string;
  maxPatientCapacity?: number;
  currentAssignedPatients?: number;
}

export interface MultidisciplinaryNote {
  id: string;
  timestamp: string;
  patientId: string;
  authorId: string;
  authorName: string;
  authorRole: TeamMemberRole | 'doctor';
  category: 'nursing' | 'pharmacy' | 'nutrition' | 'physiotherapy' | 'medical' | 'community_visit';
  title: string;
  content: string;
  recommendations: string;
}

export interface ElectronicPrescription {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorCrm: string;
  type: 'simple' | 'controlled_c1' | 'antibiotic';
  medications: {
    name: string;
    dosage: string;
    instructions: string;
    boxes: number;
    continuousUse: boolean;
  }[];
  signatureHash: string;
  qrCodeValidationUrl: string;
}

export interface MedicalCertificate {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  patientCpfMasked: string;
  doctorId: string;
  doctorName: string;
  doctorCrm: string;
  daysOfAbsence: number;
  icdCode?: string;
  reason: string;
  signatureHash: string;
  qrCodeValidationUrl: string;
}

export interface LgpdConsent {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: 'active' | 'revoked' | 'expired';
  grantedAt: string;
  expiresAt: string;
  legalBasis: string;
  dataScopes: string[];
}

export type AuditCategory = 
  | 'clinical_edit'      // Edição/Inclusão de Doenças, Alergias, Cirurgias
  | 'prescription_issue' // Emissão de Prescrição/Atestado CFM
  | 'lgpd_consent'       // Concessão/Revogação de Permissão LGPD
  | 'community_visit'    // Registro de Visita Domiciliar ACS
  | 'telehealth_chat'    // Envio de Mensagem Tele-Saúde
  | 'monthly_report'     // Emissão de Relatório Mensal pelo Médico
  | 'admin_setting';     // Alteração de Cota ACS ou Parâmetros Admin

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: AuditCategory;
  patientId: string;
  patientName: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  action: string;
  details: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'critical';
  hash: string;
}

export interface ChronicCondition {
  id: string;
  name: string;
  icdCode: string;
  diagnosedDate: string;
  status: 'active' | 'in_remission' | 'controlled';
  treatingPhysician: string;
  notes: string;
}

export interface Allergy {
  id: string;
  substance: string;
  type: 'drug' | 'food' | 'environmental';
  severity: 'mild' | 'moderate' | 'severe_anaphylaxis';
  reaction: string;
}

export interface SurgicalHistory {
  id: string;
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  notes: string;
}

export interface FamilyHistoryItem {
  id: string;
  relation: string;
  condition: string;
  ageAtDiagnosis?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduleTimes: string[];
  remainingDoses: number;
  totalDoses: number;
  refillReminderThreshold: number;
  adherenceRatePercent: number;
  prescribingDoctor: string;
  purpose: string;
  instructions: string;
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: 'pending' | 'taken' | 'snoozed' | 'skipped';
  takenAt?: string;
}

export interface PreventiveCareRecommendation {
  id: string;
  category: 'cancer_screening' | 'cardiovascular' | 'metabolic' | 'bone' | 'vaccine' | 'specialty';
  title: string;
  description: string;
  targetSex: BiologicalSex | 'both';
  minAge: number;
  maxAge?: number;
  frequencyYears: string;
  recommendedDate: string;
  status: 'up_to_date' | 'pending' | 'overdue';
  clinicalGuideline: string;
  importance: 'critical' | 'recommended' | 'optional';
  lastExamDate?: string;
  relatedReportId?: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  category: 'blood_test' | 'imaging' | 'cardiology' | 'pathology' | 'genetics';
  date: string;
  laboratory: string;
  doctorName: string;
  pdfUrl: string;
  extractedTextSummary?: string;
  aiFindings: {
    key: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    status: 'normal' | 'attention' | 'critical';
  }[];
  dicomViewerUrl?: string;
  fhirResourceJson?: string;
}

export interface VitalMetric {
  timestamp: string;
  heartRateBpm: number;
  spO2Percent: number;
  hrvMs: number;
  sleepHours: number;
  stepsCount: number;
  bodyTempC: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: 'Apple Watch' | 'Galaxy Watch' | 'Garmin' | 'Fitbit' | 'Google Pixel Watch';
  platform: 'Apple HealthKit' | 'Google Health Connect' | 'Garmin Connect API';
  batteryPercent: number;
  lastSync: string;
  status: 'connected' | 'syncing' | 'disconnected';
  metricsProvided: string[];
}

export interface SecuritySettings {
  e2eeEnabled: boolean;
  biometricAuthEnabled: boolean;
  lgpdConsentGranted: boolean;
  lastDataAuditDate: string;
  authorizedDoctors: {
    id: string;
    name: string;
    crm: string;
    specialty: string;
    accessExpiresAt: string;
  }[];
}
