import React, { useState } from 'react';
import { 
  UserProfile, 
  VitalMetric, 
  MedicationReminder, 
  PreventiveCareRecommendation, 
  MedicalReport 
} from '../types/health';
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
  ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  vitals: VitalMetric[];
  reminders: MedicationReminder[];
  onTakeMedication: (reminderId: string) => void;
  preventiveCare: PreventiveCareRecommendation[];
  reports: MedicalReport[];
  onNavigateToTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  vitals = [],
  reminders = [],
  onTakeMedication,
  preventiveCare = [],
  reports = [],
  onNavigateToTab,
}) => {
  const [chartMetric, setChartMetric] = useState<'heart' | 'bp' | 'steps' | 'hrv'>('heart');

  // Next pending reminder
  const nextReminder = (reminders || []).find((r) => r.status === 'pending');

  // Critical preventive alert
  const criticalPreventive = (preventiveCare || []).find(
    (p) => p.status === 'overdue' || p.importance === 'critical'
  );

  // Latest report
  const latestReport = (reports || [])[0];

  const defaultVital: VitalMetric = {
    timestamp: '08:00',
    heartRateBpm: 72,
    spO2Percent: 99,
    hrvMs: 55,
    sleepHours: 7.5,
    stepsCount: 10450,
    bodyTempC: 36.5,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
  };

  const currentVital = (vitals && vitals.length > 0) ? vitals[vitals.length - 1] : defaultVital;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/40">
        <div className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10"
          />
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
              <span>Resumo do Prontuário Preditivo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Olá, {profile.name}!
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {profile.age} anos • Grupo Sanguíneo: <span className="font-bold text-teal-400">{profile.bloodType}</span> • Equipe: <span className="text-slate-200">{profile.careTeamName || 'Equipe de Atenção Primária'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('preventive')}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition-all shrink-0 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Ver Agente IA Preventivo</span>
        </button>
      </div>

      {/* Vital Metrics Quick Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Heart Rate */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold text-slate-400">Batimentos</span>
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{currentVital.heartRateBpm}</span>
            <span className="text-xs font-medium text-slate-400">BPM</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">Ritmo Sinusal Normal</p>
        </div>

        {/* SpO2 */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-semibold text-slate-400">Oxigenação SpO2</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{currentVital.spO2Percent}%</span>
            <span className="text-xs font-medium text-slate-400">Sat.</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">Ótima Ventilação</p>
        </div>

        {/* HRV */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-slate-400">VHR (Variabilidade)</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{currentVital.hrvMs}</span>
            <span className="text-xs font-medium text-slate-400">ms</span>
          </div>
          <p className="text-[10px] text-indigo-300 mt-1">Recuperação Boa</p>
        </div>

        {/* Sleep */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold text-slate-400">Sono Repousador</span>
            <Moon className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{currentVital.sleepHours}h</span>
            <span className="text-xs font-medium text-slate-400">Noite</span>
          </div>
          <p className="text-[10px] text-purple-300 mt-1">82% Sono Profundo/REM</p>
        </div>

        {/* Steps */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold text-slate-400">Passos Hoje</span>
            <Footprints className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{currentVital.stepsCount.toLocaleString()}</span>
            <span className="text-xs font-medium text-slate-400">passos</span>
          </div>
          <p className="text-[10px] text-amber-300 mt-1">Meta de 10k Atingida 🎉</p>
        </div>

        {/* Blood Pressure */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between text-teal-400">
            <span className="text-xs font-semibold text-slate-400">Pressão Arterial</span>
            <Thermometer className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-white">
              {currentVital.bloodPressureSystolic}/{currentVital.bloodPressureDiastolic}
            </span>
            <span className="text-xs font-medium text-slate-400">mmHg</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1">Normotensão</p>
        </div>

      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Medication Reminder Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-amber-400">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Próxima Medicação</h3>
              </div>
              <button 
                onClick={() => onNavigateToTab('medications')}
                className="text-xs text-amber-400 hover:underline font-medium flex items-center gap-0.5"
              >
                Ver Agenda <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextReminder ? (
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Horário: {nextReminder.scheduledTime}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-2">{nextReminder.medicationName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Dose: <span className="text-slate-200">{nextReminder.dosage}</span></p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <Clock className="w-6 h-6 text-amber-400 animate-bounce" />
                  </div>
                </div>

                <button
                  onClick={() => onTakeMedication(nextReminder.id)}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Marcar como Tomado Agora</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">Todas as doses de hoje tomadas!</p>
                <p className="text-xs text-slate-400 mt-1">Taxa de adesão do tratamento: 96%</p>
              </div>
            )}
          </div>
        </div>

        {/* Preventive AI Screening Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Alerta IA Preventivo</h3>
              </div>
              <button 
                onClick={() => onNavigateToTab('preventive')}
                className="text-xs text-rose-400 hover:underline font-medium flex items-center gap-0.5"
              >
                Ver Plano IA <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {criticalPreventive ? (
              <div className="bg-rose-950/20 rounded-2xl p-4 border border-rose-500/30">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                      {criticalPreventive.status === 'overdue' ? 'Exame em Atraso' : 'Exame de Alta Relevância'}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{criticalPreventive.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {criticalPreventive.description}
                    </p>
                    <p className="text-[11px] text-rose-400 font-medium mt-2">
                      Diretriz: {criticalPreventive.clinicalGuideline}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">Seu plano de exames está em dia!</p>
                <p className="text-xs text-slate-400 mt-1">Próximo check-up recomendado em 6 meses.</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest Gemini OCR Medical Report Summary */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-teal-400">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Último Laudo Processado</h3>
              </div>
              <button 
                onClick={() => onNavigateToTab('reports')}
                className="text-xs text-teal-400 hover:underline font-medium flex items-center gap-0.5"
              >
                Abrir Laudos <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestReport ? (
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{latestReport.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                    {latestReport.laboratory}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{latestReport.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {latestReport.extractedTextSummary || 'Sem resumo disponível'}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Achados Extraídos via OCR:</span>
                  <span className="font-bold text-emerald-400">
                    {(latestReport.aiFindings && latestReport.aiFindings.length) || 0} Parâmetros
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 text-center">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">Nenhum laudo processado</p>
                <p className="text-xs text-slate-400 mt-1">Faça o upload do seu laudo em PDF ou Imagem.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Interactive Vital Trends Chart Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Monitoramento Continuo de Bio-métricas (IoT / Wearables)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dados sincronizados em tempo real do ecossistema Apple HealthKit / Google Health Connect
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setChartMetric('heart')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMetric === 'heart' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Freq. Cardíaca
            </button>
            <button
              onClick={() => setChartMetric('bp')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMetric === 'bp' ? 'bg-teal-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pressão Arterial
            </button>
            <button
              onClick={() => setChartMetric('steps')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMetric === 'steps' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Passos
            </button>
            <button
              onClick={() => setChartMetric('hrv')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMetric === 'hrv' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              VHR
            </button>
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'heart' ? (
              <AreaChart data={vitals}>
                <defs>
                  <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="heartRateBpm" name="Frequência Cardíaca (BPM)" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorHeart)" />
              </AreaChart>
            ) : chartMetric === 'bp' ? (
              <LineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
                <YAxis domain={[60, 140]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="bloodPressureSystolic" name="Sistólica (mmHg)" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="bloodPressureDiastolic" name="Diastólica (mmHg)" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            ) : chartMetric === 'steps' ? (
              <AreaChart data={vitals}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="stepsCount" name="Passos Acumulados" stroke="#f59e0b" strokeWidth={3} fill="url(#colorSteps)" />
              </AreaChart>
            ) : (
              <LineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} />
                <YAxis domain={[30, 90]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="hrvMs" name="VHR (ms)" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
