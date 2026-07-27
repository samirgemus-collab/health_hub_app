import React, { useState } from 'react';
import { UserProfile, PreventiveCareRecommendation, BiologicalSex } from '../types/health';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  BookOpen, 
  RefreshCw,
  User,
  HeartPulse,
  AlertTriangle,
  ArrowUpRight,
  MessageCircle,
  Mail,
  MessageSquare,
  Send,
  CheckSquare,
  Square,
  ExternalLink
} from 'lucide-react';

interface PreventiveCareAgentProps {
  profile: UserProfile;
  recommendations: PreventiveCareRecommendation[];
  onScheduleReminder: (rec: PreventiveCareRecommendation) => void;
}

const defaultPreventiveCatalog: PreventiveCareRecommendation[] = [
  {
    id: 'prev_cat_01',
    category: 'cancer_screening',
    title: 'Mamografia Bilateral de Rastreamento',
    description: 'Exame de imagem essencial para rastreamento precoce de nódulos mamários.',
    targetSex: 'female',
    minAge: 40,
    maxAge: 75,
    frequencyYears: 'A cada 2 anos',
    recommendedDate: '2026-08-15',
    status: 'pending',
    clinicalGuideline: 'Diretrizes INCA / SBM / Febrasgo',
    importance: 'critical'
  },
  {
    id: 'prev_cat_02',
    category: 'cancer_screening',
    title: 'Exame Citopatológico (Papanicolau / Colo do Útero)',
    description: 'Prevenção e detecção precoce de lesões precursoras no colo uterino.',
    targetSex: 'female',
    minAge: 25,
    maxAge: 64,
    frequencyYears: 'A cada 3 anos',
    recommendedDate: '2026-09-10',
    status: 'up_to_date',
    clinicalGuideline: 'Diretriz Ministério da Saúde / Febrasgo',
    importance: 'recommended'
  },
  {
    id: 'prev_cat_03',
    category: 'cancer_screening',
    title: 'Avaliação Urológica & Dosagem de PSA Livre/Total',
    description: 'Rastreamento preventivo da próstata e saúde do aparelho urinário masculino.',
    targetSex: 'male',
    minAge: 45,
    maxAge: 75,
    frequencyYears: 'Anual',
    recommendedDate: '2026-08-20',
    status: 'pending',
    clinicalGuideline: 'Diretrizes da Sociedade Brasileira de Urologia (SBU)',
    importance: 'critical'
  },
  {
    id: 'prev_cat_04',
    category: 'cardiovascular',
    title: 'Mapeamento de Risco Cardiovascular & Eletrocardiograma',
    description: 'Avaliação de ritmo cardíaco e estratificação do risco de infarto / AVC.',
    targetSex: 'both',
    minAge: 35,
    maxAge: 85,
    frequencyYears: 'Anual',
    recommendedDate: '2026-07-30',
    status: 'up_to_date',
    clinicalGuideline: 'Sociedade Brasileira de Cardiologia (SBC)',
    importance: 'recommended'
  },
  {
    id: 'prev_cat_05',
    category: 'metabolic',
    title: 'Perfil Lipídico Completo & Hemoglobina Glicada (HbA1c)',
    description: 'Rastreio precoce de dislipidemia (colesterol LDL) e diabetes tipo 2.',
    targetSex: 'both',
    minAge: 18,
    maxAge: 90,
    frequencyYears: 'Anual',
    recommendedDate: '2026-08-01',
    status: 'up_to_date',
    clinicalGuideline: 'Sociedade Brasileira de Diabetes (SBD / SBC)',
    importance: 'recommended'
  },
  {
    id: 'prev_cat_06',
    category: 'cancer_screening',
    title: 'Colonoscopia de Rastreamento (Câncer Colorretal)',
    description: 'Rastreamento e remoção preventiva de pólipos no trato gastrointestinal.',
    targetSex: 'both',
    minAge: 45,
    maxAge: 75,
    frequencyYears: 'A cada 5 anos',
    recommendedDate: '2026-11-10',
    status: 'pending',
    clinicalGuideline: 'Sociedade Brasileira de Coloproctologia / USPSTF',
    importance: 'critical'
  },
  {
    id: 'prev_cat_07',
    category: 'bone',
    title: 'Densitometria Óssea (Rastreio de Osteopenia / Osteoporose)',
    description: 'Avaliação da densidade mineral óssea e risco de fraturas por fragilidade.',
    targetSex: 'female',
    minAge: 50,
    maxAge: 85,
    frequencyYears: 'A cada 2 anos',
    recommendedDate: '2026-10-05',
    status: 'pending',
    clinicalGuideline: 'Associação Brasileira de Avaliação Óssea (ABRASSO)',
    importance: 'recommended'
  }
];

