import React, { useState } from 'react';
import { 
  UserProfile, 
  UserRole, 
  VaccinationRecord, 
  VaccinationDocument, 
  VaccinationAuditLog, 
  VaccinationReminder, 
  VaccineSourceType, 
  VaccineValidationStatus,
  VaccineProtocolRule 
} from '../types/health';
import { 
  mockVaccinationRecords, 
  mockVaccinationDocuments, 
  mockVaccinationAuditLogs, 
  mockVaccinationReminders,
  mockVaccineProtocolRules 
} from '../mock/healthData';
import { 
  RndsConnectorService 
} from '../services/rndsConnectorService';
import { 
  Syringe, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Plus, 
  FileUp, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Filter, 
  Search, 
  Bell, 
  Lock, 
  UserCheck, 
  Building2, 
  Info, 
  RefreshCw,
  Sparkles,
  Shield,
  FileCheck,
  AlertCircle,
  Camera,
  ExternalLink,
  Layers
} from 'lucide-react';

interface MinhaVacinacaoModuleProps {
  profile: UserProfile;
  userRole: UserRole;
  initialTab?: 'carteira' | 'pendencias' | 'proximas' | 'documentos';
  initialOpenModal?: boolean;
}

export const MinhaVacinacaoModule: React.FC<MinhaVacinacaoModuleProps> = ({
  profile,
  userRole,
  initialTab = 'carteira',
  initialOpenModal = false,
}) => {
  const [activeTab, setActiveTab] = useState<'carteira' | 'pendencias' | 'proximas' | 'documentos'>(initialTab);
  const [records, setRecords] = useState<VaccinationRecord[]>(mockVaccinationRecords);
  const [documents, setDocuments] = useState<VaccinationDocument[]>(mockVaccinationDocuments);
  const [reminders, setReminders] = useState<VaccinationReminder[]>(mockVaccinationReminders);
  const [auditLogs, setAuditLogs] = useState<VaccinationAuditLog[]>(mockVaccinationAuditLogs);
  const [protocols] = useState<VaccineProtocolRule[]>(mockVaccineProtocolRules);

  // Modals & UI States
  const [showAddModal, setShowAddModal] = useState<boolean>(initialOpenModal);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);
  const [selectedRecordForAudit, setSelectedRecordForAudit] = useState<VaccinationRecord | null>(null);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [selectedRecordToValidate, setSelectedRecordToValidate] = useState<VaccinationRecord | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Manual Vaccine Registration
  const [formVaccineName, setFormVaccineName] = useState('');
  const [formVaccineCode, setFormVaccineCode] = useState('COVID19_BIVALENT');
  const [formDoseDescription, setFormDoseDescription] = useState('1ª Dose');
  const [formApplicationDate, setFormApplicationDate] = useState('');
  const [formManufacturer, setFormManufacturer] = useState('');
  const [formBatchNumber, setFormBatchNumber] = useState('');
  const [formEstablishment, setFormEstablishment] = useState('');
  const [formCnes, setFormCnes] = useState('');
  const [formProfessionalName, setFormProfessionalName] = useState('');
  const [formProfessionalReg, setFormProfessionalReg] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formDateError, setFormDateError] = useState<string | null>(null);

  // Document Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getSourceBadge = (source: VaccineSourceType) => {
    switch (source) {
      case 'user_reported':
        return { label: 'Informado pelo usuário', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300' };
      case 'document_attached':
        return { label: 'Documento anexado', bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' };
      case 'extracted_pending_review':
        return { label: 'Extraído de documento (Aguardando conferência)', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300' };
      case 'validated_by_professional':
        return { label: 'Validado por profissional', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300' };
      case 'clinic_applied':
        return { label: 'Aplicado na clínica', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
      case 'official_imported':
        return { label: 'Fonte oficial', bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' };
      case 'rnds_submitted':
        return { label: 'Aguardando sincronização RNDS', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300' };
      case 'rnds_confirmed':
        return { label: 'Confirmado pela RNDS', bg: 'bg-emerald-500/20 border-emerald-400 text-emerald-300' };
      default:
        return { label: 'Informado pelo usuário', bg: 'bg-slate-800 text-slate-400' };
    }
  };

  const getValidationStatusBadge = (status: VaccineValidationStatus) => {
    switch (status) {
      case 'validated':
      case 'accepted_rnds':
        return { label: 'Validado', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'awaiting_validation':
      case 'processing':
        return { label: 'Aguardando validação', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
      case 'rejected_validation':
      case 'rejected_rnds':
        return { label: 'Rejeitado', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
      case 'needs_correction':
        return { label: 'Necessita correção', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Aguardando validação', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const handleDateChange = (dateVal: string) => {
    setFormApplicationDate(dateVal);
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateVal > todayStr) {
      setFormDateError('A data de aplicação não pode ser uma data futura.');
    } else {
      setFormDateError(null);
    }
  };

  const handleSaveManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVaccineName || !formApplicationDate) return;

    const todayStr = new Date().toISOString().split('T')[0];
    if (formApplicationDate > todayStr) {
      setFormDateError('A data de aplicação não pode ser uma data futura.');
      return;
    }

    const newRecordId = `vac_rec_${Date.now()}`;
    const newRecord: VaccinationRecord = {
      id: newRecordId,
      patientId: profile.id,
      vaccineCode: formVaccineCode,
      vaccineName: formVaccineName,
      doseCode: 'DOSE_1',
      doseDescription: formDoseDescription,
      applicationDate: formApplicationDate,
      manufacturer: formManufacturer || 'Não informado',
      batchNumber: formBatchNumber || 'N/I',
      establishmentName: formEstablishment || 'Particular / Informado pelo Usuário',
      establishmentCnes: formCnes || undefined,
      professionalName: formProfessionalName || undefined,
      professionalRegistration: formProfessionalReg || undefined,
      sourceType: uploadedFile ? 'document_attached' : 'user_reported',
      validationStatus: 'awaiting_validation',
      integrationStatus: 'not_integrated',
      createdBy: profile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formNotes || undefined,
    };

    setRecords(prev => [newRecord, ...prev]);

    // Create Audit Log Entry
    const newAuditLog: VaccinationAuditLog = {
      id: `aud_${Date.now()}`,
      vaccinationRecordId: newRecordId,
      action: 'record_created',
      userId: profile.id,
      userName: profile.name,
      userRole: 'patient',
      newData: `Vacina ${formVaccineName} (${formDoseDescription}) cadastrada manualmente`,
      ipAddress: '189.120.45.12',
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    // Enqueue for RNDS Service (simulated queue)
    RndsConnectorService.enqueueForRndsSync(newRecord);

    setShowAddModal(false);
    triggerToast('Vacina cadastrada com sucesso! Registro aguardando validação por profissional.');
  };

  const handleValidateRecord = (status: 'validated' | 'rejected_validation', reason?: string) => {
    if (!selectedRecordToValidate) return;

    setRecords(prev => prev.map(r => {
      if (r.id !== selectedRecordToValidate.id) return r;
      return {
        ...r,
        validationStatus: status,
        sourceType: status === 'validated' ? 'validated_by_professional' : r.sourceType,
        updatedAt: new Date().toISOString()
      };
    }));

    const auditEntry: VaccinationAuditLog = {
      id: `aud_${Date.now()}`,
      vaccinationRecordId: selectedRecordToValidate.id,
      action: status === 'validated' ? 'validation_approved' : 'validation_rejected',
      userId: 'doc_roberto',
      userName: 'Dr. Roberto Mendes',
      userRole: 'doctor',
      reason: reason || (status === 'validated' ? 'Conferência de lote e documento aprovados' : 'Documento ilegível'),
      ipAddress: '177.12.89.40',
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    setShowValidationModal(false);
    triggerToast(status === 'validated' ? 'Registro vacinal validado pelo profissional de saúde!' : 'Registro marcado como necessitando correção.');
  };

  const handleToggleReminder = (rule: VaccineProtocolRule) => {
    const existing = reminders.find(r => r.vaccineName.includes(rule.vaccineName));
    if (existing) {
      setReminders(prev => prev.filter(r => r.id !== existing.id));
      triggerToast('Lembrete desativado com sucesso.');
    } else {
      const newRem: VaccinationReminder = {
        id: `rem_${Date.now()}`,
        patientId: profile.id,
        vaccineName: rule.vaccineName,
        doseDescription: rule.doseSchedule,
        expectedDate: '2026-06-20',
        reminderDate: '2026-06-13',
        channel: 'in_app',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setReminders(prev => [...prev, newRem]);
      triggerToast('Lembrete ativado! Você receberá alertas 7 dias antes da data estimada.');
    }
  };

  // RNDS Sync & Gov.br State
  const [showGovBrAuthModal, setShowGovBrAuthModal] = useState<boolean>(false);
  const [isQueryingSus, setIsQueryingSus] = useState<boolean>(false);
  const [isSyncingQueue, setIsSyncingQueue] = useState<boolean>(false);
  const [queueItems, setQueueItems] = useState(RndsConnectorService.getQueueItems());

  const handleImportFromSusGovBr = async () => {
    setIsQueryingSus(true);
    try {
      const susRecords = await RndsConnectorService.queryOfficialSusVaccineCard(profile.cpfMasked);
      setRecords(prev => {
        // Prevent duplicate import of same vaccine
        const existingIds = new Set(prev.map(r => r.vaccineCode));
        const newOnly = susRecords.filter(s => !existingIds.has(s.vaccineCode));
        return [...newOnly, ...prev];
      });
      setShowGovBrAuthModal(false);
      triggerToast('Carteira Oficial do SUS importada com sucesso via RNDS / DATASUS!');
    } catch (err) {
      triggerToast('Erro na comunicação com a RNDS. Tente novamente.');
    } finally {
      setIsQueryingSus(false);
    }
  };

  const handleProcessRndsQueue = () => {
    setIsSyncingQueue(true);
    setTimeout(() => {
      const { processedCount, updatedItems } = RndsConnectorService.processSyncQueue();
      setQueueItems(updatedItems);
      setRecords(prev => prev.map(r => ({
        ...r,
        integrationStatus: 'synced_rnds',
        rndsProtocol: r.rndsProtocol || `RNDS-BR-2026-${Math.floor(100000 + Math.random() * 900000)}`
      })));
      setIsSyncingQueue(false);
      triggerToast(`Sincronização concluída! ${processedCount > 0 ? `${processedCount} pacotes FHIR enviados para a RNDS.` : 'Fila em dia.'}`);
    }, 1500);
  };

  // Pending Review Filter
  const pendingRecords = records.filter(r => r.validationStatus === 'awaiting_validation' || r.validationStatus === 'draft' || r.validationStatus === 'needs_correction');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. MODULE BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Syringe className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Módulo Minha Vacinação • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Sua Carteira de Vacinação Preventiva
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Gerencie suas imunizações, comprovantes anexados, lembretes futuros e acompanhe a validação profissional.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Vacina</span>
          </button>

          <button
            onClick={() => setActiveTab('documentos')}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <FileUp className="w-4 h-4 text-teal-400" />
            <span>Anexar Comprovante</span>
          </button>
        </div>
      </div>

      {/* 2. CENTRAL DE SINCRONIZAÇÃO DATASUS / RNDS */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="text-sm font-black text-white">Central de Sincronização DATASUS / RNDS</h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Conectado ao ambiente de Homologação RNDS v2 (HL7 FHIR R4) • CNES 2048910 • Certificado e-CNPJ ICP-Brasil Ativo.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowGovBrAuthModal(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>📥 Importar do SUS (Via Gov.br)</span>
            </button>

            <button
              onClick={handleProcessRndsQueue}
              disabled={isSyncingQueue}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingQueue ? 'animate-spin' : ''}`} />
              <span>{isSyncingQueue ? 'Enviando Bundles FHIR...' : '⚡ Processar Fila RNDS'}</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          <strong>Aviso de Conformidade:</strong> A sincronização com fontes oficiais depende de autorização, disponibilidade técnica e consentimento do cidadão via Gov.br.
        </p>
      </div>

      {/* 3. SUB-NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('carteira')}
          className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'carteira' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>Carteira ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pendencias')}
          className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pendencias' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Pendências ({pendingRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proximas')}
          className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'proximas' ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Próximas Doses</span>
        </button>

        <button
          onClick={() => setActiveTab('documentos')}
          className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'documentos' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documentos ({documents.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CARTEIRA DE VACINAÇÃO (TIMELINE COM SELOS DE ORIGEM)              */}
      {/* ========================================================================= */}
      {activeTab === 'carteira' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {records.map((rec) => {
              const srcBadge = getSourceBadge(rec.sourceType);
              const valBadge = getValidationStatusBadge(rec.validationStatus);
              return (
                <div key={rec.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    
                    {/* Top Row: Name & Origin Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">{rec.doseDescription}</span>
                        <h3 className="text-base font-extrabold text-white mt-0.5">{rec.vaccineName}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider shrink-0 ${valBadge.bg}`}>
                        {valBadge.label}
                      </span>
                    </div>

                    {/* Origin Badge (Selo de Origem) */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold border ${srcBadge.bg}`}>
                        Selo: {srcBadge.label}
                      </span>
                    </div>

                    {/* Meta Details */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Data de Aplicação:</span>
                        <span className="text-white font-bold">{rec.applicationDate}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Fabricante & Lote:</span>
                        <span className="text-slate-300 font-mono">{rec.manufacturer || 'Butantan'} • Lote {rec.batchNumber || 'N/I'}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Estabelecimento:</span>
                        <span className="text-slate-300 truncate max-w-[200px]" title={rec.establishmentName}>{rec.establishmentName || 'UBS SUS'}</span>
                      </div>
                      {rec.rndsProtocol && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Protocolo RNDS:</span>
                          <span className="text-emerald-400 font-mono">{rec.rndsProtocol}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Audit link */}
                  <div className="border-t border-slate-800/60 pt-3 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setSelectedRecordForAudit(rec);
                        setShowAuditDrawer(true);
                      }}
                      className="text-slate-400 hover:text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ver Auditoria</span>
                    </button>

                    {(userRole === 'doctor' || userRole === 'healthcare_team') && rec.validationStatus === 'awaiting_validation' && (
                      <button
                        onClick={() => {
                          setSelectedRecordToValidate(rec);
                          setShowValidationModal(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center space-x-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Validar Registro</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENDÊNCIAS ("DOSES QUE MERECEM CONFERÊNCIA")                      */}
      {/* ========================================================================= */}
      {activeTab === 'pendencias' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Doses que Merecem Conferência & Pendências</h3>
              <p className="text-xs text-slate-400">
                Registros com documentação pendente, ausência de lote ou aguardando revisão profissional.
              </p>
            </div>
          </div>

          {pendingRecords.length === 0 ? (
            <div className="p-6 bg-slate-900/60 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">Nenhuma pendência encontrada na sua carteira!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRecords.map((rec) => (
                <div key={rec.id} className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                        Dose que merece conferência
                      </span>
                      <span className="text-xs text-slate-400">{rec.applicationDate}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white mt-1">{rec.vaccineName} ({rec.doseDescription})</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {rec.notes || 'Registro autodeclarado aguardando envio e conferência do comprovante vacinal.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('documentos')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer"
                  >
                    Anexar Comprovante →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRÓXIMAS DOSES & PROTOCOLO SBIM/SUS                                */}
      {/* ========================================================================= */}
      {activeTab === 'proximas' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" /> Imunizações Futuras Recomendadas (Diretriz SBIm / PNI)
            </h3>
            <p className="text-xs text-slate-400">
              Próximas doses estimadas com base na sua faixa etária e histórico vacinal prévio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {protocols.map((prot) => {
                const isReminderActive = reminders.some(r => r.vaccineName.includes(prot.vaccineName));
                return (
                  <div key={prot.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                          {prot.guidelineSource}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{prot.version}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-white">{prot.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{prot.doseSchedule}</p>
                      <p className="text-[11px] text-slate-400"><strong>Público-Alvo:</strong> {prot.targetPopulation}</p>
                    </div>

                    <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Revisado por: {prot.validatingPhysicianName}</span>
                      <button
                        onClick={() => handleToggleReminder(prot)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center space-x-1 transition-all cursor-pointer ${
                          isReminderActive
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isReminderActive ? 'Lembrete Ativo ✓' : 'Ativar Lembrete'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOCUMENTOS COMPROBATÓRIOS (PDF / IMAGEM COM HASH SHA-256)        */}
      {/* ========================================================================= */}
      {activeTab === 'documentos' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> Comprovantes & Carteira Digitalizada
                </h3>
                <p className="text-xs text-slate-400">
                  Envie fotos da sua carteira impressa ou PDFs de certificados.
                </p>
              </div>

              {/* Upload Input */}
              <label className="py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-indigo-500/20 shrink-0">
                <Camera className="w-4 h-4" />
                <span>Fotografar ou Enviar Arquivo</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                      const newDoc: VaccinationDocument = {
                        id: `doc_vac_${Date.now()}`,
                        patientId: profile.id,
                        fileReference: URL.createObjectURL(file),
                        fileType: file.type.includes('pdf') ? 'application/pdf' : 'image/jpeg',
                        fileHash: `sha256_${Math.random().toString(36).substring(2)}`,
                        originalFilename: file.name,
                        uploadedBy: profile.id,
                        uploadedByName: profile.name,
                        uploadedAt: new Date().toISOString(),
                        validationStatus: 'pending'
                      };
                      setDocuments(prev => [newDoc, ...prev]);
                      triggerToast(`Arquivo ${file.name} enviado com sucesso! Aguardando validação.`);
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/30 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-extrabold text-white truncate" title={doc.originalFilename}>{doc.originalFilename}</h4>
                      <span className="text-[10px] text-slate-400 block font-mono">HASH: {doc.fileHash.substring(0, 16)}...</span>
                      <span className="text-[10px] text-teal-400 block">Enviado em: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <a
                    href={doc.fileReference}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PERGUNTAS FREQUENTES (FAQ DO MÓDULO VACINAL)                          */}
      {/* ========================================================================= */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 bg-slate-950/80">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" /> Perguntas Frequentes sobre a Carteira Vacinal
        </h3>

        <div className="space-y-3">
          {[
            {
              q: "A plataforma pode reunir meu cartão de vacinação?",
              a: "Sim. O usuário poderá cadastrar vacinas, anexar documentos, acompanhar doses futuras e organizar seus registros em uma única linha do tempo."
            },
            {
              q: "A plataforma importa automaticamente dados do SUS?",
              a: "A sincronização com fontes oficiais dependerá de autorização, consentimento, disponibilidade técnica e homologação dos serviços responsáveis."
            },
            {
              q: "Posso fotografar minha carteira de vacinação?",
              a: "Sim. O usuário poderá enviar uma fotografia ou PDF. Os dados extraídos deverão ser conferidos antes de serem considerados válidos."
            },
            {
              q: "Os registros cadastrados são oficiais?",
              a: "Nem todos. Cada dose exibirá sua origem (autodeclarada, documento anexado ou validada) e situação de validação."
            },
            {
              q: "A plataforma indica vacinas atrasadas?",
              a: "A plataforma poderá sinalizar doses que merecem conferência com base em protocolos revisados, histórico disponível e características do usuário."
            },
            {
              q: "Posso acompanhar a vacinação dos meus filhos?",
              a: "Sim, desde que exista vínculo de dependência ou autorização válida registrada na plataforma."
            },
            {
              q: "Meus dados estarão protegidos?",
              a: "O módulo utiliza consentimento, controle de acesso por função, criptografia E2EE, auditoria e compartilhamento somente com usuários autorizados."
            },
            {
              q: "A plataforma substitui a avaliação médica?",
              a: "Não. O módulo apoia a organização e o acompanhamento da saúde preventiva, mas não substitui orientação profissional."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed bg-slate-950">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL: CADASTRO MANUAL DE VACINA                                          */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Syringe className="w-5 h-5 text-cyan-400" /> Registrar Nova Vacina Aplicada
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome da Vacina *</label>
                <input
                  type="text"
                  required
                  value={formVaccineName}
                  onChange={(e) => setFormVaccineName(e.target.value)}
                  placeholder="Ex: Dengue QDENGA / COVID Bivalente"
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dose *</label>
                  <input
                    type="text"
                    required
                    value={formDoseDescription}
                    onChange={(e) => setFormDoseDescription(e.target.value)}
                    placeholder="Ex: 1ª Dose / Anual"
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-sans focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data de Aplicação *</label>
                  <input
                    type="date"
                    required
                    value={formApplicationDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-sans focus:border-cyan-500 focus:outline-none"
                  />
                  {formDateError && <span className="text-[10px] text-rose-400 font-bold block mt-1">{formDateError}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Fabricante</label>
                  <input
                    type="text"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    placeholder="Ex: Butantan / Pfizer"
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-sans focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Número do Lote</label>
                  <input
                    type="text"
                    value={formBatchNumber}
                    onChange={(e) => setFormBatchNumber(e.target.value)}
                    placeholder="Ex: 26B842A"
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-sans focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Estabelecimento de Saúde / CNES</label>
                <input
                  type="text"
                  value={formEstablishment}
                  onChange={(e) => setFormEstablishment(e.target.value)}
                  placeholder="Ex: UBS Jardim das Flores - CNES 2048910"
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-sans focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!!formDateError || !formVaccineName || !formApplicationDate}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black cursor-pointer disabled:opacity-50"
                >
                  Salvar Registro Vacinal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT TRAILER DRAWER */}
      {showAuditDrawer && selectedRecordForAudit && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Trilha Imutável de Auditoria
              </h3>
              <button onClick={() => setShowAuditDrawer(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Registro Auditado:</span>
                <span className="text-white font-bold">{selectedRecordForAudit.vaccineName}</span>
              </div>

              <div className="space-y-2">
                {auditLogs.filter(a => a.vaccinationRecordId === selectedRecordForAudit.id).map((aud) => (
                  <div key={aud.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-teal-400 font-bold">{aud.userName} ({aud.userRole})</span>
                      <span className="text-slate-500">{new Date(aud.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 font-medium">{aud.newData}</p>
                    <span className="text-[9px] text-slate-500 font-mono block">IP: {aud.ipAddress}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUTENTICAÇÃO E CONSENTIMENTO GOV.BR / SUS */}
      {showGovBrAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">gov.br</span>
                <h3 className="text-sm font-extrabold text-white">Autorização de Acesso ao SUS</h3>
              </div>
              <button onClick={() => setShowGovBrAuthModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Para importar sua Carteira Oficial de Vacinação da <strong>RNDS (Rede Nacional de Dados em Saúde / Meu SUS Digital)</strong>, autorize a consulta aos seus registros imunológicos.
              </p>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Cidadão:</span>
                  <span className="text-white font-bold">{profile.name}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">CPF:</span>
                  <span className="text-slate-300 font-mono">{profile.cpfMasked}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Escopo da Autorização:</span>
                  <span className="text-teal-400 font-bold">Imunizações (FHIR Immunization)</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-[11px] text-blue-200">
                🔒 Autenticação criptografada E2EE. O consentimento pode ser revogado a qualquer momento no aplicativo.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowGovBrAuthModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportFromSusGovBr}
                disabled={isQueryingSus}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isQueryingSus ? 'Buscando Dados na RNDS...' : 'Autorizar com Gov.br & Importar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 p-4 bg-teal-500 text-slate-950 font-black text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
