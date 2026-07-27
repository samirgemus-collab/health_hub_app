import React, { useState } from 'react';
import { UserRole } from '../types/health';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  User, 
  Stethoscope, 
  Users, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Fingerprint, 
  KeyRound, 
  Mail, 
  Building2, 
  ArrowRight, 
  X, 
  ShieldAlert, 
  Award, 
  Eye, 
  EyeOff,
  Sparkles,
  QrCode
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
  
  // FORM FIELDS
  const [emailOrCpf, setEmailOrCpf] = useState('dr.roberto@segsaude.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cloudCertProvider, setCloudCertProvider] = useState<'vidaas' | 'birdid' | 'soluti'>('vidaas');

  if (!isOpen) return null;

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(selectedRole, emailOrCpf);
      onClose();
    }, 1200);
  };

  const handleSimulateIcpLogin = (providerName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('doctor', 'dr.roberto.crm148920@segsaude.com.br');
      onClose();
    }, 1500);
  };

  const handleSimulateWebAuthn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('patient', 'maria.silva@segsaude.com.br');
      onClose();
    }, 1200);
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
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl text-white tracking-tight">SEG SAÚDE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30 uppercase">
                  Zero-Trust Auth
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Sistema Eletrônico de Governança, Autenticação & Segurança em Saúde
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
              <span>Senha + 2FA</span>
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

          {/* ROLE SELECTOR (ROLE RBAC) */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-extrabold uppercase text-[10px] tracking-wider block">
              Selecione seu Perfil de Acesso SEG Saúde:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center space-x-2 cursor-pointer ${
                  selectedRole === 'patient' 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Paciente</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center space-x-2 cursor-pointer ${
                  selectedRole === 'doctor' 
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Médico</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('healthcare_team')}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center space-x-2 cursor-pointer ${
                  selectedRole === 'healthcare_team' 
                    ? 'bg-teal-500/20 border-teal-500 text-teal-200 font-bold' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Equipe</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center space-x-2 cursor-pointer ${
                  selectedRole === 'admin' 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Admin CISO</span>
              </button>
            </div>
          </div>

          {/* MODE 1: PASSWORD + 2FA FORM */}
          {authMode === 'password' && (
            <form onSubmit={handleSubmitAuth} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">E-mail Corporativo ou CPF</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrCpf}
                    onChange={(e) => setEmailOrCpf(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="ex: dr.roberto@segsaude.com.br"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Senha de Acesso SEG Saúde</label>
                  <button type="button" className="text-cyan-400 hover:underline text-[11px]">Esqueceu a senha?</button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
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
                <label className="block text-slate-300 font-bold mb-1">Código de Autenticação 2FA (TOTP / SMS)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="ex: 894120"
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
                <span>{isSubmitting ? 'Autenticando no SEG Saúde...' : 'Entrar no Sistema SEG Saúde'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: ICP-BRASIL CERTIFICATE LOGIN */}
          {authMode === 'icp_brasil' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/30 space-y-2">
                <h4 className="font-extrabold text-indigo-300 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Autenticação com Certificado Digital ICP-Brasil
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Conecte seu Token A3 USB ou escolha seu Provedor de Certificado em Nuvem (VIDaaS / BirdID / VaultID) para login instantâneo com assinatura digital.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSimulateIcpLogin('VIDaaS')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-center space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-white block">VIDaaS (Valid)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Cloud Push</span>
                </button>

                <button
                  onClick={() => handleSimulateIcpLogin('BirdID')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-center space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-white block">BirdID (Certisign)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Cloud Push</span>
                </button>

                <button
                  onClick={() => handleSimulateIcpLogin('Token A3')}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-center space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-white block">Token A3 USB</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Lacuna PKI</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: WEBAUTHN / BIOMETRIA */}
          {authMode === 'webauthn' && (
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-4 text-xs">
              <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto text-teal-400">
                <Fingerprint className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">Autenticação Biométrica WebAuthn / TouchID</h4>
                <p className="text-slate-400 text-xs mt-1">Toque no leitor biométrico do seu smartphone ou notebook para entrar sem senha.</p>
              </div>

              <button
                onClick={handleSimulateWebAuthn}
                className="py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20 cursor-pointer"
              >
                <span>Usar Biometria do Dispositivo</span>
              </button>
            </div>
          )}

          {/* MODE 4: GOV.BR SSO */}
          {authMode === 'gov_br' && (
            <div className="p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-center space-y-4 text-xs">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 font-black text-xl">
                gov.br
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">Single Sign-On (SSO) do Governo Federal</h4>
                <p className="text-slate-300 text-xs mt-1">Entrar com sua conta Ouro ou Prata do Gov.br para verificação unificada de identidade de saúde.</p>
              </div>

              <button
                onClick={() => handleSimulateIcpLogin('Gov.br')}
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Entrar com Gov.br</span>
              </button>
            </div>
          )}

          {/* FOOTER SECURITY COMPLIANCE BADGE */}
          <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" /> E2EE AES-256-GCM Ativo
            </span>
            <span>LGPD Art. 18 • ANPD • CFM 2.299/2021</span>
          </div>

        </div>

      </div>

    </div>
  );
};
