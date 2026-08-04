import { EvidenceRuleProtocol } from '../types/health';

export const mockEvidenceRuleProtocols: EvidenceRuleProtocol[] = [
  {
    id: 'proto_sbim_adult_2026',
    title: 'Protocolo de Imunização do Adulto e Idoso',
    clinicalDomain: 'Vacinação & Imunologia',
    sourceOrganization: 'SBIm (Sociedade Brasileira de Imunizações)',
    sourceReference: 'Guia de Vacinação SBIm Adulto/Sênior 2025/2026',
    version: 'v2026.1',
    effectiveDate: '2026-01-10',
    reviewDate: '2026-12-31',
    population: 'Adultos de 18 a 64 anos',
    ageRange: '18-64',
    sexApplicability: 'all',
    riskFactors: ['Exposição Ocupacional', 'Imunossupressão', 'Comorbidades Crônicas'],
    requiredData: ['Histórico Vacinal', 'Idade', 'Status Sorológico Previo'],
    recommendationText: 'Reforço decenal de dTpa/dT, vacinação anual contra Influenza, esquema bivalente COVID-19 e vacinação contra Dengue (QDENGA) para soropositivos prévios.',
    contraindications: 'Anafilaxia prévia a componentes da vacina.',
    exceptions: 'Gestantes (consultar esquema específico dTpa).',
    evidenceLevel: 'Level_A',
    reviewedBy: 'Dra. Juliana Santos (CRM/SP 198.420)',
    approvedBy: 'Comitê Clínico Dono da Saúde',
    status: 'published',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'proto_sbc_cv_risk_2026',
    title: 'Diretriz de Rastreamento Cardiometabólico e Dislipidemia',
    clinicalDomain: 'Saúde Cardiovascular',
    sourceOrganization: 'SBC (Sociedade Brasileira de Cardiologia)',
    sourceReference: 'Atualização da Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose (SBC 2024/2026)',
    version: 'v2026.2',
    effectiveDate: '2026-02-01',
    reviewDate: '2027-02-01',
    population: 'Adultos assintomáticos acima de 35 anos',
    ageRange: '35-75',
    sexApplicability: 'all',
    riskFactors: ['Tabagismo', 'Hipertensão', 'Histórico Familiar de DAC Precoce'],
    requiredData: ['Perfil Lipídico Completo', 'Glicemia de Jejum', 'Pressão Arterial'],
    recommendationText: 'Avaliação quinquenal de perfil lipídico completo e glicemia de jejum/HbA1c em adultos assintomáticos de baixo risco, e anual em portadores de fatores de risco.',
    contraindications: 'Não aplicável para rastreamento populacional assintomático.',
    exceptions: 'Histórico familiar de Hipercolesterolemia Familiar (iniciar rastreamento na infância/adolescência).',
    evidenceLevel: 'Level_A',
    reviewedBy: 'Dr. Roberto Mendes (CRM/SP 148.920)',
    approvedBy: 'Comitê Clínico Dono da Saúde',
    status: 'published',
    createdAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-02-01T09:30:00Z'
  },
  {
    id: 'proto_kdigo_renal_2026',
    title: 'Rastreamento da Função Renal e Doença Renal Crônica',
    clinicalDomain: 'Saúde Renal',
    sourceOrganization: 'KDIGO / SBN (Sociedade Brasileira de Nefrologia)',
    sourceReference: 'Diretriz de Rastreamento de Albuminúria e eGFR em Pacientes com HAS/DM',
    version: 'v2026.1',
    effectiveDate: '2026-03-15',
    reviewDate: '2027-03-15',
    population: 'Adultos com Hipertensão ou Diabetes',
    ageRange: '18-85',
    sexApplicability: 'all',
    riskFactors: ['Hipertensão Arterial', 'Diabetes Mellitus', 'Uso Prolongado de AINEs'],
    requiredData: ['Creatinina Sérica', 'Relação Albuminúria/Creatininúria Urinária'],
    recommendationText: 'Dosagem anual de Creatinina Sérica (com estimativa de eGFR pela fórmula CKD-EPI) e Relação Albuminúria/Creatininúria em amostra isolada de urina.',
    contraindications: 'Infecção urinária ativa no momento da coleta de albuminúria.',
    exceptions: 'Glomerulopatias primárias conhecidas sob acompanhamento nefrológico.',
    evidenceLevel: 'Level_A',
    reviewedBy: 'Dra. Juliana Santos (CRM/SP 198.420)',
    approvedBy: 'Comitê Clínico Dono da Saúde',
    status: 'published',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z'
  }
];

export class EvidenceRulesEngine {
  public static getPublishedProtocols(): EvidenceRuleProtocol[] {
    return mockEvidenceRuleProtocols.filter(p => p.status === 'published');
  }

  public static getProtocolsByDomain(domain: string): EvidenceRuleProtocol[] {
    return mockEvidenceRuleProtocols.filter(p => p.clinicalDomain.toLowerCase().includes(domain.toLowerCase()));
  }

  public static getProtocolById(id: string): EvidenceRuleProtocol | undefined {
    return mockEvidenceRuleProtocols.find(p => p.id === id);
  }
}

