import React, { useState } from 'react';
import { UserProfile, DoctorProfile, TeamMemberProfile } from '../types/health';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Stethoscope, 
  Building2, 
  HeartPulse, 
  Droplet, 
  Calendar, 
  Clock, 
  UserCheck, 
  FileText, 
  ExternalLink,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';

interface PopulationHealthCoordinatorProps {
  patients: UserProfile[];
  doctors: DoctorProfile[];
  teamMembers: TeamMemberProfile[];
}

type PopulationCohort = 'all' | 'uncontrolled_diabetics' | 'unfollowed_hypertensives' | 'high_cv_risk' | 'incidental_findings' | 'overdue_returns';

export const PopulationHealthCoordinator: React.FC<PopulationHealthCoordinatorProps> = ({
  patients = [],
  doctors = [],
  teamMembers = [],
}) => {
  const [selectedCohort, setSelectedCohort] = useState<PopulationCohort>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // DETECTOR DE TENDÊNCIAS LONGITUDINAIS (Módulo C)
  const longitudinalTrends = [
    {
      id: 'trend_01',
      patientId: 'user_maria_01',
      patientName: 'Maria Silva',
      metricName: 'Creatinina Sérica & eGFR',
      trendType: 'worsening',
      historicalValues: '1,0 mg/dL (Mar/25) → 1,2 mg/dL (Nov/25) → 1,5 mg/dL (Jul/26)',
      findingText: 'Tendência de piora da função renal identificada em 14 meses (+0.5 mg/dL).',
      recommendation: 'Solicitar Razão Albumina/Creatinina Urinária e parecer com Nefrologia.',
      severity: 'high'
    },
    {
      id: 'trend_02',
      patientId: 'user_maria_01',
      patientName: 'Maria Silva',
      metricName: 'Hemoglobina Glicada (HbA1c)',
      trendType: 'worsening',
      historicalValues: '5,9% (Mar/25) → 6,2% (Jul/25) → 6,6% (Dez/25)',
      findingText: 'Aumento progressivo da glicemia de controle nos últimos 9 meses.',
      recommendation: 'Ajuste posológico de hipoglicemiantes e consulta nutricional.',
      severity: 'high'
    },
    {
      id: 'trend_03',
      patientId: 'user_maria_01',
      patientName: 'Maria Silva',
      metricName: 'Nódulo Pulmonar Sólido (TAC Tórax)',
      trendType: 'worsening',
      historicalValues: '6 mm (Jul/25) → 8 mm (Jul/26)',
      findingText: 'Crescimento de lesão nodular no lobo superior direito (+2 mm em 12 meses).',
      recommendation: 'Exame de controle tomográfico prioritário em 6 meses ou PET-CT.',
      severity: 'critical'
    },
    {
      id: 'trend_04',
      patientId: 'user_carlos_02',
      patientName: 'Carlos Oliveira',
      metricName: 'Pressão Arterial Repouso (Wearables)',
      trendType: 'worsening',
      historicalValues: '128x82 mmHg (Jan) → 136x86 mmHg (Mai) → 144x92 mmHg (Jul)',
      findingText: 'Piora progressiva da pressão arterial com 3 medições acima da meta.',
      recommendation: 'Revisão da adesão ao anti-hipertensivo pelo ACS.',
      severity: 'medium'
    }
  ];

  // ALERTAS PREVENTIVOS INTELIGENTES (Módulo D)
  const preventiveCareGaps = [
    {
      id: 'gap_01',
      patientName: 'Maria Silva',
      alertTitle: 'Paciente diabético sem avaliação renal há 12 meses',
      category: 'Avaliação Renal (KDIGO)',
      actionText: 'Convocar para coleta de Creatinina e Albuminúria',
      urgency: 'high'
    },
    {
      id: 'gap_02',
      patientName: 'Maria Silva',
      alertTitle: 'Nódulo pulmonar sem controle registrado há 12 meses',
      category: 'Controle de Imagem (RIS)',
      actionText: 'Agendar Tomografia de Tórax de acompanhamento',
      urgency: 'critical'
    },
    {
      id: 'gap_03',
      patientName: 'Carlos Oliveira',
      alertTitle: 'Mamografia ou Avaliação Urológica/PSA atrasada',
      category: 'Diretriz de Rastreamento (SBU)',
      actionText: 'Enviar lembrete de agendamento por WhatsApp Direct',
      urgency: 'high'
    },
    {
      id: 'gap_04',
      patientName: 'Carlos Oliveira',
      alertTitle: 'Exame recomendou controle, mas não há agendamento futuro',
      category: 'Absenteísmo de Retorno',
      actionText: 'Acionar busca ativa pelo Agente Comunitário de Saúde (ACS)',
      urgency: 'medium'
    }
  ];

  // GESTÃO POPULACIONAL COHORT POPULATION (Módulo E)
  const populationCohortsData = [
    {
      id: 'coh_01',
      cohortType: 'uncontrolled_diabetics',
      title: 'Diabéticos Descompensados (HbA1c > 8.0%)',
      count: 14,
      riskLevel: 'Risco Crítico Metabólico',
      color: 'text-rose-400',
      border: 'border-rose-500/40 bg-rose-950/10',
      description: 'Pacientes com controle glicêmico inadequado nos últimos 6 meses exigindo revisão nutricional e medicamentosa.'
    },
    {
      id: 'coh_02',
      cohortType: 'unfollowed_hypertensives',
      title: 'Hipertensos sem Acompanhamento (> 90 dias)',
      count: 28,
      riskLevel: 'Risco de Evento Cardiovascular',
      color: 'text-amber-400',
      border: 'border-amber-500/40 bg-amber-950/10',
      description: 'Pacientes com HAS sem consulta presencial ou medição de PA registrada nos últimos 3 meses.'
    },
    {
      id: 'coh_03',
      cohortType: 'high_cv_risk',
      title: 'Alto Risco Cardiovascular (PREVENT > 10%)',
      count: 19,
      riskLevel: 'Estratificação Elevada',
      color: 'text-purple-400',
      border: 'border-purple-500/40 bg-purple-950/10',
      description: 'Pacientes elegíveis para estatinas de alta potência e acompanhamento multidisciplinar contínuo.'
    },
    {
      id: 'coh_04',
      cohortType: 'incidental_findings',
      title: 'Pacientes com Achados Incidentais em Imagem',
      count: 7,
      riskLevel: 'Seguimento de Laudo Obrigatório',
      color: 'text-cyan-400',
      border: 'border-cyan-500/40 bg-cyan-950/10',
      description: 'Achados de nódulos, pólipos ou cistos em ultrassom/tomografia aguardando controle periódico.'
    },
    {
      id: 'coh_05',
      cohortType: 'overdue_returns',
      title: 'Pessoas sem Retorno Pós-Diagnóstico Relevante',
      count: 11,
      riskLevel: 'Absenteísmo de Acompanhamento',
      color: 'text-teal-400',
      border: 'border-teal-500/40 bg-teal-950/10',
      description: 'Pacientes que receberam laudo de alerta mas não agendaram consulta de retorno com o médico.'
    },
    {
      id: 'coh_06',
      cohortType: 'epidemiological_smoking',
      title: 'Filtro Epidemiológico: Tabagistas Ativos ou Pregressos',
      count: 8,
      riskLevel: 'Risco Pulmonar & Oncologia',
      color: 'text-orange-400',
      border: 'border-orange-500/40 bg-orange-950/10',
      description: 'Elegíveis para tomografia de tórax de baixa dosagem (rastreio de câncer de pulmão SBPT/INCA).'
    },
    {
      id: 'coh_07',
      cohortType: 'epidemiological_elderly',
      title: 'Filtro Epidemiológico: Idosos Frágeis (Idade ≥ 65 anos)',
      count: 16,
      riskLevel: 'Prevenção de Quedas & Osteoporose',
      color: 'text-indigo-400',
      border: 'border-indigo-500/40 bg-indigo-950/10',
      description: 'Avaliação multidimensional de quedas, densitometria óssea FRAX e rastreio de sarcopenia.'
    }
  ];

  const handleTriggerCohortOutreach = (cohortTitle: string) => {
    setToastMessage(`Disparada convocação por WhatsApp para os pacientes do grupo: ${cohortTitle}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/30 text-teal-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Building2 className="w-4 h-4" />
              <span>Painel de Saúde Populacional & Coordenação Ativa do Cuidado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Gestão Populacional & Tendências Clínicas</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
              Transformando a clínica em uma ferramenta de coordenação pró-ativa. Monitoramento de grupos de risco, detecção de variações e eliminação de lacunas de cuidado.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shrink-0 text-xs">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <div>
            <p className="font-bold text-white">Prontuário Populacional FHIR</p>
            <p className="text-[11px] text-slate-400">Coordenação Pró-Ativa de Grupos</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE E: POPULATION HEALTH COHORTS DASHBOARD                             */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              Grupos Populacionais de Risco na Clínica / UBS (Painel E)
            </h3>
            <p className="text-xs text-slate-400">
              Visualização agregada de pacientes por condição clínica para busca ativa e prevenção de agravos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {populationCohortsData.map((coh) => (
            <div key={coh.id} className={`glass-card rounded-2xl p-5 border ${coh.border} space-y-3 flex flex-col justify-between text-xs`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-black ${coh.color}`}>{coh.count} Pacientes</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 uppercase border border-slate-800">
                    {coh.riskLevel}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white">{coh.title}</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">{coh.description}</p>
              </div>

              <button
                onClick={() => handleTriggerCohortOutreach(coh.title)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs border border-slate-800 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Disparar Convocação / Busca Ativa</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMNS: DETECTOR DE TENDÊNCIAS (MODULE C) VS ALERTAS PREVENTIVOS (MODULE D) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MODULE C: LONGITUDINAL TREND DETECTOR */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-400" />
                Detector de Tendências Clínicas Longitudinais (Painel C)
              </h3>
              <p className="text-xs text-slate-400">
                Análise preditiva temporal: identifica desvios acumulados ao longo dos meses.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {longitudinalTrends.map((trend) => (
              <div key={trend.id} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">{trend.patientName}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {trend.metricName}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                  <span className="text-slate-400 block">Evolução dos Registros:</span>
                  <p className="text-rose-300 font-bold">{trend.historicalValues}</p>
                </div>

                <p className="text-slate-200 font-semibold">{trend.findingText}</p>
                <p className="text-[11px] text-teal-300 font-bold">Conduta Sugerida: {trend.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MODULE D: ACTIONABLE PREVENTIVE CARE GAPS ALERT */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                Alertas Preventivos de Lacunas de Cuidado (Painel D)
              </h3>
              <p className="text-xs text-slate-400">
                Pendências críticas e exames atrasados baseados em diretrizes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {preventiveCareGaps.map((gap) => (
              <div key={gap.id} className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-950/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">{gap.category}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{gap.patientName}</span>
                </div>

                <h4 className="text-sm font-extrabold text-white">{gap.alertTitle}</h4>

                <button
                  onClick={() => handleTriggerCohortOutreach(gap.alertTitle)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer mt-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{gap.actionText}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
