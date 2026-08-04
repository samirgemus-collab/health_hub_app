export interface PlatformFeatureFlags {
  FEATURE_PREVENTIVE_HEALTH: boolean;
  FEATURE_PREVENTIVE_CHECKUP: boolean;
  FEATURE_FAMILY_HISTORY: boolean;
  FEATURE_HEALTH_MAP: boolean;
  FEATURE_PREVENTIVE_AGENDA: boolean;
  FEATURE_PREVENTIVE_PLAN: boolean;
  FEATURE_PREVENTIVE_ACTIONS: boolean;
  FEATURE_WEEKLY_CHECKIN: boolean;
  FEATURE_PREVENTIVE_PROGRAMS: boolean;
  FEATURE_CLINICAL_TRENDS: boolean;
  FEATURE_CARE_ABANDONMENT: boolean;
  FEATURE_DECOMPENSATION_PREDICTION: boolean;
  FEATURE_CONSULTATION_REPORT: boolean;
  FEATURE_EVIDENCE_RULES_ENGINE: boolean;
  FEATURE_CARDIOMETABOLIC_PROGRAM: boolean;
  FEATURE_RENAL_PROGRAM: boolean;
  FEATURE_HEALTHY_AGING_PROGRAM: boolean;
  FEATURE_MUSCULOSKELETAL_PROGRAM: boolean;
  FEATURE_SLEEP_PROGRAM: boolean;
  FEATURE_WOMEN_HEALTH_PROGRAM: boolean;
  FEATURE_MEN_HEALTH_PROGRAM: boolean;
  FEATURE_CHILD_HEALTH_PROGRAM: boolean;
}

// ETAPA 2: Ativar as 4 flags autorizadas do Mapa, Agenda e Plano + Etapa 1
const defaultFeatureFlags: PlatformFeatureFlags = {
  FEATURE_PREVENTIVE_HEALTH: true,
  FEATURE_PREVENTIVE_CHECKUP: true,
  FEATURE_FAMILY_HISTORY: true,
  FEATURE_HEALTH_MAP: true,
  FEATURE_PREVENTIVE_AGENDA: true,
  FEATURE_PREVENTIVE_PLAN: true,
  FEATURE_PREVENTIVE_ACTIONS: true,
  FEATURE_EVIDENCE_RULES_ENGINE: true,

  // DESATIVADAS RIGOROSAMENTE NESTA ETAPA:
  FEATURE_WEEKLY_CHECKIN: false,
  FEATURE_PREVENTIVE_PROGRAMS: false,
  FEATURE_CLINICAL_TRENDS: false,
  FEATURE_CARE_ABANDONMENT: false,
  FEATURE_DECOMPENSATION_PREDICTION: false, // RIGOROSAMENTE DESATIVADO
  FEATURE_CONSULTATION_REPORT: false,
  FEATURE_CARDIOMETABOLIC_PROGRAM: false,
  FEATURE_RENAL_PROGRAM: false,
  FEATURE_HEALTHY_AGING_PROGRAM: false,
  FEATURE_MUSCULOSKELETAL_PROGRAM: false,
  FEATURE_SLEEP_PROGRAM: false,
  FEATURE_WOMEN_HEALTH_PROGRAM: false,
  FEATURE_MEN_HEALTH_PROGRAM: false,
  FEATURE_CHILD_HEALTH_PROGRAM: false,
};

let activeFlags = { ...defaultFeatureFlags };

export class FeatureFlagsService {
  public static getFlags(): PlatformFeatureFlags {
    return { ...activeFlags };
  }

  public static isEnabled(flagName: keyof PlatformFeatureFlags): boolean {
    return !!activeFlags[flagName];
  }

  public static updateFlag(flagName: keyof PlatformFeatureFlags, value: boolean): PlatformFeatureFlags {
    // Trava de segurança clínica: impedimento estrito de ativação autônoma de predição de descompensação
    if (flagName === 'FEATURE_DECOMPENSATION_PREDICTION' && value === true) {
      console.warn('[SECURITY GOVERNANCE] FEATURE_DECOMPENSATION_PREDICTION não pode ser ativada sem validação clínica prévia.');
      return { ...activeFlags };
    }
    activeFlags = { ...activeFlags, [flagName]: value };
    return { ...activeFlags };
  }
}
