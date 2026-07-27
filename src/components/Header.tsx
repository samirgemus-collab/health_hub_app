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
  Brain
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
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-900 shadow-xl backdrop-blur-xl bg-slate-950/80">
      
      {/* Top Bar: Brand, Security Badges & Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Activity className="w-6 h-6 text-slate-950 animate-heartbeat" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-tight text-white">HealthHub</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              HUB de Saúde Individual & Prontuário Multidisciplinar
            </p>
          </div>
        </div>

        {/* CENTER ROLE SWITCHER (Patient vs Doctor vs Team vs Admin) */}
        <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => onToggleUserRole('patient')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              userRole === 'patient' 
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paciente</span>
          </button>

          <button
            onClick={() => onToggleUserRole('doctor')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              userRole === 'doctor' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Médico</span>
          </button>

          <button
            onClick={() => onToggleUserRole('healthcare_team')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              userRole === 'healthcare_team' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Equipe de Saúde</span>
          </button>

          <button
            onClick={() => onToggleUserRole('admin')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              userRole === 'admin' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Administrador</span>
          </button>
        </div>

        {/* Right side: Security Indicators */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-slate-300">E2EE AES-256</span>
          </div>

          <button
            onClick={onToggleBiometric}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center space-x-1.5 ${
              biometricActive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Patient Sub-Navigation Tabs */}
      {userRole === 'patient' && (
        <div className="border-t border-slate-900 bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-2 text-xs">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Início</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Painel Geral</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'history' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Histórico Médico</span>
            </button>

            <button
              onClick={() => onTabChange('medications')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'medications' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Lembrete de Remédios</span>
            </button>

            <button
              onClick={() => onTabChange('preventive')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'preventive' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Preventivas (IA)</span>
            </button>

            <button
              onClick={() => onTabChange('reports')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'reports' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Laudos & OCR</span>
            </button>

            <button
              onClick={() => onTabChange('wearables')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'wearables' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Watch className="w-4 h-4" />
              <span>Wearables</span>
            </button>

            <button
              onClick={() => onTabChange('jornada_timeline')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'jornada_timeline' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Jornada / Linha do Tempo</span>
            </button>

            <button
              onClick={() => onTabChange('risk_calculators')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'risk_calculators' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 text-indigo-400" />
              <span>Calculadoras & Risco</span>
            </button>

            <button
              onClick={() => onTabChange('population_health')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'population_health' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Saúde Populacional</span>
            </button>

            <button
              onClick={() => onTabChange('clinical_ai_engine')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'clinical_ai_engine' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 text-rose-400" />
              <span>IA Clínica & Governança</span>
            </button>

            <button
              onClick={() => onTabChange('security')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'security' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Segurança & LGPD</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
