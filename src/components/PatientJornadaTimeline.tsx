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
  HelpCircle
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
    if (medicalFilter === 'relevant_changes') return evt.trend === 'worsening' || evt.priority === 'high' || evt.priority === 'critical';
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

  const getEventBadge = (type: ClinicalTimelineEvent['eventType']) => {
    switch (type) {
      case 'consultation': return { label: 'Consulta Médica', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: <Stethoscope className="w-3.5 h-3.5" /> };
      case 'lab_test': return { label: 'Exame de Sangue', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: <Activity className="w-3.5 h-3.5" /> };
      case 'imaging': return { label: 'Exame de Imagem', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: <FileText className="w-3.5 h-3.5" /> };
      case 'medication': return { label: 'Medicamento', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: <Pill className="w-3.5 h-3.5" /> };
      case 'hospitalization': return { label: 'Internação', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: <Building2 className="w-3.5 h-3.5" /> };
      default: return { label: 'Evento Clínico', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: <Clock className="w-3.5 h-3.5" /> };
    }
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
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Jornada do Paciente • Linha do Tempo Única com Dupla Visualização</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Histórico Clínico Unificado & Linha do Tempo
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Registros centralizados do LIS, RIS e Prontuário FHIR com visão técnica detalhada para o médico e visão educativa simplificada para o paciente.
          </p>
        </div>

        {/* VIEW MODE TOGGLER (Doctor vs Patient) */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setViewMode('doctor')}
            className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center space-x-2 ${
              viewMode === 'doctor' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Visão Médica (Decisão Técnica)</span>
          </button>

          <button
            onClick={() => setViewMode('patient')}
            className={`px-4 py-2.5 rounded-xl font-extrabold transition-all flex items-center space-x-2 ${
              viewMode === 'patient' 
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Visão do Paciente (Simples)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DOCTOR VIEW: TECHNICAL, HIGHLIGHTS, PENDENCIES & GATEKEEPER VALIDATION */}
      {/* ========================================================================= */}
      {viewMode === 'doctor' && (
        <div className="space-y-6">
          
          {/* TOP AUTOMATED HIGHLIGHTS & SUMMARY BANNER */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 bg-slate-900/80">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
                <Zap className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>Destaques Automáticos: O que mudou desde a última consulta</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                3 Mudanças Relevantes Detectadas
              </span>
            </div>

            {/* HIGHLIGHT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-rose-500/40 space-y-1">
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>Hemoglobina Glicada (HbA1c)</span>
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-sm font-extrabold text-white">5,9% → 6,2% → 6,6%</p>
                <p className="text-[10px] text-slate-400">Tendência: Elevação progressiva nos últimos 9 meses (+0.7%).</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>Creatinina Sérica</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm font-extrabold text-white">1,1 mg/dL → 1,4 mg/dL</p>
                <p className="text-[10px] text-slate-400">Discreta redução da taxa de filtração glomerular estimada (eGFR).</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-cyan-500/40 space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>Nódulo Pulmonar Sólido (LSD)</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-sm font-extrabold text-white">6 mm (2025) → 8 mm (2026)</p>
                <p className="text-[10px] text-slate-400">Aumento dimensional relevante (+2 mm em 12 meses).</p>
              </div>
            </div>

            {/* AI SYNTHESIZED CLINICAL SUMMARY WITH DIRECT SOURCE LINKS */}
            <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Resumo Preditivo Gerado pela Plataforma HealthHub IA:</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">
                Paciente <strong className="text-white">Maria Silva (45 anos)</strong> com hipertensão e diabetes em acompanhamento. Apresenta piora progressiva do controle glicêmico e discreta redução da função renal nos últimos nove meses. Mantém pendente exame de controle pulmonar recomendado no último laudo.
              </p>
              <div className="flex items-center space-x-3 pt-1 text-[10px] text-indigo-300 font-bold">
                <span className="hover:underline cursor-pointer flex items-center gap-1">
                  [1] Ver laudo TAC Tórax (Sírio-Libanês) <ExternalLink className="w-3 h-3" />
                </span>
                <span>•</span>
                <span className="hover:underline cursor-pointer flex items-center gap-1">
                  [2] Ver exames LIS Fleury (HbA1c/Creatinina) <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

          {/* DOCTOR FILTERS SUB-BAR */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span>Filtros do Prontuário Médico:</span>
            </div>

            <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setMedicalFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Toda a Linha do Tempo
              </button>
              <button
                onClick={() => setMedicalFilter('30days')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === '30days' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Últimos 30 Dias
              </button>
              <button
                onClick={() => setMedicalFilter('1year')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === '1year' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Último Ano
              </button>
              <button
                onClick={() => setMedicalFilter('imaging')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === 'imaging' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Apenas Imagem
              </button>
              <button
                onClick={() => setMedicalFilter('lab')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === 'lab' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Apenas Laboratório
              </button>
              <button
                onClick={() => setMedicalFilter('relevant_changes')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === 'relevant_changes' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Alterações Relevantes
              </button>
              <button
                onClick={() => setMedicalFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  medicalFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Aguardando Liberação ({localEvents.filter(e => e.visibilityToPatient === 'hidden_pending_validation').length})
              </button>
            </div>
          </div>

          {/* DOCTOR TIMELINE CARDS LIST */}
          <div className="space-y-4">
            {filteredDoctorEvents.map((evt) => {
              const badge = getEventBadge(evt.eventType);
              const isPendingValidation = evt.visibilityToPatient === 'hidden_pending_validation';

              return (
                <div 
                  key={evt.id} 
                  className={`glass-card rounded-2xl p-5 border transition-all text-xs space-y-3 ${
                    isPendingValidation 
                      ? 'border-amber-500/50 bg-amber-950/10' 
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase flex items-center gap-1.5 ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="font-extrabold text-white text-sm">{evt.title}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                      <span>{evt.eventDate}</span>
                      <span>•</span>
                      <span>{evt.sourceSystem}</span>
                    </div>
                  </div>

                  {/* CLINICAL TECHNICAL SUMMARY */}
                  <div className="space-y-2">
                    <p className="text-slate-200 leading-relaxed font-sans">{evt.professionalSummary}</p>

                    {/* EVOLUTION COMPARISON BOX IF AVAILABLE */}
                    {evt.comparisons && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-amber-300 font-mono space-y-0.5">
                        <span className="font-bold text-white block">Comparação Histórica Direta:</span>
                        <p>Anterior: {evt.comparisons.previousValue} → Atual: {evt.comparisons.currentValue}</p>
                        <p className="text-slate-400">{evt.comparisons.changeDetails}</p>
                      </div>
                    )}
                  </div>

                  {/* GATEKEEPER VALIDATION BAR FOR DOCTOR */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      {isPendingValidation ? (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Aguardando Validação para Liberação ao Paciente</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Liberado no Aplicativo do Paciente</span>
                        </span>
                      )}
                    </div>

                    {isPendingValidation && (
                      <button
                        onClick={() => handleToggleValidation(evt.id)}
                        className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Validar & Liberar para o Paciente</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PATIENT VIEW: SIMPLE, EDUCATIONAL, NEXT STEPS & CURATED RELEASE       */}
      {/* ========================================================================= */}
      {viewMode === 'patient' && (
        <div className="space-y-6">
          
          {/* PATIENT FILTER SUB-BAR */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <User className="w-4 h-4 text-teal-400" />
              <span>Minha Jornada de Saúde:</span>
            </div>

            <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setPatientFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  patientFilter === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Minha Saúde
              </button>
              <button
                onClick={() => setPatientFilter('exams')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  patientFilter === 'exams' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Meus Exames
              </button>
              <button
                onClick={() => setPatientFilter('consultations')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  patientFilter === 'consultations' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Minhas Consultas
              </button>
              <button
                onClick={() => setPatientFilter('medications')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  patientFilter === 'medications' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Meus Medicamentos
              </button>
            </div>
          </div>

          {/* NEXT STEPS / PRÓXIMOS CUIDADOS CARD */}
          <div className="glass-panel rounded-3xl p-6 border border-teal-500/30 bg-teal-950/10 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              Seus Próximos Cuidados Recomendados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Realizar Exame de Sangue</h4>
                  <p className="text-[11px] text-slate-400">Até 15 de agosto de 2026</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Agendar Retorno com Cardiologista</h4>
                  <p className="text-[11px] text-slate-400">Retorno em 90 dias com Dr. Roberto</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Continuar Medicamento</h4>
                  <p className="text-[11px] text-slate-400">Enalapril 10mg conforme prescrição</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Atualizar Peso & Pressão</h4>
                  <p className="text-[11px] text-slate-400">Medição semanal no aplicativo</p>
                </div>
              </div>
            </div>
          </div>

          {/* PATIENT TIMELINE EVENTS CARDS LIST */}
          <div className="space-y-4">
            {filteredPatientEvents.map((evt) => {
              const badge = getEventBadge(evt.eventType);

              return (
                <div key={evt.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase flex items-center gap-1.5 ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="font-extrabold text-white text-sm">{evt.title}</span>
                    </div>

                    <span className="text-slate-400 font-mono text-[11px]">{evt.eventDate}</span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-sans">{evt.patientSummary}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-teal-400 font-bold">
                    <span>Instrução: Consulte as orientações do profissional responsável.</span>
                    <button className="text-slate-300 hover:text-white font-bold flex items-center gap-1">
                      <span>Ver detalhes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
