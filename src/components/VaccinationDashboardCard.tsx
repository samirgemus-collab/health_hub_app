import React from 'react';
import { VaccinationRecord } from '../types/health';
import { 
  Syringe, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Plus, 
  FileUp, 
  Share2, 
  ArrowRight, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

interface VaccinationDashboardCardProps {
  records: VaccinationRecord[];
  onNavigateToModule: (initialTab?: 'carteira' | 'pendencias' | 'proximas' | 'documentos', openModal?: boolean) => void;
}

export const VaccinationDashboardCard: React.FC<VaccinationDashboardCardProps> = ({
  records = [],
  onNavigateToModule,
}) => {
  const totalRegistered = records.length;
  const pendingValidationCount = records.filter(r => r.validationStatus === 'awaiting_validation' || r.validationStatus === 'draft').length;
  const validatedCount = records.filter(r => r.validationStatus === 'validated').length;
  
  // Future dose estimation
  const futureDosesCount = 2; // Dengue QDENGA 2ª dose & Influenza 2027
  const nextVaccineName = 'Dengue Tetravalente (QDENGA) - 2ª Dose';
  const nextVaccineDate = '20/06/2026';

  // Coverage percentage estimate
  const coveragePercent = Math.min(100, Math.round((validatedCount / Math.max(1, totalRegistered)) * 100));

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 shadow-2xl animate-fadeIn">
      
      {/* 1. CARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Syringe className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">
              <span>Módulo Imunização</span>
              <span>•</span>
              <span>Saúde Preventiva</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Sua vacinação em dia
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Acompanhe suas vacinas, receba lembretes de próximas doses e mantenha seus comprovantes organizados em um só lugar.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-2xl shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>{coveragePercent}% Cobertura Registrada</span>
        </div>
      </div>

      {/* 2. STATS & PREVENTIVE INDICATORS GRID */}
      {totalRegistered === 0 ? (
        <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-extrabold text-white">Nenhum registro vacinal cadastrado ainda</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cadastre suas vacinas aplicadas ou envie uma foto da sua carteira de vacinação para manter seu histórico organizado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vacinas Registradas</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white">{totalRegistered}</span>
              <span className="text-[10px] text-teal-400 font-semibold">{validatedCount} validadas</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doses Futuras</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-cyan-300">{futureDosesCount}</span>
              <span className="text-[10px] text-slate-400">programadas</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aguardando Validação</span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-black ${pendingValidationCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {pendingValidationCount}
              </span>
              <span className="text-[10px] text-slate-400">em análise</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Próxima Vacina Prevista</span>
            <span className="text-xs font-black text-white block truncate" title={nextVaccineName}>{nextVaccineName}</span>
            <span className="text-[10px] text-cyan-400 font-bold block">Prevista para: {nextVaccineDate}</span>
          </div>

        </div>
      )}

      {/* 3. 4 QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <button
          onClick={() => onNavigateToModule('carteira')}
          className="p-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Syringe className="w-4 h-4" />
          <span>Ver carteira</span>
        </button>

        <button
          onClick={() => onNavigateToModule('carteira', true)}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Adicionar vacina</span>
        </button>

        <button
          onClick={() => onNavigateToModule('documentos')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <FileUp className="w-4 h-4 text-teal-400" />
          <span>Importar documento</span>
        </button>

        <button
          onClick={() => onNavigateToModule('carteira')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-indigo-400" />
          <span>Compartilhar</span>
        </button>
      </div>

      {/* 4. CLINICAL SAFETY & ORIGIN DISCLAIMERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">Classificação da Origem:</strong> Cada registro apresenta sua origem (autodeclarada, documento anexado ou validada) e situação de validação.
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">Aviso de Segurança:</strong> As informações da plataforma apoiam o acompanhamento preventivo e não substituem avaliação de um profissional de saúde.
          </p>
        </div>
      </div>

    </div>
  );
};
