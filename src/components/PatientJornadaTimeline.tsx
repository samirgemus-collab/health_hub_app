import React, { useState } from 'react';
import { UserProfile, ClinicalTimelineEvent, UserRole } from '../types/health';
import { 
  Clock, 
  Calendar, 
  FileText, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Filter, 
  Stethoscope, 
  Pill, 
  Building2, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Zap, 
  Lock, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Mic,
  MicOff,
  Plus,
  Heart
} from 'lucide-react';

interface PatientJornadaTimelineProps {
  profile: UserProfile;
  userRole: UserRole;
  events?: ClinicalTimelineEvent[];
  onValidateEventForPatient?: (eventId: string) => void;
}

export const PatientJornadaTimeline: React.FC<PatientJornadaTimelineProps> = ({
  profile,
  userRole,
  events = [],
  onValidateEventForPatient,
}) => {
  const [viewMode, setViewMode] = useState<'doctor' | 'patient'>(userRole === 'doctor' || userRole === 'healthcare_team' ? 'doctor' : 'patient');
  const [medicalFilter, setMedicalFilter] = useState<'all' | '30days' | '1year' | 'imaging' | 'lab' | 'medication' | 'relevant_changes' | 'pending'>('all');
  const [patientFilter, setPatientFilter] = useState<'all' | 'consultations' | 'exams' | 'medications' | 'next_steps'>('all');
  const [localEvents, setLocalEvents] = useState<ClinicalTimelineEvent[]>(events);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // PATIENT VOICE DICTATION STATE
  const [isRecordingDictation, setIsRecordingDictation] = useState(false);
  const [patientVoiceText, setPatientVoiceText] = useState('Hoje pela manhã senti uma leve tontura ao me levantar, verifiquei minha pressão arterial que deu 138x88 mmHg. Tomei meu remédio Enalapril às 08:00 com água e me sinto bem agora.');
  const [isStructuringPatientVoice, setIsStructuringPatientVoice] = useState(false);

  const handleToggleValidation = (eventId: string) => {
    setLocalEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          visibilityToPatient: 'visible' as const,
          validatedBy: 'Dr. Roberto Mendes',
          validatedAt: new Date().toISOString()
        };
      }
      return e;
    }));

    if (onValidateEventForPatient) onValidateEventForPatient(eventId);
    setToastMessage('Evento validado e liberado para visualização no aplicativo do paciente!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // PATIENT SPEECH-TO-TEXT VOICE DICTATION HANDLER
  const handleTogglePatientDictation = () => {
    if (isRecordingDictation) {
      setIsRecordingDictation(false);
      return;
    }
    setIsRecordingDictation(true);
    setTimeout(() => {
      setIsRecordingDictation(false);
    }, 3000);
  };

  // AI PATIENT VOICE RECORDING STRUCTURING INTO FHIR TIMELINE
  const handleSavePatientVoiceToTimeline = () => {
    if (!patientVoiceText.trim()) return;
    setIsStructuringPatientVoice(true);

    setTimeout(() => {
      const newVoiceEvent: ClinicalTimelineEvent = {
        id: `evt_voice_${Date.now()}`,
        patientId: profile.id,
        tenantId: 'tenant_healthhub_sp',
        eventType: 'consultation',
        eventDate: new Date().toLocaleDateString('pt-BR'),
        title: '🎙️ Ditado por Voz do Paciente: Relato de Sintomas',
        professionalSummary: `Relato do Paciente via Ditado por Voz: "${patientVoiceText}"`,
        patientSummary: `Você gravou por voz: "${patientVoiceText}"`,
        sourceSystem: 'HealthHub Voice Dictation App',
        clinicalStatus: 'confirmed',
        priority: 'medium',
        visibilityToPatient: 'visible',
        trendDirection: 'stable',
        createdAt: new Date().toISOString()
      };

      setLocalEvents([newVoiceEvent, ...localEvents]);
      setIsStructuringPatientVoice(false);
      setToastMessage('Relato por voz gravado e adicionado à sua Linha do Tempo de Saúde!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 1000);
  };

  // FILTERED EVENTS FOR DOCTOR VIEW
  const filteredDoctorEvents = localEvents.filter(evt => {
    if (medicalFilter === '30days') {
      const evtDate = new Date(evt.eventDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return evtDate >= thirtyDaysAgo;
    }
    if (medicalFilter === '1year') {
      const evtDate = new Date(evt.eventDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return evtDate >= oneYearAgo;
    }
    if (medicalFilter === 'imaging') return evt.eventType === 'imaging';
    if (medicalFilter === 'lab') return evt.eventType === 'lab_test';
    if (medicalFilter === 'medication') return evt.eventType === 'medication';
    if (medicalFilter === 'relevant_changes') return evt.trendDirection === 'worsening' || evt.priority === 'high' || evt.priority === 'critical';
    if (medicalFilter === 'pending') return evt.visibilityToPatient === 'hidden_pending_validation';
    return true;
  });

  // FILTERED EVENTS FOR PATIENT VIEW (Hides hidden_pending_validation unless validated!)
  const patientVisibleEvents = localEvents.filter(evt => evt.visibilityToPatient === 'visible');

  const filteredPatientEvents = patientVisibleEvents.filter(evt => {
    if (patientFilter === 'consultations') return evt.eventType === 'consultation';
    if (patientFilter === 'exams') return evt.eventType === 'lab_test' || evt.eventType === 'imaging';
    if (patientFilter === 'medications') return evt.eventType === 'medication';
    return true;
  });

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
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-4 h-4" />
              <span>Jornada do Paciente • Linha do Tempo Inteligente (FHIR R4)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Histórico de Saúde do Paciente</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Eventos clínicos integrados de laboratórios, exames e relatos por voz do próprio paciente.
            </p>
          </div>
        </div>

        {/* VIEW MODE TOGGLE (Médico vs Paciente) */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setViewMode('patient')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'patient' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Visão do Paciente</span>
          </button>
          <button
            onClick={() => setViewMode('doctor')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'doctor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Visão do Médico</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PATIENT VOICE DICTATION WIDGET (DITADO POR VOZ DO PACIENTE)            */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                🎙️ Ditado por Voz do Paciente (Diário de Sintomas por Áudio)
              </h3>
              <p className="text-xs text-slate-300">
                Fale como você está se sentindo hoje. A IA converte sua voz em registros de saúde para seu médico acompanhar!
              </p>
            </div>
          </div>

          <button
            onClick={handleTogglePatientDictation}
            className={`py-3 px-5 rounded-2xl font-black text-xs flex items-center space-x-2 transition-all cursor-pointer ${
              isRecordingDictation ? 'bg-rose-600 text-white animate-pulse' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
            }`}
          >
            {isRecordingDictation ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isRecordingDictation ? '🔴 Gravando sua voz...' : '🎙️ Falar Meus Sintomas por Voz'}</span>
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={patientVoiceText}
            onChange={(e) => setPatientVoiceText(e.target.value)}
            placeholder="Digite ou fale como está se sentindo..."
            className="w-full p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-cyan-500"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSavePatientVoiceToTimeline}
              disabled={isStructuringPatientVoice || !patientVoiceText.trim()}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isStructuringPatientVoice ? 'Gravando no Prontuário...' : 'Gravar Relato por Voz na Linha do Tempo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TIMELINE EVENTS DISPLAY                                                */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        
        {/* VIEW HEADER & FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            {viewMode === 'patient' ? 'Sua Linha do Tempo de Saúde' : 'Prontuário Médico & Curadoria Clinica'}
          </h3>

          {viewMode === 'patient' ? (
            <div className="flex space-x-1 text-xs bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPatientFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold ${patientFilter === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setPatientFilter('consultations')}
                className={`px-3 py-1.5 rounded-lg font-bold ${patientFilter === 'consultations' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Consultas
              </button>
              <button
                onClick={() => setPatientFilter('exams')}
                className={`px-3 py-1.5 rounded-lg font-bold ${patientFilter === 'exams' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                Exames
              </button>
            </div>
          ) : (
            <div className="flex space-x-1 text-xs bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setMedicalFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold ${medicalFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Todos ({localEvents.length})
              </button>
              <button
                onClick={() => setMedicalFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-bold ${medicalFilter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Pendentes de Curadoria ({localEvents.filter(e => e.visibilityToPatient === 'hidden_pending_validation').length})
              </button>
            </div>
          )}
        </div>

        {/* EVENTS LIST */}
        <div className="space-y-4">
          {(viewMode === 'patient' ? filteredPatientEvents : filteredDoctorEvents).map((evt) => (
            <div
              key={evt.id}
              className={`glass-card rounded-2xl p-5 border transition-all space-y-3 ${
                evt.visibilityToPatient === 'hidden_pending_validation'
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-xs">
                    {evt.eventDate}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">{evt.title}</h4>
                    <p className="text-xs text-slate-400">Origem: <strong className="text-slate-300">{evt.sourceSystem}</strong></p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {evt.visibilityToPatient === 'visible' ? (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" /> Liberado ao Paciente
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" /> Pendente de Curadoria Médica
                    </span>
                  )}
                </div>
              </div>

              {/* EVENT CONTENT ACCORDING TO VIEW MODE */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
                {viewMode === 'doctor' ? (
                  <div>
                    <span className="font-extrabold text-indigo-300 block mb-0.5">Resumo Clínico / Linguagem Médica:</span>
                    <p className="text-slate-200 leading-relaxed">{evt.professionalSummary}</p>
                  </div>
                ) : (
                  <div>
                    <span className="font-extrabold text-cyan-300 block mb-0.5">Resumo Descomplicado para Você:</span>
                    <p className="text-slate-200 leading-relaxed">{evt.patientSummary}</p>
                  </div>
                )}
              </div>

              {/* DOCTOR CURATION VALIDATION BUTTON */}
              {viewMode === 'doctor' && evt.visibilityToPatient === 'hidden_pending_validation' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleToggleValidation(evt.id)}
                    className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar & Liberar para o Aplicativo do Paciente</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
