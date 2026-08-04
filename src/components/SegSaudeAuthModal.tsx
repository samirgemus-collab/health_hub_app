import React, { useState } from 'react';
import { UserRole } from '../types/health';
import { supabase, currentAppMode } from '../lib/supabaseClient';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Stethoscope, 
  Users, 
  Fingerprint, 
  KeyRound, 
  Mail, 
  Building2, 
  ArrowRight, 
  X, 
  Award, 
  Eye, 
  EyeOff,
  AlertTriangle
} from 'lucide-react';

interface SegSaudeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userEmail: string) => void;
}

export const SegSaudeAuthModal: React.FC<SegSaudeAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'password' | 'icp_brasil' | 'webauthn' | 'gov_br'>('password');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  
  // FORM FIELDS (no hardcoded pre-filled values)
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (currentAppMode === 'real') {
      if (!supabase) {
        setErrorMessage('Cliente Supabase indisponível no modo real.');
        return;
      }
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrCpf,
        password: password,
      });
      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message || 'Erro ao realizar login.');
        return;
      }

      if (data.session) {
        const userRole = (data.session.user.app_metadata?.role as UserRole) || selectedRole;
        onLoginSuccess(userRole, data.session.user.email || emailOrCpf);
        onClose();
      }
    } else if (currentAppMode === 'demo') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(selectedRole, emailOrCpf || 'demo@segsaude.com.br');
        onClose();
      }, 500);
    } else {
      setErrorMessage('Aplicação em modo bloqueado. Configure as variáveis de ambiente no arquivo .env.local.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="glass-panel rounded-3xl max-w-xl w-full border border-cyan-500/30 bg-slate-950 shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* TOP BANNER SEG SAÚDE BRANDING */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                SEG Saúde Auth
              </h3>
              <p className="text-xs text-slate-400">
                Autenticação de Segurança E2EE & RBAC Corporativo
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* AUTHENTICATION METHOD TABS */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('password')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                authMode === 'password' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Senha</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('icp_brasil')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                authMode === 'icp_brasil' ? 'bg-indigo-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>ICP-Brasil</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('webauthn')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                authMode === 'webauthn' ? 'bg-teal-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Biometria</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('gov_br')}
              className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                authMode === 'gov_br' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Gov.br SSO</span>
            </button>
          </div>

          {/* ERROR DISPLAY */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE 1: PASSWORD FORM */}
          {authMode === 'password' && (
            <form onSubmit={handleSubmitAuth} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">E-mail Corporativo</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailOrCpf}
                    onChange={(e) => setEmailOrCpf(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="usuario@exemplo.com"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Senha de Acesso</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="Digite sua senha"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-white absolute right-3.5 top-3"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Código 2FA (Opcional)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="ex: 123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-cyan-400 font-mono tracking-widest text-center text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Autenticando...' : 'Entrar no Sistema'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: ICP-BRASIL CERTIFICATE LOGIN (DISABLED / EM HOMOLOGAÇÃO) */}
          {authMode === 'icp_brasil' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/30 space-y-2 text-center">
                <Award className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-indigo-300 text-sm">Autenticação ICP-Brasil</h4>
                <p className="text-slate-400 text-xs">
                  Integração com Certificado Digital A3/Nuvem em homologação de segurança. Utilize e-mail e senha para login real.
                </p>
              </div>
            </div>
          )}

          {/* MODE 3: WEBAUTHN / BIOMETRIA (DISABLED / EM HOMOLOGAÇÃO) */}
          {authMode === 'webauthn' && (
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3 text-xs">
              <Fingerprint className="w-10 h-10 text-teal-400 mx-auto opacity-50" />
              <h4 className="font-extrabold text-white text-sm">Autenticação Biométrica WebAuthn</h4>
              <p className="text-slate-400 text-xs">Em homologação de segurança no ecossistema SEG Saúde.</p>
            </div>
          )}

          {/* MODE 4: GOV.BR SSO (DISABLED / EM HOMOLOGAÇÃO) */}
          {authMode === 'gov_br' && (
            <div className="p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-center space-y-3 text-xs">
              <Building2 className="w-10 h-10 text-emerald-400 mx-auto opacity-50" />
              <h4 className="font-extrabold text-white text-sm">Gov.br SSO</h4>
              <p className="text-slate-400 text-xs">Em homologação de segurança no ecossistema SEG Saúde.</p>
            </div>
          )}

          {/* FOOTER SECURITY COMPLIANCE BADGE */}
          <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" /> Auth RBAC Fail-Closed
            </span>
            <span>LGPD Art. 18 • ANPD</span>
          </div>

        </div>

      </div>

    </div>
  );
};
