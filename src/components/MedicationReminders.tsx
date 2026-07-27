import React, { useState } from 'react';
import { UserProfile, Medication, MedicationReminder } from '../types/health';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  Bell, 
  RefreshCw, 
  Stethoscope, 
  Volume2, 
  VolumeX, 
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Send
} from 'lucide-react';

interface MedicationRemindersProps {
  profile: UserProfile;
  medications: Medication[];
  reminders: MedicationReminder[];
  onTakeReminder: (reminderId: string) => void;
  onAddMedication: (medication: Omit<Medication, 'id'>) => void;
  onRequestRefill?: (medication: Medication) => void;
}

export const MedicationReminders: React.FC<MedicationRemindersProps> = ({
  profile,
  medications = [],
  reminders = [],
  onTakeReminder,
  onAddMedication,
  onRequestRefill,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAlarmPopup, setShowAlarmPopup] = useState<MedicationReminder | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refillRequestedIds, setRefillRequestedIds] = useState<string[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1x ao dia (08:00)');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [totalDoses, setTotalDoses] = useState(30);
  const [purpose, setPurpose] = useState('');

  // Low stock medications (remaining <= refillReminderThreshold)
  const lowStockMeds = medications.filter(
    (m) => m.remainingDoses <= (m.refillReminderThreshold || 5)
  );

  const handleTakeWithAlarm = (reminder: MedicationReminder) => {
    onTakeReminder(reminder.id);
    if (soundEnabled) {
      setShowAlarmPopup(reminder);
      setTimeout(() => setShowAlarmPopup(null), 3000);
    }
  };

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    onAddMedication({
      name,
      dosage,
      frequency,
      scheduleTimes: [scheduleTime],
      remainingDoses: totalDoses,
      totalDoses,
      refillReminderThreshold: 5,
      adherenceRatePercent: 100,
      prescribingDoctor: 'Dr. Roberto Mendes',
      purpose: purpose || 'Tratamento de rotina',
      instructions: 'Tomar com 1 copo de água.'
    });

    setName('');
    setDosage('');
    setShowAddModal(false);
  };

  const handleTriggerRefillRequest = (med: Medication) => {
    if (onRequestRefill) onRequestRefill(med);
    setRefillRequestedIds(prev => [...prev, med.id]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* SIMULATED SOUND ALARM POPUP */}
      {showAlarmPopup && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-bold shadow-2xl flex items-center space-x-3 animate-bounce">
          <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <p className="font-extrabold text-white">Dose Confirmada!</p>
            <p className="text-[10px] text-slate-300">Registrado no histórico de tomadas de {showAlarmPopup.medicationName}.</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4 text-amber-400" />
            <span>Gestão de Tratamento & Automação de Estoque</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Agenda de Medicamentos & Controle de Saldo
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Acompanhamento diário com contagem automática de comprimidos restantes e solicitação preventiva de receita médica.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all ${
              soundEnabled 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Som Ativo' : 'Mudo'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Medicamento</span>
          </button>
        </div>
      </div>

      {/* LOW STOCK AUTOMATED ALERT BANNER */}
      {lowStockMeds.length > 0 && (
        <div className="glass-panel rounded-3xl p-5 border border-amber-500/40 bg-amber-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-sm font-extrabold text-white">
                Alerta de Estoque Baixo ({lowStockMeds.length} Medicamento em Cota Crítica)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              Solicitação Automática de Receita Enviada ao Médico
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowStockMeds.map((med) => {
              const isRequested = refillRequestedIds.includes(med.id);
              return (
                <div key={med.id} className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      Restam apenas {med.remainingDoses} comprimidos
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{med.name} {med.dosage}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Prescrito por: {med.prescribingDoctor}</p>
                  </div>

                  <button
                    onClick={() => handleTriggerRefillRequest(med)}
                    disabled={isRequested}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                      isRequested
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                    }`}
                  >
                    {isRequested ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isRequested ? 'Receita Solicitada!' : 'Solicitar Renovação'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID: SCHEDULE VS MEDICATIONS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TODAY SCHEDULE TIMELINE */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Cronograma de Hoje ({reminders.length} Doses)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Status em Tempo Real</span>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => {
              const isTaken = rem.status === 'taken';
              return (
                <div
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isTaken 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                      : 'glass-card border-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl ${isTaken ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">Horário: {rem.scheduledTime}</span>
                      <h4 className="text-sm font-bold text-white">{rem.medicationName}</h4>
                      <p className="text-xs text-slate-300">Dose: {rem.dosage}</p>
                    </div>
                  </div>

                  {isTaken ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tomado às {rem.takenAt || '08:02'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTakeWithAlarm(rem)}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                      Tomar Agora
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MEDICATIONS CATALOG & DOSE STOCK COUNTERS */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-teal-400" />
              Controle de Saldo de Frascos & Remédios
            </h3>
            <span className="text-[10px] text-teal-300 font-bold uppercase">Decremento Automático</span>
          </div>

          <div className="space-y-3">
            {medications.map((med) => {
              const stockPercent = Math.round((med.remainingDoses / med.totalDoses) * 100);
              const isCritical = med.remainingDoses <= (med.refillReminderThreshold || 5);

              return (
                <div key={med.id} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{med.name} {med.dosage}</h4>
                      <p className="text-slate-400 text-[11px]">{med.purpose} • {med.frequency}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase ${
                      isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {med.remainingDoses} / {med.totalDoses} Doses
                    </span>
                  </div>

                  {/* Stock Bar Meter */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isCritical ? 'bg-rose-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Saldo Atual: {stockPercent}%</span>
                      <span>Médico: {med.prescribingDoctor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL: ADD MEDICATION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4 animate-scaleUp text-left">
            <h3 className="text-lg font-bold text-white">Cadastrar Novo Medicamento</h3>
            <form onSubmit={handleCreateMedication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nome do Medicamento</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Losartana Potássica"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Dosagem</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 50 mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Total de Doses na Caixa</label>
                  <input
                    type="number"
                    min={1}
                    value={totalDoses}
                    onChange={(e) => setTotalDoses(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Cadastrar Remédio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
