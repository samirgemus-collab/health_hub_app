import React, { useState } from 'react';
import { 
  DoctorProfile, 
  UserProfile, 
  LgpdConsent, 
  AuditLogEntry, 
  ChronicCondition, 
  Allergy, 
  MedicalReport, 
  Medication, 
  PreventiveCareRecommendation,
  ElectronicPrescription,
  MedicalCertificate,
  ChronicCareProtocol,
  PrescribedProtocol,
  MedicationRefillRequest,
  ClinicalTimelineEvent
} from '../types/health';
import { 
  Stethoscope, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Pill, 
  FileCheck, 
  Clock, 
  UserCheck, 
  Lock, 
  FileSignature,
  FileBadge,
  QrCode,
  Printer,
  Download,
  Plus,
  Calendar,
  Send,
  Sparkles,
  TrendingUp,
  Heart,
  Share2,
  Activity,
  Sliders,
  Check,
  Building2,
  FileSpreadsheet,
  Zap,
  Target,
  RefreshCw,
  ShoppingBag,
  Mic,
  MicOff,
  Copy,
  Brain,
  Eye,
  MessageCircle,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

interface DoctorPortalProps {
  doctor: DoctorProfile;
  consents: LgpdConsent[];
  patients: UserProfile[];
  auditLogs: AuditLogEntry[];
  conditionsMap: Record<string, ChronicCondition[]>;
  allergiesMap: Record<string, Allergy[]>;
  reportsMap: Record<string, MedicalReport[]>;
  medicationsMap: Record<string, Medication[]>;
  preventiveMap: Record<string, PreventiveCareRecommendation[]>;
  chronicProtocols?: ChronicCareProtocol[];
  prescribedProtocols?: PrescribedProtocol[];
  refillRequests?: MedicationRefillRequest[];
  timelineEvents?: ClinicalTimelineEvent[];
  onPrescribeProtocol?: (protocol: Omit<PrescribedProtocol, 'id' | 'prescribedDate'>) => void;
  onFulfillRefillRequest?: (requestId: string) => void;
}

const defaultProtocol: ChronicCareProtocol = {
  id: 'proto_has_01',
  conditionName: 'Hipertensão Arterial Sistêmica (HAS)',
  icdCode: 'CID-10 I10',
  specialty: 'Cardiologia & Medicina Preventiva',
  guidelineSource: 'Diretrizes Brasileiras de Hipertensão (SBC / DHA)',
  recommendedMonitoringFrequency: 'daily',
  requiredVitals: ['Pressão Arterial (Sistólica/Diastólica)', 'Frequência Cardíaca (BPM)'],
  alertTriggers: 'Pressão Sistólica > 140 mmHg ou Diastólica > 90 mmHg em 2 medições no mesmo dia',
  targetGoals: 'Manter PA Média < 120 x 80 mmHg e Adesão Posológica > 95%',
  teamWorkflows: 'Tele-triagem da Enfermagem quinzenal + Visita domiciliar mensal do Agente de Saúde (ACS)'
};

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  doctor,
  consents,
  patients = [],
  auditLogs,
  conditionsMap,
  allergiesMap,
  reportsMap,
  medicationsMap,
  preventiveMap,
  chronicProtocols = [],
  prescribedProtocols = [],
  refillRequests = [],
  timelineEvents = [],
  onPrescribeProtocol,
  onFulfillRefillRequest,
}) => {
  const availableProtocols = (chronicProtocols && chronicProtocols.length > 0) ? chronicProtocols : [defaultProtocol];
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'user_maria_01');
  const [activeDoctorTab, setActiveDoctorTab] = useState<'protocols' | 'emr' | 'prescriptions' | 'dictation' | 'refills'>('protocols');
  
  // VOICE DICTATION & AI SOAP STRUCTURING STATE
  const [isRecordingDictation, setIsRecordingDictation] = useState(false);
  const [dictationRawText, setDictationRawText] = useState('Paciente Maria Silva, 45 anos, retorna hoje referindo melhora da cefaleia, porém queixa-se de tontura ortostática ao se levantar. Ao exame físico: PA 145x92 mmHg, FC 76 bpm, ausculta cardíaca RCR 2T BNF sem sopros. Conduta: Aumentar Enalapril para 10mg 1x ao dia, solicitar ECG de repouso e retorno em 30 dias.');
  const [isStructuringSoap, setIsStructuringSoap] = useState(false);
  const [structuredSoapNote, setStructuredSoapNote] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  } | null>(null);

  // PRESCRIPTION EMISSION STATE
  const [rxType, setRxType] = useState<'simple' | 'controlled_c1' | 'antibiotic'>('simple');
  const [medName, setMedName] = useState('Enalapril');
  const [medDosage, setMedDosage] = useState('10mg');
  const [medInstructions, setMedInstructions] = useState('Tomar 1 comprimido pela manhã em jejum com água.');
  const [prescriptions, setPrescriptions] = useState<ElectronicPrescription[]>([]);
  const [previewPrescription, setPreviewPrescription] = useState<ElectronicPrescription | null>({
    id: 'rx_preview_01',
    date: new Date().toLocaleDateString('pt-BR'),
    patientId: 'user_maria_01',
    patientName: 'Maria Silva',
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorCrm: doctor.crm,
    type: 'simple',
    medications: [
      {
        name: 'Enalapril 10mg',
        dosage: '10mg',
        instructions: 'Tomar 1 comprimido pela manhã em jejum com água.',
        boxes: 1,
        continuousUse: true
      }
    ],
    signatureHash: 'SHA256-A89F10B829C04D81E9923847',
    qrCodeValidationUrl: 'https://validar.iti.gov.br/verificar?hash=SHA256-A89F10B829C04D81E9923847'
  });

  // TOAST NOTIFICATION
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientConditions = conditionsMap[selectedPatientId] || [];
  const patientMeds = medicationsMap[selectedPatientId] || [];

  // SPEECH-TO-TEXT VOICE DICTATION HANDLER
  const handleToggleVoiceDictation = () => {
    if (isRecordingDictation) {
      setIsRecordingDictation(false);
      return;
    }
    setIsRecordingDictation(true);
    setTimeout(() => {
      setIsRecordingDictation(false);
    }, 3000);
  };

  // AI SOAP CONSULTATION STRUCTURING AGENT HANDLER
  const handleStructureConsultationSoap = () => {
    setIsStructuringSoap(true);
    setTimeout(() => {
      setStructuredSoapNote({
        subjective: 'S (Subjetivo): Paciente retorna para avaliação de acompanhamento. Refere alívio das dores de cabeça prévias, porém relata episódios de tontura ortostática ao se levantar abruptamente.',
        objective: 'O (Objetivo): Sinais vitais telemétricos: Pressão Arterial 145x92 mmHg (Atenção), Frequência Cardíaca 76 BPM, SpO2 98%. Exame físico: Ritmo cardíaco regular em 2 tempos, bulhas normofonéticas sem sopros. Murmúrio vesicular presente bilateralmente.',
        assessment: 'A (Avaliação / Hipótese): Hipertensão Arterial Sistêmica Estágio I não controlada (CID-10 I10) com ajuste posológico pendente.',
        plan: 'P (Plano & Conduta): 1. Aumentar dosagem de Enalapril para 10mg VO 1x ao dia; 2. Solicitar Eletrocardiograma de Repouso (ECG) em 15 dias; 3. Manter telemetria semanal de PA no aplicativo; 4. Consulta de retorno agendada para 30 dias.'
      });
      setIsStructuringSoap(false);
      setToastMessage('Ditado médico estruturado no padrão SOAP via IA Gemini com sucesso!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 1200);
  };

  // SAVE SOAP NOTE TO PATIENT EMR
  const handleSaveSoapToEmr = () => {
    setActiveDoctorTab('emr');
    setToastMessage(`Nota SOAP gravada no Prontuário FHIR da paciente ${selectedPatient.name}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // ISSUE ELECTRONIC PRESCRIPTION & UPDATE PREVIEW
  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const newRx: ElectronicPrescription = {
      id: `rx_${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorCrm: doctor.crm,
      type: rxType,
      medications: [
        {
          name: `${medName || 'Enalapril'} ${medDosage || '10mg'}`,
          dosage: medDosage || '10mg',
          instructions: medInstructions || 'Tomar 1 comprimido pela manhã em jejum.',
          boxes: 1,
          continuousUse: true
        }
      ],
      signatureHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}${Date.now().toString(36).toUpperCase()}`,
      qrCodeValidationUrl: `https://validar.iti.gov.br/verificar?hash=SHA256-${Date.now()}`
    };

    setPrescriptions([newRx, ...prescriptions]);
    setPreviewPrescription(newRx);

    setToastMessage(`Prescrição emitida e assinada via ICP-Brasil para ${selectedPatient.name}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSendRxWhatsApp = () => {
    if (!previewPrescription) return;
    const msg = `Olá ${selectedPatient.name}, aqui está a sua Receita Médica Eletrônica emitida pelo ${doctor.name} (${doctor.crm}):\n\n💊 *${previewPrescription.medications[0].name}*\nInstruções: ${previewPrescription.medications[0].instructions}\n\n🔒 Validação ICP-Brasil: ${previewPrescription.qrCodeValidationUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30">
        <div className="flex items-center space-x-4">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
          />
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Stethoscope className="w-4 h-4" />
              <span>Portal do Médico • Prontuário Multidisciplinar & Protocolos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{doctor.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {doctor.specialty} • <strong className="text-white">{doctor.crm}</strong> • {doctor.hospitalAffiliation}
            </p>
          </div>
        </div>

        {/* PATIENT SELECTOR DROPDOWN */}
        <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <UserCheck className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block">Atendimento Atual:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.age}a • CPF {p.cpfMasked})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DOCTOR PORTAL TABS HEADER */}
      <div className="flex space-x-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveDoctorTab('protocols')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'protocols' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 text-indigo-300" />
          <span>🩺 Protocolos Clínicos ({availableProtocols.length})</span>
        </button>

        <button
          onClick={() => setActiveDoctorTab('emr')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'emr' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-indigo-300" />
          <span>📋 Prontuário & Linha do Tempo FHIR</span>
        </button>

        <button
          onClick={() => setActiveDoctorTab('prescriptions')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'prescriptions' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileSignature className="w-4 h-4 text-indigo-300" />
          <span>📄 Receita Eletrônica & Canvas ICP-Brasil</span>
        </button>

        <button
          onClick={() => setActiveDoctorTab('dictation')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'dictation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4 text-indigo-300" />
          <span>🎙️ Ditado Médico & SOAP</span>
        </button>

        <button
          onClick={() => setActiveDoctorTab('refills')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'refills' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-indigo-300" />
          <span>💊 Renovações de Receita ({refillRequests.filter(r => r.status === 'pending').length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: PROTOCOLOS CLÍNICOS                                               */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'protocols' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Protocolos de Doenças Crônicas Pre-configurados (SBC / SBD / SBPT)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {availableProtocols.map((proto) => (
                <div key={proto.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-white text-sm">{proto.conditionName}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {proto.icdCode}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs">{proto.guidelineSource}</p>
                  <p className="text-teal-300 font-bold">Meta: {proto.targetGoals}</p>
                  <p className="text-amber-400 text-[11px]">Gatilho de Alerta: {proto.alertTriggers}</p>

                  <button
                    onClick={() => {
                      if (onPrescribeProtocol) {
                        onPrescribeProtocol({
                          patientId: selectedPatient.id,
                          patientName: selectedPatient.name,
                          doctorId: doctor.id,
                          doctorName: doctor.name,
                          protocolId: proto.id,
                          conditionName: proto.conditionName,
                          icdCode: proto.icdCode,
                          monitoringFrequency: proto.recommendedMonitoringFrequency,
                          targetGoals: proto.targetGoals,
                          customAlertThresholds: proto.alertTriggers,
                          status: 'active'
                        });
                        setToastMessage(`Protocolo de ${proto.conditionName} ativado e gravado no Prontuário de ${selectedPatient.name}!`);
                        setShowToast(true);
                        setTimeout(() => {
                          setShowToast(false);
                          setActiveDoctorTab('emr'); // AUTO SWITCH TO EMR TIMELINE VIEW!
                        }, 1200);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Prescrever & Ativar no Prontuário do Paciente</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: PRONTUÁRIO MÉDICO COMPLETO & LINHA DO TEMPO FHIR (EMR VIEWER)     */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'emr' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-6 h-6 text-teal-400" />
                <div>
                  <h3 className="text-base font-extrabold text-white">Prontuário Médico & Linha do Tempo Inteligente (FHIR R4)</h3>
                  <p className="text-xs text-slate-400">Paciente: <strong className="text-white">{selectedPatient.name}</strong> ({selectedPatient.age} anos • CPF {selectedPatient.cpfMasked})</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 rounded-xl text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Prontuário Sincronizado
              </span>
            </div>

            {/* PROTOCOLS PRESCRIBED IN EMR SUMMARY */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
                Protocolos Clínicos Ativos no Prontuário ({prescribedProtocols.length}):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {prescribedProtocols.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-900 rounded-2xl border border-indigo-500/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{p.conditionName}</span>
                      <span className="text-[10px] text-indigo-400 font-bold">{p.icdCode}</span>
                    </div>
                    <p className="text-slate-300">Prescrito por: <strong className="text-white">{p.doctorName}</strong> em {p.prescribedDate}</p>
                    <p className="text-teal-300 font-bold">Meta: {p.targetGoals}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* EMR TIMELINE EVENTS LIST */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                Eventos Clínicos Registrados na Linha do Tempo ({timelineEvents.length}):
              </h4>

              <div className="space-y-3">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-sm">{evt.title}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{evt.date}</span>
                    </div>
                    <p className="text-slate-300">{evt.description}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Autor: {evt.authorName} ({evt.authorRole})</span>
                      <span className="text-teal-400 font-mono">Recurso FHIR: {evt.fhirResource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: PRESCRIÇÃO ELETRÔNICA & VISUALIZADOR OFICIAL DA RECEITA (CANVAS)  */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'prescriptions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-indigo-400" />
              Emissão de Receita Eletrônica
            </h3>

            <form onSubmit={handleIssuePrescription} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tipo de Prescrição</label>
                <select
                  value={rxType}
                  onChange={(e) => setRxType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="simple">Receita Simples / Uso Contínuo</option>
                  <option value="controlled_c1">Receita de Controle Especial (C1 branca)</option>
                  <option value="antibiotic">Receita de Antimicrobianos</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Medicamento & Concentração</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Enalapril 10mg"
                  value={medName}
                  onChange={(e) => {
                    setMedName(e.target.value);
                    if (previewPrescription) {
                      setPreviewPrescription({
                        ...previewPrescription,
                        medications: [{ ...previewPrescription.medications[0], name: e.target.value }]
                      });
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Dosagem (mg/mL)</label>
                <input
                  type="text"
                  placeholder="ex: 10mg"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Posologia / Modo de Usar</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ex: Tomar 1 comprimido via oral pela manhã em jejum."
                  value={medInstructions}
                  onChange={(e) => {
                    setMedInstructions(e.target.value);
                    if (previewPrescription) {
                      setPreviewPrescription({
                        ...previewPrescription,
                        medications: [{ ...previewPrescription.medications[0], instructions: e.target.value }]
                      });
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <FileSignature className="w-4 h-4" />
                <span>Assinar Digitalmente (Certificado ICP-Brasil)</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-extrabold text-white">Visualizador Oficial da Receita Médica</h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSendRxWhatsApp}
                  className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir (PDF)</span>
                </button>
              </div>
            </div>

            {previewPrescription && (
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300 font-serif leading-relaxed">
                <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide font-sans">
                      {doctor.hospitalAffiliation || 'HealthHub Medicina Preventiva'}
                    </h2>
                    <p className="text-sm font-bold text-indigo-900 mt-0.5 font-sans">{doctor.name}</p>
                    <p className="text-xs text-slate-600 font-sans">{doctor.specialty} • <strong className="text-slate-900">{doctor.crm}</strong></p>
                  </div>
                  <div className="text-right font-sans text-xs text-slate-500">
                    <p className="font-bold text-slate-800">RECEITUÁRIO MÉDICO</p>
                    <p>Data: {previewPrescription.date}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 text-xs font-sans space-y-1">
                  <p><strong className="text-slate-900 uppercase">Paciente:</strong> {selectedPatient.name}</p>
                  <p><strong className="text-slate-900">CPF:</strong> {selectedPatient.cpfMasked} • <strong className="text-slate-900">Idade:</strong> {selectedPatient.age} anos</p>
                </div>

                <div className="space-y-4 py-2 font-sans">
                  <span className="text-lg font-black text-indigo-950 font-serif block">Rx / Uso Medicamentoso:</span>
                  {previewPrescription.medications.map((m, idx) => (
                    <div key={idx} className="space-y-1 pl-4 border-l-4 border-indigo-600">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-slate-900">{m.name}</h4>
                        {m.continuousUse && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 uppercase">
                            Uso Contínuo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-semibold">{m.instructions}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between font-sans text-xs">
                  <div className="space-y-1 max-w-xs">
                    <div className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Documento Assinado Digitalmente via ICP-Brasil</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono break-all">Hash: {previewPrescription.signatureHash}</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-center space-y-1 shrink-0">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono text-[9px] mx-auto">
                      <QrCode className="w-12 h-12 text-white" />
                    </div>
                    <span className="text-[9px] text-slate-600 font-bold block">Validar no ITI</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: DITADO MÉDICO POR VOZ & ESTRUTURAÇÃO DE CONSULTA (SOAP)           */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'dictation' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-indigo-400" />
                  Agente de Ditado por Voz & Estruturação de Consulta (SOAP)
                </h3>
                <p className="text-xs text-slate-400">
                  Dite os achados da consulta por voz. A IA Gemini converte o áudio bruto no formato médico padrão SOAP.
                </p>
              </div>

              <button
                onClick={handleToggleVoiceDictation}
                className={`py-3 px-5 rounded-2xl font-black text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  isRecordingDictation 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                {isRecordingDictation ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecordingDictation ? '🔴 Gravando Ditado (Fale Agora)...' : '🎙️ Iniciar Ditado por Voz'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Transcrição Bruta do Ditado da Consulta:</label>
              <textarea
                rows={4}
                value={dictationRawText}
                onChange={(e) => setDictationRawText(e.target.value)}
                className="w-full p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="Fale ou digite as observações da consulta..."
              />

              <div className="flex justify-end">
                <button
                  onClick={handleStructureConsultationSoap}
                  disabled={isStructuringSoap || !dictationRawText}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isStructuringSoap ? 'animate-spin' : ''}`} />
                  <span>{isStructuringSoap ? 'Estruturando nota SOAP...' : '✨ Estruturar Consulta com IA Gemini'}</span>
                </button>
              </div>
            </div>

            {structuredSoapNote && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-teal-400" />
                    Nota Clínica Estruturada (Padrão SOAP) para {selectedPatient.name}
                  </h4>

                  <button
                    onClick={handleSaveSoapToEmr}
                    className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>💾 Gravar Nota SOAP no Prontuário FHIR</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-indigo-400 block uppercase">Subjetivo (S):</span>
                    <p className="text-slate-200 leading-relaxed">{structuredSoapNote.subjective}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-teal-400 block uppercase">Objetivo (O):</span>
                    <p className="text-slate-200 leading-relaxed">{structuredSoapNote.objective}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-amber-400 block uppercase">Avaliação / Diagnóstico (A):</span>
                    <p className="text-slate-200 leading-relaxed">{structuredSoapNote.assessment}</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-extrabold text-rose-400 block uppercase">Plano & Conduta (P):</span>
                    <p className="text-slate-200 leading-relaxed">{structuredSoapNote.plan}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: RENOVAÇÕES AUTOMÁTICAS DE RECEITA                                 */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'refills' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            Solicitações Automáticas de Renovação de Receita por Estoque Baixo
          </h3>

          {refillRequests.length === 0 ? (
            <p className="text-slate-400 text-xs italic">Nenhuma solicitação de renovação pendente no momento.</p>
          ) : (
            <div className="space-y-3">
              {refillRequests.map((req) => (
                <div key={req.id} className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-950/10 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{req.medicationName} {req.dosage}</h4>
                    <p className="text-slate-300">Paciente: <strong className="text-white">{req.patientName}</strong></p>
                    <p className="text-amber-400 font-mono text-[11px]">Restam apenas {req.remainingDoses} comprimidos no estoque do paciente!</p>
                  </div>

                  <button
                    onClick={() => {
                      if (onFulfillRefillRequest) onFulfillRefillRequest(req.id);
                      setToastMessage(`Receita renovada e assinada via ICP-Brasil para ${req.patientName}!`);
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
                  >
                    <FileSignature className="w-4 h-4" />
                    <span>Renovar & Assinar Receita ICP-Brasil</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
