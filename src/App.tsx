import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MedicalHistory } from './components/MedicalHistory';
import { MedicationReminders } from './components/MedicationReminders';
import { PreventiveCareAgent } from './components/PreventiveCareAgent';
import { MedicalReports } from './components/MedicalReports';
import { WearablesConnector } from './components/WearablesConnector';
import { SecurityPanel } from './components/SecurityPanel';
import { DoctorPortal } from './components/DoctorPortal';
import { HealthcareTeamPortal } from './components/HealthcareTeamPortal';
import { AdminPortal } from './components/AdminPortal';
import { CookieConsentModal } from './components/CookieConsentModal';
import { ClinicalRiskCalculators } from './components/ClinicalRiskCalculators';
import { PatientJornadaTimeline } from './components/PatientJornadaTimeline';
import { PopulationHealthCoordinator } from './components/PopulationHealthCoordinator';
import { ClinicalAiGovernanceEngine } from './components/ClinicalAiGovernanceEngine';
import { HomePage } from './components/HomePage';
import { LandingPage } from './components/LandingPage';
import { SegSaudeAuthModal } from './components/SegSaudeAuthModal';
import { MinhaVacinacaoModule } from './components/MinhaVacinacaoModule';
import { EmergencySosModal } from './components/EmergencySosModal';
import { PreventiveCheckupModule } from './components/PreventiveCheckupModule';
import { FamilyHistoryModule } from './components/FamilyHistoryModule';
import { PatientProfileRegistrationModal } from './components/PatientProfileRegistrationModal';
import { HealthMapModule } from './components/HealthMapModule';
import { PreventiveAgendaModule } from './components/PreventiveAgendaModule';
import { PreventivePlanModule } from './components/PreventivePlanModule';

import { supabase, currentAppMode } from './lib/supabaseClient';
import { roleToPortal } from './lib/appMode';
import { Lock, ShieldAlert, LogOut } from 'lucide-react';


import { 
  mockProfiles, 
  mockDoctors, 
  mockTeamMembers, 
  mockMultidisciplinaryNotes, 
  mockInactivityAlerts, 
  mockChatMessages, 
  mockLgpdConsents, 
  mockAuditLogs, 
  mockChronicConditions, 
  mockAllergies, 
  mockSurguries, 
  mockFamilyHistory, 
  mockMedications, 
  mockMedicationReminders, 
  mockPreventiveRecommendations, 
  mockMedicalReports, 
  mockVitalMetrics, 
  mockWearableDevices, 
  mockSecuritySettings,
  mockSubscriptions,
  mockChronicProtocols,
  mockPrescribedProtocols,
  mockRefillRequests,
  mockTimelineEvents 
} from './mock/healthData';

import { 
  UserProfile, 
  UserRole, 
  MultidisciplinaryNote, 
  TelehealthChatMessage, 
  ChronicCondition, 
  Allergy, 
  Medication, 
  MedicationReminder, 
  PreventiveCareRecommendation, 
  MedicalReport,
  CookieSettings,
  PrescribedProtocol,
  MedicationRefillRequest,
  ClinicalTimelineEvent
} from './types/health';