export const PreventiveCareAgent: React.FC<PreventiveCareAgentProps> = ({
  profile,
  recommendations = [],
  onScheduleReminder,
}) => {
  const [selectedSexFilter, setSelectedSexFilter] = useState<BiologicalSex>(profile.sex);
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<number>(profile.age);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // SELECTION & MULTI-CHANNEL DISPATCHER STATE
  const [selectedExamIds, setSelectedExamIds] = useState<string[]>([]);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [activeDispatchChannel, setActiveDispatchChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState<string | null>(null);

  // Combine user recommendations with default catalog so the plan NEVER shows empty!
  const allAvailable = recommendations.length > 0 ? [...recommendations, ...defaultPreventiveCatalog] : defaultPreventiveCatalog;

  // Filter unique items matching sex & age
  const activeRecommendations = allAvailable.filter((rec, index, self) => {
    const isFirst = self.findIndex(t => t.title === rec.title) === index;
    const matchesSex = rec.targetSex === 'both' || rec.targetSex === selectedSexFilter;
    const matchesAge = selectedAgeFilter >= rec.minAge && (!rec.maxAge || selectedAgeFilter <= rec.maxAge);
    return isFirst && matchesSex && matchesAge;
  });

  const selectedRecommendations = activeRecommendations.filter(r => selectedExamIds.includes(r.id));

  const handleToggleSelectAll = () => {
    if (selectedExamIds.length === activeRecommendations.length) {
      setSelectedExamIds([]);
    } else {
      setSelectedExamIds(activeRecommendations.map(r => r.id));
    }
  };

  const handleToggleSelectExam = (id: string) => {
    if (selectedExamIds.includes(id)) {
      setSelectedExamIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedExamIds(prev => [...prev, id]);
    }
  };

  const handleSimulateRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  // Generate formatted message for selected exams
  const examTitlesList = selectedRecommendations.length > 0 
    ? selectedRecommendations.map(r => `• ${r.title} (${r.clinicalGuideline})`).join('\n')
    : `• ${activeRecommendations[0]?.title || 'Mamografia Bilateral'} (${activeRecommendations[0]?.clinicalGuideline || 'INCA/SBM'})`;

  const formattedMessage = `Olá ${profile.name}!\n\nDe acordo com as diretrizes clínicas oficiais do Ministério da Saúde / SUS, está no momento de realizar os seus exames preventivos de rastreamento:\n\n${examTitlesList}\n\n👉 Acesse a Central de Marcação para confirmar a data e local: https://healthhub.ai/agendar-exame?paciente=${profile.id}`;

  const handleSendWhatsApp = () => {
    const encodedText = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    setDispatchSuccessToast('Lembrete enviado via WhatsApp Direct com sucesso!');
    setShowDispatchModal(false);
    setTimeout(() => setDispatchSuccessToast(null), 4000);
  };

  const handleSendSMS = () => {
    const encodedText = encodeURIComponent(formattedMessage);
    const smsUrl = `sms:?body=${encodedText}`;
    window.open(smsUrl, '_blank');
    setDispatchSuccessToast('Lembrete enviado via SMS com sucesso!');
    setShowDispatchModal(false);
    setTimeout(() => setDispatchSuccessToast(null), 4000);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Lembrete Preventivo HealthHub: Hora de agendar seus exames`);
    const body = encodeURIComponent(formattedMessage);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
    setDispatchSuccessToast('Lembrete enviado por E-mail com sucesso!');
    setShowDispatchModal(false);
    setTimeout(() => setDispatchSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {dispatchSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{dispatchSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/20">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
            <span>Agente Preditivo IA • Diretrizes SUS / USPSTF / SBC / SBM / INCA / SBU</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Plano de Consultas & Exames Preventivos
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Rastreamento personalizado de câncer, risco cardiovascular e alterações metabólicas elaborado para <span className="text-white font-bold">{profile.name}</span> ({selectedAgeFilter} anos • {selectedSexFilter === 'female' ? 'Sexo Biológico Feminino' : 'Sexo Biológico Masculino'}).
          </p>
        </div>

        {/* Profile Age/Sex Dynamic Simulator */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 shrink-0">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Simulador Dinâmico de Plano por Idade / Sexo:
          </p>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => { setSelectedSexFilter('female'); handleSimulateRegenerate(); }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedSexFilter === 'female' ? 'bg-rose-500 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Feminino
              </button>
              <button
                onClick={() => { setSelectedSexFilter('male'); handleSimulateRegenerate(); }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedSexFilter === 'male' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Masculino
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-white">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>Idade:</span>
              <input
                type="number"
                min={18}
                max={90}
                value={selectedAgeFilter}
                onChange={(e) => { setSelectedAgeFilter(Number(e.target.value)); handleSimulateRegenerate(); }}
                className="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center font-bold text-teal-300 focus:outline-none"
              />
              <span>anos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Diretrizes Clínicas Oficiais</h4>
            <p className="text-[11px] text-slate-400">Ministério da Saúde (SUS), SBM, SBU, SBC, USPSTF</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Prevenção Preditiva</h4>
            <p className="text-[11px] text-slate-400">Detecção precoce antes do surgimento de sintomas</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Cronograma Inteligente</h4>
            <p className="text-[11px] text-slate-400">Lembretes automáticos por WhatsApp / SMS / E-mail</p>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS LIST WITH SELECTION & MULTI-CHANNEL DISPATCH BUTTON */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              Recomendações de Rastreamento ({activeRecommendations.length} Exames/Consultas Ativas)
            </h3>
            <p className="text-xs text-slate-400">
              Marque os exames desejados para disparar o lembrete de marcação por WhatsApp, SMS ou E-mail.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleToggleSelectAll}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              {selectedExamIds.length === activeRecommendations.length ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>{selectedExamIds.length === activeRecommendations.length ? 'Desmarcar Todos' : 'Selecionar Todos'}</span>
            </button>

            <button
              onClick={() => setShowDispatchModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>Enviar Lembrete de Agendamento ({selectedExamIds.length || activeRecommendations.length})</span>
            </button>
          </div>
        </div>

        {/* CARDS LIST WITH SELECTION CHECKBOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeRecommendations.map((rec) => {
            const isCritical = rec.importance === 'critical';
            const isSelected = selectedExamIds.includes(rec.id);

            return (
              <div
                key={rec.id}
                onClick={() => handleToggleSelectExam(rec.id)}
                className={`glass-card rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 cursor-pointer relative ${
                  isSelected 
                    ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/50' 
                    : isCritical 
                    ? 'border-rose-500/40 bg-rose-950/10' 
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 text-emerald-400">
                        {isSelected ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                        isCritical 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                          : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                      }`}>
                        {isCritical ? 'Alta Relevância' : 'Recomendado'}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-semibold">
                      Frequência: {rec.frequencyYears}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white leading-snug">{rec.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Diretriz Clínica:</span>
                    <span className="font-bold text-slate-200 text-[11px]">{rec.clinicalGuideline}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelectExam(rec.id);
                      setShowDispatchModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
                    <span>Disparar Aviso</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MULTI-CHANNEL DISPATCH MODAL (WHATSAPP, SMS, EMAIL) */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-500/50 space-y-5 animate-scaleUp text-left shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-base">
                <Send className="w-5 h-5 text-emerald-400" />
                <span>Enviar Lembrete de Agendamento por Diretrizes</span>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Selecione o canal de transmissão para enviar o aviso de marcação de exames para <strong className="text-white">{profile.name}</strong>:
            </p>

            {/* CHANNEL TABS */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveDispatchChannel('whatsapp')}
                className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
                  activeDispatchChannel === 'whatsapp' 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveDispatchChannel('sms')}
                className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
                  activeDispatchChannel === 'sms' 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>SMS</span>
              </button>

              <button
                onClick={() => setActiveDispatchChannel('email')}
                className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
                  activeDispatchChannel === 'email' 
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>E-mail</span>
              </button>
            </div>

            {/* PREVIEW OF FORMATTED MESSAGE */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Prévia da Mensagem Formata (Diretriz SUS / INCA / SBC):
              </span>
              <pre className="text-[11px] text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {formattedMessage}
              </pre>
            </div>

            {/* CHANNEL ACTION BUTTONS */}
            <div className="pt-2">
              {activeDispatchChannel === 'whatsapp' && (
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Agora pelo WhatsApp Direct</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {activeDispatchChannel === 'sms' && (
                <button
                  onClick={handleSendSMS}
                  className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar Agora via SMS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {activeDispatchChannel === 'email' && (
                <button
                  onClick={handleSendEmail}
                  className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar Agora por E-mail</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
