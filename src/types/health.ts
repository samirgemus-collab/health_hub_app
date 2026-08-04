export type BiologicalSex = 'female' | 'male';
export type UserRole = 'patient' | 'doctor' | 'healthcare_team' | 'admin';
export type TeamMemberRole = 'nurse' | 'pharmacist' | 'nutritionist' | 'physiotherapist' | 'care_navigator' | 'community_health_worker';

export type TrafficLightStatus = 'green' | 'yellow' | 'red' | 'gray';
export type SupervisionTier = 'autogestao' | 'assistido' | 'premium';
export type EvidenceAlertLevel = 'level_1_education' | 'level_2_low_risk' | 'level_3_professional_review' | 'level_4_urgency';

export type DataOriginType = 
  | 'manual_user' 
  | 'manual_professional' 
  | 'uploaded_document' 
  | 'integrated_clinic' 
  | 'connected_device' 
  | 'laboratory' 
  | 'imaging_center' 
  | 'official_source' 
  | 'system_generated' 
  | 'calculated';

export type DataValidationStatus = 
  | 'unverified' 
  | 'pending_review' 
  | 'verified' 
  | 'rejected' 
  | 'needs_correction' 
  | 'official' 
  | 'calculated';

export type CheckupResultCategory = 
  | 'in_order' 
  | 'needs_update' 
  | 'deserves_conference' 
  | 'professional_evaluation_recommended';

export interface HealthAssessmentAnswer {
  questionId: string;
  category: 'general' | 'personal_history' | 'family_history' | 'lifestyle' | 'emotional_health' | 'prevention' | 'safety';
  value: any;
  notes?: string;
}

export interface CheckupCategoryGroup {
  category: CheckupResultCategory;
  title: string;
  description: string;
  itemCount: number;
  items: {
    id: string;
    title: string;
    description: string;
    recommendedAction: string;
    domain: string;
  }[];
}

export interface HealthAssessmentResult {
  id: string;
  patientId: string;
  completedPercentage: number;
  lastUpdated: string;
  categoryResults: CheckupCategoryGroup[];
  sourceType: DataOriginType;
  validationStatus: DataValidationStatus;
}

export type FamilyRelationship = 
  | 'mother' 
  | 'father' 
  | 'sibling' 
  | 'child' 
  | 'maternal_grandmother' 
  | 'maternal_grandfather' 
  | 'paternal_grandmother' 
  | 'paternal_grandfather' 
  | 'maternal_uncle_aunt' 
  | 'paternal_uncle_aunt' 
  | 'other';

