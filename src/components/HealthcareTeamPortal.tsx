import React, { useState } from 'react';
import { 
  UserProfile, 
  TeamMemberProfile, 
  MultidisciplinaryNote, 
  LgpdConsent, 
  ChronicCondition, 
  Allergy, 
  Medication,
  PatientInactivityAlert,
  TelehealthChatMessage
} from '../types/health';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Stethoscope, 
  Pill, 
  Apple, 
  Activity, 
  FileText, 
  Clock, 
  Search,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Send,
  PhoneCall,
  ExternalLink,
  Sliders,
  PieChart
} from 'lucide-react';

interface HealthcareTeamPortalProps {
  currentMember: TeamMemberProfile;
  teamMembers: TeamMemberProfile[];
  patients: UserProfile[];
  consents: LgpdConsent[];
  notes: MultidisciplinaryNote[];
  onAddNote: (note: Omit<MultidisciplinaryNote, 'id' | 'timestamp'>) => void;
  conditionsMap: Record<string, ChronicCondition[]>;
  allergiesMap: Record<string, Allergy[]>;
  medicationsMap: Record<string, Medication[]>;
  inactivityAlerts: PatientInactivityAlert[];
  chatMessages: TelehealthChatMessage[];
  onSendMessage: (text: string, patientId: string) => void;
}

