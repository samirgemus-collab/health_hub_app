import React, { useState } from 'react';
import { 
  UserProfile, 
  VitalMetric, 
  MedicationReminder, 
  PreventiveCareRecommendation, 
  MedicalReport,
  HealthMetricIndicator,
  PersonalHealthPlanGoal,
  TrafficLightStatus
} from '../types/health';
import { 
  mock11HealthIndicators,
  mockPersonalHealthGoals,
  mockVaccinationRecords
} from '../mock/healthData';
import { VaccinationDashboardCard } from './VaccinationDashboardCard';
import { FeatureFlagsService } from '../services/featureFlagsService';
import { 
  Heart, 
  Activity, 
  Zap, 
  Moon, 
  Footprints, 
  Thermometer, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Check,
  Plus,
  HelpCircle,
  Pill,
  Syringe,
  AlertCircle,
  Info,
  Calendar,
  Scale,
  Droplet,
  Dna,
  Users
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  vitals: VitalMetric[];
  reminders: MedicationReminder[];
  onTakeMedication: (reminderId: string) => void;
  preventiveCare: PreventiveCareRecommendation[];
  reports: MedicalReport[];
  onNavigateToTab: (tab: string) => void;
  onOpenEmergencySos?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  vitals = [],
  reminders = [],
  onTakeMedication,
  preventiveCare = [],
  reports = [],
  onNavigateToTab,
  onOpenEmergencySos,
}) => {
  const [indicators, setIndicators] = useState<HealthMetricIndicator[]>(mock11HealthIndicators);
  const [goals, setGoals] = useState<PersonalHealthPlanGoal[]>(mockPersonalHealthGoals);
  const [activeFilter, setActiveFilter] = useState<'all' | 'green' | 'yellow' | 'red' | 'gray'>('all');

  const filteredIndicators = activeFilter === 'all' 
    ? indicators 
    : indicators.filter(ind => ind.status === activeFilter);

  const getStatusBadge = (status: TrafficLightStatus) => {
    switch (status) {
      case 'green':
        return {
          label: 'Dentro da Meta',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'yellow':
        return {
          label: 'Precisa de Acompanhamento',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400'
        };
      case 'red':
        return {
          label: 'Requer Avaliação Profissional',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-500 animate-pulse'
        };
      case 'gray':
      default:
        return {
          label: 'Ainda Não Cadastrado',
          bg: 'bg-slate-800/80 border-slate-700 text-slate-400',
          dot: 'bg-slate-500'
        };
    }
  };

  const handleActionToggle = (goalId: string, actionId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updatedActions = g.weeklyActions.map(act => {
        if (act.id !== actionId) return act;
        const nextCompleted = act.completedDaysThisWeek >= act.targetDaysPerWeek ? act.targetDaysPerWeek - 1 : act.completedDaysThisWeek + 1;
        return { ...act, completedDaysThisWeek: Math.max(0, nextCompleted) };
      });
      const totalTarget = updatedActions.reduce((acc, a) => acc + a.targetDaysPerWeek, 0);
      const totalDone = updatedActions.reduce((acc, a) => acc + a.completedDaysThisWeek, 0);
      const newAdherence = Math.round((totalDone / totalTarget) * 100);
      return { ...g, weeklyActions: updatedActions, adherencePercentage: newAdherence };
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. BRAND POSITIONING BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/40 shadow-2xl">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10"
          />
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Dono da Saúde • Copiloto de Saúde Preventiva</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Olá, {profile.name}!
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Sua saúde nas suas mãos, com ciência e acompanhamento profissional ao seu lado.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onOpenEmergencySos && (
            <button
              onClick={onOpenEmergencySos}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>🚨 SOS Emergência 24/7</span>
            </button>
          )}

          <button
            onClick={() => onNavigateToTab('preventive')}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ver Agente IA Preventivo</span>
          </button>
        </div>
      </div>

      {/* TELEMETRY & WEARABLES QUICK BAR */}
      <div className="p-4 bg-slate-900/90 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div>
            <span className="text-white font-extrabold block">Telemetria Ativa & Dispositivos Conectados:</span>
            <span className="text-[11px] text-slate-400">Apple Watch Series 9 (HealthKit) • Omron Evolv BLE (Anvisa) • Accu-Chek Instant BLE</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('wearables')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-slate-700 whitespace-nowrap cursor-pointer shrink-0"
        >
          Gerenciar Conexões BLE →
        </button>
      </div>

      {/* CARD DO MÓDULO MINHA VACINAÇÃO */}
      <VaccinationDashboardCard
        records={mockVaccinationRecords}
        onNavigateToModule={(initialTab) => onNavigateToTab('vaccination')}
      />

      {/* 2. PILAR 1: MEU PAINEL DE SAÚDE (SEMÁFORO CLÍNICO EM 4 CORES) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
              <span>Pilar 1</span>
              <span>•</span>
              <span>11 Indicadores Fundamentais</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Meu Painel de Saúde (Semáforo Clínico)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhamento claro do seu estado atual com linguagem segura e sem mensagens alarmistas.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({indicators.length})
            </button>
            <button
              onClick={() => setActiveFilter('green')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === 'green' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-emerald-400 hover:text-white'
              }`}
            >
              🟢 Na Meta
            </button>
            <button
              onClick={() => setActiveFilter('yellow')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === 'yellow' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-amber-300 hover:text-white'
              }`}
            >
              🟡 Acompanhar
            </button>
            <button
              onClick={() => setActiveFilter('red')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === 'red' ? 'bg-rose-600 text-white shadow-md' : 'text-rose-400 hover:text-white'
              }`}
            >
              🔴 Avaliação
            </button>
            <button
              onClick={() => setActiveFilter('gray')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === 'gray' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚪ Não Cadastrado
            </button>
          </div>
        </div>

        {/* Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndicators.map((ind) => {
            const badge = getStatusBadge(ind.status);
            return (
              <div
                key={ind.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white">{ind.title}</h3>
                      <p className="text-[11px] text-slate-400">{ind.subtitle}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center space-x-1.5 shrink-0 ${badge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-white">{ind.currentValue}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Meta: {ind.targetRange}</span>
                  </div>

                  {/* Reassurance Message */}
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/60 text-xs text-slate-300 leading-relaxed flex items-start space-x-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[11px]">{ind.reassuranceMessage}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-3">
                  <span>Atualizado: {ind.lastUpdated}</span>
                  <button
                    onClick={() => onNavigateToTab('jornada_timeline')}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Ver Trajetória →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PILAR 4: PLANO PESSOAL DE SAÚDE */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 bg-slate-950/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-teal-400 uppercase tracking-widest">
              <span>Pilar 4</span>
              <span>•</span>
              <span>Ações Monitoráveis Sem Punição</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Meu Plano Pessoal de Saúde
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha seus objetivos e acompanhe suas metas semanais em pequenas ações praticáveis.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>Índice Geral de Adesão: 75% (Sem Constrangimento)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                    {goal.categoryName}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1">{goal.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{goal.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-400">{goal.adherencePercentage}%</span>
                  <span className="text-[10px] text-slate-400 block">Adesão Semanal</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full" style={{ width: `${goal.adherencePercentage}%` }}></div>
              </div>

              {/* Action Checkboxes */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-300">Ações Monitoráveis da Semana:</h4>
                {goal.weeklyActions.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{act.title}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] font-bold text-teal-300">{act.completedDaysThisWeek} / {act.targetDaysPerWeek} dias</span>
                      <button
                        onClick={() => handleActionToggle(goal.id, act.id)}
                        className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          act.completedDaysThisWeek >= act.targetDaysPerWeek
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Registrar dia cumprido"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 5. NOVA ÁREA PRINCIPAL: PREVENÇÃO E SAÚDE FUTURA */}
      {FeatureFlagsService.isEnabled('FEATURE_PREVENTIVE_HEALTH') && (
        <section className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
                <span>Nova Área Principal</span>
                <span>•</span>
                <span>Prevenção e Saúde Futura</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Seu Sistema Pessoal de Prevenção e Antecipação de Riscos
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* CARD 1 — MEU CHECK-UP PREVENTIVO */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-teal-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    75% Preenchido
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">1. Meu check-up preventivo</h3>
                <p className="text-xs text-slate-300">
                  Responda algumas perguntas e descubra quais áreas da sua saúde estão em dia e quais merecem acompanhamento.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between"><span>Última atualização:</span> <strong className="text-white">Há 2 dias</strong></div>
                  <div className="flex justify-between"><span>Áreas avaliadas:</span> <strong className="text-white">7 áreas</strong></div>
                  <div className="flex justify-between"><span>Pendências:</span> <strong className="text-amber-300">2 itens</strong></div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('preventive_checkup')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Fazer Check-up →
              </button>
            </div>

            {/* CARD 2 — MEU MAPA DE SAÚDE */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-teal-500/30 transition-all bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-teal-500/10 rounded-2xl border border-teal-500/30 text-teal-400">
                    <Activity className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-teal-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    78% Completude
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">2. Meu mapa de saúde</h3>
                <p className="text-xs text-slate-300">
                  Visualize seus principais fatores de proteção, riscos modificáveis e informações que ainda precisam ser completadas.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between"><span>Áreas em dia:</span> <strong className="text-emerald-400">8 de 13 áreas</strong></div>
                  <div className="flex justify-between"><span>Merecem atenção:</span> <strong className="text-amber-300">3 áreas</strong></div>
                  <div className="flex justify-between"><span>Avaliação recomendada:</span> <strong className="text-cyan-300">1 área</strong></div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('health_map')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-teal-500/20"
              >
                Ver Mapa →
              </button>
            </div>

            {/* CARD 3 — MINHA AGENDA PREVENTIVA */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    3 Ações Pendentes
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">3. Minha agenda preventiva</h3>
                <p className="text-xs text-slate-300">
                  Acompanhe vacinas, exames, consultas, avaliações e ações preventivas recomendadas.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between"><span>Próxima ação:</span> <strong className="text-white">Perfil Lipídico (15/06)</strong></div>
                  <div className="flex justify-between"><span>Agendadas:</span> <strong className="text-teal-300">2 ações agendadas</strong></div>
                  <div className="flex justify-between"><span>Concluídas este mês:</span> <strong className="text-emerald-400">1 ação</strong></div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('preventive_agenda')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Abrir Agenda →
              </button>
            </div>

            {/* CARD 4 — TENDÊNCIAS DA MINHA SAÚDE (PROTEGIDO POR FEATURE FLAG) */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between opacity-80 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-purple-500/10 rounded-2xl border border-purple-500/30 text-purple-400">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-500/30">
                    Fase Futura / Flag Off
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">4. Tendências da minha saúde</h3>
                <p className="text-xs text-slate-300">
                  Acompanhe mudanças de pressão, peso, glicemia, sono, atividade física e outros indicadores ao longo do tempo.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between"><span>Estado:</span> <strong className="text-slate-400">Dados Insuficientes</strong></div>
                  <div className="flex justify-between"><span>Indicadores:</span> <strong className="text-slate-400">PA, Peso, Glicemia, SpO2</strong></div>
                </div>
              </div>

              <button
                disabled
                className="w-full py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
              >
                Ver Tendências (Em Breve)
              </button>
            </div>

            {/* CARD 5 — HISTÓRICO FAMILIAR */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-indigo-500/30 transition-all bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 text-indigo-400">
                    <Users className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-indigo-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    2 Condições
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">5. Histórico familiar</h3>
                <p className="text-xs text-slate-300">
                  Registre condições relevantes da sua família para tornar seu acompanhamento mais personalizado.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
                  <div>Mãe (Hipertensão) • Avó Materna (Diabetes T2)</div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('family_history')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-500/20"
              >
                Adicionar Histórico Familiar →
              </button>
            </div>

            {/* CARD 6 — MEU PLANO DE PREVENÇÃO */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-amber-500/30 transition-all bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    60% Progresso Semanal
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">6. Meu plano de prevenção</h3>
                <p className="text-xs text-slate-300">
                  Transforme seus objetivos de saúde em pequenas ações semanais monitoráveis.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between"><span>Tarefas da semana:</span> <strong className="text-white">3 de 5 concluídas</strong></div>
                  <div className="flex justify-between"><span>Próxima revisão:</span> <strong className="text-amber-300">Segunda-feira</strong></div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('preventive_plan')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-teal-400 hover:from-amber-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-500/20"
              >
                Ver Plano →
              </button>
            </div>

          </div>
        </section>
      )}

      {/* 4. SUPERVISION & COPILOT DISCLAIMER BANNER */}
      <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0" />
          <p>
            <strong className="text-white">Seu Copiloto de Saúde:</strong> Esta plataforma não substitui a avaliação médica presencial. Em caso de dor torácica, falta de ar súbita ou urgência, procure um serviço de emergência imediatamente.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('risk_calculators')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 whitespace-nowrap cursor-pointer"
        >
          Consultar Calculadoras Validadas →
        </button>
      </div>

    </div>
  );
};