export interface FamilyHealthHistory {
  id: string;
  patientId: string;
  relationship: FamilyRelationship;
  relationshipLabel?: string;
  conditionCode: string;
  conditionName: string;
  ageAtDiagnosis?: number;
  maternalOrPaternalBranch: 'maternal' | 'paternal' | 'direct';
  notes?: string;
  sourceType: DataOriginType;
  validationStatus: DataValidationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRuleProtocol {
  id: string;
  title: string;
  clinicalDomain: string;
  sourceOrganization: string;
  sourceReference: string;
  version: string;
  effectiveDate: string;
  reviewDate: string;
  population: string;
  ageRange: string;
  sexApplicability: 'male' | 'female' | 'all';
  riskFactors?: string[];
  requiredData?: string[];
  recommendationText: string;
  contraindications?: string;
  exceptions?: string;
  evidenceLevel: 'Level_A' | 'Level_B' | 'Level_C';
  reviewedBy: string;
  approvedBy: string;
  status: 'draft' | 'under_review' | 'approved' | 'published' | 'suspended' | 'retired';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// HEALTH CORE ENTITIES (SAÚDE PREVENTIVA E PREDITIVA)
// ============================================================================

export interface HealthProfile {
  id: string;
  patientId: string;
  biologicalSex: BiologicalSex;
  birthDate?: string;
  completenessPercentage: number;
  lastAssessmentDate?: string;
  updatedAt: string;
}

export interface HealthRiskFactor {
  id: string;
  category: string;
  name: string;
  isModifiable: boolean;
  notes?: string;
}

export interface HealthProtectiveFactor {
  id: string;
  category: string;
  name: string;
  description?: string;
}

// ============================================================================
// ETAPA 2 — MAPA DE SAÚDE, AGENDA PREVENTIVA & PLANO DE AÇÕES TYPES
// ============================================================================

export type HealthMapStatus = 
  | 'up_to_date' 
  | 'needs_information' 
  | 'needs_attention' 
  | 'professional_review_recommended' 
  | 'not_applicable';

export type PreventiveActionType = 
  | 'vaccination'
  | 'consultation'
  | 'laboratory_exam'
  | 'imaging_exam'
  | 'screening'
  | 'dental_evaluation'
  | 'vision_evaluation'
  | 'hearing_evaluation'
  | 'medication_review'
  | 'nutrition_follow_up'
  | 'physical_activity'
  | 'mental_health_follow_up'
  | 'health_document'
  | 'professional_review'
  | 'custom_preventive_action';

export type PreventiveActionPriority = 
  | 'informational' 
  | 'routine' 
  | 'recommended' 
  | 'needs_review';

export type PreventiveActionStatus = 
  | 'pending' 
  | 'scheduled' 
  | 'completed' 
  | 'dismissed' 
  | 'expired' 
  | 'needs_review' 
  | 'archived';

export interface PreventiveActionAttachment {
  id: string;
  filename: string;
  fileType: string;
  uploadedAt: string;
  url: string;
}

export interface ProfessionalPreventiveReview {
  id: string;
  actionId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerCrmOrCouncil: string;
  decision: 'approved' | 'adjusted' | 'postponed' | 'replaced' | 'rejected' | 'marked_not_applicable';
  notes?: string;
  reviewedAt: string;
}

export interface PreventiveAction {
  id: string;
  patientId: string;
  organizationId?: string;
  type: PreventiveActionType;
  title: string;
  description: string;
  clinicalDomain: string;
  priority: PreventiveActionPriority;
  status: PreventiveActionStatus;
  expectedDate: string;
  scheduledDate?: string;
  completedAt?: string;
  sourceType: DataOriginType;
  sourceProtocolId?: string;
  sourceProtocolName?: string;
  sourceProtocolOrganization?: string;
  sourceProtocolVersion?: string;
  sourceAssessmentId?: string;
  professionalReviewRequired: boolean;
  validationStatus: DataValidationStatus;
  createdBy: string;
  dismissedBy?: string;
  dismissedReason?: string;
  attachments?: PreventiveActionAttachment[];
  reviews?: ProfessionalPreventiveReview[];
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface HealthMapDomainState {
  id: string;
  domainKey: 
    | 'cardiovascular' 
    | 'metabolic' 
    | 'renal' 
    | 'respiratory' 
    | 'musculoskeletal' 
    | 'bone' 
    | 'vaccination' 
    | 'sleep' 
    | 'emotional' 
    | 'dental' 
    | 'lifestyle' 
    | 'age_group_prevention' 
    | 'professional_followup';
  title: string;
  iconName: string;
  description: string;
  status: HealthMapStatus;
  infoAvailablePercentage: number;
  protectiveFactors: string[];
  modifiableFactors: string[];
  missingInformation: string[];
  consideredData: string[];
  relatedActionIds: string[];
  lastUpdated: string;
  sourceType: DataOriginType;
  validationStatus: DataValidationStatus;
  sourceProtocol: string;
  protocolVersion: string;
}

export interface PreventivePlanTask {
  id: string;
  patientId: string;
  title: string;
  objective: string;
  targetWeek: string; // e.g. "2026-W30"
  domainKey: string;
  domainTitle: string;
  priorityOrder: number; // 1 to 5 for primary, >5 for secondary
  status: 'pending' | 'completed' | 'postponed';
  completedAt?: string;
  assignedRole: string; // e.g. "Você", "Médico Assistente", "Dentista"
  actionIdRef?: string;
  createdAt: string;
}

export interface ProtocolRule {
  id: string;
  protocolId: string;
  name: string;
  clinicalDomain: string;
  conditions: string[];
  exclusions: string[];
  requiredData: string[];
  outputActionType: PreventiveActionType;
  outputTitle: string;
  outputDescription: string;
  recommendedInterval: string;
  professionalReviewRequired: boolean;
  priority: PreventiveActionPriority;
  status: 'active' | 'draft' | 'deprecated';
  version: string;
  createdAt: string;
  updatedAt: string;
}


export interface HealthPreventiveAction {
  id: string;
  patientId: string;
  type: 'vaccine' | 'consultation' | 'exam' | 'evaluation' | 'screening' | 'lifestyle';
  title: string;
  description: string;
  expectedDate: string;
  status: 'pending' | 'scheduled' | 'completed' | 'dismissed' | 'expired' | 'needs_review';
  priority: 'low' | 'medium' | 'high';
  sourceProtocol?: string;
  sourceVersion?: string;
  createdBy: string;
  completedAt?: string;
  dismissedAt?: string;
  dismissReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyCheckIn {
  id: string;
  patientId: string;
  weekStartDate: string;
  sleepQualityRating?: number;
  physicalActivityDays?: number;
  newSymptomsReported?: boolean;
  medicationAdherenceOk?: boolean;
  vitalsMeasured?: boolean;
  energyLevelRating?: number;
  weightChangedKg?: number;
  summaryText?: string;
  createdAt: string;
}


export interface HealthMetricIndicator {
  id: string;
  categoryKey: 'bp' | 'weight_bmi' | 'glycemia_hba1c' | 'cholesterol' | 'renal_function' | 'hepatic_health' | 'sleep_quality' | 'physical_activity' | 'vaccination' | 'current_meds' | 'pending_exams';
  title: string;
  subtitle: string;
  status: TrafficLightStatus;
  currentValue: string;
  unit: string;
  targetRange: string;
  reassuranceMessage: string;
  lastUpdated: string;
  historicalTrajectory?: { date: string; valueDisplay: string; numericValue?: number }[];
}

export interface PersonalHealthGoalAction {
  id: string;
  title: string;
  targetDaysPerWeek: number;
  completedDaysThisWeek: number;
}

export interface PersonalHealthPlanGoal {
  id: string;
  title: string;
  categoryName: string;
  iconName: string;
  description: string;
  weeklyActions: PersonalHealthGoalAction[];
  adherencePercentage: number;
  status: 'active' | 'completed' | 'paused';
}

export interface ClinicalEvidenceRule {
  id: string;
  title: string;
  alertLevel: EvidenceAlertLevel;
  guidelineSource: string;
  scientificReference: string;
  recommendingSociety: string;
  lastReviewedDate: string;
  targetPopulation: string;
  contraindications: string;
  validatingPhysicianName: string;
  validatingPhysicianCrm: string;
  version: string;
}

// ============================================================================
// MINHA VACINAÇÃO - MODULE TYPES & DATA STRUCTURES
// ============================================================================

export type VaccineSourceType = 
  | 'user_reported' 
  | 'document_attached' 
  | 'extracted_pending_review' 
  | 'validated_by_professional' 
  | 'clinic_applied' 
  | 'official_imported' 
  | 'rnds_submitted' 
  | 'rnds_confirmed';

export type VaccineValidationStatus = 
  | 'draft' 
  | 'awaiting_validation' 
  | 'validated' 
  | 'rejected_validation' 
  | 'awaiting_submission' 
  | 'processing' 
  | 'sent_rnds' 
  | 'accepted_rnds' 
  | 'rejected_rnds' 
  | 'needs_correction' 
  | 'canceled' 
  | 'replaced';

export interface VaccinationRecord {
  id: string;
  patientId: string;
  dependentId?: string;
  dependentName?: string;
  vaccineCode: string; // e.g. 'COVID19_BIVALENT', 'INFLUENZA_2026', 'TRIPLICE_VIRAL'
  vaccineName: string;
  doseCode: string; // e.g. 'DOSE_1', 'DOSE_2', 'BOOSTER_1', 'ANNUAL'
  doseDescription: string;
  applicationDate: string;
  applicationTime?: string;
  manufacturer?: string;
  batchNumber?: string;
  expirationDate?: string;
  administrationRoute?: string;
  applicationSite?: string;
  establishmentName?: string;
  establishmentCnes?: string;
  professionalId?: string;
  professionalName?: string;
  professionalRegistration?: string; // CRM / COREN
  sourceType: VaccineSourceType;
  validationStatus: VaccineValidationStatus;
  integrationStatus: 'not_integrated' | 'queued' | 'synced_rnds' | 'failed_rnds';
  evidenceDocumentId?: string;
  evidenceDocumentName?: string;
  externalIdentifier?: string;
  rndsProtocol?: string;
  rndsSentAt?: string;
  rndsConfirmedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface VaccinationDocument {
  id: string;
  patientId: string;
  fileReference: string;
  fileType: 'image/png' | 'image/jpeg' | 'application/pdf';
  fileHash: string;
  originalFilename: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  validationStatus: 'pending' | 'validated' | 'rejected';
  validatedBy?: string;
  validatedAt?: string;
  linkedVaccineRecordIds?: string[];
}

export interface VaccinationAuditLog {
  id: string;
  vaccinationRecordId: string;
  action: 'record_created' | 'document_uploaded' | 'validation_approved' | 'validation_rejected' | 'correction_requested' | 'rnds_queued' | 'rnds_synced';
  userId: string;
  userName: string;
  userRole: string;
  previousData?: string;
  newData?: string;
  reason?: string;
  ipAddress: string;
  createdAt: string;
}

export interface VaccinationReminder {
  id: string;
  patientId: string;
  vaccinationRecordId?: string;
  vaccineName: string;
  doseDescription: string;
  expectedDate: string;
  reminderDate: string;
  channel: 'in_app' | 'sms' | 'email';
  status: 'active' | 'sent' | 'canceled';
  createdAt: string;
  sentAt?: string;
}

export interface RndsIntegrationQueueItem {
  id: string;
  vaccinationRecordId: string;
  operationType: 'CREATE_IMMUNIZATION' | 'UPDATE_IMMUNIZATION' | 'CANCEL_IMMUNIZATION';
  status: 'queued' | 'processing' | 'completed' | 'failed_temporary' | 'failed_permanent';
  attempts: number;
  maxAttempts: number;
  nextAttemptAt?: string;
  idempotencyKey: string;
  rndsProtocol?: string;
  errorCode?: string;
  errorSummary?: string;
  lastProcessedAt?: string;
  createdAt: string;
}

export interface VaccineProtocolRule {
  id: string;
  title: string;
  vaccineCode: string;
  vaccineName: string;
  guidelineSource: string; // e.g. 'SBIm 2025/2026', 'PNI / SUS'
  version: string;
  effectiveDate: string;
  targetPopulation: string;
  minAgeYears: number;
  maxAgeYears?: number;
  clinicalConditions?: string[];
  contraindications: string;
  doseSchedule: string;
  recommendedIntervalDays?: number;
  reassuringNotes: string;
  validatingPhysicianName: string;
  lastReviewedDate: string;
  status: 'published' | 'draft';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneFormatted: string;
  notifyBySms: boolean;
  notifyByWhatsapp: boolean;
}

export interface EmergencySosDispatch {
  id: string;
  patientId: string;
  patientName: string;
  timestamp: string;
  locationGps: string;
  vitalsSnapshot: {
    heartRateBpm: number;
    spO2Percent: number;
    bloodPressure: string;
  };
  status: 'dispatched' | 'acknowledged_by_team' | 'resolved';
  notifiedContacts: string[];
}

export type FamilyAccessLevel = 'full_access' | 'read_only' | 'emergency_only';

export interface AuthorizedFamilyMember {
  id: string;
  name: string;
  relationship: string;
  cpfMasked?: string;
  email: string;
  phoneFormatted: string;
  accessLevel: FamilyAccessLevel;
  authorizedAt: string;
  consentHash: string;
  status: 'active' | 'revoked';
}

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
  birthDate?: string;
  addressFormatted?: string;
  riskLevel?: 'high_risk' | 'moderate_risk' | 'low_risk';
  careTeamName?: string;
  lastCheckInHoursAgo?: number;
  emergencyContacts?: EmergencyContact[];
  familySharingConsentActive?: boolean;
  authorizedFamilyMembers?: AuthorizedFamilyMember[];
}

export interface HistoricalConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: BiologicalSex;
  consultationDate: string;
  consultationEpoch: string;
  consultationType: 'presencial' | 'telemedicina' | 'retorno' | 'urgencia';
  doctorName: string;
  doctorCrm: string;
  specialty: string;
  mainDiagnosisCid10: string;
  diagnosisDescription: string;
  soapNotes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  vitalsAtEpoch: {
    bloodPressure: string;
    heartRateBpm: number;
    weightKg: number;
    spO2Percent?: number;
    glycemiaMgDl?: number;
  };
  prescriptionsIssued: {
    id: string;
    medicationName: string;
    dosageInstruction: string;
    duration: string;
  }[];
  examsRequested: string[];
  integrityHash: string;
  signedWithIcpBrasil: boolean;
  signedAt: string;
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
  date?: string;
  description?: string;
  category?: string;
  authorName?: string;
  authorRole?: string;
  fhirResource?: string;
  icdCode?: string;
  trendDirection?: 'up' | 'down' | 'stable' | 'worsening' | 'improving';
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

export type DeviceGrade = 'medical_grade' | 'wellness_fitness';
export type ConnectionHub = 'healthkit' | 'google_health_connect' | 'samsung_health' | 'ble_direct' | 'manual_entry';

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
  originType?: 'automatic_ble' | 'healthkit' | 'google_connect' | 'samsung_health' | 'manual';
  deviceGrade?: DeviceGrade;
  deviceSource?: string;
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: 'Apple Watch' | 'Galaxy Watch' | 'Garmin' | 'Fitbit' | 'Omron BLE' | 'Accu-Chek BLE' | 'Freestyle Libre' | 'Tanita Smart';
  platform: 'Apple HealthKit' | 'Google Health Connect' | 'Samsung Health' | 'Bluetooth LE Direct' | 'Manual';
  connectionType: ConnectionHub;
  deviceCategory: DeviceGrade;
  anvisaFdaApprovalStatus?: string;
  batteryPercent: number;
  lastSync: string;
  status: 'connected' | 'syncing' | 'disconnected';
  metricsProvided: string[];
  permissionsGranted: string[];
  sharingWithCareTeam: boolean;
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
