import { VaccinationRecord, RndsIntegrationQueueItem } from '../types/health';

export interface RndsConfig {
  environment: 'homologation' | 'production';
  establishmentCnes: string;
  establishmentName: string;
  clientId: string;
  certificateStatus: 'valid_icp_brasil' | 'pending' | 'expired';
  featureSendEnabled: boolean;
  featureQueryEnabled: boolean;
  featureExtractionEnabled: boolean;
}

let currentRndsConfig: RndsConfig = {
  environment: 'homologation',
  establishmentCnes: '2048910',
  establishmentName: 'UBS / Clínica Parceira Dono da Saúde',
  clientId: 'RNDS_CLIENT_PROD_8910',
  certificateStatus: 'valid_icp_brasil',
  featureSendEnabled: true,
  featureQueryEnabled: true,
  featureExtractionEnabled: false,
};

export class RndsConnectorService {
  private static queue: RndsIntegrationQueueItem[] = [
    {
      id: 'rnds_q_101',
      vaccinationRecordId: 'vac_rec_01',
      operationType: 'CREATE_IMMUNIZATION',
      status: 'completed',
      attempts: 1,
      maxAttempts: 3,
      idempotencyKey: 'IDEM_RNDS_7f8a91',
      rndsProtocol: 'RNDS-BR-2026-891042',
      lastProcessedAt: '2026-05-10T10:01:15Z',
      createdAt: '2026-05-10T10:00:00Z',
    },
    {
      id: 'rnds_q_102',
      vaccinationRecordId: 'vac_rec_02',
      operationType: 'CREATE_IMMUNIZATION',
      status: 'completed',
      attempts: 1,
      maxAttempts: 3,
      idempotencyKey: 'IDEM_RNDS_3b4c12',
      rndsProtocol: 'RNDS-BR-2025-774109',
      lastProcessedAt: '2025-11-15T14:30:45Z',
      createdAt: '2025-11-15T14:30:00Z',
    },
  ];

  public static getRndsConfig(): RndsConfig {
    return { ...currentRndsConfig };
  }

  public static updateRndsConfig(newConfig: Partial<RndsConfig>): RndsConfig {
    currentRndsConfig = { ...currentRndsConfig, ...newConfig };
    return { ...currentRndsConfig };
  }

  public static getQueueItems(): RndsIntegrationQueueItem[] {
    return [...this.queue];
  }

  /**
   * Generates a deterministic idempotency key for vaccination records
   */
  public static generateIdempotencyKey(record: VaccinationRecord): string {
    const rawString = `${record.patientId}_${record.vaccineCode}_${record.doseCode}_${record.applicationDate}`;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `IDEM_RNDS_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Converts a VaccinationRecord to HL7 FHIR R4 Immunization Resource Bundle format
   */
  public static convertToFhirImmunizationBundle(record: VaccinationRecord) {
    return {
      resourceType: 'Bundle',
      type: 'transaction',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:${record.id}`,
          resource: {
            resourceType: 'Immunization',
            id: record.id,
            status: record.validationStatus === 'canceled' ? 'entered-in-error' : 'completed',
            vaccineCode: {
              coding: [
                {
                  system: 'http://www.saude.gov.br/fhir/r4/CodeSystem/BRImunobiologico',
                  code: record.vaccineCode,
                  display: record.vaccineName,
                },
              ],
            },
            patient: {
              reference: `Patient/${record.patientId}`,
            },
            occurrenceDateTime: record.applicationDate,
            primarySource: record.sourceType === 'official_imported' || record.sourceType === 'clinic_applied',
            lotNumber: record.batchNumber || 'N/I',
            expirationDate: record.expirationDate || undefined,
            performer: [
              {
                actor: {
                  display: record.professionalName || 'Profissional de Saúde Responsável',
                },
              },
            ],
            protocolApplied: [
              {
                doseNumberString: record.doseDescription,
              },
            ],
          },
          request: {
            method: 'POST',
            url: 'Immunization',
          },
        },
      ],
    };
  }

  /**
   * Enqueues a vaccination record for RNDS synchronization in the secure queue
   */
  public static enqueueForRndsSync(record: VaccinationRecord): RndsIntegrationQueueItem {
    const idempotencyKey = this.generateIdempotencyKey(record);
    
    const existing = this.queue.find(q => q.idempotencyKey === idempotencyKey);
    if (existing) {
      return existing;
    }

    const queueItem: RndsIntegrationQueueItem = {
      id: `rnds_q_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vaccinationRecordId: record.id,
      operationType: 'CREATE_IMMUNIZATION',
      status: 'queued',
      attempts: 0,
      maxAttempts: 3,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    this.queue.push(queueItem);
    return queueItem;
  }

  /**
   * Processes all queued records and generates official RNDS protocols
   */
  public static processSyncQueue(): { processedCount: number; updatedItems: RndsIntegrationQueueItem[] } {
    let processedCount = 0;
    
    for (const item of this.queue) {
      if (item.status === 'queued' || item.status === 'failed_temporary') {
        item.status = 'completed';
        item.attempts += 1;
        item.lastProcessedAt = new Date().toISOString();
        item.rndsProtocol = `RNDS-BR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        processedCount++;
      }
    }

    return { processedCount, updatedItems: [...this.queue] };
  }

  /**
   * Simulates authorized query to the official SUS Vaccination Card via Gov.br consent
   */
  public static async queryOfficialSusVaccineCard(patientCpf: string): Promise<VaccinationRecord[]> {
    // Simulated RNDS official query response
    return [
      {
        id: `vac_sus_${Date.now()}_1`,
        patientId: 'user_maria_01',
        vaccineCode: 'FEBRE_AMARELA',
        vaccineName: 'Febre Amarela (VFA Atenuada)',
        doseCode: 'DOSE_UNICA',
        doseDescription: 'Dose Única (Proteção Vitalícia)',
        applicationDate: '2020-02-14',
        manufacturer: 'Bio-Manguinhos / Fiocruz',
        batchNumber: '20VFA099',
        establishmentName: 'UBS Vila Mariana - SUS SP',
        establishmentCnes: '2048123',
        professionalName: 'Enf. Marisa Oliveira',
        professionalRegistration: 'COREN-SP 149021',
        sourceType: 'official_imported',
        validationStatus: 'validated',
        integrationStatus: 'synced_rnds',
        rndsProtocol: 'RNDS-SUS-2020-110294',
        rndsSentAt: '2020-02-14T11:00:00Z',
        rndsConfirmedAt: '2020-02-14T11:00:10Z',
        createdBy: 'rnds_sus_query',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Registro oficial importado da Carteira Nacional de Vacinação (RNDS/DATASUS).'
      },
      {
        id: `vac_sus_${Date.now()}_2`,
        patientId: 'user_maria_01',
        vaccineCode: 'HEPATITE_B',
        vaccineName: 'Hepatite B (Recombinante)',
        doseCode: 'DOSE_3',
        doseDescription: '3ª Dose do Esquema Básico',
        applicationDate: '2019-09-05',
        manufacturer: 'Instituto Butantan',
        batchNumber: '19HB882',
        establishmentName: 'Posto de Saúde Central',
        sourceType: 'official_imported',
        validationStatus: 'validated',
        integrationStatus: 'synced_rnds',
        rndsProtocol: 'RNDS-SUS-2019-847291',
        rndsSentAt: '2019-09-05T09:30:00Z',
        rndsConfirmedAt: '2019-09-05T09:30:15Z',
        createdBy: 'rnds_sus_query',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Registro oficial importado da Carteira Nacional de Vacinação (RNDS/DATASUS).'
      }
    ];
  }
}
