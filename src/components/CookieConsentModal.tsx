import React, { useState, useRef } from 'react';
import { CookieSettings } from '../types/health';
import { ShieldCheck, Lock, ScrollText, CheckCircle2, AlertCircle, Cookie, ArrowDown } from 'lucide-react';

interface CookieConsentModalProps {
  isOpen: boolean;
  onAccept: (settings: CookieSettings) => void;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  isOpen,
  onAccept,
}) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(true);
  const [essential] = useState(true);
  const [healthTelemetry, setHealthTelemetry] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [communications, setCommunications] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 15) {
        setHasScrolledToEnd(true);
      }
    }
  };

  const handleConfirm = () => {
    onAccept({
      essential: true,
      healthTelemetry,
      analytics,
      communications,
      hasScrolledToEnd: true,
      acceptedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-teal-500/40 space-y-6 shadow-2xl animate-scaleUp text-left">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/30 text-teal-400">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Gestão de Cookies & Termos LGPD (Art. 7° V / 11° II)</h2>
              <p className="text-xs text-slate-300">HUB de Saúde Individual • Transparência e Criptografia E2EE</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase">
            Rolagem Obrigatória
          </span>
        </div>

        {/* FORCED SCROLL LEGAL TERMS BOX */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-200">
              <ScrollText className="w-4 h-4 text-teal-400" />
              Termo de Consentimento para Tratamento de Dados Sensíveis de Saúde:
            </span>
            {!hasScrolledToEnd && (
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                <ArrowDown className="w-3.5 h-3.5" /> Role até o final para habilitar o botão
              </span>
            )}
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed max-h-52 overflow-y-auto space-y-3 shadow-inner"
          >
            <p className="font-bold text-teal-300">1. ESCOPO E FINALIDADE DO TRATAMENTO DE DADOS SENSÍVEIS (LGPD)</p>
            <p>
              Ao utilizar a plataforma HealthHub.AI, você autoriza expressamente o tratamento dos seus dados sensíveis de saúde (incluindo laudos laboratoriais, diagnósticos prévios, frequência cardíaca, oxigenação SpO2, imagens DICOM e receitas médicas) exclusivamente para fins de tutela da saúde, saúde preditiva e compartilhamento com seu médico assistente ou equipe multidisciplinar cadastrada.
            </p>

            <p className="font-bold text-teal-300">2. CRIPTOGRAFIA END-TO-END (E2EE) E ARMAZENAMENTO SEGURO</p>
            <p>
              Todos os documentos anexados são cifrados com a chave privada AES-256 gerada localmente. O acesso por terceiros (médicos e enfermeiros) exige concessão prévia de consentimento revogável a qualquer momento conforme o Artigo 18 da Lei 13.709/2018 (LGPD).
            </p>

            <p className="font-bold text-teal-300">3. USO DE COOKIES E TELEMETRIA DE DISPOSITIVOS</p>
            <p>
              Utilizamos cookies estritamente necessários para manter sua sessão cifrada e cookies de telemetria para sincronizar os dados dos relógios inteligentes (Apple Watch e Google Health Connect). NENHUM dado de saúde é vendido ou compartilhado com redes de publicidade.
            </p>

            <p className="font-bold text-teal-300">4. DIREITOS DO TITULAR DOS DADOS</p>
            <p>
              Você pode solicitar a portabilidade completa do seu prontuário em formato JSON/ZIP, revogar permissões concedidas a médicos específicos ou solicitar a exclusão definitiva da sua conta a qualquer momento no Painel de Segurança.
            </p>

            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-emerald-300 font-sans font-semibold text-center">
              ✓ Você alcançou o final do Termo de Consentimento LGPD. O botão de aceite foi habilitado abaixo.
            </div>
          </div>
        </div>

        {/* GRANULAR COOKIES CHECKBOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Cookies Essenciais</p>
              <p className="text-[10px] text-slate-400">Sessão cifrada E2EE (Obrigatório)</p>
            </div>
            <input type="checkbox" checked={essential} disabled className="rounded text-teal-500 cursor-not-allowed" />
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Telemetria de Saúde / IoT</p>
              <p className="text-[10px] text-slate-400">Apple Health & Health Connect</p>
            </div>
            <input 
              type="checkbox" 
              checked={healthTelemetry} 
              onChange={(e) => setHealthTelemetry(e.target.checked)} 
              className="rounded text-teal-500" 
            />
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Desempenho & Analytics</p>
              <p className="text-[10px] text-slate-400">Melhoria de estabilidade do app</p>
            </div>
            <input 
              type="checkbox" 
              checked={analytics} 
              onChange={(e) => setAnalytics(e.target.checked)} 
              className="rounded text-teal-500" 
            />
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Comunicação Tele-Saúde</p>
              <p className="text-[10px] text-slate-400">Notificações e lembretes de remédio</p>
            </div>
            <input 
              type="checkbox" 
              checked={communications} 
              onChange={(e) => setCommunications(e.target.checked)} 
              className="rounded text-teal-500" 
            />
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Concordar e Acessar Plataforma</span>
          </button>
        </div>

      </div>
    </div>
  );
};
