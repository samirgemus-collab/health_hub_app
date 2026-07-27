import React, { useState } from 'react';
import { 
  UserProfile, 
  ChronicCondition, 
  Allergy, 
  SurgicalHistory, 
  FamilyHistoryItem 
} from '../types/health';
import { 
  Stethoscope, 
  AlertOctagon, 
  Scissors, 
  Users, 
  Plus, 
  CheckCircle2, 
  ShieldAlert, 
  FileCode, 
  Info,
  Calendar,
  UserCheck
} from 'lucide-react';

interface MedicalHistoryProps {
  profile: UserProfile;
  conditions: ChronicCondition[];
  allergies: Allergy[];
  surgeries: SurgicalHistory[];
  familyHistory: FamilyHistoryItem[];
  onAddCondition: (cond: Omit<ChronicCondition, 'id'>) => void;
  onAddAllergy: (all: Omit<Allergy, 'id'>) => void;
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  profile,
  conditions,
  allergies,
  surgeries,
  familyHistory,
  onAddCondition,
  onAddAllergy,
}) => {
  const [activeTab, setActiveTab] = useState<'conditions' | 'allergies' | 'surgeries' | 'family' | 'fhir'>('conditions');
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  // New Condition Form State
  const [newCondName, setNewCondName] = useState('');
  const [newCondIcd, setNewCondIcd] = useState('');
  const [newCondDoctor, setNewCondDoctor] = useState('');
  const [newCondNotes, setNewCondNotes] = useState('');

  // New Allergy Form State
  const [newAllSubstance, setNewAllSubstance] = useState('');
  const [newAllType, setNewAllType] = useState<'drug' | 'food' | 'environmental'>('drug');
  const [newAllSeverity, setNewAllSeverity] = useState<'mild' | 'moderate' | 'severe_anaphylaxis'>('moderate');
  const [newAllReaction, setNewAllReaction] = useState('');

  const handleCreateCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondName) return;
    onAddCondition({
      name: newCondName,
      icdCode: newCondIcd || 'CID-10 R69',
      diagnosedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      treatingPhysician: newCondDoctor || 'Dr. Médico Assistente',
      notes: newCondNotes || 'Cadastrado no histórico individual do paciente.'
    });
    setNewCondName('');
    setNewCondIcd('');
    setNewCondDoctor('');
    setNewCondNotes('');
    setShowConditionModal(false);
  };

  const handleCreateAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllSubstance) return;
    onAddAllergy({
      substance: newAllSubstance,
      type: newAllType,
      severity: newAllSeverity,
      reaction: newAllReaction || 'Reação registrada pelo paciente.'
    });
    setNewAllSubstance('');
    setNewAllReaction('');
    setShowAllergyModal(false);
  };

  // FHIR interoperability preview generator
  const fhirConditionsJson = JSON.stringify({
    resourceType: "Bundle",
    type: "collection",
    entry: conditions.map(c => ({
      resource: {
        resourceType: "Condition",
        id: c.id,
        clinicalStatus: { coding: [{ code: c.status }] },
        code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: c.icdCode, display: c.name }] },
        subject: { reference: `Patient/${profile.id}`, display: profile.name },
        onsetDateTime: c.diagnosedDate,
        note: [{ text: c.notes }]
      }
    }))
  }, null, 2);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Módulo C • Prontuário Eletrônico Pessoal (PEP/FHIR)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            História Médica Pregressa & Condições Crônicas
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Centralização de diagnósticos prévios, alergias de alto risco, intervenções cirúrgicas e hereditariedade biológica de {profile.name}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowConditionModal(true)}
            className="py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-teal-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Doença Crônica</span>
          </button>
          <button
            onClick={() => setShowAllergyModal(true)}
            className="py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center space-x-2 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Registrar Alergia</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('conditions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'conditions'
              ? 'bg-teal-950/80 text-teal-300 border border-teal-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doenças Crônicas ({conditions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('allergies')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'allergies'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Alergias & Reações ({allergies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('surgeries')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'surgeries'
              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Cirurgias & Internações ({surgeries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'family'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Histórico Familiar ({familyHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fhir')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'fhir'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Interoperabilidade FHIR R4</span>
        </button>
      </div>

      {/* TAB CONTENT: Chronic Conditions */}
      {activeTab === 'conditions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conditions.map((cond) => (
            <div key={cond.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                    CID: {cond.icdCode}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{cond.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  cond.status === 'controlled' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {cond.status === 'controlled' ? 'Controlada' : 'Em Acompanhamento'}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {cond.notes}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" /> {cond.treatingPhysician}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Desde {cond.diagnosedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Allergies */}
      {activeTab === 'allergies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allergies.map((all) => (
            <div key={all.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    all.type === 'drug' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {all.type === 'drug' ? 'Alergia Medicamentosa' : all.type === 'food' ? 'Alergia Alimentar' : 'Ambiental'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{all.substance}</h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  all.severity === 'severe_anaphylaxis'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : all.severity === 'moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {all.severity === 'severe_anaphylaxis' ? '⚠️ Anafilaxia / Grave' : all.severity === 'moderate' ? 'Moderada' : 'Leve'}
                </span>
              </div>

              <div className="bg-rose-950/20 rounded-xl p-3 border border-rose-500/20 text-xs text-rose-200">
                <span className="font-semibold text-rose-400">Sintomas/Reação: </span>
                {all.reaction}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Surgeries */}
      {activeTab === 'surgeries' && (
        <div className="space-y-4">
          {surgeries.map((surg) => (
            <div key={surg.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
                  <Scissors className="w-4 h-4" />
                  <span>Data: {surg.date}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{surg.procedure}</h3>
                <p className="text-xs text-slate-300 mt-1">{surg.notes}</p>
              </div>

              <div className="text-right text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 shrink-0">
                <p className="font-bold text-slate-200">{surg.hospital}</p>
                <p className="text-slate-400">{surg.surgeon}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Family History */}
      {activeTab === 'family' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {familyHistory.map((fam) => (
            <div key={fam.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Parentesco: {fam.relation}
              </span>
              <h3 className="text-sm font-bold text-white mt-2">{fam.condition}</h3>
              {fam.ageAtDiagnosis && (
                <p className="text-xs text-slate-400">Diagnosticado aos {fam.ageAtDiagnosis} anos</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: FHIR JSON Interoperability */}
      {activeTab === 'fhir' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400">
              <FileCode className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Mapeamento FHIR R4 (HL7 Standard)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Resource: Bundle/Condition</span>
          </div>

          <p className="text-xs text-slate-300">
            Estes registros de saúde podem ser exportados via API RESTful FHIR diretamente para sistemas hospitalares TASY, MV Soul e FHIR Cloud Repositories.
          </p>

          <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-96">
            {fhirConditionsJson}
          </pre>
        </div>
      )}

      {/* Modal: Add Condition */}
      {showConditionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-white">Cadastrar Doença Crônica / Condição</h3>
            <form onSubmit={handleCreateCondition} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome da Condição</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Asma Brônquica"
                  value={newCondName}
                  onChange={(e) => setNewCondName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Código CID-10 (opcional)</label>
                <input
                  type="text"
                  placeholder="ex: J45"
                  value={newCondIcd}
                  onChange={(e) => setNewCondIcd(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Médico Assistente</label>
                <input
                  type="text"
                  placeholder="ex: Dr. Carlos Pneumologista"
                  value={newCondDoctor}
                  onChange={(e) => setNewCondDoctor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Observações Médicas</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes sobre tratamento e frequência..."
                  value={newCondNotes}
                  onChange={(e) => setNewCondNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConditionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                >
                  Salvar Condição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Allergy */}
      {showAllergyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-white">Registrar Alergia / Reação</h3>
            <form onSubmit={handleCreateAllergy} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Substância Alérgena</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ibuprofeno ou Látex"
                  value={newAllSubstance}
                  onChange={(e) => setNewAllSubstance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Alergia</label>
                  <select
                    value={newAllType}
                    onChange={(e) => setNewAllType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="drug">Medicamentosa</option>
                    <option value="food">Alimentar</option>
                    <option value="environmental">Ambiental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Severidade</label>
                  <select
                    value={newAllSeverity}
                    onChange={(e) => setNewAllSeverity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="mild">Leve</option>
                    <option value="moderate">Moderada</option>
                    <option value="severe_anaphylaxis">Grave / Anafilaxia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descrição da Reação</label>
                <textarea
                  rows={2}
                  placeholder="ex: Inchaço nos lábios, edemas, erupções..."
                  value={newAllReaction}
                  onChange={(e) => setNewAllReaction(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllergyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20"
                >
                  Registrar Alergia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
