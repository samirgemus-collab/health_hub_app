/**
 * HEALTHHUB.AI - MAPPERS E ADAPTADORES HL7 FHIR R4
 * Conversão bidirecional entre modelos locais de estado React e Especificação Internacional HL7 FHIR R4 (JSON-LD).
 */

import { UserProfile, MedicalReport, ClinicalTimelineEvent } from '../types/health';

export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  active: boolean;
  name: Array<{
    use: 'official';
    text: string;
  }>;
  gender: 'female' | 'male' | 'other' | 'unknown';
  birthDate?: string;
  identifier: Array<{
    system: string;
    value: string;
  }>;
  extension?: Array<{
    url: string;
    valueString?: string;
    valueQuantity?: {
      value: number;
      unit: string;
    };
  }>;
}

export interface FHIRDiagnosticReport {
  resourceType: 'DiagnosticReport';
  id: string;
  status: 'registered' | 'partial' | 'preliminary' | 'final';
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
    display: string;
  };
  effectiveDateTime: string;
  issued: string;
  performer?: Array<{
    display: string;
  }>;
  conclusion?: string;
}

/**
 * Converte um UserProfile local para o formato de Recurso FHIR Patient
 */
export function mapProfileToFHIRPatient(profile: UserProfile): FHIRPatient {
  return {
    resourceType: 'Patient',
    id: profile.id,
    active: true,
    name: [
      {
        use: 'official',
        text: profile.name
      }
    ],
    gender: profile.sex === 'female' ? 'female' : 'male',
    identifier: [
      {
        system: 'urn:oid:2.16.76.1.3.1', // OID Padrão do CPF no Brasil
        value: profile.cpfMasked
      }
    ],
    extension: [
      {
        url: 'http://hl7.org/fhir/StructureDefinition/patient-bmi',
        valueQuantity: {
          value: profile.bmi,
          unit: 'kg/m2'
        }
      },
      {
        url: 'http://healthhub.ai/fhir/StructureDefinition/blood-type',
        valueString: profile.bloodType
      }
    ]
  };
}

/**
 * Converte um MedicalReport local para o formato de Recurso FHIR DiagnosticReport
 */
export function mapReportToFHIRDiagnosticReport(report: MedicalReport, patientName: string): FHIRDiagnosticReport {
  return {
    resourceType: 'DiagnosticReport',
    id: report.id,
    status: 'final',
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '11502-2',
          display: 'Laboratory Report'
        }
      ],
      text: report.title
    },
    subject: {
      reference: `Patient/${report.id}`,
      display: patientName
    },
    effectiveDateTime: report.date,
    issued: new Date().toISOString(),
    performer: [
      {
        display: `${report.laboratory} - Dr. ${report.doctorName}`
      }
    ],
    conclusion: report.extractedTextSummary || 'Laudo finalizado e revisado.'
  };
}