export const HealthcareTeamPortal: React.FC<HealthcareTeamPortalProps> = ({
  currentMember,
  teamMembers,
  patients,
  consents,
  notes,
  onAddNote,
  conditionsMap,
  allergiesMap,
  medicationsMap,
  inactivityAlerts,
  chatMessages,
  onSendMessage,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<UserProfile>(patients[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'nursing' | 'community_visit' | 'chat'>('all');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Chat input state
  const [chatInputText, setChatInputText] = useState('');

  // New Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteRecs, setNoteRecs] = useState('');
  const [noteCategory, setNoteCategory] = useState<'nursing' | 'pharmacy' | 'nutrition' | 'physiotherapy' | 'community_visit'>('community_visit');

  const patientNotes = notes.filter((n) => n.patientId === selectedPatient.id);
  const filteredNotes = activeCategory === 'all' 
    ? patientNotes 
    : patientNotes.filter((n) => n.category === activeCategory);

  const member = currentMember || (teamMembers && teamMembers[0]) || {
    id: 'team_01',
    name: 'Enf. Fernando Alencar',
    role: 'Enfermeiro de Tele-Triagem',
    currentAssignedPatients: 124,
    maxPatientCapacity: 150
  };

  // Patient Load Capacity
  const assignedCount = member.currentAssignedPatients || 124;
  const maxCapacity = member.maxPatientCapacity || 150;
  const capacityPercent = Math.round((assignedCount / maxCapacity) * 100);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    onSendMessage(chatInputText, selectedPatient.id);
    setChatInputText('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    onAddNote({
      patientId: selectedPatient.id,
      authorId: currentMember.id,
      authorName: currentMember.name,
      authorRole: currentMember.role,
      category: noteCategory,
      title: noteTitle,
      content: noteContent,
      recommendations: noteRecs || 'Manter acompanhamento com o Agente Comunitário de Saúde (ACS).'
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteRecs('');
    setShowAddNoteModal(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'nurse': return { label: 'Enfermagem', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: <Stethoscope className="w-3.5 h-3.5" /> };
      case 'pharmacist': return { label: 'Farmácia Clínica', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: <Pill className="w-3.5 h-3.5" /> };
      case 'nutritionist': return { label: 'Nutrição', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: <Apple className="w-3.5 h-3.5" /> };
      case 'community_health_worker': return { label: 'Agente de Saúde (ACS)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: <Home className="w-3.5 h-3.5" /> };
      default: return { label: 'Equipe de Saúde', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: <Users className="w-3.5 h-3.5" /> };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Team Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30">
        <div className="flex items-center space-x-4">
          <img
            src={currentMember.avatarUrl}
            alt={currentMember.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10"
          />
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Users className="w-4 h-4" />
              <span>Portal Multidisciplinar & Atenção Primária (ACS)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{currentMember.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentMember.councilId} • <span className="text-teal-300 font-semibold">{currentMember.teamName}</span>
            </p>
          </div>
        </div>

        {/* MAXIMUM PATIENT CAPACITY CAP METER */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2 shrink-0">
          <div className="flex items-center justify-between space-x-4 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <PieChart className="w-4 h-4 text-cyan-400" /> Cota Máxima de Pacientes:
            </span>
            <span className="font-extrabold text-white">
              {assignedCount} / {maxCapacity} Pacientes
            </span>
          </div>

          {/* Meter Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all ${
                capacityPercent >= 90 ? 'bg-rose-500' : capacityPercent >= 75 ? 'bg-amber-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 text-right">
            {capacityPercent}% da cota utilizada (Limite Teto: 150 por ACS)
          </p>
        </div>
      </div>

      {/* AUTOMATED NON-COMPLIANCE ALERTS RIBBON */}
      {inactivityAlerts.length > 0 && (
        <div className="glass-panel rounded-3xl p-5 border border-rose-500/40 bg-rose-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white">
                Alertas Automáticos de Omissão de Preenchimento / Inatividade ({inactivityAlerts.length})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inactivityAlerts.map((alert) => (
              <div key={alert.id} className="p-3.5 bg-slate-900/90 rounded-2xl border border-rose-500/30 flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    {alert.patientName}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1">{alert.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{alert.description}</p>
                </div>

                <button
                  onClick={() => {
                    const patient = patients.find(p => p.id === alert.patientId);
                    if (patient) setSelectedPatient(patient);
                    setActiveCategory('chat');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Contatar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PATIENTS & CLINICAL CHAT / EVOLUTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PATIENT LIST SIDEBAR */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Pacientes sob Monitoramento ({patients.length})
            </h3>
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="p-1 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
              title="Adicionar Nota"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {patients.map((patient) => {
              const isSelected = selectedPatient.id === patient.id;
              const hasAlert = inactivityAlerts.some(a => a.patientId === patient.id);

              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-teal-950/60 border-teal-500/40 text-white shadow-md shadow-teal-500/10' 
                      : 'glass-card border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{patient.name}</h4>
                        {hasAlert && (
                          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" /> {patient.careTeamName || 'Micro-área 04'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED PATIENT CLINICAL NOTES & ONLINE CHAT */}
        {selectedPatient && (
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
            
            {/* Header Patient Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">{selectedPatient.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tel: <span className="text-slate-200 font-semibold">{selectedPatient.phoneFormatted || '(11) 98482-9102'}</span> • Acompanhamento Domiciliar & Tele-Saúde
                </p>
              </div>

              {/* Sub-Tabs */}
              <div className="flex space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs overflow-x-auto">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeCategory === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Prontuário Equipe
                </button>
                <button
                  onClick={() => setActiveCategory('chat')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                    activeCategory === 'chat' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Contato Online
                </button>
              </div>
            </div>

            {/* TAB: ONLINE CHAT TELE-HEALTH */}
            {activeCategory === 'chat' ? (
              <div className="space-y-4">
                
                {/* External WhatsApp Direct Button */}
                <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Contato Direto via WhatsApp Tele-Saúde</h4>
                      <p className="text-[11px] text-slate-300">Inicie uma conversa imediata pelo telefone {selectedPatient.phoneFormatted}</p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/55${selectedPatient.phoneFormatted?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir WhatsApp</span>
                  </a>
                </div>

                {/* Chat History Box */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 max-h-80 overflow-y-auto">
                  {patientChatMessages.length > 0 ? (
                    patientChatMessages.map((msg) => {
                      const isMe = msg.senderRole !== 'patient';
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                            isMe ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100' : 'bg-slate-900 border border-slate-800 text-slate-200'
                          }`}>
                            <p className="font-bold text-[10px] text-cyan-300">{msg.senderName}</p>
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">
                      Nenhuma mensagem enviada. Digite abaixo para iniciar o contato online de apoio.
                    </p>
                  )}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendChat} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem de apoio ao paciente..."
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                  </button>
                </form>

              </div>
            ) : (
              /* TAB: MULTIDISCIPLINARY EVOLUTION NOTES */
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Evoluções Registradas no Prontuário ({filteredNotes.length})</h3>

                <div className="space-y-3">
                  {filteredNotes.map((note) => {
                    const badge = getRoleBadge(note.authorRole);
                    return (
                      <div key={note.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.color}`}>
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>
                            <span className="text-xs font-bold text-white">{note.authorName}</span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {note.timestamp.replace('T', ' ').substring(0, 16)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mt-1">{note.title}</h4>
                        <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL: ADD MULTIDISCIPLINARY NOTE */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4 animate-scaleUp text-left">
            <h3 className="text-lg font-bold text-white">Registrar Evolução / Visita Domiciliar</h3>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Categoria Profissional</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="community_visit">Agente Comunitário de Saúde (Visita Domiciliar)</option>
                  <option value="nursing">Enfermagem</option>
                  <option value="pharmacy">Farmácia Clínica</option>
                  <option value="nutrition">Nutrição</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Título da Visita / Atendimento</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Visita Domiciliar Mensal de Acompanhamento"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descrição do Acompanhamento de Campo</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Relato das condições do domicílio, checagem da caixa de remédios e queixas..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
