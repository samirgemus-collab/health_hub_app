import React, { useState } from 'react';
import { 
  Activity, 
  Shield, 
  Lock, 
  User, 
  Stethoscope, 
  Users, 
  Heart, 
  Pill, 
  FileText, 
  Calendar, 
  Watch, 
  Sparkles, 
  Radio, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Mic, 
  FileSignature, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Star, 
  Building2, 
  Clock, 
  Award, 
  Brain, 
  Cpu, 
  Database, 
  Check, 
  HelpCircle,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: (role?: 'patient' | 'doctor' | 'team' | 'admin') => void;
  onNavigateTab?: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPlatform,
  onNavigateTab
}) => {
  const [activeAudience, setActiveAudience] = useState<'patient' | 'doctor' | 'team' | 'admin'>('doctor');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'dictation' | 'iot' | 'risk' | 'fhir' | 'population'>('dictation');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [demoAudioRecording, setDemoAudioRecording] = useState(false);
  const [demoSoapResult, setDemoSoapResult] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleSimulateVoiceDictation = () => {
    setDemoAudioRecording(true);
    setDemoSoapResult(null);
    setTimeout(() => {
      setDemoAudioRecording(false);
      setDemoSoapResult(
        "S: Paciente refere dispneia aos médios esforços há 3 dias. Negou febre ou dor torácica.\nO: PA 128/82 mmHg, FC 74 bpm, SpO2 98% em ar ambiente. Ausculta pulmonar límpida.\nA: Hipótese de fadiga associada a estresse / sem descompensação aguda.\nP: Manter medicação habitual (Losartana 50mg/dia), solicitar ECG eletivo e reagendar retorno em 30 dias."
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 animate-fadeIn">
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-indigo-900/60 to-purple-900/60 border-b border-cyan-500/20 py-2.5 px-4 text-center text-xs font-medium text-cyan-200 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 flex-wrap gap-y-1">
          <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-300" /> Novidade v2.5
          </span>
          <span>IA Tríplice Clínico com Ditado Médico SOAP, Telemetria BLE e Interoperabilidade FHIR.</span>
          <button 
            onClick={() => onEnterPlatform('doctor')}
            className="underline font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-0.5 ml-1"
          >
            Testar Agora <ChevronRight className="w-3 h-3 inline" />
          </button>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-xl shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-xs font-bold text-slate-300 tracking-wide">
              Dono da Saúde • Plataforma de Saúde Preventiva, Preditiva & Personalizada
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Seja o dono da sua saúde, com <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">dados claros, acompanhamento profissional</span> e decisões baseadas em evidências.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Seu copiloto de saúde individual: entenda seus exames no Semáforo Clínico em 4 cores, acompanhe trajetórias longitudinais, calcule riscos com diretrizes médicas validadas e mantenha metas realistas sem cunho alarmista.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onEnterPlatform('doctor')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-base flex items-center justify-center space-x-3 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Acessar Portal Médico / Demonstração</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onEnterPlatform('patient')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-base flex items-center justify-center space-x-3 shadow-lg transition-all cursor-pointer"
            >
              <User className="w-5 h-5 text-cyan-400" />
              <span>Ver Visão do Paciente</span>
            </button>
          </div>

          {/* Key Trust Signals */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cifragem E2EE AES-256-GCM</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Validação CFM & ICP-Brasil</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Interoperabilidade FHIR & HL7</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>100% em Conformidade com LGPD</span>
            </div>
          </div>

          {/* Interactive App Teaser / Mockup Card */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950/80 p-2 sm:p-4 backdrop-blur-2xl">
              
              {/* Fake Window Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-bold text-slate-400 ml-2">app.healthhub.ai/dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Sinais Vitais em Tempo Real (BLE Active)</span>
                </div>
              </div>

              {/* Teaser Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2 sm:p-4">
                
                {/* Widget 1 */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400" /> Frequência Cardíaca
                    </span>
                    <span className="text-emerald-400 text-[10px] font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">Normal</span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white">74</span>
                    <span className="text-xs text-slate-400">bpm</span>
                  </div>
                  <div className="h-10 w-full bg-slate-950 rounded-xl border border-slate-800/60 p-2 flex items-center justify-between">
                    <div className="flex items-end space-x-1 h-full w-full">
                      {[40, 55, 30, 80, 45, 60, 90, 50, 65, 75, 45, 85].map((val, idx) => (
                        <div key={idx} className="bg-gradient-to-t from-rose-500 to-amber-400 w-full rounded-t" style={{ height: `${val}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Widget 2 */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-indigo-400" /> Ditado por Voz Gemini
                    </span>
                    <span className="text-indigo-400 text-[10px] font-extrabold bg-indigo-500/10 px-2 py-0.5 rounded">Transcrito</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono space-y-1">
                    <span className="text-indigo-400 font-bold block">SOAP Estruturado:</span>
                    <p className="line-clamp-2 text-slate-400">S: Paciente relata dor pré-cordial leve... O: PA 120x80. A: Risco Baixo.</p>
                  </div>
                  <button 
                    onClick={() => onEnterPlatform('doctor')}
                    className="w-full py-1.5 text-xs text-cyan-400 font-bold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all cursor-pointer"
                  >
                    Ver Prontuário Completo →
                  </button>
                </div>

                {/* Widget 3 */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-teal-400" /> Estratificação PREVENT
                    </span>
                    <span className="text-cyan-400 text-[10px] font-extrabold bg-cyan-500/10 px-2 py-0.5 rounded">KDIGO 1</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Risco Cardiovascular (10 Anos)</span>
                      <span className="text-emerald-400 font-bold">3.2% (Baixo)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onEnterPlatform('doctor')}
                    className="w-full py-1.5 text-xs text-indigo-400 font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all cursor-pointer"
                  >
                    Calcular Risco de Paciente →
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. PROOF OF SCALE & STATS COUNTER BAR */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
                +150.000
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">Pacientes Acompanhados</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
                99.8%
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">Acurácia de Ditado SOAP</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                +2.500
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">Médicos Ativos</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
                100%
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">LGPD & Cifragem AES-256</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE FEATURE SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Recursos Principais
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Uma Plataforma Completa Desenvolvida para a Saúde do Futuro
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Combine inteligência artificial preditiva, governança clínica e telemetria para maximizar desfechos de saúde.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveFeatureTab('dictation')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center space-x-2 cursor-pointer ${
              activeFeatureTab === 'dictation'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Ditado Médico SOAP</span>
          </button>

          <button
            onClick={() => setActiveFeatureTab('iot')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center space-x-2 cursor-pointer ${
              activeFeatureTab === 'iot'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>IoT & Wearables</span>
          </button>

          <button
            onClick={() => setActiveFeatureTab('risk')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center space-x-2 cursor-pointer ${
              activeFeatureTab === 'risk'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Calculadoras PREVENT/KDIGO</span>
          </button>

          <button
            onClick={() => setActiveFeatureTab('fhir')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center space-x-2 cursor-pointer ${
              activeFeatureTab === 'fhir'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Prontuário FHIR / HL7</span>
          </button>
        </div>

        {/* Feature Details Showcase Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-900/80">
          
          {activeFeatureTab === 'dictation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit text-indigo-400 border border-indigo-500/20">
                  <Mic className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Ditado por Voz com Estruturação SOAP Instantânea</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Elimine o tempo gasto com digitação manual. Fale naturalmente durante a consulta e nossa IA treinada com vocabulário médico brasileiro estrutura automaticamente em Subjetivo, Objetivo, Avaliação e Plano.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Transcrição adaptada para termos técnicos de cardiologia, nefrologia e clínica geral.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Integração com envio de prescrições por WhatsApp e QR-Code ICP-Brasil.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Economize até 45 minutos por dia de atendimento.
                  </li>
                </ul>
                <button
                  onClick={() => onEnterPlatform('doctor')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Experimentar Ditado SOAP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Audio Simulator Widget */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Teste Interativo de Voz
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">IA Gemini 2.5 Active</span>
                </div>

                <div className="text-center py-4 space-y-3">
                  <button
                    onClick={handleSimulateVoiceDictation}
                    disabled={demoAudioRecording}
                    className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                      demoAudioRecording
                        ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                  <p className="text-xs text-slate-400">
                    {demoAudioRecording ? 'Simulando captação de voz clínica...' : 'Clique no microfone para simular o ditado de uma consulta'}
                  </p>
                </div>

                {demoSoapResult && (
                  <div className="p-4 bg-slate-900 rounded-xl border border-indigo-500/30 text-xs text-slate-300 font-mono space-y-2 animate-fadeIn text-left">
                    <span className="text-emerald-400 font-extrabold text-[11px] block">✓ SOAP Gerado em 1.2 segundos:</span>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
                      {demoSoapResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeFeatureTab === 'iot' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit text-cyan-400 border border-cyan-500/20">
                  <Radio className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Hub de Telemetria IoT & Pareamento BLE</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Conecte oxímetros, medidores de glicemia, balanças digitais e relógios sem fio diretamente à plataforma. Os dados de sinais vitais fluem em tempo real para o médico com alertas de desvio.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Compatibilidade com Apple Health, Google Fit e wearables Bluetooth LE.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Controle de permissões de telemetria granulada gerenciadas pelo paciente.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Notificação imediata para equipe médica em caso de descompensação de PA ou SpO2.
                  </li>
                </ul>
                <button
                  onClick={() => onEnterPlatform('patient')}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Conectar Dispositivo IoT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dispositivos Homologados BLE:</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <Watch className="w-5 h-5 text-cyan-400" />
                      <div>
                        <span className="font-bold text-white block">Apple Watch Series 9</span>
                        <span className="text-slate-400 text-[10px]">Frequência Cardíaca, SpO2 & ECG</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded-full">Sincronizado</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-teal-400" />
                      <div>
                        <span className="font-bold text-white block">Omron Evolv BLE</span>
                        <span className="text-slate-400 text-[10px]">Pressão Arterial Sistólica / Diastólica</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded-full">Sincronizado</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <Pill className="w-5 h-5 text-indigo-400" />
                      <div>
                        <span className="font-bold text-white block">Accu-Chek Instant Bluetooth</span>
                        <span className="text-slate-400 text-[10px]">Glicemia Capilar Pré e Pós-prandial</span>
                      </div>
                    </div>
                    <span className="text-cyan-400 font-extrabold text-[10px] bg-cyan-500/10 px-2.5 py-1 rounded-full">Pronto para Parear</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'risk' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-amber-500/10 rounded-2xl w-fit text-amber-400 border border-amber-500/20">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Estratificação de Risco Preditivo (AHA PREVENT & KDIGO)</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Avalie o risco cardiovascular em 10 a 30 anos e o risco de progressão de Doença Renal Crônica sem caixa-preta. Todos os coeficientes e algoritmos seguem as diretrizes médicas internacionais.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" /> Coeficientes ajustados para TFGe, HbA1c, Colesterol e Tabagismo.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" /> Simulação em tempo real do impacto do controle de PA no escore de risco.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" /> Recomendação automática de metas terapêuticas.
                  </li>
                </ul>
                <button
                  onClick={() => onEnterPlatform('doctor')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Abrir Calculadoras de Risco</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-white">Escore PREVENT AHA 2023:</span>
                  <span className="text-emerald-400 text-xs font-extrabold">Risco Baixo (3.2%)</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Idade / Sexo:</span>
                    <span className="text-white font-bold">58 anos • Masculino</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TFGe (CKD-EPI 2021):</span>
                    <span className="text-white font-bold">88 mL/min/1.73m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pressão Arterial Sistólica:</span>
                    <span className="text-white font-bold">128 mmHg</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 text-amber-300 text-[11px] font-medium">
                    💡 <strong>Orientação Preventiva:</strong> Manter medicação anti-hipertensiva. Reavaliar perfil lipídico em 6 meses.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'fhir' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-400 border border-emerald-500/20">
                  <Database className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">Linha do Tempo FHIR R4 & Interoperabilidade</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Construído nativamente sobre o padrão HL7 FHIR (Fast Healthcare Interoperability Resources). Garanta que os dados do paciente transitam com segurança entre hospitais, clínicas e laboratórios.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recursos FHIR: Patient, Observation, Condition, CarePlan, MedicationRequest.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Histórico clínico estruturado em uma linha do tempo unificada.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exportação de relatórios em JSON/PDF assinados digitalmente.
                  </li>
                </ul>
                <button
                  onClick={() => onEnterPlatform('doctor')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Ver Linha do Tempo FHIR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-3 font-mono text-left">
                <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Resource: Observation/obs_bp_001</span>
                  <span className="text-emerald-400 font-bold">FHIR R4 JSON</span>
                </div>
                <pre className="text-[10px] text-teal-300 overflow-x-auto leading-relaxed">
{`{
  "resourceType": "Observation",
  "status": "final",
  "code": {
    "coding": [{ "system": "http://loinc.org", "code": "85354-9" }]
  },
  "subject": { "reference": "Patient/pat_001" },
  "valueQuantity": { "value": 120, "unit": "mmHg" }
}`}
                </pre>
              </div>
            </div>
          )}

        </div>

      </section>

      {/* 5. TARGET AUDIENCE & SOLUTIONS GRID */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-white">Desenvolvido para Todos os Agentes da Saúde</h2>
            <p className="text-slate-400 text-sm">
              Alterne entre as perspectivas para entender como o HealthHub.AI atende cada profissional e paciente.
            </p>

            {/* Audience Tabs */}
            <div className="flex items-center justify-center space-x-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 max-w-xl mx-auto pt-2">
              <button
                onClick={() => setActiveAudience('doctor')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeAudience === 'doctor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👨‍⚕️ Médicos
              </button>
              <button
                onClick={() => setActiveAudience('patient')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeAudience === 'patient' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Pacientes
              </button>
              <button
                onClick={() => setActiveAudience('team')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeAudience === 'team' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👩‍⚕️ Equipes & ACS
              </button>
              <button
                onClick={() => setActiveAudience('admin')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeAudience === 'admin' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚙️ Gestores
              </button>
            </div>
          </div>

          {/* Solution Card Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {activeAudience === 'doctor' && (
              <>
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Mic className="w-8 h-8 text-indigo-400" />
                  <h4 className="text-lg font-extrabold text-white">Ditado de Consulta por Voz</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Transforme conversas informais em notas SOAP estruturadas com supervisão e assinatura do médico em segundos.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <FileSignature className="w-8 h-8 text-teal-400" />
                  <h4 className="text-lg font-extrabold text-white">Prescrição ICP-Brasil</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Emissão de receitas timbradas com envio direto para o WhatsApp do paciente e validação oficial por QR-Code.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                  <h4 className="text-lg font-extrabold text-white">Calculadoras Clínicas Integradas</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Acesso imediato a scores de risco cardiovascular, renal e cirúrgico com recomendação de diretrizes médicas.
                  </p>
                </div>
              </>
            )}

            {activeAudience === 'patient' && (
              <>
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Pill className="w-8 h-8 text-cyan-400" />
                  <h4 className="text-lg font-extrabold text-white">Lembrete Posológico & Estoque</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Notificações de horário dos remédios e controle de doses restantes com solicitação automática de renovação.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Radio className="w-8 h-8 text-emerald-400" />
                  <h4 className="text-lg font-extrabold text-white">Conexão com Wearables</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sincronização com relógios e medidores de pressão para acompanhamento contínuo sem complicação.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <ShieldCheck className="w-8 h-8 text-indigo-400" />
                  <h4 className="text-lg font-extrabold text-white">Privacidade & Consentimento LGPD</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Você decide exatamente quem pode visualizar seu histórico médico com controle de permissões em tempo real.
                  </p>
                </div>
              </>
            )}

            {activeAudience === 'team' && (
              <>
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Users className="w-8 h-8 text-teal-400" />
                  <h4 className="text-lg font-extrabold text-white">Notas Multidisciplinares</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Comunicação fluida entre enfermeiros, farmacêuticos, nutricionistas e agentes comunitários de saúde.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                  <h4 className="text-lg font-extrabold text-white">Busca Ativa Automatizada</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Envio automático de mensagens preventivas via WhatsApp para pacientes faltosos em consultas de rotina.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Clock className="w-8 h-8 text-indigo-400" />
                  <h4 className="text-lg font-extrabold text-white">Linha do Tempo da Jornada</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Acompanhamento longitudinal de episódios de internação, exames de laboratório e vacinação.
                  </p>
                </div>
              </>
            )}

            {activeAudience === 'admin' && (
              <>
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Building2 className="w-8 h-8 text-rose-400" />
                  <h4 className="text-lg font-extrabold text-white">Gestão Populacional de Saúde</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Painel unificado com mapa de risco por grupos crônicos, controle de no-show e redução de sinistralidade.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Lock className="w-8 h-8 text-amber-400" />
                  <h4 className="text-lg font-extrabold text-white">Auditoria & Logs Imutáveis</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Registro detalhado de cada acesso a dados de pacientes para prestação de contas aos órgãos reguladores.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/60">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <h4 className="text-lg font-extrabold text-white">Governança de IA (OMS)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Três camadas de salvaguarda clínica garantindo que nenhuma recomendação automatizada passe sem supervisão.
                  </p>
                </div>
              </>
            )}

          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onEnterPlatform(activeAudience)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 text-slate-950 font-black text-sm inline-flex items-center space-x-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              <span>Acessar Portal do {activeAudience === 'doctor' ? 'Médico' : activeAudience === 'patient' ? 'Paciente' : activeAudience === 'team' ? 'Equipe' : 'Gestor'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. SECURITY, PRIVACY & COMPLIANCE SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Segurança Máxima & LGPD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Arquitetura de Segurança de Nível Bancário & Saúde
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sabemos da sensibilidade dos dados de saúde. Por isso, a plataforma foi desenvolvida desde o primeiro dia com suporte nativo a criptografia de ponta a ponta e isolamento estrito de dados.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start space-x-4">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Cifragem Client-Side AES-256-GCM</h4>
                  <p className="text-slate-400">Os dados sensíveis são cifrados no próprio navegador ou smartphone antes de trafegarem para o servidor.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start space-x-4">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Isolamento via Supabase RLS (Row Level Security)</h4>
                  <p className="text-slate-400">Garantia matemática de que médicos só enxergam dados de seus pacientes autorizados.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start space-x-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Relatório RIPD & Artigo 18 da LGPD</h4>
                  <p className="text-slate-400">Exportação simplificada de relatórios de impacto à proteção de dados e revogação de consentimento com 1 clique.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-slate-900/90 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
              <Shield className="w-8 h-8 text-slate-950" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Certificações & Conformidade Regulatória</h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-slate-300">
                ✓ CFM Resolução 2.314/2022
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-slate-300">
                ✓ ANPD LGPD Compliant
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-slate-300">
                ✓ ICP-Brasil V3 Digital Signature
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-slate-300">
                ✓ HL7 FHIR Release 4
              </div>
            </div>

            <button
              onClick={() => onEnterPlatform('admin')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              Consultar Painel de Segurança & Logs →
            </button>
          </div>

        </div>
      </section>

      {/* 7. PRICING & SUBSCRIPTION PLANS */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Planos & Investimento
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Planos Transparentes para Qualquer Porte</h2>
            <p className="text-slate-400 text-sm">
              Sem contratos engessados. Cancele ou altere seu plano a qualquer momento.
            </p>

            {/* Monthly / Annual Selector */}
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span className={`text-xs font-bold ${selectedPlan === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Mensal</span>
              <button
                onClick={() => setSelectedPlan(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 bg-slate-800 rounded-full p-1 border border-slate-700 transition-colors relative cursor-pointer"
              >
                <div className={`w-4 h-4 bg-cyan-400 rounded-full transition-transform ${selectedPlan === 'annual' ? 'translate-x-6' : ''}`}></div>
              </button>
              <span className={`text-xs font-bold ${selectedPlan === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                Anual <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">-20% OFF</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* PLAN 1: PACIENTE / FAMÍLIA */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 bg-slate-950/70 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-white">Individual & Família</h3>
                  <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full">Para Pacientes</span>
                </div>
                <p className="text-xs text-slate-400">Controle completo da sua saúde, lembretes de remédio e conexão com wearables.</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">R$ 0</span>
                  <span className="text-xs text-slate-400">/ grátis para sempre</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Prontuário pessoal e histórico de vacinas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Lembrete diário de medicação
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Conexão com até 2 dispositivos BLE
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Agente preventivo de saúde por chat
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPlatform('patient')}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs border border-slate-700 transition-all cursor-pointer text-center"
              >
                Cadastrar Grátis
              </button>
            </div>

            {/* PLAN 2: MÉDICO PRO (DESTACADO) */}
            <div className="glass-card rounded-3xl p-8 border-2 border-indigo-500 bg-slate-900/90 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-500/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Mais Popular para Consultórios
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-white">Médico Pro</h3>
                  <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-2.5 py-1 rounded-full">Consultório Individual</span>
                </div>
                <p className="text-xs text-slate-300">Ditado por voz SOAP com IA, receituário ICP-Brasil e calculadoras de risco.</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">{selectedPlan === 'annual' ? 'R$ 149' : 'R$ 189'}</span>
                  <span className="text-xs text-slate-400">/ mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Ditado ilimitado de notas SOAP com IA
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Emissão de receitas com QR-Code e WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Calculadoras PREVENT e KDIGO sem limite
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Assinatura digital ICP-Brasil homologada
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPlatform('doctor')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform cursor-pointer text-center"
              >
                Testar 14 Dias Grátis
              </button>
            </div>

            {/* PLAN 3: CLÍNICAS & OPERADORAS */}
            <div className="glass-card rounded-3xl p-8 border border-slate-800 bg-slate-950/70 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-white">Hospital & Operadora</h3>
                  <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full">Corporativo</span>
                </div>
                <p className="text-xs text-slate-400">Gestão de saúde populacional, busca ativa por WhatsApp e governança de IA.</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white">Sob Consulta</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" /> Integração personalizada FHIR / TUSS / ANS
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" /> Painel de sinistralidade e grupos de risco
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" /> Suporte dedicado 24/7 com SLA de 99.9%
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-rose-400 shrink-0" /> Treinamento de equipe multidisciplinar
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPlatform('admin')}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs border border-slate-700 transition-all cursor-pointer text-center"
              >
                Falar com Consultor
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl font-black text-white">Perguntas & Respostas</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "O ditado por voz possui amparo legal e aprovação do CFM?",
              a: "Sim. A transposição de voz para texto utiliza a IA Gemini com supervisão médica obrigatória. Nenhuma nota SOAP é inserida no prontuário sem a revisão prévia e assinatura digital do médico responsável, respeitando a Resolução CFM 2.314/2022."
            },
            {
              q: "Como funciona a sincronização com relógios e medidores de pressão?",
              a: "A plataforma se conecta aos ecossistemas nativos Apple HealthKit e Google Health Connect, além de suportar pareamento direto via Bluetooth Low Energy (BLE) para oxímetros e glicosímetros homologados."
            },
            {
              q: "Os dados dos pacientes ficam protegidos segundo a LGPD?",
              a: "Absolutamente. Todos os registros utilizam criptografia de ponta a ponta AES-256-GCM. O paciente mantém o controle total sobre quais profissionais podem acessar suas informações médicas, podendo revogar o consentimento a qualquer momento."
            },
            {
              q: "Posso exportar os dados para outros sistemas hospitalares?",
              a: "Sim. A plataforma utiliza a especificação internacional HL7 FHIR Release 4, permitindo a exportação e importação perfeita de dados de histórico clínico em formato padronizado JSON/PDF."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left font-extrabold text-white text-sm cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA CALLOUT */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 border border-slate-800 bg-gradient-to-r from-slate-950 via-cyan-950/60 to-indigo-950/60 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pronto para Transformar sua Prática Clínica?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Junte-se a mais de 2.500 médicos e 150.000 pacientes que já usam a plataforma HealthHub.AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onEnterPlatform('doctor')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 text-slate-950 font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/25 hover:scale-105 transition-transform cursor-pointer"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Entrar no Hub Médico</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onEnterPlatform('patient')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-base flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <User className="w-5 h-5 text-cyan-400" />
              <span>Acessar Portal do Paciente</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-900 pb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-slate-950">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-white">HealthHub.AI</span>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-400 font-medium flex-wrap justify-center">
              <button onClick={() => onEnterPlatform('patient')} className="hover:text-white transition-colors cursor-pointer">Paciente</button>
              <button onClick={() => onEnterPlatform('doctor')} className="hover:text-white transition-colors cursor-pointer">Médico</button>
              <button onClick={() => onEnterPlatform('team')} className="hover:text-white transition-colors cursor-pointer">Equipe Multidisciplinar</button>
              <button onClick={() => onEnterPlatform('admin')} className="hover:text-white transition-colors cursor-pointer">Governança Admin</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} HealthHub.AI. Todos os direitos reservados. Governança & IA Médica.</p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Todos os sistemas operacionais • SLA 99.9%</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
