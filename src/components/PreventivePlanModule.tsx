import React, { useState } from 'react';
import { UserProfile, PreventivePlanTask } from '../types/health';
import { mockPreventivePlanTasks } from '../mock/healthData';
import { 
  CheckCircle2, 
  Target, 
  Calendar, 
  Sparkles, 
  Clock, 
  Check, 
  RotateCcw, 
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface PreventivePlanModuleProps {
  profile: UserProfile;
  tasks?: PreventivePlanTask[];
  onNavigateToTab?: (tab: string) => void;
}

export const PreventivePlanModule: React.FC<PreventivePlanModuleProps> = ({
  profile,
  tasks = mockPreventivePlanTasks,
  onNavigateToTab
}) => {
  const [taskList, setTaskList] = useState<PreventivePlanTask[]>(tasks);
  const [showSecondaryTasks, setShowSecondaryTasks] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Divide into Primary Priority Tasks (up to 5 max) and Secondary Tasks (> 5)
  const primaryTasks = taskList.slice(0, 5);
  const secondaryTasks = taskList.slice(5);

  const completedPrimaryCount = primaryTasks.filter(t => t.status === 'completed').length;
  const progressPercentage = Math.round((completedPrimaryCount / (primaryTasks.length || 1)) * 100);

  const handleToggleTaskStatus = (taskId: string) => {
    setTaskList(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
      const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
      return { ...t, status: nextStatus, completedAt };
    }));
    triggerToast('Progresso atualizado com sucesso! Continue no seu próprio ritmo.');
  };

  const handlePostponeTask = (taskId: string) => {
    setTaskList(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, status: 'postponed' };
    }));
    triggerToast('Tarefa reorganizada. Você pode retomá-la quando estiver pronto!');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* MODULE BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Módulo de Prevenção • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Meu Plano de Prevenção
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Transforme seus objetivos de saúde em até 5 tarefas semanais simples e acompanhe seu progresso sem sobrecarga.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab?.('health_map')}
          className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 font-extrabold text-xs flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Ver Meu Mapa de Saúde</span>
        </button>
      </div>

      {/* PROGRESSO DO PLANO SEMANAL */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Plano Semanal (Semana Atual)
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              Progresso do Plano: <span className="text-emerald-400">{completedPrimaryCount} de {primaryTasks.length} tarefas concluídas ({progressPercentage}%)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {completedPrimaryCount === primaryTasks.length
                ? 'Parabéns! Todas as tarefas prioritárias da semana foram concluídas.'
                : 'Algumas ações ficaram pendentes. Escolha uma nova data ou reorganize seu plano quando estiver pronto.'}
            </p>
          </div>

          <div className="w-full sm:w-64 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 shrink-0">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Progresso Semanal</span>
              <span className="text-emerald-400">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* NON-PUNITIVE ENCOURAGING MESSAGE */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-start space-x-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-white">Acompanhamento Flexível:</strong> Este plano foi desenhado para caber na sua rotina. Caso uma tarefa não seja realizada esta semana, você pode reagendá-la tranquilamente.
          </p>
        </div>
      </div>

      {/* TAREFAS PRIORITÁRIAS DA SEMANA (MÁXIMO DE 5) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Tarefas Prioritárias da Semana</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {primaryTasks.length} de 5 Max
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ações simples de alto impacto preventivo para a sua semana.</p>
          </div>

          <span className="text-xs text-slate-500">Próxima revisão: Segunda-feira</span>
        </div>

        <div className="space-y-4">
          {primaryTasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.status === 'completed'
                  ? 'bg-slate-950/60 border-slate-850 opacity-85'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className={`mt-0.5 p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                  title={task.status === 'completed' ? 'Desmarcar tarefa' : 'Marcar como concluída'}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                      Prioridade #{index + 1}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {task.domainTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">Responsável: {task.assignedRole}</span>
                  </div>

                  <h4 className={`text-base font-extrabold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-300">{task.objective}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handlePostponeTask(task.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
                  >
                    Reorganizar Data
                  </button>
                )}

                <button
                  onClick={() => handleToggleTaskStatus(task.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
                  }`}
                >
                  {task.status === 'completed' ? 'Concluída ✓' : 'Concluir Tarefa'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TAREFAS SECUNDÁRIAS (SE HOUVER MAIS DE 5) */}
      {secondaryTasks.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setShowSecondaryTasks(!showSecondaryTasks)}
            className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-between cursor-pointer"
          >
            <span>Lista de Tarefas Secundárias ({secondaryTasks.length} tarefas mantidas em espera para evitar sobrecarga)</span>
            {showSecondaryTasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSecondaryTasks && (
            <div className="space-y-3 animate-fadeIn">
              {secondaryTasks.map(task => (
                <div key={task.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{task.domainTitle}</span>
                    <strong className="text-white">{task.title}</strong>
                    <p className="text-slate-400 text-[11px]">{task.objective}</p>
                  </div>
                  <button
                    onClick={() => handleToggleTaskStatus(task.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 p-4 bg-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
