import React, { useState } from 'react';
import { UserProfile, VitalMetric } from '../types/health';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Heart, 
  Activity, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  Send, 
  Bell,
  Navigation,
  MessageSquare,
  Users
} from 'lucide-react';

interface EmergencySosModalProps {
  profile: UserProfile;
  vitals?: VitalMetric[];
  isOpen: boolean;
  onClose: () => void;
  onDispatchEmergencyAlert: (sosData: {
    locationGps: string;
    vitalsSnapshot: { heartRateBpm: number; spO2Percent: number; bloodPressure: string };
    notifiedContacts: string[];
  }) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  profile,
  vitals = [],
  isOpen,
  onClose,
  onDispatchEmergencyAlert,
}) => {
  const [isDispatched, setIsDispatched] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const currentVital = vitals[0] || {
    heartRateBpm: 68,
    spO2Percent: 99,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76
  };

  const gpsLocationStr = 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP (GPS ± 5m)';
  const emergencyContact = profile.emergencyContacts?.[0] || {
    name: 'Pedro Silva',
    relationship: 'Esposo / Contato de Emergência',
    phoneFormatted: '(11) 99842-1020'
  };

  const handleConfirmDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      onDispatchEmergencyAlert({
        locationGps: gpsLocationStr,
        vitalsSnapshot: {
          heartRateBpm: currentVital.heartRateBpm,
          spO2Percent: currentVital.spO2Percent,
          bloodPressure: `${currentVital.bloodPressureSystolic}/${currentVital.bloodPressureDiastolic}`
        },
        notifiedContacts: [emergencyContact.name, 'Dr. Roberto Mendes', 'Equipe Alpha de Cuidados']
      });
      setIsSending(false);
      setIsDispatched(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900 border-2 border-rose-600/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/50 max-h-[90vh] overflow-y-auto">
        
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/40 text-rose-400 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                Nível 4 • Atendimento de Emergência 24/7
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                SOS Médico & Alerta Rápido
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CLINICAL PROTOCOL NOTICE */}
        <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/30 space-y-2 text-xs text-rose-200">
          <div className="flex items-center space-x-2 font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Orientação de Emergência Médica:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            "Os sintomas informados podem exigir atendimento imediato. Se você está sentindo dor no peito, dor súbita de forte intensidade, falta de ar grave ou fraqueza muscular, procure socorro médico ou ligue 192 imediatamente."
          </p>
        </div>

        {/* DIRECT EMERGENCY CALL BUTTONS */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:192"
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex flex-col items-center justify-center space-y-1 shadow-lg shadow-rose-600/30 transition-all text-center"
          >
            <Phone className="w-6 h-6 animate-bounce" />
            <span className="text-sm">Ligar 192 (SAMU)</span>
            <span className="text-[10px] font-normal opacity-80">Socorro Móvel de Urgência</span>
          </a>

          <a
            href="tel:193"
            className="p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex flex-col items-center justify-center space-y-1 shadow-lg shadow-amber-600/30 transition-all text-center"
          >
            <Phone className="w-6 h-6" />
            <span className="text-sm">Ligar 193 (Bombeiros)</span>
            <span className="text-[10px] font-normal opacity-80">Resgate & Emergências</span>
          </a>
        </div>

        {/* AUTOMATED DISPATCH STATUS / TELEMETRY SNAPSHOT */}
        {!isDispatched ? (
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-extrabold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Instantâneo de Telemetria & Localização GPS</span>
              <span className="text-[10px] text-teal-400 font-mono">Sinal Conectado</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Frequência</span>
                <span className="text-sm font-black text-emerald-400">{currentVital.heartRateBpm} bpm</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Saturação</span>
                <span className="text-sm font-black text-cyan-300">{currentVital.spO2Percent}% SpO2</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Pressão</span>
                <span className="text-sm font-black text-white">{currentVital.bloodPressureSystolic}/{currentVital.bloodPressureDiastolic}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{gpsLocationStr}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Notificar Médico Assistente: <strong>Dr. Roberto Mendes (CRM/SP 148.920)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Notificar Contato: <strong>{emergencyContact.name} ({emergencyContact.phoneFormatted})</strong></span>
              </div>
            </div>

            <button
              onClick={handleConfirmDispatch}
              disabled={isSending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-5 h-5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Transmitindo Alerta Crítico...' : '🚨 Disparar Alerta SOS para Equipe & Família'}</span>
            </button>
          </div>
        ) : (
          <div className="p-6 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-white">Alerta SOS Transmitido com Sucesso!</h3>
            
            <div className="text-xs text-slate-300 space-y-2 text-left bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-emerald-400 font-bold">✓ Médico Assistente e Equipe de Saúde Notificados com prioridade crítica.</p>
              <p className="text-cyan-300 font-bold">✓ Contato de Emergência ({emergencyContact.name}) notificado via SMS/WhatsApp.</p>
              <p className="text-slate-400">✓ Telemetria atual e localização GPS transmitidas para o prontuário.</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs cursor-pointer"
            >
              Fechar Janela
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
