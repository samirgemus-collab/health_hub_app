import React, { useState } from 'react';
import { UserProfile, FamilyHealthHistory, FamilyRelationship } from '../types/health';
import { mockFamilyHealthHistory } from '../mock/healthData';
import { 
  Users, 
  Plus, 
  Heart, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Info,
  Calendar,
  FileText
} from 'lucide-react';

interface FamilyHistoryModuleProps {
  profile: UserProfile;
}

export const FamilyHistoryModule: React.FC<FamilyHistoryModuleProps> = ({ profile }) => {
  const [historyList, setHistoryList] = useState<FamilyHealthHistory[]>(mockFamilyHealthHistory);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal Form State
  const [relationship, setRelationship] = useState<FamilyRelationship>('mother');
  const [conditionName, setConditionName] = useState<string>('');
  const [ageAtDiagnosis, setAgeAtDiagnosis] = useState<string>('50');
  const [notes, setNotes] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getRelationshipLabel = (rel: FamilyRelationship) => {
    switch (rel) {
      case 'mother': return 'Mãe';
      case 'father': return 'Pai';
      case 'sibling': return 'Irmão / Irmã';
      case 'child': return 'Filho / Filha';
      case 'maternal_grandmother': return 'Avó Materna';
      case 'maternal_grandfather': return 'Avô Materno';
      case 'paternal_grandmother': return 'Avó Paterna';
      case 'paternal_grandfather': return 'Avô Paterno';
      case 'maternal_uncle_aunt': return 'Tio / Tia Materna';
      case 'paternal_uncle_aunt': return 'Tio / Tia Paterna';
      default: return 'Outro Parente';
    }
  };

  const getBranch = (rel: FamilyRelationship): 'maternal' | 'paternal' | 'direct' => {
    if (rel.startsWith('maternal')) return 'maternal';
    if (rel.startsWith('paternal')) return 'paternal';
    return 'direct';
  };

  const handleAddFamilyRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conditionName) return;

    const newRecord: FamilyHealthHistory = {
      id: `fam_hist_${Date.now()}`,
      patientId: profile.id,
      relationship,
      relationshipLabel: getRelationshipLabel(relationship),
      conditionCode: 'COND_USER_DEF',
      conditionName,
      ageAtDiagnosis: parseInt(ageAtDiagnosis, 10) || 50,
      maternalOrPaternalBranch: getBranch(relationship),
      notes: notes || 'Condição informada pelo usuário.',
      sourceType: 'manual_user',
      validationStatus: 'pending_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setHistoryList(prev => [newRecord, ...prev]);
    setShowAddModal(false);
    setConditionName('');
    setNotes('');
    triggerToast('Histórico familiar registrado com sucesso!');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* MODULE HEADER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Módulo de Prevenção • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Histórico Familiar de Saúde
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Registre condições de saúde relevantes da sua família para personalizar seu acompanhamento preventivo.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Condição Familiar</span>
        </button>
      </div>

      {/* MANDATORY CLINICAL EDUCATIONAL DISCLAIMER */}
      <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 flex items-center space-x-3 text-xs text-indigo-200">
        <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="leading-relaxed">
          <strong>Aviso Educativo:</strong> O histórico familiar ajuda na personalização da prevenção e no rastreamento precoce, mas não significa que uma doença irá necessariamente ocorrer.
        </p>
      </div>

      {/* FAMILY HISTORY RECORDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historyList.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 font-bold text-xs">
                  {item.relationshipLabel || getRelationshipLabel(item.relationship)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                  Linhagem {item.maternalOrPaternalBranch === 'maternal' ? 'Materna' : item.maternalOrPaternalBranch === 'paternal' ? 'Paterna' : 'Direta'}
                </span>
              </div>

              <span className="text-[10px] bg-slate-900 text-amber-300 px-2.5 py-1 rounded-md border border-slate-800">
                Informado por você (Pendente de Revisão)
              </span>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-white">{item.conditionName}</h4>
              {item.ageAtDiagnosis && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Idade aproximada no diagnóstico: <strong>{item.ageAtDiagnosis} anos</strong>
                </p>
              )}
            </div>

            {item.notes && (
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
                {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MODAL ADICIONAR CONDIÇÃO FAMILIAR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Registrar Condição do Histórico Familiar</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFamilyRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Grau de Parentesco</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold"
                >
                  <option value="mother">Mãe</option>
                  <option value="father">Pai</option>
                  <option value="sibling">Irmão / Irmã</option>
                  <option value="child">Filho / Filha</option>
                  <option value="maternal_grandmother">Avó Materna</option>
                  <option value="maternal_grandfather">Avô Materno</option>
                  <option value="paternal_grandmother">Avó Paterna</option>
                  <option value="paternal_grandfather">Avô Paterno</option>
                  <option value="maternal_uncle_aunt">Tio / Tia Materna</option>
                  <option value="paternal_uncle_aunt">Tio / Tia Paterna</option>
                  <option value="other">Outro Parente</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Condição de Saúde ou Doença</label>
                <input
                  type="text"
                  placeholder="Ex: Hipertensão, Diabetes Tipo 2, Infarto..."
                  value={conditionName}
                  onChange={(e) => setConditionName(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Idade Aproximada no Diagnóstico</label>
                <input
                  type="number"
                  value={ageAtDiagnosis}
                  onChange={(e) => setAgeAtDiagnosis(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Observações / Detalhes</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Sob controle com medicação..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 p-4 bg-teal-500 text-slate-950 font-black text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
