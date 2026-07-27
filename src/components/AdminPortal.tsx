import React, { useState } from 'react';
import { 
  UserProfile, 
  DoctorProfile, 
  TeamMemberProfile, 
  LgpdConsent, 
  AuditLogEntry, 
  SecuritySettings,
  AuditCategory,
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
  Award
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

export const AdminPortal: React.FC<AdminPortalProps> = ({
  patients = [],
  doctors = [],
  teamMembers = [],
  consents = [],
  auditLogs = [],
  securitySettings,
  subscriptions: initialSubscriptions = [],
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'approval_matrix' | 'subscriptions' | 'audit' | 'overview' | 'lgpd' | 'capacity'>('approval_matrix');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // PENDING PROFESSIONAL CREDENTIAL APPROVALS STATE WITH OFFICIAL COUNCIL LINKS
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
    },
    {
      id: 'appr_03',
      name: 'Dr. Lucas Ferreira',
      role: 'Farmacêutico Clínico',
      councilType: 'CRF / CFF',
      councilRegistration: 'CRF/SP 77.410',
      councilUrl: 'https://www.cff.org.br/consulta_profissional.php',
      email: 'lucas.farmacia@healthhub.com.br',
      status: 'pending',
      requestedAt: '2026-07-27 09:15'
    }
  ]);

  const handleApproveProfessional = (id: string, name: string) => {
    setPendingApprovals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    setToastMessage(`Credencial profissional de ${name} aprovada e ativada pelo Administrador!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleRejectProfessional = (id: string, name: string) => {
    setPendingApprovals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    setToastMessage(`Solicitação de credencial de ${name} recusada.`);
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
      systemArchitecture: {
        e2eeEncryption: 'AES-256-GCM Nativo (Web Crypto API W3C)',
        databaseBackend: 'Supabase PostgreSQL com Row Level Security (RLS)',
        auditTrail: 'Trilha Imutável de Logs com Hash SHA-256',
        whoAiGovernance: 'Supervisão Humana Obrigatória (Human-in-the-Loop) nas 3 Camadas de IA'
      },
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
              <span>Painel de Administração do Sistema & Governança de Acessos</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Super Administrador de Saúde</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Validação nos Conselhos (COREN/CFM/CRF) • Matriz de Responsabilidade RACI • Auditoria imutável
            </p>
          </div>
        </div>

        {/* System Sub-Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveAdminTab('approval_matrix')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'approval_matrix' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
          <button
            onClick={handleExportDpiaLgpd}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Baixar RIPD LGPD</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: APROVAÇÃO DE CREDENCIAIS & VALIDAÇÃO EM DIRETO NOS CONSELHOS     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'approval_matrix' && (
        <div className="space-y-6">
          
          {/* PENDING CREDENTIAL APPROVALS SECTION WITH DIRECT COUNCIL VERIFICATION LINKS */}
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
                      {/* DIRECT LINK BUTTON TO OFFICIAL PROFESSIONAL COUNCIL WEB SEARCH */}
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
                            onClick={() => handleRejectProfessional(item.id, item.name)}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs flex items-center space-x-1 border border-slate-800 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Recusar</span>
                          </button>
                          <button
                            onClick={() => handleApproveProfessional(item.id, item.name)}
                            className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-lg shadow-emerald-500/20 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Aprovar & Ativar Credencial</span>
                          </button>
                        </>
                      ) : item.status === 'approved' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Aprovado & Ativo
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-rose-400" /> Recusado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESPONSIBILITY MATRIX (MATRIZ RACI) */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-400" />
              Matriz de Responsabilidade RACI por Conselho Profissional
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="p-3">Atividade / Função no Sistema</th>
                    <th className="p-3">Médico (CFM/CRM)</th>
                    <th className="p-3">Enfermeiro (COREN)</th>
                    <th className="p-3">Farmacêutico (CRF)</th>
                    <th className="p-3">Fisioterapeuta (CREFITO)</th>
                    <th className="p-3">Administrador (CISO)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200 font-sans">
                  <tr>
                    <td className="p-3 font-extrabold text-white">Prescrição de Medicamentos & Atestados</td>
                    <td className="p-3 font-black text-rose-400">Responsável Único (A)</td>
                    <td className="p-3 text-slate-500">Consultado</td>
                    <td className="p-3 text-teal-300 font-bold">Valida Posologia</td>
                    <td className="p-3 text-slate-500">-</td>
                    <td className="p-3 text-slate-500">Auditor</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-extrabold text-white">Renovação por Estoque Baixo</td>
                    <td className="p-3 font-bold text-indigo-400">Assina Receita</td>
                    <td className="p-3 font-bold text-teal-400">Solicita Renovação (R)</td>
                    <td className="p-3 font-bold text-amber-400">Despacha Medicamento (R)</td>
                    <td className="p-3 text-slate-500">-</td>
                    <td className="p-3 text-slate-500">Auditor</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-extrabold text-white">Concessão / Revogação de Acesso LGPD</td>
                    <td className="p-3 text-slate-500">Solicitante</td>
                    <td className="p-3 text-slate-500">Solicitante</td>
                    <td className="p-3 text-slate-500">Solicitante</td>
                    <td className="p-3 text-slate-500">Solicitante</td>
                    <td className="p-3 font-black text-emerald-400">Valida Credencial no Conselho</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: TRILHA DE AUDITORIA IMUTÁVEL                                      */}
      {/* ========================================================================= */}
      {activeAdminTab === 'audit' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Trilha de Auditoria Imutável de Responsabilidades (Hash SHA-256)
              </h3>
              <p className="text-xs text-slate-400">
                Registra exatamente quem fez o quê, quando, a partir de qual IP e em qual perfil.
              </p>
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
            {auditLogs.length === 0 ? (
              <p className="text-slate-400 text-xs italic">Nenhum log registrado até o momento.</p>
            ) : (
              auditLogs.map((log) => (
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

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>IP: {log.ipAddress}</span>
                    <span className="text-amber-400">Hash SHA-256: {log.hash}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
