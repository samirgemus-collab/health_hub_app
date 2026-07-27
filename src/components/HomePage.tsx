import React from 'react';
import { UserProfile, DoctorProfile } from '../types/health';
import { 
  Activity, 
  Heart, 
  Stethoscope, 
  Radio, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Users, 
  FileSignature, 
  Mic, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  Sliders, 
  Smartphone, 
  Globe, 
  Lock, 
  ChevronRight,
  Target,
  FileText
} from 'lucide-react';

interface HomePageProps {
  user: UserProfile;
  doctor: DoctorProfile;
  activeRole: 'patient' | 'doctor' | 'team' | 'admin';
  onSelectRole: (role: 'patient' | 'doctor' | 'team' | 'admin') => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  doctor,
  activeRole,
  onSelectRole,
  onNavigateTab
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. HERO BANNER - MIDNIGHT BIO-TECH GLASSMORPHISM */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 overflow-hidden shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest block">
                  Plataforma Unificada Mobile & Web • HealthHub.AI 2.5
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Bem-vindo(a), <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">{user.name}</span>
                </h1>
              </div>
            </div>

            {/* QUICK ROLE SWITCHER PILLS */}
            <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs shrink-0">
              <button
                onClick={() => onSelectRole('patient')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeRole === 'patient' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Paciente
              </button>
              <button
                onClick={() => onSelectRole('doctor')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeRole === 'doctor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👨‍⚕️ Médico
              </button>
              <button
                onClick={() => onSelectRole('team')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeRole === 'team' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👩‍⚕️ Equipe
              </button>
              <button
                onClick={() => onSelectRole('admin')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeRole === 'admin' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {/* HEALTH SCORE WIDGET BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 font-extrabold text-xl">
                92<span className="text-xs font-normal">/100</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Escore Preventivo de Saúde</span>
                <p className="text-emerald-400 font-extrabold text-sm">Excelente • Baixo Risco Cardiovascular</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Telemetria IoT em Tempo Real</span>
                <p className="text-white font-extrabold text-sm">3 Dispositivos BLE Conectados</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Proteção de Dados & Cifragem</span>
                <p className="text-indigo-300 font-extrabold text-sm">E2EE AES-256-GCM + RLS Supabase</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. FEATURE SHORTCUTS GRID (ATALHOS RÁPIDOS) */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Atalhos Principais & Módulos da Plataforma
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          
          {/* CARD 1: DITADO MÉDICO SOAP */}
          <div 
            onClick={() => onNavigateTab('doctor')}
            className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-indigo-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-base font-extrabold text-white">Ditado por Voz & Notas SOAP</h3>
            <p className="text-slate-400 leading-relaxed">
              Dite a consulta médica em voz alta. A IA Gemini converte o áudio bruto no padrão estruturado SOAP (Subjetivo, Objetivo, Avaliação, Plano).
            </p>
          </div>

          {/* CARD 2: RECEITUÁRIO DIGITAL ICP-BRASIL */}
          <div 
            onClick={() => onNavigateTab('doctor')}
            className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-teal-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                <FileSignature className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>
            <h3 className="text-base font-extrabold text-white">Receita Eletrônica & Canvas</h3>
            <p className="text-slate-400 leading-relaxed">
              Emissão de prescrições timbradas com visualizador digital em tempo real, QR-Code de validação no portal do ITI e envio por WhatsApp.
            </p>
          </div>

          {/* CARD 3: HUB TELEMÉTRICO IOT */}
          <div 
            onClick={() => onNavigateTab('wearables')}
            className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="text-base font-extrabold text-white">Sensores IoT & Permissões</h3>
            <p className="text-slate-400 leading-relaxed">
              Pareamento de relógios, oxímetros e medidores de glicemia BLE com busca automática por Bluetooth e controle granular de permissões por métrica.
            </p>
          </div>

          {/* CARD 4: ESTRATIFICAÇÃO DE RISCO */}
          <div 
            onClick={() => onNavigateTab('risk')}
            className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-base font-extrabold text-white">Calculadoras de Risco (PREVENT/KDIGO)</h3>
            <p className="text-slate-400 leading-relaxed">
              Estratificação cardiovascular, renal, osteoporótica e pós-operatória sem caixa-preta baseada nas diretrizes internacionais AHA/KDIGO.
            </p>
          </div>

          {/* CARD 5: GESTÃO POPULACIONAL & DETECTOR */}
          <div 
            onClick={() => onNavigateTab('population')}
            className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-base font-extrabold text-white">Gestão Populacional & Busca Ativa</h3>
            <p className="text-slate-400 leading-relaxed">
              Painel de grupos de risco, detector de trajetórias longitudinais (Creatinina 1.0→1.5) e busca ativa via WhatsApp por Agente de Saúde.
            </p>
          </div>

          {/* CARD 6: ARQUITETURA TRÍPLICE DE IA */}
          <div 
            onClick={() => onNavigateTab('ai_governance')}
            className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-rose-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
            </div>
            <h3 className="text-base font-extrabold text-white">Arquitetura de IA & Governança OMS</h3>
            <p className="text-slate-400 leading-relaxed">
              Camada 1 (Determinística), Camada 2 (ML Preditivo de No-show) e Camada 3 (IA Generativa Gemini com supervisão humana).
            </p>
          </div>

        </div>
      </div>

      {/* 3. PLATFORM CAPABILITIES SUMMARY (MOBILE & WEB NATIVE) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 bg-slate-950/60">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-extrabold">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold">Recursos Nativos da Plataforma (Mobile Android/iOS & Web)</h3>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
            ✓ 100% Responsivo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-1">
            <h4 className="font-extrabold text-white">📱 Aplicativo Mobile Nativo:</h4>
            <p>Compatível com Android (Google Health Connect) e iOS (Apple HealthKit). Suporte a notificações de lembrete posológico e sincronização de wearables via Bluetooth BLE direct em segundo plano.</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-white">💻 Painel Web PWA de Alta Performance:</h4>
            <p>Construído em React 19 + Vite com compilação ultra-rápida (350ms). Funciona perfeitamente em computadores de clínicas, tablets e smartphones sem necessidade de download.</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-white">🔒 Segurança & LGPD Artigo 18:</h4>
            <p>Cifragem AES-256-GCM client-side com Web Crypto API W3C, isolamento de dados no Supabase via Row Level Security (RLS) e Relatório RIPD LGPD exportável.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
