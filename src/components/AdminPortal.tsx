import React, { useState } from 'react';
import { 
  UserProfile, 
  DoctorProfile, 
  TeamMemberProfile, 
  LgpdConsent, 
  AuditLogEntry, 
  SecuritySettings,
  PlatformSubscription
} from '../types/health';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Users, 
  Activity, 
  Server, 
  Database, 
  FileCheck, 
  AlertTriangle, 
  Sliders, 
  Download, 
  UserCheck, 
  RefreshCw, 
  CheckCircle2,
  PieChart,
  HardDrive,
  Clock,
  Search,
  FileText,
  KeyRound,
  FileSpreadsheet,
  Edit3,
  Stethoscope,
  Pill,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  XCircle,
  Home,
  UserPlus,
  Check,
  X,
  ExternalLink,
  Award,
  FileCode,
  AlertCircle,
  Upload,
  BadgeAlert
} from 'lucide-react';

interface AdminPortalProps {
  patients: UserProfile[];
  doctors: DoctorProfile[];
  teamMembers: TeamMemberProfile[];
  consents: LgpdConsent[];
  auditLogs: AuditLogEntry[];
  securitySettings: SecuritySettings;
  subscriptions?: PlatformSubscription[];
}

export interface RegulatoryDocument {
  id: string;
  category: 'municipal' | 'state' | 'federal' | 'collaborator_doc';
  documentName: string;
  issuingBody: string;
  registrationNumber: string;
  ownerName?: string; // Nome do colaborador ou clínica
  ownerRole?: string;
  issueDate: string;
  expirationDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  fileUrl?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  patients = [],
  doctors = [],
  teamMembers = [],
  consents = [],
  auditLogs = [],
  securitySettings,
  subscriptions: initialSubscriptions = [],
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'compliance' | 'approval_matrix' | 'audit'>('compliance');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // MUNICIPAL, STATE, FEDERAL & COLLABORATOR REGULATORY DOCUMENTS STATE
  const [regulatoryDocs, setRegulatoryDocs] = useState<RegulatoryDocument[]>([
    {
      id: 'doc_mun_01',
      category: 'municipal',
      documentName: 'Alvará de Funcionamento da Prefeitura',
      issuingBody: 'Prefeitura Municipal de São Paulo / Subprefeitura',
      registrationNumber: 'ALV-2026/89412-SP',
      ownerName: 'HealthHub Medicina Preventiva LTDA',
      issueDate: '2025-01-10',
      expirationDate: '2026-12-31',
      status: 'valid'
    },
    {
      id: 'doc_mun_02',
      category: 'municipal',
      documentName: 'Licença Sanitária Municipal (VISA)',
      issuingBody: 'Vigilância Sanitária Municipal (COVISA)',
      registrationNumber: 'VISA-MUN-44812/2025',
      ownerName: 'HealthHub Medicina Preventiva LTDA',
      issueDate: '2025-03-15',
      expirationDate: '2026-08-30', // Vencendo em breve!
      status: 'expiring_soon'
    },
    {
      id: 'doc_est_01',
      category: 'state',
      documentName: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)',
      issuingBody: 'Corpo de Bombeiros da Polícia Militar de SP',
      registrationNumber: 'AVCB-SP-9948120-B',
      ownerName: 'HealthHub Medicina Preventiva LTDA',
      issueDate: '2024-05-20',
      expirationDate: '2027-05-20',
      status: 'valid'
    },
    {
      id: 'doc_fed_01',
      category: 'federal',
      documentName: 'Cadastro Nacional de Estabelecimentos de Saúde (CNES)',
      issuingBody: 'Ministério da Saúde / DataSUS',
      registrationNumber: 'CNES 7849120',
      ownerName: 'HealthHub Medicina Preventiva LTDA',
      issueDate: '2024-01-01',
      expirationDate: '2028-12-31',
      status: 'valid'
    },
    {
      id: 'doc_fed_02',
      category: 'federal',
      documentName: 'Certidão Negativa de Débitos Federais (CND Receita Federal)',
      issuingBody: 'Receita Federal do Brasil / Procuradoria Geral',
      registrationNumber: 'CND-RFB-2026-004812',
      ownerName: 'HealthHub Medicina Preventiva LTDA',
      issueDate: '2026-01-15',
      expirationDate: '2026-07-15', // Expirado!
      status: 'expired'
    },
    {
      id: 'doc_col_01',
      category: 'collaborator_doc',
      documentName: 'Certidão Negativa Criminal & Quitação Eleitoral',
      issuingBody: 'Tribunal de Justiça de SP / Justiça Federal',
      registrationNumber: 'TJSP-CND-99481',
      ownerName: 'Dra. Juliana Santos',
      ownerRole: 'Médico Cardiologista (CRM/SP 198.420)',
      issueDate: '2025-06-10',
      expirationDate: '2026-06-10', // Expirado!
      status: 'expired'
    },
    {
      id: 'doc_col_02',
      category: 'collaborator_doc',
      documentName: 'Carteira de Vacinação Ocupacional (Hepatite B, Tríplice, COVID)',
      issuingBody: 'Medicina do Trabalho / SESMT Hospitalar',
      registrationNumber: 'VAC-SESMT-8841',
      ownerName: 'Enf. Fernando Alencar',
      ownerRole: 'Enfermeiro (COREN/SP 482.910)',
      issueDate: '2025-11-01',
      expirationDate: '2026-11-01',
      status: 'valid'
    },
    {
      id: 'doc_col_03',
      category: 'collaborator_doc',
      documentName: 'Certificado de Treinamento BLS/ACLS (Suporte Básico de Vida)',
      issuingBody: 'American Heart Association (AHA)',
      registrationNumber: 'AHA-BLS-449102',
      ownerName: 'Dr. Roberto Mendes',
      ownerRole: 'Médico Assistente (CRM/SP 148.920)',
      issueDate: '2025-09-12',
      expirationDate: '2026-09-12', // Vencendo em breve!
      status: 'expiring_soon'
    }
  ]);

  // PENDING PROFESSIONAL CREDENTIAL APPROVALS STATE
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'appr_01',
      name: 'Dra. Juliana Santos',
      role: 'Médico (Cardiologia)',
      councilType: 'CFM / CRM',
      councilRegistration: 'CRM/SP 198.420',
      councilUrl: 'https://portal.cfm.org.br/busca-medicos/',
      email: 'juliana.santos@hospital.com.br',
      status: 'pending',
      requestedAt: '2026-07-26 14:20'
    },
    {
      id: 'appr_02',
      name: 'Enf. Fernando Alencar',
      role: 'Enfermeiro de Tele-Triagem',
      councilType: 'COREN / COFEN',
      councilRegistration: 'COREN/SP 482.910',
      councilUrl: 'https://www.cofen.gov.br/busca-profissionais/',
      email: 'fernando.enfermagem@ubs.sp.gov.br',
      status: 'pending',
      requestedAt: '2026-07-27 08:30'
    }
  ]);

  const handleApproveProfessional = (id: string, name: string) => {
    setPendingApprovals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    setToastMessage(`Credencial profissional de ${name} aprovada e ativada pelo Administrador!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleRenewDocument = (docId: string, docName: string) => {
    setRegulatoryDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          expirationDate: '2027-12-31',
          status: 'valid'
        };
      }
      return d;
    }));
    setToastMessage(`Documento "${docName}" renovado com nova data de validade ativada!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Data/Hora', 'Categoria', 'Autor', 'Funcao', 'Paciente', 'Acao', 'Detalhes', 'IP', 'Gravidade', 'Hash'];
    const rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      l.category,
      l.authorName,
      l.authorRole,
      l.patientName,
      `"${l.action}"`,
      `"${l.details}"`,
      l.ipAddress,
      l.severity,
      l.hash
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trilha_auditoria_lgpd_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDpiaLgpd = () => {
    const dpiaReport = {
      reportTitle: 'Relatório Oficial de Impacto à Proteção de Dados Pessoais (RIPD / DPIA)',
      legalFramework: 'Lei Geral de Proteção de Dados Pessoais (LGPD - Lei 13.709/2018, Art. 38)',
      generatedAt: new Date().toISOString(),
      governanceOfficer: 'Chief Security & Compliance Officer - HealthHub.AI',
      auditSummary: {
        totalAuditLogs: auditLogs.length,
        securityStatus: '100% em conformidade com as diretrizes ANPD / CFM'
      }
    };

    const blob = new Blob([JSON.stringify(dpiaReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_impacto_lgpd_ripd_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Relatório Oficial de Impacto à Proteção de Dados (RIPD LGPD) exportado!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/20">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-rose-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <KeyRound className="w-4 h-4" />
              <span>Painel de Administração • Governança, Regularidades & Compliance</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Super Administrador de Saúde</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Regularidades Municipal/Estadual/Federal • Documentação de Colaboradores • Datas de Validade
            </p>
          </div>
        </div>

        {/* System Sub-Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveAdminTab('compliance')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'compliance' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Regularidades & Documentos
          </button>
          <button
            onClick={() => setActiveAdminTab('approval_matrix')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'approval_matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Aprovação & Matriz RACI
          </button>
          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'audit' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> Trilha de Auditoria
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: REGULARIDADES MUNICIPAIS, ESTADUAIS, FEDERAIS & COLABORADORES      */}
      {/* ========================================================================= */}
      {activeAdminTab === 'compliance' && (
        <div className="space-y-6">
          
          {/* SUMMARY EXPIRATION STATUS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 font-black text-lg">
                {regulatoryDocs.filter(d => d.status === 'valid').length}
              </div>
              <div>
                <span className="text-emerald-400 font-bold block uppercase text-[10px]">Documentos Válidos</span>
                <p className="text-slate-300">Licenças e Certidões dentro do prazo</p>
              </div>
            </div>

            <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/30 flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 font-black text-lg">
                {regulatoryDocs.filter(d => d.status === 'expiring_soon').length}
              </div>
              <div>
                <span className="text-amber-400 font-bold block uppercase text-[10px]">Vencendo em Breve</span>
                <p className="text-slate-300">Exige renovação nos próximos 60 dias</p>
              </div>
            </div>

            <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-500/30 flex items-center space-x-3">
              <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 font-black text-lg">
                {regulatoryDocs.filter(d => d.status === 'expired').length}
              </div>
              <div>
                <span className="text-rose-400 font-bold block uppercase text-[10px]">Expirados / Bloqueados</span>
                <p className="text-slate-300">Ação imediata recomendada</p>
              </div>
            </div>
          </div>

          {/* MUNICIPAL, STATE, FEDERAL REGULATORY LICENSES TABLE */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-rose-400" />
                  Regularidades Regulatórias Institucionais (Municipal, Estadual e Federal)
                </h3>
                <p className="text-xs text-slate-400">
                  Alvarás da Prefeitura, Licença da Vigilância Sanitária (VISA), AVCB dos Bombeiros e CNES.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {regulatoryDocs.filter(d => d.category !== 'collaborator_doc').map((doc) => (
                <div key={doc.id} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-sm">{doc.documentName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        doc.category === 'municipal' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                        doc.category === 'state' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        Regularidade {doc.category}
                      </span>
                    </div>

                    <p className="text-slate-300">Órgão Emissor: <strong className="text-white">{doc.issuingBody}</strong> • Número: <strong className="text-white font-mono">{doc.registrationNumber}</strong></p>
                    <p className="text-slate-400 text-[11px]">Emissão: {doc.issueDate} • <strong className="text-white">Validade: {doc.expirationDate}</strong></p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {doc.status === 'valid' && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Válido
                      </span>
                    )}

                    {doc.status === 'expiring_soon' && (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Vencendo em breve
                      </span>
                    )}

                    {doc.status === 'expired' && (
                      <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" /> Expirado
                      </span>
                    )}

                    <button
                      onClick={() => handleRenewDocument(doc.id, doc.documentName)}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-800 cursor-pointer"
                    >
                      Renovar Licença
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLLABORATOR COMPLIANCE DOCUMENTS TABLE */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-400" />
                  Documentação Exigida para Colaboradores (Médicos, Enfermeiros e Farmacêuticos)
                </h3>
                <p className="text-xs text-slate-400">
                  Certidões criminais, quitação eleitoral, carteira de vacinação ocupacional e certificados BLS/ACLS.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {regulatoryDocs.filter(d => d.category === 'collaborator_doc').map((doc) => (
                <div key={doc.id} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-sm">{doc.documentName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                        Documento Ocupacional
                      </span>
                    </div>

                    <p className="text-slate-300">Colaborador: <strong className="text-white">{doc.ownerName}</strong> ({doc.ownerRole})</p>
                    <p className="text-slate-400 text-[11px]">Órgão/Instituição: {doc.issuingBody} • Validade: <strong className="text-white">{doc.expirationDate}</strong></p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {doc.status === 'valid' && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Em Dia
                      </span>
                    )}

                    {doc.status === 'expiring_soon' && (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Vencendo em breve
                      </span>
                    )}

                    {doc.status === 'expired' && (
                      <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" /> Expirado (Bloqueado)
                      </span>
                    )}

                    <button
                      onClick={() => handleRenewDocument(doc.id, doc.documentName)}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold border border-slate-800 cursor-pointer"
                    >
                      Anexar Novo Documento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: APROVAÇÃO DE CREDENCIAIS & VALIDAÇÃO EM DIRETO NOS CONSELHOS     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'approval_matrix' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-400" />
                  Validação Oficial nos Conselhos de Classe (COREN, CFM, CRF, CREFITO)
                </h3>
                <p className="text-xs text-slate-400">
                  O Administrador pode clicar no botão de checagem direta para validar a licença do profissional no portal oficial do conselho.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-sm">{item.name}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.role}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        Registro: <strong className="text-white">{item.councilRegistration}</strong> ({item.councilType})
                      </p>
                      <p className="text-slate-400 font-mono text-[11px]">{item.email} • Solicitado em {item.requestedAt}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        href={item.councilUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>🔍 Checar no {item.councilType}</span>
                      </a>

                      {item.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApproveProfessional(item.id, item.name)}
                            className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-lg shadow-emerald-500/20 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Aprovar & Ativar Credencial</span>
                          </button>
                        </>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Aprovado & Ativo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: TRILHA DE AUDITORIA IMUTÁVEL                                      */}
      {/* ========================================================================= */}
      {activeAdminTab === 'audit' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Trilha de Auditoria Imutável de Responsabilidades (Hash SHA-256)
              </h3>
            </div>

            <button
              onClick={handleExportCSV}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-slate-800 flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV de Auditoria</span>
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-sm">{log.authorName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800 uppercase">
                      {log.authorRole}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{log.timestamp}</span>
                </div>

                <p className="text-slate-200 font-medium">Ação: <strong className="text-white">{log.action}</strong> no prontuário de <strong className="text-teal-300">{log.patientName}</strong></p>
                <p className="text-slate-400 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
