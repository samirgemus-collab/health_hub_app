import React from 'react';
import { UserProfile, UserRole, DoctorProfile, TeamMemberProfile } from '../types/health';
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
  KeyRound, 
  ShieldCheck,
  Building2,
  Calculator,
  Clock,
  Brain,
  Home,
  Sparkles,
  Bot,
  Syringe,
  ClipboardCheck
} from 'lucide-react';

interface HeaderProps {
  currentProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  e2eeEnabled: boolean;
  biometricActive: boolean;
  onToggleBiometric: () => void;
  userRole: UserRole;
  onToggleUserRole: (role: UserRole) => void;
  currentDoctor: DoctorProfile;
  currentTeamMember: TeamMemberProfile;
  onOpenSegSaudeAuth?: () => void;
  onOpenEmergencySos?: () => void;
  onOpenProfileRegistration?: () => void;
  hidePortalSelector?: boolean;
  onSignOut?: () => void;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  profiles,
  onSelectProfile,
  activeTab,
  onTabChange,
  e2eeEnabled,
  biometricActive,
  onToggleBiometric,
  userRole,
  onToggleUserRole,
  onOpenSegSaudeAuth,
  onOpenEmergencySos,
  onOpenProfileRegistration,
  hidePortalSelector,
  onSignOut,
  userEmail
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-900 shadow-xl backdrop-blur-xl bg-slate-950/90">
      
      {/* 1. TOP BRANDING BAR & SEG SAÚDE AUTH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Ir para Landing Page"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-slate-950 animate-heartbeat" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">Dono da Saúde</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-extrabold border border-teal-500/30">
                Wellness Copilot
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Sua saúde nas suas mãos, com ciência ao seu lado
            </p>
          </div>
        </div>

        {/* TOP LEVEL 4-PORTAL SELECTOR (PACIENTE | MÉDICO | EQUIPE & AGENTES | ADMIN) */}
        {!hidePortalSelector && (
          <div className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => onToggleUserRole('patient')}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                userRole === 'patient' 
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Portal Paciente</span>
            </button>

            <button
              onClick={() => onToggleUserRole('doctor')}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                userRole === 'doctor' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>2. Portal Médico</span>
            </button>

            <button
              onClick={() => onToggleUserRole('healthcare_team')}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                userRole === 'healthcare_team' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>3. Agentes de Saúde & Equipe (ACS)</span>
            </button>

            <button
              onClick={() => onToggleUserRole('admin')}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                userRole === 'admin' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>4. Governança Admin</span>
            </button>
          </div>
        )}

        {/* RIGHT SECURITY & SEG SAÚDE AUTH BUTTON */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTabChange('landing')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'landing' 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Ir para a Landing Page institucional"
          >
            <span>🌐 Landing Page</span>
          </button>

          {onSignOut ? (
            <div className="flex items-center space-x-2">
              {userEmail && (
                <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
                  {userEmail}
                </span>
              )}
              <button
                onClick={onSignOut}
                className="py-2 px-3.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-black text-xs cursor-pointer transition-all"
              >
                <span>Sair</span>
              </button>
            </div>
          ) : (
            onOpenSegSaudeAuth && (
              <button
                onClick={onOpenSegSaudeAuth}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SEG Saúde Auth</span>
              </button>
            )
          )}

          {userRole === 'patient' && onOpenProfileRegistration && (
            <button
              onClick={onOpenProfileRegistration}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              title="Abrir Ficha Cadastral e Consentimentos LGPD"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Minha Ficha & LGPD</span>
            </button>
          )}

          {userRole === 'patient' && onOpenEmergencySos && (
            <button
              onClick={onOpenEmergencySos}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer animate-pulse"
              title="Disparar Alerta SOS de Emergência Médica"
            >
              <span>🚨 SOS 24/7</span>
            </button>
          )}

          <button
            onClick={onToggleBiometric}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
              biometricActive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Autenticação Biométrica E2EE"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* MOBILE PORTAL SELECTOR */}
      <div className="md:hidden flex items-center justify-around p-1.5 bg-slate-900 border-t border-slate-800 text-[11px]">
        <button
          onClick={() => onToggleUserRole('patient')}
          className={`px-2 py-1 rounded-lg font-bold ${userRole === 'patient' ? 'bg-teal-500 text-slate-950' : 'text-slate-400'}`}
        >
          Paciente
        </button>
        <button
          onClick={() => onToggleUserRole('doctor')}
          className={`px-2 py-1 rounded-lg font-bold ${userRole === 'doctor' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Médico
        </button>
        <button
          onClick={() => onToggleUserRole('healthcare_team')}
          className={`px-2 py-1 rounded-lg font-bold ${userRole === 'healthcare_team' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
        >
          Agentes/ACS
        </button>
        <button
          onClick={() => onToggleUserRole('admin')}
          className={`px-2 py-1 rounded-lg font-bold ${userRole === 'admin' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
        >
          Admin
        </button>
      </div>

      {/* 2. SUB-NAVIGATION TABS (ONLY VISIBLE IN PATIENT PORTAL ROLE) */}
      {userRole === 'patient' && (
        <div className="border-t border-slate-900 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-2 text-xs">
            
            <button
              onClick={() => onTabChange('home')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Início Unificado</span>
            </button>

            <button
              onClick={() => onTabChange('health_map')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'health_map' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Meu Mapa de Saúde</span>
            </button>

            <button
              onClick={() => onTabChange('preventive_agenda')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'preventive_agenda' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Minha Agenda Preventiva</span>
            </button>

            <button
              onClick={() => onTabChange('preventive_plan')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'preventive_plan' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-amber-400" />
              <span>Meu Plano de Prevenção</span>
            </button>

            <button
              onClick={() => onTabChange('jornada_timeline')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'jornada_timeline' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Linha do Tempo FHIR</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Minha Saúde (Sinais Vitais)</span>
            </button>

            <button
              onClick={() => onTabChange('medications')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'medications' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-4 h-4 text-teal-400" />
              <span>Remédios & Estoque</span>
            </button>

            <button
              onClick={() => onTabChange('preventive_checkup')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'preventive_checkup' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-cyan-400" />
              <span>Check-up Preventivo</span>
            </button>

            <button
              onClick={() => onTabChange('family_history')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'family_history' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Histórico Familiar</span>
            </button>

            <button
              onClick={() => onTabChange('vaccination')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'vaccination' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Syringe className="w-4 h-4 text-cyan-400" />
              <span>Minha Vacinação</span>
            </button>

            <button
              onClick={() => onTabChange('preventive')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'preventive' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-teal-400" />
              <span>Agente Preventivo (IA)</span>
            </button>

            <button
              onClick={() => onTabChange('wearables')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'wearables' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Watch className="w-4 h-4 text-cyan-400" />
              <span>Sensores BLE / IoT</span>
            </button>

            <button
              onClick={() => onTabChange('risk_calculators')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'risk_calculators' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 text-indigo-400" />
              <span>Calculadoras de Risco</span>
            </button>

            <button
              onClick={() => onTabChange('population_health')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'population_health' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Gestão Populacional</span>
            </button>

            <button
              onClick={() => onTabChange('clinical_ai_engine')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'clinical_ai_engine' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Engine de IA</span>
            </button>

            <button
              onClick={() => onTabChange('security')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'security' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Segurança & LGPD</span>
            </button>

          </div>
        </div>
      )}

    </header>
  );
};
