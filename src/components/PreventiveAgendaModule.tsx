import React, { useState } from 'react';
import { 
  UserProfile, 
  PreventiveAction, 
  PreventiveActionStatus, 
  PreventiveActionPriority, 
  PreventiveActionType 
} from '../types/health';
import { mockPreventiveActions } from '../mock/healthData';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  FileText, 
  Plus, 
  Upload, 
  Share2, 
  Archive, 
  X, 
  Info,
  Stethoscope,
  Syringe,
  Activity,
  Smile,
  Eye,
  Volume2,
  Sparkles,
  Paperclip,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';

interface PreventiveAgendaModuleProps {
  profile: UserProfile;
  actions?: PreventiveAction[];
  onNavigateToTab?: (tab: string) => void;
  userRole?: string;
}

export const PreventiveAgendaModule: React.FC<PreventiveAgendaModuleProps> = ({
  profile,
  actions = mockPreventiveActions,
  onNavigateToTab,
  userRole = 'patient'
}) => {
  const [actionList, setActionList] = useState<PreventiveAction[]>(actions);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'scheduled' | 'completed' | 'archived'>('upcoming');
  const [selectedWhyAction, setSelectedWhyAction] = useState<PreventiveAction | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState<PreventiveAction | null>(null);
  const [dismissReason, setDismissReason] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState<PreventiveAction | null>(null);
  const [scheduledDateInput, setScheduledDateInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Action Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<PreventiveActionType>('consultation');
  const [newDomain, setNewDomain] = useState('Saúde Geral');
  const [newPriority, setNewPriority] = useState<PreventiveActionPriority>('routine');
  const [newExpectedDate, setNewExpectedDate] = useState('2026-07-01');
  const [newDescription, setNewDescription] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getActionIcon = (type: PreventiveActionType) => {
    switch (type) {
      case 'vaccination': return Syringe;
      case 'consultation': return Stethoscope;
      case 'laboratory_exam': return Activity;
      case 'imaging_exam': return FileText;
      case 'screening': return Activity;
      case 'dental_evaluation': return Sparkles;
      case 'vision_evaluation': return Eye;
      case 'hearing_evaluation': return Volume2;
      case 'medication_review': return Stethoscope;
      case 'nutrition_follow_up': return Activity;
      case 'physical_activity': return Activity;
      case 'mental_health_follow_up': return Smile;
      default: return Calendar;
    }
  };

  const getPriorityBadge = (priority: PreventiveActionPriority) => {
    switch (priority) {
      case 'informational':
        return { label: 'Informativo', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
      case 'routine':
        return { label: 'Rotina', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30' };
      case 'recommended':
        return { label: 'Recomendado', bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
      case 'needs_review':
        return { label: 'Precisa de Revisão', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    }
  };

  // Filter actions according to tab
  const filteredActions = actionList.filter(a => {
    if (activeTab === 'upcoming') return a.status === 'pending' || a.status === 'scheduled';
    if (activeTab === 'pending') return a.status === 'pending' || a.status === 'needs_review';
    if (activeTab === 'scheduled') return a.status === 'scheduled';
    if (activeTab === 'completed') return a.status === 'completed';
    if (activeTab === 'archived') return a.status === 'dismissed' || a.status === 'archived';
    return true;
  });

  const handleMarkCompleted = (actionId: string) => {
    setActionList(prev => prev.map(a => 
      a.id === actionId 
        ? { ...a, status: 'completed', completedAt: new Date().toISOString() } 
        : a
    ));
    triggerToast('Ação preventiva marcada como concluída com sucesso!');
  };

  const handleScheduleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScheduleModal || !scheduledDateInput) return;

    setActionList(prev => prev.map(a => 
      a.id === showScheduleModal.id 
        ? { ...a, status: 'scheduled', scheduledDate: scheduledDateInput } 
        : a
    ));
    setShowScheduleModal(null);
    setScheduledDateInput('');
    triggerToast('Ação agendada com sucesso!');
  };

  const handleDismissAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDismissModal) return;

    setActionList(prev => prev.map(a => 
      a.id === showDismissModal.id 
        ? { ...a, status: 'archived', dismissedReason: dismissReason || 'Opção informada pelo usuário' } 
        : a
    ));
    setShowDismissModal(null);
    setDismissReason('');
    triggerToast('Ação arquivada. O histórico de acompanhamento foi preservado.');
  };

  const handleCreateCustomAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Idempotency check: patientId + type + title + expectedDate
    const idempotencyKey = `${profile.id}:${newType}:${newTitle.toLowerCase().trim()}:${newExpectedDate}`;
    const duplicate = actionList.find(a => a.idempotencyKey === idempotencyKey);

    if (duplicate) {
      triggerToast('Esta ação preventiva já existe na sua agenda para esta data.');
      setShowAddModal(false);
      return;
    }

    const newAction: PreventiveAction = {
      id: `act_user_${Date.now()}`,
      patientId: profile.id,
      type: newType,
      title: newTitle,
      description: newDescription || 'Ação personalizada cadastrada pelo usuário.',
      clinicalDomain: newDomain,
      priority: newPriority,
      status: 'pending',
      expectedDate: newExpectedDate,
      sourceType: 'manual_user',
      professionalReviewRequired: false,
      validationStatus: 'unverified',
      createdBy: profile.name,
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActionList(prev => [newAction, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    triggerToast('Nova ação preventiva adicionada à sua agenda!');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* MODULE HEADER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Módulo de Prevenção • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Minha Agenda Preventiva
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Organize suas consultas, vacinas, exames, avaliações e hábitos em um calendário preventivo único.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Ação Preventiva</span>
        </button>
      </div>

      {/* TABS HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto gap-2">
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'upcoming' 
                ? 'bg-cyan-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Próximas Ações ({actionList.filter(a => a.status === 'pending' || a.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'pending' 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Pendentes ({actionList.filter(a => a.status === 'pending' || a.status === 'needs_review').length})
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'scheduled' 
                ? 'bg-teal-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Agendadas ({actionList.filter(a => a.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'completed' 
                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Concluídas ({actionList.filter(a => a.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'archived' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Arquivadas ({actionList.filter(a => a.status === 'dismissed' || a.status === 'archived').length})
          </button>
        </div>
      </div>

      {/* ACTIONS LIST GRID */}
      {filteredActions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Nenhuma ação preventiva nesta categoria</h3>
          <p className="text-xs text-slate-400">
            Suas próximas ações preventivas aparecerão aqui conforme suas informações forem atualizadas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredActions.map((act) => {
            const IconComp = getActionIcon(act.type);
            const priorityBadge = getPriorityBadge(act.priority);
            return (
              <div
                key={act.id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all bg-slate-900/90"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-cyan-400">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                          {act.clinicalDomain}
                        </span>
                        <h3 className="text-base font-black text-white mt-1">
                          {act.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${priorityBadge.bg}`}>
                      {priorityBadge.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {act.description}
                  </p>

                  {/* Professional Review Badge */}
                  {act.professionalReviewRequired && (
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 shrink-0" />
                      <span className="font-bold">Aguardando revisão profissional da equipe médica</span>
                    </div>
                  )}

                  {/* Date & Protocol Source */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Data esperada:</span>
                      <strong className="text-white">{act.expectedDate}</strong>
                    </div>
                    {act.scheduledDate && (
                      <div className="flex justify-between text-teal-300">
                        <span>Data agendada:</span>
                        <strong>{act.scheduledDate}</strong>
                      </div>
                    )}
                    {act.sourceProtocolName && (
                      <div className="flex justify-between text-[11px]">
                        <span>Protocolo:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">{act.sourceProtocolName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  
                  {/* Button: Por que isso foi recomendado? */}
                  <button
                    onClick={() => setSelectedWhyAction(act)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Por que isso foi recomendado?</span>
                  </button>

                  <div className="flex items-center justify-between gap-2">
                    {act.status !== 'completed' && (
                      <button
                        onClick={() => handleMarkCompleted(act.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Concluir</span>
                      </button>
                    )}

                    {act.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setShowScheduleModal(act);
                          setScheduledDateInput(act.scheduledDate || act.expectedDate);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{act.scheduledDate ? 'Alterar Data' : 'Agendar'}</span>
                      </button>
                    )}

                    {act.status !== 'archived' && (
                      <button
                        onClick={() => setShowDismissModal(act)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                        title="Arquivar / Não desejo realizar"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: POR QUE ISSO FOI RECOMENDADO? */}
      {selectedWhyAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>Origem e Racional da Recomendação</span>
              </div>
              <button onClick={() => setSelectedWhyAction(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-sm font-extrabold text-white">{selectedWhyAction.title}</h4>
                <p className="text-slate-300 mt-1">{selectedWhyAction.description}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocolo de Origem:</span>
                  <strong className="text-white">{selectedWhyAction.sourceProtocolName || 'Protocolo Preventivo Institucional'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sociedade Médica Emissora:</span>
                  <strong className="text-cyan-300">{selectedWhyAction.sourceProtocolOrganization || 'Sociedades Médicas de Especialidade'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Versão das Diretrizes:</span>
                  <strong className="text-teal-400">{selectedWhyAction.sourceProtocolVersion || 'v2026.1'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Informação Considerada:</span>
                  <strong className="text-emerald-400">{selectedWhyAction.clinicalDomain} • Idade {profile.age} anos</strong>
                </div>
              </div>

              {/* MANDATORY DISCLAIMER */}
              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-[11px] text-cyan-200 leading-relaxed">
                <strong>Aviso da Plataforma:</strong> Esta ação foi sugerida com base nas informações cadastradas e no protocolo preventivo vigente. Ela não substitui avaliação individualizada.
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-3">
              <button
                onClick={() => setSelectedWhyAction(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR AÇÃO PREVENTIVA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Adicionar Ação à Agenda Preventiva</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomAction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Título da Ação Preventiva</label>
                <input
                  type="text"
                  placeholder="Ex: Consulta com Dermatologista, Exame de Sangue..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Tipo de Ação</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PreventiveActionType)}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="consultation">Consulta Médica</option>
                    <option value="laboratory_exam">Exame Laboratorial</option>
                    <option value="vaccination">Vacinação</option>
                    <option value="dental_evaluation">Avaliação Odontológica</option>
                    <option value="physical_activity">Atividade Física</option>
                    <option value="custom_preventive_action">Outra Ação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Prioridade</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PreventiveActionPriority)}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="routine">Rotina</option>
                    <option value="recommended">Recomendado</option>
                    <option value="informational">Informativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Data Prevista</label>
                <input
                  type="date"
                  value={newExpectedDate}
                  onChange={(e) => setNewExpectedDate(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Descrição / Detalhes</label>
                <textarea
                  rows={2}
                  placeholder="Orientações ou lembretes adicionais..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  Adicionar Ação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGENDAR AÇÃO */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-white">Agendar ou Alterar Data</h3>
            <p className="text-xs text-slate-300">{showScheduleModal.title}</p>

            <form onSubmit={handleScheduleAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Selecione a Data Agendada</label>
                <input
                  type="date"
                  value={scheduledDateInput}
                  onChange={(e) => setScheduledDateInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ARQUIVAR / RECUSAR */}
      {showDismissModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-white">Arquivar Ação Preventiva</h3>
            <p className="text-xs text-slate-300">
              Você está arquivando <strong>{showDismissModal.title}</strong>. Seu histórico será mantido e a ação não será apagada.
            </p>

            <form onSubmit={handleDismissAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Motivo (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Já realizei em outro local, não aplicável agora..."
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDismissModal(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-700 text-white font-extrabold text-xs cursor-pointer"
                >
                  Confirmar Arquivamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 p-4 bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