export function App() {
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(mockProfiles[0]);
  const [userRole, setUserRole] = useState<UserRole>('doctor');
  const [activeTab, setActiveTab] = useState<string>('doctor');

  // Supabase auth state for 'real' mode
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(currentAppMode === 'real');

  useEffect(() => {
    if (currentAppMode !== 'real' || !supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // COOKIE CONSENT STATE
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    essential: true,
    healthTelemetry: true,
    analytics: true,
    communications: true,
    hasScrolledToEnd: false
  });

  const [isSegSaudeAuthOpen, setIsSegSaudeAuthOpen] = useState(false);

  // Dynamic user data states
  const [conditionsMap, setConditionsMap] = useState(mockChronicConditions);
  const [allergiesMap, setAllergiesMap] = useState(mockAllergies);
  const [medicationsMap, setMedicationsMap] = useState(mockMedications);
  const [remindersMap, setRemindersMap] = useState(mockMedicationReminders);
  const [preventiveMap, setPreventiveMap] = useState(mockPreventiveRecommendations);
  const [reportsMap, setReportsMap] = useState(mockMedicalReports);
  const [consents, setConsents] = useState(mockLgpdConsents);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  const [notes, setNotes] = useState<MultidisciplinaryNote[]>(mockMultidisciplinaryNotes);
  const [inactivityAlerts, setInactivityAlerts] = useState(mockInactivityAlerts);
  const [chatMessages, setChatMessages] = useState<TelehealthChatMessage[]>(mockChatMessages);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [prescribedProtocols, setPrescribedProtocols] = useState<PrescribedProtocol[]>(mockPrescribedProtocols);
  const [refillRequests, setRefillRequests] = useState<MedicationRefillRequest[]>(mockRefillRequests);
  const [timelineEvents, setTimelineEvents] = useState<ClinicalTimelineEvent[]>(mockTimelineEvents);

  // Security states
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);

  const currentConditions = conditionsMap[currentProfile.id] || [];
  const currentAllergies = allergiesMap[currentProfile.id] || [];
  const currentSurgeries = mockSurguries[currentProfile.id] || [];
  const currentFamilyHistory = mockFamilyHistory[currentProfile.id] || [];
  const currentMedications = medicationsMap[currentProfile.id] || [];
  const currentReminders = remindersMap[currentProfile.id] || [];
  const currentPreventive = preventiveMap[currentProfile.id] || [];
  const currentReports = reportsMap[currentProfile.id] || [];

  // Emergency SOS State
  const [isEmergencySosOpen, setIsEmergencySosOpen] = useState(false);
  const [isProfileRegistrationOpen, setIsProfileRegistrationOpen] = useState(false);

  const handleUpdateProfile = (updatedFields: Partial<UserProfile>) => {
    setCurrentProfile(prev => ({ ...prev, ...updatedFields }));
  };

  const handleDispatchEmergencyAlert = (sosData: {
    locationGps: string;
    vitalsSnapshot: { heartRateBpm: number; spO2Percent: number; bloodPressure: string };
    notifiedContacts: string[];
  }) => {
    // 1. Create Critical Event in Clinical Timeline
    const criticalTimelineEvent: ClinicalTimelineEvent = {
      id: `evt_sos_${Date.now()}`,
      patientId: currentProfile.id,
      tenantId: 'tenant_01',
      eventType: 'alert',
      eventDate: new Date().toISOString().split('T')[0],
      title: '🚨 DISPARO DE ALERTA DE EMERGÊNCIA SOS 24/7',
      professionalSummary: `Alerta Crítico SOS acionado pelo paciente. Localização: ${sosData.locationGps}. Telemetria: FC ${sosData.vitalsSnapshot.heartRateBpm} bpm, SpO2 ${sosData.vitalsSnapshot.spO2Percent}%, PA ${sosData.vitalsSnapshot.bloodPressure}. Notificados: ${sosData.notifiedContacts.join(', ')}.`,
      patientSummary: 'Você disparou o Alerta SOS de Emergência Médica. A equipe de saúde e seus contatos de emergência foram notificados.',
      sourceSystem: 'Dono da Saúde SOS Engine',
      sourceRecordId: `sos_${Date.now()}`,
      clinicalStatus: 'finding',
      priority: 'critical',
      visibilityToPatient: 'visible',
      createdAt: new Date().toISOString()
    };

    setTimelineEvents(prev => [criticalTimelineEvent, ...prev]);
  };

  // Handlers
  const handleSelectProfile = (p: UserProfile) => {
    setCurrentProfile(p);
  };

  const handleAcceptCookies = (settings: CookieSettings) => {
    setCookieSettings(settings);
    setShowCookieModal(false);
  };

  const handleValidateTimelineEvent = (eventId: string) => {
    setTimelineEvents(prev => prev.map(e => e.id === eventId ? { ...e, visibilityToPatient: 'visible' } : e));
  };

  const handlePrescribeProtocol = (newProtocol: Omit<PrescribedProtocol, 'id' | 'prescribedDate'>) => {
    const fullProtocol: PrescribedProtocol = {
      ...newProtocol,
      id: `presc_proto_${Date.now()}`,
      prescribedDate: new Date().toLocaleDateString('pt-BR')
    };
    setPrescribedProtocols((prev) => [fullProtocol, ...prev]);

    // RECORD DIRECTLY INTO THE PATIENT'S EMR TIMELINE (FHIR CarePlan Event)
    const newTimelineEvent: ClinicalTimelineEvent = {
      id: `evt_proto_${Date.now()}`,
      patientId: currentProfile.id,
      tenantId: 'tenant_default',
      eventType: 'consultation',
      eventDate: new Date().toISOString(),
      professionalSummary: `Protocolo Crônico ativado pelo ${fullProtocol.doctorName}`,
      patientSummary: `Protocolo Crônico ativado pelo ${fullProtocol.doctorName}`,
      sourceSystem: 'EHR',
      sourceRecordId: `proto_${Date.now()}`,
      clinicalStatus: 'confirmed',
      priority: 'high',
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR'),
      category: 'protocol',
      title: `Ativação do Protocolo Clínico: ${fullProtocol.conditionName}`,
      description: `Protocolo Crônico ativado pelo ${fullProtocol.doctorName}. Meta: ${fullProtocol.targetGoals}. Alertas: ${fullProtocol.customAlertThresholds}`,
      authorName: fullProtocol.doctorName,
      authorRole: 'Médico Assistente (CRM)',
      visibilityToPatient: 'visible',
      fhirResource: 'CarePlan',
      icdCode: fullProtocol.icdCode
    };

    setTimelineEvents((prev) => [newTimelineEvent, ...prev]);
  };

  const handleTakeMedication = (reminderId: string) => {
    // 1. Mark reminder as taken
    setRemindersMap((prev) => {
      const userList = prev[currentProfile.id] || [];
      const updated = userList.map((r) => 
        r.id === reminderId 
          ? { ...r, status: 'taken' as const, takenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : r
      );
      return { ...prev, [currentProfile.id]: updated };
    });

    // 2. Decrement remainingDoses and trigger automatic refill alert if <= threshold
    setMedicationsMap((prev) => {
      const userMeds = prev[currentProfile.id] || [];
      const updatedMeds = userMeds.map((med) => {
        const matchingReminder = (remindersMap[currentProfile.id] || []).find(r => r.id === reminderId);
        if (matchingReminder && matchingReminder.medicationId === med.id) {
          const nextRemaining = Math.max(0, med.remainingDoses - 1);

          // Trigger refill alert if <= 5 doses left
          if (nextRemaining <= (med.refillReminderThreshold || 5)) {
            const newRequest: MedicationRefillRequest = {
              id: `refill_${Date.now()}`,
              patientId: currentProfile.id,
              patientName: currentProfile.name,
              medicationId: med.id,
              medicationName: med.name,
              dosage: med.dosage,
              remainingDoses: nextRemaining,
              totalDoses: med.totalDoses,
              prescribingDoctorId: mockDoctors[0].id,
              prescribingDoctorName: med.prescribingDoctor,
              requestedAt: new Date().toISOString(),
              status: 'pending'
            };
            setRefillRequests(r => [newRequest, ...r]);
          }

          return { ...med, remainingDoses: nextRemaining };
        }
        return med;
      });
      return { ...prev, [currentProfile.id]: updatedMeds };
    });
  };

  const handleRequestRefill = (med: Medication) => {
    const newRequest: MedicationRefillRequest = {
      id: `refill_${Date.now()}`,
      patientId: currentProfile.id,
      patientName: currentProfile.name,
      medicationId: med.id,
      medicationName: med.name,
      dosage: med.dosage,
      remainingDoses: med.remainingDoses,
      totalDoses: med.totalDoses,
      prescribingDoctorId: mockDoctors[0].id,
      prescribingDoctorName: med.prescribingDoctor,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };
    setRefillRequests(r => [newRequest, ...r]);
  };

  const handleFulfillRefillRequest = (requestId: string) => {
    setRefillRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'fulfilled' } : r));

    // Reset doses to full package (30 doses) upon refill fulfillment
    setMedicationsMap((prev) => {
      const userMeds = prev[currentProfile.id] || [];
      const updated = userMeds.map(m => ({ ...m, remainingDoses: m.totalDoses }));
      return { ...prev, [currentProfile.id]: updated };
    });
  };

  const handleAddCondition = (cond: Omit<ChronicCondition, 'id'>) => {
    const newCond: ChronicCondition = { ...cond, id: `cond_${Date.now()}` };
    setConditionsMap((prev) => ({
      ...prev,
      [currentProfile.id]: [newCond, ...(prev[currentProfile.id] || [])]
    }));
  };

  const handleAddAllergy = (all: Omit<Allergy, 'id'>) => {
    const newAll: Allergy = { ...all, id: `all_${Date.now()}` };
    setAllergiesMap((prev) => ({
      ...prev,
      [currentProfile.id]: [newAll, ...(prev[currentProfile.id] || [])]
    }));
  };

  const handleAddMedication = (med: Omit<Medication, 'id'>) => {
    const newMed: Medication = { ...med, id: `med_${Date.now()}` };
    const newReminder: MedicationReminder = {
      id: `rem_${Date.now()}`,
      medicationId: newMed.id,
      medicationName: newMed.name,
      dosage: newMed.dosage,
      scheduledTime: newMed.scheduleTimes[0] || '08:00',
      status: 'pending'
    };

    setMedicationsMap((prev) => ({
      ...prev,
      [currentProfile.id]: [newMed, ...(prev[currentProfile.id] || [])]
    }));

    setRemindersMap((prev) => ({
      ...prev,
      [currentProfile.id]: [newReminder, ...(prev[currentProfile.id] || [])]
    }));
  };

  const handleAddReport = (report: MedicalReport) => {
    setReportsMap((prev) => ({
      ...prev,
      [currentProfile.id]: [report, ...(prev[currentProfile.id] || [])]
    }));
  };

  const handleAddMultidisciplinaryNote = (note: Omit<MultidisciplinaryNote, 'id' | 'timestamp'>) => {
    const newNote: MultidisciplinaryNote = {
      ...note,
      id: `note_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleSendMessage = (text: string, patientId: string) => {
    const newMsg: TelehealthChatMessage = {
      id: `msg_${Date.now()}`,
      patientId,
      senderId: mockTeamMembers[0].id,
      senderName: mockTeamMembers[0].name,
      senderRole: mockTeamMembers[0].role,
      text,
      timestamp: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const handleSchedulePreventiveReminder = (rec: PreventiveCareRecommendation) => {
    setActiveTab('medications');
  };

  const handleToggleE2EE = () => {
    setSecuritySettings((prev) => ({ ...prev, e2eeEnabled: !prev.e2eeEnabled }));
  };

  const handleToggleBiometric = () => {
    setSecuritySettings((prev) => ({ ...prev, biometricAuthEnabled: !prev.biometricAuthEnabled }));
  };

  const handleToggleRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'doctor') setActiveTab('doctor');
    else if (role === 'healthcare_team') setActiveTab('healthcare_team');
    else if (role === 'admin') setActiveTab('admin');
    else if (activeTab === 'landing' || activeTab === 'doctor' || activeTab === 'healthcare_team' || activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'doctor') {
      setUserRole('doctor');
      setActiveTab('doctor');
    } else if (tab === 'team' || tab === 'healthcare_team') {
      setUserRole('healthcare_team');
      setActiveTab('healthcare_team');
    } else if (tab === 'admin') {
      setUserRole('admin');
      setActiveTab('admin');
    } else if (tab === 'landing') {
      setActiveTab('landing');
    } else {
      setUserRole('patient');
      setActiveTab(tab);
    }
  };

  // 1. MODO BLOCKED (FAIL-CLOSED)
  if (currentAppMode === 'blocked') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <Lock className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
        <h1 className="text-2xl font-black text-amber-400 mb-2">Modo Bloqueado (Fail-Closed)</h1>
        <p className="text-slate-300 max-w-lg mb-4 text-sm leading-relaxed">
          A aplicação está bloqueada por razões de segurança. As variáveis de ambiente do Supabase (<code className="text-cyan-400 font-mono">VITE_SUPABASE_URL</code> e <code className="text-cyan-400 font-mono">VITE_SUPABASE_ANON_KEY</code>) não foram configuradas no ambiente local.
        </p>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-md text-left text-xs font-mono text-slate-400 space-y-1 mb-6">
          <p className="text-cyan-300 font-bold mb-2">Como resolver:</p>
          <p>1. Crie o arquivo <code className="text-white">.env.local</code> na raiz do projeto;</p>
          <p>2. Adicione <code className="text-white">VITE_SUPABASE_URL=sua_url</code> e <code className="text-white">VITE_SUPABASE_ANON_KEY=sua_chave</code>;</p>
          <p>3. Ou adicione <code className="text-amber-400">VITE_DEMO_MODE=true</code> para ativar o Modo Demonstração.</p>
        </div>
      </div>
    );
  }

  // 2. MODO REAL: AUTH RESOLUTION
  let effectiveRole: UserRole = userRole;
  let isRealAuthSession = false;

  if (currentAppMode === 'real') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400">Carregando autenticação do SEG Saúde...</p>
        </div>
      );
    }

    if (!session) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl mb-4">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">SEG Saúde — Autenticação Necessária</h1>
          <p className="text-slate-400 max-w-md mb-6 text-sm">
            Para acessar o sistema Health Hub em modo real, por favor realize a autenticação com suas credenciais registradas.
          </p>
          <button
            onClick={() => setIsSegSaudeAuthOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 cursor-pointer hover:from-cyan-400 hover:to-indigo-500"
          >
            Abrir Modal de Login SEG Saúde
          </button>

          <SegSaudeAuthModal
            isOpen={isSegSaudeAuthOpen}
            onClose={() => setIsSegSaudeAuthOpen(false)}
            onLoginSuccess={() => {
              setIsSegSaudeAuthOpen(false);
            }}
          />
        </div>
      );
    }

    // Session is present in Real Mode
    const sessionRole = session.user.app_metadata?.role;
    const mappedPortal = roleToPortal(sessionRole);

    if (!mappedPortal) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
          <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-black text-rose-400 mb-2">Acesso Bloqueado — Nenhum Papel Atribuído</h1>
          <p className="text-slate-300 max-w-md mb-4 text-sm">
            Sua conta (<code className="text-cyan-300">{session.user.email}</code>) está autenticada, porém não possui um papel de acesso válido configurado (<code className="text-cyan-400">app_metadata.role</code> ausente ou inválido).
          </p>
          <p className="text-slate-400 text-xs max-w-md mb-6">
            Por favor, contate o administrador do sistema para atribuir o papel correspondente (patient, doctor, healthcare_team, admin).
          </p>
          <button
            onClick={() => supabase?.auth.signOut()}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center space-x-2 mx-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão (Logout)</span>
          </button>
        </div>
      );
    }

    effectiveRole = sessionRole as UserRole;
    isRealAuthSession = true;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">

      {/* DEMO MODE FIXED WARNING BANNER */}
      {currentAppMode === 'demo' && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-center font-black text-xs uppercase tracking-widest sticky top-0 z-50 shadow-md">
          ⚠️ MODO DEMO — DADOS FICTÍCIOS EM MEMÓRIA
        </div>
      )}

      {/* Cookie Consent Modal */}
      <CookieConsentModal
        isOpen={showCookieModal}
        onAccept={handleAcceptCookies}
      />

      {/* Header */}
      <Header
        currentProfile={currentProfile}
        profiles={mockProfiles}
        onSelectProfile={handleSelectProfile}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        e2eeEnabled={securitySettings.e2eeEnabled}
        biometricActive={securitySettings.biometricAuthEnabled}
        onToggleBiometric={handleToggleBiometric}
        userRole={effectiveRole}
        onToggleUserRole={handleToggleRole}
        currentDoctor={mockDoctors[0]}
        currentTeamMember={mockTeamMembers[0]}
        onOpenSegSaudeAuth={isRealAuthSession ? undefined : () => setIsSegSaudeAuthOpen(true)}
        onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
        onOpenProfileRegistration={() => setIsProfileRegistrationOpen(true)}
        hidePortalSelector={isRealAuthSession}
        onSignOut={isRealAuthSession ? () => supabase?.auth.signOut() : undefined}
        userEmail={isRealAuthSession ? session.user.email : undefined}
      />

      {/* Main Content Area */}
      {activeTab === 'landing' ? (
        <LandingPage
          onEnterPlatform={(role) => {
            if (role === 'doctor') {
              setUserRole('doctor');
              setActiveTab('doctor');
            } else if (role === 'team') {
              setUserRole('healthcare_team');
              setActiveTab('healthcare_team');
            } else if (role === 'admin') {
              setUserRole('admin');
              setActiveTab('admin');
            } else {
              setUserRole('patient');
              setActiveTab('dashboard');
            }
          }}
          onNavigateTab={handleTabChange}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {userRole === 'admin' ? (
          <AdminPortal
            patients={mockProfiles}
            doctors={mockDoctors}
            teamMembers={mockTeamMembers}
            consents={consents}
            auditLogs={auditLogs}
            securitySettings={securitySettings}
            subscriptions={subscriptions}
          />
        ) : userRole === 'doctor' ? (
          <DoctorPortal
            doctor={mockDoctors[0]}
            consents={consents}
            patients={mockProfiles}
            auditLogs={auditLogs}
            conditionsMap={conditionsMap}
            allergiesMap={allergiesMap}
            reportsMap={reportsMap}
            medicationsMap={medicationsMap}
            preventiveMap={preventiveMap}
            chronicProtocols={mockChronicProtocols}
            prescribedProtocols={prescribedProtocols}
            refillRequests={refillRequests}
            timelineEvents={timelineEvents}
            onPrescribeProtocol={handlePrescribeProtocol}
            onFulfillRefillRequest={handleFulfillRefillRequest}
          />
        ) : userRole === 'healthcare_team' ? (
          <HealthcareTeamPortal
            currentMember={mockTeamMembers[0]}
            teamMembers={mockTeamMembers}
            patients={mockProfiles}
            consents={consents}
            notes={notes}
            onAddNote={handleAddMultidisciplinaryNote}
            conditionsMap={conditionsMap}
            allergiesMap={allergiesMap}
            medicationsMap={medicationsMap}
            inactivityAlerts={inactivityAlerts}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                user={currentProfile}
                doctor={mockDoctors[0]}
                activeRole={userRole}
                onSelectRole={(role) => handleToggleRole(role === 'team' ? 'healthcare_team' : role)}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                profile={currentProfile}
                vitals={mockVitalMetrics}
                reminders={currentReminders}
                onTakeMedication={handleTakeMedication}
                preventiveCare={currentPreventive}
                reports={currentReports}
                onNavigateToTab={setActiveTab}
                onOpenEmergencySos={() => setIsEmergencySosOpen(true)}
              />
            )}

            {activeTab === 'history' && (
              <MedicalHistory
                profile={currentProfile}
                conditions={currentConditions}
                allergies={currentAllergies}
                surgeries={currentSurgeries}
                familyHistory={currentFamilyHistory}
                onAddCondition={handleAddCondition}
                onAddAllergy={handleAddAllergy}
              />
            )}

            {activeTab === 'medications' && (
              <MedicationReminders
                profile={currentProfile}
                medications={currentMedications}
                reminders={currentReminders}
                onTakeReminder={handleTakeMedication}
                onAddMedication={handleAddMedication}
                onRequestRefill={handleRequestRefill}
              />
            )}

            {activeTab === 'preventive' && (
              <PreventiveCareAgent
                profile={currentProfile}
                recommendations={currentPreventive}
                onScheduleReminder={handleSchedulePreventiveReminder}
              />
            )}

            {activeTab === 'vaccination' && (
              <MinhaVacinacaoModule
                profile={currentProfile}
                userRole={userRole}
              />
            )}

            {activeTab === 'preventive_checkup' && (
              <PreventiveCheckupModule
                profile={currentProfile}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'family_history' && (
              <FamilyHistoryModule
                profile={currentProfile}
              />
            )}

            {activeTab === 'health_map' && (
              <HealthMapModule
                profile={currentProfile}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'preventive_agenda' && (
              <PreventiveAgendaModule
                profile={currentProfile}
                onNavigateToTab={setActiveTab}
                userRole={userRole}
              />
            )}

            {activeTab === 'preventive_plan' && (
              <PreventivePlanModule
                profile={currentProfile}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'jornada_timeline' && (
              <PatientJornadaTimeline
                profile={currentProfile}
                userRole={userRole}
                events={timelineEvents}
                onValidateEventForPatient={handleValidateTimelineEvent}
              />
            )}

            {activeTab === 'risk_calculators' && (
              <ClinicalRiskCalculators
                profile={currentProfile}
                userRole={userRole}
              />
            )}

            {activeTab === 'population_health' && (
              <PopulationHealthCoordinator
                patients={mockProfiles}
                doctors={mockDoctors}
                teamMembers={mockTeamMembers}
              />
            )}

            {activeTab === 'clinical_ai_engine' && (
              <ClinicalAiGovernanceEngine
                profile={currentProfile}
                doctors={mockDoctors}
              />
            )}

            {activeTab === 'reports' && (
              <MedicalReports
                profile={currentProfile}
                reports={currentReports}
                onAddReport={handleAddReport}
              />
            )}

            {activeTab === 'wearables' && (
              <WearablesConnector
                profile={currentProfile}
                devices={mockWearableDevices}
              />
            )}

            {activeTab === 'security' && (
              <SecurityPanel
                profile={currentProfile}
                settings={securitySettings}
                onToggleE2EE={handleToggleE2EE}
                onToggleBiometric={handleToggleBiometric}
              />
            )}
          </>
        )}
      </main>
      )}

      {/* SEG Saúde Auth Modal */}
      <SegSaudeAuthModal
        isOpen={isSegSaudeAuthOpen}
        onClose={() => setIsSegSaudeAuthOpen(false)}
        onLoginSuccess={(role) => {
          setUserRole(role);
          setIsSegSaudeAuthOpen(false);
        }}
      />

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        profile={currentProfile}
        vitals={mockVitalMetrics}
        isOpen={isEmergencySosOpen}
        onClose={() => setIsEmergencySosOpen(false)}
        onDispatchEmergencyAlert={handleDispatchEmergencyAlert}
      />

      {/* Patient Profile & Family Sharing LGPD Modal */}
      <PatientProfileRegistrationModal
        profile={currentProfile}
        isOpen={isProfileRegistrationOpen}
        onClose={() => setIsProfileRegistrationOpen(false)}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 HealthHub.AI • Arquitetura Tríplice de IA Clínica & Governança da OMS</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 transition-colors">HL7 / FHIR Standard</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors">Regras Determinísticas & ML Preditivo</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
