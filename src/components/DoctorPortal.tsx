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
  ClinicalTimelineEvent,
  HistoricalConsultationRecord
} from '../types/health';
import { mockHistoricalConsultations } from '../mock/healthData';
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
  ClipboardList,
  BookOpen,
  CheckSquare,
  Award,
  Sun,
  Moon,
  AlertCircle,
  Apple,
  Dumbbell,
  Edit3,
  X
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
  auditLogs: _auditLogs = [],
  conditionsMap: _conditionsMap = {},
  allergiesMap: _allergiesMap = {},
  reportsMap: _reportsMap = {},
  medicationsMap,
  preventiveMap: _preventiveMap = {},
  chronicProtocols = [],
  prescribedProtocols = [],
  refillRequests = [],
  timelineEvents = [],
  onPrescribeProtocol,
  onFulfillRefillRequest: _onFulfillRefillRequest,
}) => {
  const availableProtocols = (chronicProtocols && chronicProtocols.length > 0) ? chronicProtocols : [defaultProtocol];
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'user_maria_01');
  const [activeDoctorTab, setActiveDoctorTab] = useState<'care_plan_doc' | 'guidelines' | 'protocols' | 'emr' | 'prescriptions' | 'dictation' | 'refills' | 'backlog'>('care_plan_doc');
  
  // HISTORICAL CONSULTATIONS BACKLOG STATE
  const [epochFilter, setEpochFilter] = useState<string>('all');
  const [backlogSearchQuery, setBacklogSearchQuery] = useState<string>('');
  const [selectedConsultationForReview, setSelectedConsultationForReview] = useState<HistoricalConsultationRecord | null>(null);
  
  // PATIENT CARE PLAN DOCUMENT EDITABLE STATE
  const [careDietInfo, setCareDietInfo] = useState('Dieta hipossódica (máximo 2g de sódio/dia ou 5g de sal de cozinha). Evitar embutidos, enlatados e temperos industrializados. Aumentar consumo de potássio via frutas e vegetais.');
  const [careExerciseInfo, setCareExerciseInfo] = useState('Caminhada moderada de 30 minutos, 5 vezes por semana (total de 150 min/semana). Evitar exercícios de alta intensidade em dias de PA > 140/90 mmHg.');
  const [careWarningInfo, setCareWarningInfo] = useState('Procurar o Pronto-Socorro IMEDIATAMENTE se apresentar: Dor no peito intensa, falta de ar súbita, tontura forte com desmaio, visão embaçada ou PA Sistólica > 180 mmHg.');
  const [careReturnDate, setCareReturnDate] = useState('Retorno em 30 dias para reavaliação de PA e checagem de exames de sangue.');

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

  const handleSendCarePlanWhatsApp = () => {
    const msg = `📋 *GUIA DE CUIDADOS AO PACIENTE - ${selectedPatient.name.toUpperCase()}*\nEmitido por: ${doctor.name} (${doctor.crm})\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n🥗 *ALIMENTAÇÃO & DIETA:*\n${careDietInfo}\n\n🏃 *EXERCÍCIOS FÍSICOS:*\n${careExerciseInfo}\n\n⚠️ *SINAIS DE ALERTA PARA PRONTO-SOCORRO:*\n${careWarningInfo}\n\n📅 *PRÓXIMO RETORNO:*\n${careReturnDate}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
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
              <span>Portal do Médico • Plano de Cuidados & Emissão de Documentos</span>
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
          onClick={() => setActiveDoctorTab('care_plan_doc')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'care_plan_doc' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Printer className="w-4 h-4 text-indigo-300" />
          <span>🖨️ Documento de Cuidados ao Paciente</span>
        </button>

        <button
          onClick={() => setActiveDoctorTab('guidelines')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'guidelines' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-300" />
          <span>📖 Consensos Clínicos por Doença</span>
        </button>

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
          <span>📄 Receita Eletrônica ICP-Brasil</span>
        </button>

        <button
          onClick={() => setActiveDoctorTab('backlog')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeDoctorTab === 'backlog' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-300" />
          <span>📅 Backlog de Consultas ({mockHistoricalConsultations.length})</span>
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
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: DOCUMENTO IMPRIMÍVEL DE CUIDADOS AO PACIENTE (CARE PLAN CANVAS)   */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'care_plan_doc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* EDITABLE FORM FOR PATIENT CARE INSTRUCTIONS */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              Editar Orientações de Cuidados ao Paciente
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Apple className="w-3.5 h-3.5 text-emerald-400" />
                  Alimentação & Restrições Dietéticas
                </label>
                <textarea
                  rows={3}
                  value={careDietInfo}
                  onChange={(e) => setCareDietInfo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                  Exercícios Físicos & Atividade
                </label>
                <textarea
                  rows={3}
                  value={careExerciseInfo}
                  onChange={(e) => setCareExerciseInfo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1 text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  Sinais de Alerta para Ir ao Pronto-Socorro
                </label>
                <textarea
                  rows={3}
                  value={careWarningInfo}
                  onChange={(e) => setCareWarningInfo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Próximo Retorno & Exames Solicitados
                </label>
                <input
                  type="text"
                  value={careReturnDate}
                  onChange={(e) => setCareReturnDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* OFFICIAL PRINTABLE PATIENT CARE PLAN SHEET DOCUMENT */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white">Visualizador da Folha de Cuidados (Folha A4 Imprimível)</h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSendCarePlanWhatsApp}
                  className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir em Folha A4 (PDF)</span>
                </button>
              </div>
            </div>

            {/* WHITE PRINTABLE SHEET CANVAS */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300 font-sans leading-relaxed">
              
              {/* HEADER TIMBRE */}
              <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                    {doctor.hospitalAffiliation || 'HealthHub Medicina Preventiva'}
                  </h2>
                  <p className="text-sm font-bold text-indigo-900 mt-0.5">{doctor.name}</p>
                  <p className="text-xs text-slate-600">{doctor.specialty} • <strong className="text-slate-900">{doctor.crm}</strong></p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-bold text-slate-800 uppercase">Plano de Cuidados do Paciente</p>
                  <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* PATIENT IDENTIFICATION */}
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-300 text-xs space-y-1">
                <p><strong className="text-slate-900 uppercase">Paciente:</strong> {selectedPatient.name}</p>
                <p><strong className="text-slate-900">CPF:</strong> {selectedPatient.cpfMasked} • <strong className="text-slate-900">Idade:</strong> {selectedPatient.age} anos</p>
              </div>

              {/* SECTION 1: DIET & NUTRITION */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
                <h4 className="font-extrabold text-emerald-900 text-sm flex items-center gap-1.5 uppercase">
                  <Apple className="w-4 h-4 text-emerald-700" />
                  1. Alimentação & Orientações Nutricionais
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">{careDietInfo}</p>
              </div>

              {/* SECTION 2: EXERCISES */}
              <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200 space-y-1.5 text-xs">
                <h4 className="font-extrabold text-cyan-900 text-sm flex items-center gap-1.5 uppercase">
                  <Dumbbell className="w-4 h-4 text-cyan-700" />
                  2. Atividade Física Recomendada
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">{careExerciseInfo}</p>
              </div>

              {/* SECTION 3: DIDACTIC MEDICATION TIMETABLE */}
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-1.5 uppercase">
                  <Pill className="w-4 h-4 text-indigo-700" />
                  3. Tabela Didática de Remédios
                </h4>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-indigo-200 flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">Manhã (Em Jejum)</span>
                      <span className="text-slate-600 font-semibold">Enalapril 10mg — 1 Comprimido</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-indigo-200 flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">Noite (Após Jantar)</span>
                      <span className="text-slate-600 font-semibold">Atorvastatina 20mg — 1 Comprimido</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: EMERGENCY WARNING SIGNS */}
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1.5 text-xs">
                <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-1.5 uppercase">
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  4. Sinais de Alerta para Pronto-Socorro
                </h4>
                <p className="text-rose-900 leading-relaxed font-bold">{careWarningInfo}</p>
              </div>

              {/* FOOTER & SIGNATURE */}
              <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">📅 Próxima Consulta: {careReturnDate}</p>
                  <p className="text-[10px] text-slate-500">Documento de Acompanhamento gerado pelo HealthHub.AI</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-48 border-b border-slate-900 mx-auto"></div>
                  <p className="font-bold text-slate-900 text-[11px]">{doctor.name}</p>
                  <p className="text-[10px] text-slate-600">{doctor.crm}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: CONSENSOS CLÍNICOS OFICIAIS POR DOENÇA CRÔNICA                    */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Diretrizes Oficiais das Sociedades Médicas (SBC, SBD, KDIGO, IOF, AHA)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Principais Recomendações dos Consensos Médicos por Patologia Crônica
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="font-extrabold text-white text-base">Hipertensão Arterial (HAS)</h3>
                <p className="text-slate-300">Meta: PA &lt; 130/80 mmHg para alto risco cardiovascular / DRC.</p>
              </div>
              <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
                <h3 className="font-extrabold text-white text-base">Diabetes Mellitus Tipo 2 (DM2)</h3>
                <p className="text-slate-300">Meta: HbA1c &lt; 7,0% com proteção cardiorrenal iSGLT2.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: PROTOCOLOS CLÍNICOS PRE-CONFIGURADOS                              */}
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
                          setActiveDoctorTab('emr');
                        }, 1200);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
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
      {/* 4. TAB: PRONTUÁRIO MÉDICO COMPLETO & LINHA DO TEMPO FHIR (EMR VIEWER)     */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'emr' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-6 h-6 text-teal-400" />
                <div>
                  <h3 className="text-base font-extrabold text-white">Prontuário Médico & Linha do Tempo Inteligente (FHIR R4)</h3>
                  <p className="text-xs text-slate-400">Paciente: <strong className="text-white">{selectedPatient.name}</strong></p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm">{evt.title}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{evt.date}</span>
                  </div>
                  <p className="text-slate-300">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: PRESCRIÇÃO ELETRÔNICA ICP-BRASIL                                 */}
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
                <label className="block text-slate-300 font-bold mb-1">Medicamento & Posologia</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Enalapril 10mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-extrabold text-xs cursor-pointer"
              >
                <FileSignature className="w-4 h-4 inline mr-1" />
                <span>Assinar Digitalmente (Certificado ICP-Brasil)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: DITADO MÉDICO POR VOZ & ESTRUTURAÇÃO DE CONSULTA (SOAP)           */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'dictation' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Agente de Ditado por Voz & Estruturação SOAP</h3>
              <button
                onClick={handleToggleVoiceDictation}
                className={`py-3 px-5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  isRecordingDictation ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white'
                }`}
              >
                {isRecordingDictation ? '🔴 Gravando Ditado...' : '🎙️ Iniciar Ditado por Voz'}
              </button>
            </div>

            <textarea
              rows={4}
              value={dictationRawText}
              onChange={(e) => setDictationRawText(e.target.value)}
              className="w-full p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white text-xs"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: BACKLOG DE CONSULTAS & REVISÃO DE PRONTUÁRIO HISTÓRICO POR ÉPOCA  */}
      {/* ========================================================================= */}
      {activeDoctorTab === 'backlog' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            {/* BACKLOG HEADER & FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                  <Calendar className="w-4 h-4" />
                  <span>Histórico de Atendimentos & Arquivo Médico</span>
                </div>
                <h3 className="text-xl font-black text-white">Backlog de Consultas por Época</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Consulte atendimentos passados, pesquise por ano/trimestre e revise o prontuário SOAP original da época.
                </p>
              </div>

              {/* EPOCH & SEARCH FILTERS */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={epochFilter}
                  onChange={(e) => setEpochFilter(e.target.value)}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  <option value="all">Todas as Épocas</option>
                  <option value="2026">Ano de 2026</option>
                  <option value="2025">Ano de 2025</option>
                  <option value="2024">Ano de 2024</option>
                </select>

                <input
                  type="text"
                  placeholder="Buscar por paciente ou CID-10..."
                  value={backlogSearchQuery}
                  onChange={(e) => setBacklogSearchQuery(e.target.value)}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-xs w-48 sm:w-64"
                />
              </div>
            </div>

            {/* BACKLOG TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Data / Época</th>
                    <th className="py-3 px-3">Paciente</th>
                    <th className="py-3 px-3">Tipo</th>
                    <th className="py-3 px-3">Médico / Especialidade</th>
                    <th className="py-3 px-3">Diagnóstico Principal (CID-10)</th>
                    <th className="py-3 px-3">Assinatura ICP</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {mockHistoricalConsultations
                    .filter(c => epochFilter === 'all' || c.consultationDate.startsWith(epochFilter) || c.consultationEpoch.includes(epochFilter))
                    .filter(c => !backlogSearchQuery || c.patientName.toLowerCase().includes(backlogSearchQuery.toLowerCase()) || c.mainDiagnosisCid10.toLowerCase().includes(backlogSearchQuery.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="text-white font-bold block">{new Date(item.consultationDate).toLocaleDateString()}</span>
                          <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{item.consultationEpoch}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-white font-bold block">{item.patientName}</span>
                          <span className="text-[10px] text-slate-400">{item.patientAge} anos ({item.patientSex === 'female' ? 'F' : 'M'})</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="capitalize font-bold text-teal-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">{item.consultationType}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-white font-medium block">{item.doctorName}</span>
                          <span className="text-[10px] text-slate-400">{item.specialty}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-amber-300 font-extrabold block">{item.mainDiagnosisCid10}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-xs block">{item.diagnosisDescription}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3 h-3" /> Assinado ICP-Brasil
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedConsultationForReview(item)}
                            className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer shadow-sm"
                          >
                            🔍 Revisar Prontuário
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE REVISÃO DO PRONTUÁRIO SOAP DA ÉPOCA */}
      {selectedConsultationForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>Prontuário Histórico da Época • Leitura Protegida (CFM 1.821/2007)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Atendimento de {new Date(selectedConsultationForReview.consultationDate).toLocaleDateString()} ({selectedConsultationForReview.consultationEpoch})
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Paciente: <strong className="text-white">{selectedConsultationForReview.patientName}</strong> • Médico: <strong className="text-white">{selectedConsultationForReview.doctorName} ({selectedConsultationForReview.doctorCrm})</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedConsultationForReview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* VITALS SNAPSHOT AT EPOCH */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <h3 className="font-extrabold text-white text-xs flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Sinais Vitais Vigentes na Época do Atendimento</span>
                <span className="text-[10px] text-slate-400">Registrado em {new Date(selectedConsultationForReview.consultationDate).toLocaleDateString()}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Pressão Arterial</span>
                  <span className="text-sm font-black text-white">{selectedConsultationForReview.vitalsAtEpoch.bloodPressure} mmHg</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Frequência Cardíaca</span>
                  <span className="text-sm font-black text-emerald-400">{selectedConsultationForReview.vitalsAtEpoch.heartRateBpm} bpm</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Peso</span>
                  <span className="text-sm font-black text-cyan-300">{selectedConsultationForReview.vitalsAtEpoch.weightKg} kg</span>
                </div>
                {selectedConsultationForReview.vitalsAtEpoch.glycemiaMgDl && (
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Glicemia</span>
                    <span className="text-sm font-black text-amber-300">{selectedConsultationForReview.vitalsAtEpoch.glycemiaMgDl} mg/dL</span>
                  </div>
                )}
              </div>
            </div>

            {/* SOAP NOTES VIEW */}
            <div className="space-y-3 text-xs">
              <h3 className="font-extrabold text-white text-sm">Evolução Clínica Registrada (Estrutura SOAP)</h3>
              
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-extrabold text-xs block">S — Subjetivo (Anamnese & Queixa)</span>
                <p className="text-slate-200 leading-relaxed">{selectedConsultationForReview.soapNotes.subjective}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-extrabold text-xs block">O — Objetivo (Exame Físico & Achados)</span>
                <p className="text-slate-200 leading-relaxed">{selectedConsultationForReview.soapNotes.objective}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-extrabold text-xs block">A — Avaliação (Hipóteses & CID-10: {selectedConsultationForReview.mainDiagnosisCid10})</span>
                <p className="text-slate-200 leading-relaxed">{selectedConsultationForReview.soapNotes.assessment}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-extrabold text-xs block">P — Plano (Conduta & Orientações)</span>
                <p className="text-slate-200 leading-relaxed">{selectedConsultationForReview.soapNotes.plan}</p>
              </div>
            </div>

            {/* PRESCRIPTIONS & EXAMS ISSUED AT EPOCH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-400" /> Prescrições Emitidas na Época
                </h4>
                {selectedConsultationForReview.prescriptionsIssued.length > 0 ? (
                  <div className="space-y-2">
                    {selectedConsultationForReview.prescriptionsIssued.map((rx) => (
                      <div key={rx.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 text-[11px]">
                        <strong className="text-white block">{rx.medicationName}</strong>
                        <span className="text-slate-300 block">{rx.dosageInstruction}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{rx.duration}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Nenhuma receita medicamentos ematida neste atendimento.</p>
                )}
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-extrabold text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-400" /> Exames Solicitados
                </h4>
                {selectedConsultationForReview.examsRequested.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {selectedConsultationForReview.examsRequested.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">Nenhum exame solicitado nesta data.</p>
                )}
              </div>
            </div>

            {/* CFM / ICP-BRASIL INTEGRITY STAMP */}
            <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-emerald-400 font-extrabold block">Assinado Digitalmente via ICP-Brasil</span>
                  <span className="text-[10px] text-slate-400 font-mono">Hash de Integridade: {selectedConsultationForReview.integrityHash}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedConsultationForReview(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer shrink-0"
              >
                Fechar Visualizador
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
