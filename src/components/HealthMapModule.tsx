import React, { useState } from 'react';
import { 
  UserProfile, 
  HealthMapDomainState, 
  HealthMapStatus, 
  PreventiveAction 
} from '../types/health';
import { mock13HealthMapDomains, mockPreventiveActions } from '../mock/healthData';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Wind, 
  Dumbbell, 
  Shield, 
  Syringe, 
  Moon, 
  Smile, 
  Sparkles, 
  Compass, 
  Calendar, 
  Stethoscope,
  Info,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  FileText,
  Filter
} from 'lucide-react';

interface HealthMapModuleProps {
  profile: UserProfile;
  domains?: HealthMapDomainState[];
  actions?: PreventiveAction[];
  onNavigateToTab?: (tab: string) => void;
}

export const HealthMapModule: React.FC<HealthMapModuleProps> = ({
  profile,
  domains = mock13HealthMapDomains,
  actions = mockPreventiveActions,
  onNavigateToTab
}) => {
  const [selectedDomain, setSelectedDomain] = useState<HealthMapDomainState | null>(null);
  const [filterStatus, setFilterStatus] = useState<HealthMapStatus | 'all'>('all');

  // Calculate overall completeness percentage (average of infoAvailablePercentage across domains)
  const totalPercentage = Math.round(
    domains.reduce((acc, d) => acc + d.infoAvailablePercentage, 0) / (domains.length || 1)
  );

  const filteredDomains = filterStatus === 'all' 
    ? domains 
    : domains.filter(d => d.status === filterStatus);

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Activity': return Activity;
      case 'Droplet': return Droplet;
      case 'Wind': return Wind;
      case 'Dumbbell': return Dumbbell;
      case 'Shield': return Shield;
      case 'Syringe': return Syringe;
      case 'Moon': return Moon;
      case 'Smile': return Smile;
      case 'Sparkles': return Sparkles;
      case 'Compass': return Compass;
      case 'Calendar': return Calendar;
      case 'Stethoscope':
      default: return Stethoscope;
    }
  };

  const getStatusBadge = (status: HealthMapStatus) => {
    switch (status) {
      case 'up_to_date':
        return {
          label: 'Em Dia',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'needs_information':
        return {
          label: 'Informações Pendentes',
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400'
        };
      case 'needs_attention':
        return {
          label: 'Merece Atenção',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'professional_review_recommended':
        return {
          label: 'Avaliação Profissional Recomendada',
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400'
        };
      case 'not_applicable':
      default:
        return {
          label: 'Não Se Aplica Neste Momento',
          bg: 'bg-slate-900 text-slate-500 border-slate-800',
          dot: 'bg-slate-600'
        };
    }
  };

  const getOriginLabel = (origin: string) => {
    switch (origin) {
      case 'manual_user': return 'Informado por você';
      case 'manual_professional': return 'Adicionado por profissional';
      case 'uploaded_document': return 'Documento enviado';
      case 'integrated_clinic': return 'Recebido da clínica';
      case 'connected_device': return 'Dispositivo conectado';
      case 'laboratory': return 'Resultado laboratorial';
      case 'imaging_center': return 'Exame de imagem';
      case 'official_source': return 'Fonte oficial';
      case 'calculated': return 'Calculado pela plataforma';
      default: return 'Registro do sistema';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. MODULE BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/30 text-teal-400">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Módulo de Prevenção • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Meu Mapa de Saúde
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Visualize seus principais fatores de proteção, riscos modificáveis e informações preventivas organizadas em 13 áreas.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab?.('preventive_agenda')}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Ver Agenda Preventiva</span>
        </button>
      </div>

      {/* 2. INDICADOR DE COMPLETUDE DO ACOMPANHAMENTO PREVENTIVO */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">
              Indicador Geral
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              Acompanhamento Preventivo: <span className="text-teal-300">{totalPercentage}% Atualizado</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {totalPercentage}% das suas informações e ações preventivas recomendadas estão registradas e em dia.
            </p>
          </div>

          <div className="w-full sm:w-64 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 shrink-0">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Completude</span>
              <span className="text-teal-300">{totalPercentage}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* MANDATORY EXPLICIT DISCLAIMER */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-start space-x-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-slate-200">Aviso da Plataforma:</strong> Este percentual representa a atualização do seu acompanhamento preventivo, não uma nota da sua saúde.
          </p>
        </div>
      </div>

      {/* 3. FILTER PILLS */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 overflow-x-auto">
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-bold">Filtrar por Status:</span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === 'all' ? 'bg-slate-800 text-white border border-slate-700 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({domains.length})
          </button>
          <button
            onClick={() => setFilterStatus('up_to_date')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === 'up_to_date' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            🟢 Em Dia
          </button>
          <button
            onClick={() => setFilterStatus('needs_attention')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === 'needs_attention' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            🟡 Merece Atenção
          </button>
          <button
            onClick={() => setFilterStatus('professional_review_recommended')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === 'professional_review_recommended' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            🩵 Avaliação Recomendada
          </button>
          <button
            onClick={() => setFilterStatus('needs_information')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStatus === 'needs_information' ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚪ Informações Pendentes
          </button>
        </div>
      </div>

      {/* 4. DOMAINS GRID */}
      {filteredDomains.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <Info className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Nenhum domínio encontrado para este filtro</h3>
          <p className="text-xs text-slate-400">
            Complete seu check-up preventivo para começar a montar seu Mapa de Saúde.
          </p>
          <button
            onClick={() => onNavigateToTab?.('preventive_checkup')}
            className="py-2.5 px-5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs cursor-pointer"
          >
            Continuar Check-up →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((dom) => {
            const IconComp = getDomainIcon(dom.iconName);
            const badge = getStatusBadge(dom.status);
            return (
              <div
                key={dom.id}
                onClick={() => setSelectedDomain(dom)}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer space-y-4 flex flex-col justify-between bg-slate-900/80 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-teal-500/40 text-teal-400 transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                          {dom.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {dom.infoAvailablePercentage}% das informações
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center space-x-1.5 shrink-0 ${badge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {dom.description}
                  </p>

                  {/* Summary of Protective vs Modifiable */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center text-emerald-400 font-medium">
                      <span>Fatores de Proteção:</span>
                      <strong className="font-bold">{dom.protectiveFactors.length} item(ns)</strong>
                    </div>
                    <div className="flex justify-between items-center text-amber-300 font-medium">
                      <span>Fatores Modificáveis:</span>
                      <strong className="font-bold">{dom.modifiableFactors.length} item(ns)</strong>
                    </div>
                    {dom.missingInformation.length > 0 && (
                      <div className="flex justify-between items-center text-slate-400 font-medium">
                        <span>Dados Ausentes:</span>
                        <strong className="font-bold">{dom.missingInformation.length} item(ns)</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>Atualizado: {dom.lastUpdated.split('T')[0]}</span>
                  <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ver Detalhes <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. SIDE PANEL / MODAL DETALHAMENTO DO DOMÍNIO */}
      {selectedDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/30">
                  {React.createElement(getDomainIcon(selectedDomain.iconName), { className: 'w-7 h-7' })}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    Detalhamento do Mapa de Saúde
                  </span>
                  <h2 className="text-xl font-black text-white">{selectedDomain.title}</h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedDomain(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Protocol & Metadata Info */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Protocolo de Evidência:</span>
                <strong className="text-white">{selectedDomain.sourceProtocol} ({selectedDomain.protocolVersion})</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Origem dos Dados:</span>
                <strong className="text-teal-300">{getOriginLabel(selectedDomain.sourceType)}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Completude desta área:</span>
                <strong className="text-emerald-400">{selectedDomain.infoAvailablePercentage}% dos dados cadastrados</strong>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-5 text-xs">
              
              {/* Dados Considerados */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Dados Considerados na Avaliação:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDomain.consideredData.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fatores de Proteção */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fatores de Proteção Identificados:</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDomain.protectiveFactors.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-200">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fatores Modificáveis */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-amber-300 flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Fatores Modificáveis (Oportunidades de Melhoria):</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDomain.modifiableFactors.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dados Ausentes */}
              {selectedDomain.missingInformation.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-400 flex items-center gap-1.5 text-sm">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Informações Ainda Ausentes:</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDomain.missingInformation.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 text-slate-400 rounded-xl border border-slate-800">
                        ? {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Próximas Ações Relacionadas */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Próximas Ações da Agenda Preventiva:</span>
                </h4>

                <div className="space-y-2">
                  {actions
                    .filter(a => selectedDomain.relatedActionIds.includes(a.id) || a.clinicalDomain.toLowerCase().includes(selectedDomain.title.toLowerCase()))
                    .map(act => (
                      <div key={act.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <strong className="text-white block">{act.title}</strong>
                          <span className="text-[10px] text-slate-400">Previsão: {act.expectedDate}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedDomain(null);
                            onNavigateToTab?.('preventive_agenda');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs cursor-pointer"
                        >
                          Ir para Agenda →
                        </button>
                      </div>
                    ))}

                  {actions.filter(a => selectedDomain.relatedActionIds.includes(a.id)).length === 0 && (
                    <p className="text-slate-400 italic">Nenhuma ação pendente específica para esta área no momento.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-800 pt-4">
              <button
                onClick={() => setSelectedDomain(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Fechar Detalhes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
