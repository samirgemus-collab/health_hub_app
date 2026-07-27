import React, { useState } from 'react';
import { UserProfile, SecuritySettings } from '../types/health';
import { encryptDataE2EE, decryptDataE2EE, EncryptedPayload, generateSHA256Hash } from '../services/cryptoService';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Fingerprint, 
  Download, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  FileText,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Copy
} from 'lucide-react';

interface SecurityPanelProps {
  profile: UserProfile;
  settings: SecuritySettings;
  onToggleE2EE: () => void;
  onToggleBiometric: () => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  profile,
  settings,
  onToggleE2EE,
  onToggleBiometric
}) => {
  // Real E2EE Test State
  const [plainText, setPlainText] = useState('Laudo de Exame Secreto: Hemoglobina Glicada 6,6%. Recomenda-se acompanhamento nutricional.');
  const [passphrase, setPassphrase] = useState('MinhaChaveSecreta123!');
  const [encryptedPayload, setEncryptedPayload] = useState<EncryptedPayload | null>(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [contentHash, setContentHash] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);

  const handleEncryptData = async () => {
    setIsEncrypting(true);
    try {
      const payload = await encryptDataE2EE(plainText, passphrase);
      const hash = await generateSHA256Hash(plainText);
      setEncryptedPayload(payload);
      setContentHash(hash);
      setDecryptedText('');
    } catch (err) {
      console.error('Erro na cifragem E2EE:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecryptData = async () => {
    if (!encryptedPayload) return;
    setIsDecrypting(true);
    try {
      const result = await decryptDataE2EE(encryptedPayload, passphrase);
      setDecryptedText(result);
    } catch (err) {
      setDecryptedText('❌ FALHA NA DECIFRAGEM: Frase secreta incorreta ou payload corrompido.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadPortabilityJson = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      legalBasis: 'LGPD Artigo 18 - Direito à Portabilidade de Dados de Saúde',
      patient: profile,
      security: {
        e2eeStatus: settings.e2eeEnabled ? 'Active (AES-256-GCM)' : 'Inactive',
        biometricAuth: settings.biometricAuthEnabled ? 'Active' : 'Inactive',
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prontuario_portabilidade_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/20">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Segurança, LGPD Art. 18 & Web Crypto API</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Painel de Segurança & Criptografia E2EE Real
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Cifragem de dados em nível de dispositivo utilizando o padrão W3C Web Crypto API (AES-256-GCM) e portabilidade completa de dados.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>LGPD / HIPAA Compliant</span>
        </div>
      </div>

      {/* SECURITY TOGGLES & STATUS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* E2EE Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Criptografia de Ponta a Ponta (E2EE)</h3>
                <p className="text-xs text-slate-400">Web Crypto API • AES-256-GCM com PBKDF2</p>
              </div>
            </div>

            <button
              onClick={onToggleE2EE}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                settings.e2eeEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          <p className="text-xs text-slate-300">
            {settings.e2eeEnabled 
              ? 'Ativado: Os PDFs de laudos e exames são cifrados no navegador com AES-256-GCM antes do envio ao storage.'
              : 'Desativado: Recomendamos manter a criptografia ativa para total sigilo médico.'}
          </p>
        </div>

        {/* BIOMETRIC AUTH CARD */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Autenticação Biométrica</h3>
                <p className="text-xs text-slate-400">Face ID / Touch ID / Biometria Nactiva</p>
              </div>
            </div>

            <button
              onClick={onToggleBiometric}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                settings.biometricAuthEnabled ? 'bg-teal-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          <p className="text-xs text-slate-300">
            {settings.biometricAuthEnabled
              ? 'Solicita validação biométrica nativa a cada abertura do aplicativo.'
              : 'Biometria inativa. O app utilizará apenas PIN/Senha.'}
          </p>
        </div>

      </div>

      {/* REAL-TIME WEB CRYPTO API LABORATORY */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-5 bg-emerald-950/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Laboratório de Cifragem E2EE em Tempo Real (Web Crypto API)
            </h3>
            <p className="text-xs text-slate-400">
              Teste interativo de encriptação AES-256-GCM nativa do navegador.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Plaintext Input */}
          <div className="space-y-3">
            <label className="font-bold text-slate-300 block">Dado Médico em Texto Claro:</label>
            <textarea
              rows={3}
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-sans text-xs focus:ring-1 focus:ring-emerald-500"
            />

            <div className="flex items-center space-x-2">
              <label className="font-bold text-slate-300">Frase Secreta:</label>
              <div className="relative flex-1">
                <input
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleEncryptData}
              disabled={isEncrypting || !plainText}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isEncrypting ? 'Cifrando...' : '🔒 Cifrar com AES-256-GCM (Web Crypto API)'}</span>
            </button>
          </div>

          {/* Ciphertext Output & Decryption */}
          <div className="space-y-3">
            <label className="font-bold text-slate-300 block">Payload Cifrado Base64 (Armazenado no Banco):</label>

            {encryptedPayload ? (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px] overflow-hidden">
                <div>
                  <span className="text-slate-500 block">Ciphertext (Base64):</span>
                  <p className="text-emerald-400 break-all">{encryptedPayload.cipherTextBase64.substring(0, 80)}...</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <p>IV: {encryptedPayload.ivBase64}</p>
                  <p>Salt: {encryptedPayload.saltBase64}</p>
                </div>
                {contentHash && (
                  <p className="text-[10px] text-indigo-400">Hash SHA-256 Auditável: {contentHash.substring(0, 32)}...</p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-500 text-center italic">
                Clique em "Cifrar" para ver o payload AES-256-GCM.
              </div>
            )}

            <button
              onClick={handleDecryptData}
              disabled={isDecrypting || !encryptedPayload}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold text-xs border border-slate-800 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isDecrypting ? 'Decifrando...' : '🔓 Decifrar Payload Cifrado'}</span>
            </button>

            {decryptedText && (
              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40 font-mono text-[11px] text-emerald-200">
                <span className="font-bold block text-white">Resultado Decifrado no Cliente:</span>
                {decryptedText}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* LGPD DATA PORTABILITY CARD */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Portabilidade de Dados (LGPD Art. 18)</h3>
            <p className="text-xs text-slate-400">Exporte todo o seu prontuário em formato JSON estruturado interoperável.</p>
          </div>
        </div>

        <button
          onClick={handleDownloadPortabilityJson}
          className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Prontuário JSON</span>
        </button>
      </div>

    </div>
  );
};
