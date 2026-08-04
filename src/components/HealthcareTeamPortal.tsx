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
  PieChart,
  Filter,
  UserCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  X
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
  consents: _consents,
  notes,
  onAddNote,
  conditionsMap: _conditionsMap,
  allergiesMap: _allergiesMap,
  medicationsMap: _medicationsMap,
  inactivityAlerts,
  chatMessages,
  onSendMessage,
}) => {
  const defaultPatient: UserProfile = patients[0] || {
    id: 'user_maria_01',
    name: 'Maria Silva',
    age: 45,
    sex: 'female',
    cpfMasked: '***.482.910-**',
    bloodType: 'A+',
    heightCm: 165,
    weightKg: 68,
    bmi: 24.9,
    phoneFormatted: '(11) 98482-9102',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    careTeamName: 'Microárea 04'
  };

  const [selectedPatient, setSelectedPatient] = useState<UserProfile>(defaultPatient);
  
  const [activeTab, setActiveTab] = useState<'notes' | 'chat' | 'alerts'>('notes');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState<'all' | 'community_visit' | 'nursing' | 'pharmacy' | 'nutrition'>('all');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientFilterAlertsOnly, setPatientFilterAlertsOnly] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Chat input state
  const [chatInputText, setChatInputText] = useState('');

  // New Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteRecs, setNoteRecs] = useState('');
  const [noteCategory, setNoteCategory] = useState<'nursing' | 'pharmacy' | 'nutrition' | 'physiotherapy' | 'community_visit'>('community_visit');

  const defaultMember: TeamMemberProfile = {
    id: 'team_01',
    name: 'Enf. Fernando Alencar',
    role: 'nurse',
    councilId: 'COREN/SP 482.910',
    teamName: 'Equipe de Saúde da Família (ESF II)',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    currentAssignedPatients: 124,
    maxPatientCapacity: 150
  };

  const member = currentMember || (teamMembers && teamMembers[0]) || defaultMember;

  // Capacity calculations
  const assignedCount = member.currentAssignedPatients || 124;
  const maxCapacity = member.maxPatientCapacity || 150;
  const capacityPercent = Math.round((assignedCount / maxCapacity) * 100);

  // Filtered Patients List
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                          (patient.phoneFormatted && patient.phoneFormatted.includes(patientSearchQuery));
    const hasAlert = inactivityAlerts.some(a => a.patientId === patient.id);
    const matchesAlertFilter = !patientFilterAlertsOnly || hasAlert;
    return matchesSearch && matchesAlertFilter;
  });

  // Filtered Notes for Selected Patient
  const patientNotes = notes.filter((n) => n.patientId === selectedPatient.id);
  const filteredNotes = noteCategoryFilter === 'all' 
    ? patientNotes 
    : patientNotes.filter((n) => n.category === noteCategoryFilter);

  const patientChatMessages = (chatMessages || []).filter((m) => m.patientId === selectedPatient.id);
  const patientAlerts = inactivityAlerts.filter((a) => a.patientId === selectedPatient.id);

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
      authorId: member.id,
      authorName: member.name,
      authorRole: member.role,
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
      case 'nurse': return { label: 'Enfermagem', color: 'bg-teal-500/10 text-teal-300 border-teal-500/30', icon: <Stethoscope className="w-3.5 h-3.5" /> };
      case 'pharmacist': return { label: 'Farmácia Clínica', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30', icon: <Pill className="w-3.5 h-3.5" /> };
      case 'nutritionist': return { label: 'Nutrição', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', icon: <Apple className="w-3.5 h-3.5" /> };
      case 'community_health_worker': return { label: 'Agente de Saúde (ACS)', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', icon: <Home className="w-3.5 h-3.5" /> };
      default: return { label: 'Equipe de Saúde', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', icon: <Users className="w-3.5 h-3.5" /> };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. HEADER BANNER: CLEAN & PREMIUM */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={member.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250'}
            alt={member.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Portal dos Agentes de Saúde & Atenção Primária</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{member.name}</h1>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span className="bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800 font-mono text-cyan-300">{member.councilId}</span>
              <span>•</span>
              <span className="text-teal-300 font-semibold">{member.teamName}</span>
            </p>
          </div>
        </div>

        {/* METRICS & CAPACITY WIDGET */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 min-w-[220px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-cyan-400" /> Capacidade do Agente:
              </span>
              <span className="font-extrabold text-white">{assignedCount} / {maxCapacity}</span>
            </div>
            
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityPercent >= 90 ? 'bg-rose-500' : capacityPercent >= 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-teal-400 to-cyan-400'
                }`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-0.5">
              <span>Status: <strong className="text-emerald-400">Atende Microárea 04</strong></span>
              <span className="text-cyan-300">{capacityPercent}% Ocupado</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddNoteModal(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nova Visita / Evolução</span>
          </button>
        </div>
      </div>

      {/* 2. AUTOMATED INACTIVITY / NON-COMPLIANCE ALERTS BANNER */}
      {inactivityAlerts.length > 0 && (
        <div className="glass-panel rounded-3xl p-5 border border-rose-500/40 bg-rose-950/10 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white">
                Alertas Prioritários de Busca Ativa ({inactivityAlerts.length} Pacientes Necessitam de Contato)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {inactivityAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                      {alert.patientName}
                    </span>
                    <span className="text-[10px] text-slate-400">Há 2 dias</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-white mt-1.5">{alert.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{alert.description}</p>
                </div>

                <button
                  onClick={() => {
                    const patient = patients.find(p => p.id === alert.patientId);
                    if (patient) setSelectedPatient(patient);
                    setActiveTab('chat');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contatar via WhatsApp / Chat</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE: SIDEBAR PATIENTS LIST + SELECTED PATIENT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PATIENTS LIST SIDEBAR (COL-4) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 bg-slate-900/90 shadow-xl flex flex-col">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Lista de Pacientes ({filteredPatients.length})</span>
              </h3>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* FILTER PILLS */}
            <div className="flex items-center space-x-2 text-[11px]">
              <button
                onClick={() => setPatientFilterAlertsOnly(false)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  !patientFilterAlertsOnly ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Todos ({patients.length})
              </button>
              <button
                onClick={() => setPatientFilterAlertsOnly(true)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  patientFilterAlertsOnly ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Alertas ({inactivityAlerts.length})
              </button>
            </div>
          </div>

          {/* PATIENT CARDS LIST */}
          <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                Nenhum paciente encontrado com os filtros atuais.
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = selectedPatient.id === patient.id;
                const hasAlert = inactivityAlerts.some(a => a.patientId === patient.id);

                return (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={patient.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'} 
                        alt={patient.name} 
                        className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-slate-700" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{patient.name}</h4>
                          {hasAlert && (
                            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" title="Possui Alerta de Busca Ativa" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> 
                          <span className="truncate">{patient.careTeamName || 'Microárea 04 • USF'}</span>
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* SELECTED PATIENT MAIN CONTENT (COL-8) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 bg-slate-900/90 shadow-xl">
          
          {/* HEADER SELECTED PATIENT */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedPatient.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'} 
                alt={selectedPatient.name} 
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30" 
              />
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Prontuário Multidisciplinar
                </span>
                <h2 className="text-xl font-black text-white mt-1">{selectedPatient.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Telefone: <strong className="text-white">{selectedPatient.phoneFormatted || '(11) 98482-9102'}</strong> • Idade: <strong className="text-white">{selectedPatient.age} anos</strong>
                </p>
              </div>
            </div>

            {/* TAB NAVIGATION BUTTONS */}
            <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs shrink-0">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-xl font-extrabold transition-all cursor-pointer ${
                  activeTab === 'notes' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Prontuário ({patientNotes.length})
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'chat' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contato Online</span>
              </button>
              {patientAlerts.length > 0 && (
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`px-4 py-2 rounded-xl font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'alerts' ? 'bg-rose-500 text-white shadow-md' : 'text-rose-400 hover:text-rose-300'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Alertas ({patientAlerts.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: PRONTUÁRIO MULTIDISCIPLINAR */}
          {activeTab === 'notes' && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  Filtrar por Especialidade Profissional:
                </span>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => setNoteCategoryFilter('all')}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                      noteCategoryFilter === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Todas ({patientNotes.length})
                  </button>
                  <button
                    onClick={() => setNoteCategoryFilter('community_visit')}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                      noteCategoryFilter === 'community_visit' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Agente de Saúde (ACS)
                  </button>
                  <button
                    onClick={() => setNoteCategoryFilter('nursing')}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                      noteCategoryFilter === 'nursing' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Enfermagem
                  </button>
                </div>
              </div>

              {filteredNotes.length === 0 ? (
                <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
                  <ClipboardList className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">Nenhum registro encontrado nesta categoria</h3>
                  <p className="text-xs text-slate-400">Clique em "Registrar Nova Visita / Evolução" para adicionar um acompanhamento para {selectedPatient.name}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotes.map((note) => {
                    const badge = getRoleBadge(note.authorRole);
                    return (
                      <div key={note.id} className="p-6 rounded-3xl bg-slate-950 border border-slate-850 space-y-4 hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.color}`}>
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>
                            <span className="text-sm font-extrabold text-white">{note.authorName}</span>
                          </div>

                          <span className="text-xs text-slate-400 font-mono">
                            {note.timestamp.replace('T', ' ').substring(0, 16)}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-white">{note.title}</h4>
                          <p className="text-xs text-slate-300 mt-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
                            {note.content}
                          </p>
                        </div>

                        {note.recommendations && (
                          <div className="p-3.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-xs text-cyan-200">
                            <strong>Recomendações / Conduta de Campo:</strong> {note.recommendations}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CONTATO ONLINE & WHATSAPP */}
          {activeTab === 'chat' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* WhatsApp Direct Action Banner */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-950 p-5 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Contato Direto via WhatsApp Tele-Saúde</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Inicie uma conversa direta com {selectedPatient.name} pelo telefone {selectedPatient.phoneFormatted}</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/55${selectedPatient.phoneFormatted?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir no WhatsApp</span>
                </a>
              </div>

              {/* Chat Messages Log */}
              <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 space-y-3 max-h-[350px] overflow-y-auto">
                {patientChatMessages.length > 0 ? (
                  patientChatMessages.map((msg) => {
                    const isMe = msg.senderRole !== 'patient';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                          isMe ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-100' : 'bg-slate-900 border border-slate-800 text-slate-200'
                        }`}>
                          <p className="font-bold text-[10px] text-cyan-300">{msg.senderName}</p>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                    <p>Nenhuma mensagem trocada pelo aplicativo. Digite abaixo para enviar um aviso direto ao paciente.</p>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem para o paciente..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="py-3 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar</span>
                </button>
              </form>

            </div>
          )}

          {/* TAB 3: ALERTAS DE BUSCA ATIVA */}
          {activeTab === 'alerts' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-white">Alertas do Paciente ({patientAlerts.length})</h3>
              {patientAlerts.map(alert => (
                <div key={alert.id} className="p-5 bg-slate-950 rounded-2xl border border-rose-500/40 space-y-2">
                  <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded uppercase border border-rose-500/30">
                    Omissão Identificada pelo Sistema
                  </span>
                  <h4 className="text-sm font-extrabold text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-300">{alert.description}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* MODAL: ADICIONAR EVOLUÇÃO MULTIDISCIPLINAR */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-800 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Registrar Evolução / Visita para {selectedPatient.name}</span>
              </h3>
              <button onClick={() => setShowAddNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Categoria do Registro</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value="community_visit">Agente Comunitário de Saúde (Visita Domiciliar)</option>
                  <option value="nursing">Enfermagem (Acompanhamento Sinais Vitais)</option>
                  <option value="pharmacy">Farmácia Clínica (Adesão Posológica)</option>
                  <option value="nutrition">Nutrição (Acompanhamento Dietético)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Título do Atendimento / Visita</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Visita Domiciliar Mensal de Rotina"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Relato de Campo / Observações</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva as condições encontradas, queixas e orientações..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Recomendações / Próximos Passos</label>
                <input
                  type="text"
                  placeholder="Ex: Recomendar agendamento de exame de sangue..."
                  value={noteRecs}
                  onChange={(e) => setNoteRecs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
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
