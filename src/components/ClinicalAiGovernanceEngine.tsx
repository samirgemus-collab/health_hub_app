import React, { useState } from 'react';
import { UserProfile, DoctorProfile } from '../types/health';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  Sliders, 
  UserCheck, 
  FileText, 
  MessageCircle, 
  HelpCircle, 
  Info, 
  Send, 
  Lock, 
  Zap, 
  Calendar, 
  Activity,
  Bot,
  Scale,
  Shield
} from 'lucide-react';

interface ClinicalAiGovernanceEngineProps {
  profile: UserProfile;
  doctors: DoctorProfile[];
}

export const ClinicalAiGovernanceEngine: React.FC<ClinicalAiGovernanceEngineProps> = ({
  profile,
  doctors = [],
}) => {
  const [activeLayer, setActiveLayer] = useState<'rules' | 'predictive' | 'generative'>('rules');

  // CAMADA 1: REGRAS CLÍNICAS DETERMINÍSTICAS
  const deterministicRules = [
    {
      id: 'rule_01',
      title: 'Regra 01: HbA1c Descompensada sem Consulta Recente',
      conditionIf: 'Se HbA1c ≥ 6.5% E não houver consulta nos últimos 180 dias',
      triggeredStatus: true,
      actionThen: 'Gerar Alerta Prioritário de Convocação de Acompanhamento Metabólico',
      costSafety: '100% Determinístico • Baixo Custo • Validação Imediata'
    },
    {
      id: 'rule_02',
      title: 'Regra 02: Piora de Pressão Arterial com Wearable',
      conditionIf: 'Se PA Sistólica > 140 mmHg em 3 medições consecutivas nos últimos 7 dias',
      triggeredStatus: true,
      actionThen: 'Disparar Notificação para Enfermagem e ACS para Revisão Posológica',
      costSafety: '100% Determinístico • Sem Falsos Positivos Complexos'
    },
    {
      id: 'rule_03',
      title: 'Regra 03: Exame de Rastreamento de Imagem sem Controle registrado',
      conditionIf: 'Se Nódulo Pulmonar registrado E ausência de Tomografia nos últimos 365 dias',
      triggeredStatus: true,
      actionThen: 'Bloquear alta de protocolo e convocar consulta de Pneumologia',
      costSafety: 'Garantia de Segurança do Paciente'
    }
  ];

  // CAMADA 2: MODELOS ESTATÍSTICOS & ML PREDITIVO
  const predictiveModels = [
    {
      id: 'ml_01',
      modelType: 'Previsão de Ausência em Consulta (No-Show Prediction)',
      algorithm: 'Regressão Logística & Séries Temporais',
      patientTarget: profile.name,
      predictedRiskPercent: 78,
      riskLevel: 'Risco Elevado de Ausência',
      recommendation: 'Enviar confirmação ativa por WhatsApp 48h antes e oferecer transporte da UBS.'
    },
    {
      id: 'ml_02',
      modelType: 'Previsão de Reinternação Hospitalar em 30 Dias',
      algorithm: 'Modelo de Sobrevivência & XGBoost',
      patientTarget: profile.name,
      predictedRiskPercent: 34,
      riskLevel: 'Risco Moderado',
      recommendation: 'Agendar visita domiciliar do Enfermeiro 7 dias pós-alta.'
    },
    {
      id: 'ml_03',
      modelType: 'Identificação de Risco de Abandono de Tratamento (Churn Clínico)',
      algorithm: 'Detecção de Anomalias Posológicas',
      patientTarget: profile.name,
      predictedRiskPercent: 12,
      riskLevel: 'Risco Baixo de Abandono',
      recommendation: 'Manter acompanhamento posológico pelo aplicativo.'
    }
  ];

  // CAMADA 3: IA GENERATIVA GEMINI & GOVERNANÇA DA OMS
  const generativeAiFeatures = [
    {
      id: 'gen_01',
      title: 'Síntese Automática da História Clínica',
      description: 'Condensa consultas, laudos e bio-marcadores em um parágrafo executivo para o médico.',
      whoCompliance: 'Supervisão humana obrigatória. Racional auditável.'
    },
    {
      id: 'gen_02',
      title: 'Explicabilidade Clínica de Alertas',
      description: 'Explica o motivo pelo qual a regra determinística ou preditiva foi disparada.',
      whoCompliance: 'Transparência total dos dados de entrada.'
    },
    {
      id: 'gen_03',
      title: 'Preparação de Mensagens Educativas ao Paciente',
      description: 'Traduz jargões médicos em textos orientados ao próximo passo em linguagem simples.',
      whoCompliance: 'Proteção da autonomia e compreensão do paciente.'
    },
    {
      id: 'gen_04',
      title: 'Extração Estruturada de Laudos (OCR / NLP)',
      description: 'Lê PDFs e imagens de laudos laboratoriais/DICOM e extrai tabelas de resultados.',
      whoCompliance: 'Validação pelo profissional antes da gravação definitiva.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/20">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-rose-400">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Bot className="w-4 h-4" />
              <span>Arquitetura Tríplice de IA Clínica & Governança da OMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Central de IA & Regras Clínicas</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl">
              Combinação de regras determinísticas transparentes, aprendizado preditivo de máquina e IA generativa com estrita governança ética.
            </p>
          </div>
        </div>

        {/* WHO COMPLIANCE BADGE */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-rose-500/30 flex items-center space-x-3 text-xs shrink-0">
          <Scale className="w-6 h-6 text-rose-400" />
          <div>
            <p className="font-extrabold text-white">Diretriz da OMS (WHO)</p>
            <p className="text-[10px] text-slate-400">Supervisão Humana & Autonomia</p>
          </div>
        </div>
      </div>

      {/* LAYER SELECTOR TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveLayer('rules')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeLayer === 'rules' 
              ? 'bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500 shadow-lg shadow-rose-500/10' 
              : 'glass-card border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-400">Camada 1</span>
            <Zap className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-sm font-extrabold text-white mt-1">Regras Clínicas Determinísticas</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Segura, barata e 100% explicável.</p>
        </button>

        <button
          onClick={() => setActiveLayer('predictive')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeLayer === 'predictive' 
              ? 'bg-amber-950/60 border-amber-500 text-white ring-1 ring-amber-500 shadow-lg shadow-amber-500/10' 
              : 'glass-card border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-400">Camada 2</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-extrabold text-white mt-1">Modelos Estatísticos & ML</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Previsão de no-show e reinternação.</p>
        </button>

        <button
          onClick={() => setActiveLayer('generative')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeLayer === 'generative' 
              ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10' 
              : 'glass-card border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-indigo-400">Camada 3</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-extrabold text-white mt-1">IA Generativa Gemini (Copiloto)</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Resumos, explicabilidade e OCR.</p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 1: DETERMINISTIC CLINICAL RULES                                     */}
      {/* ========================================================================= */}
      {activeLayer === 'rules' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-400" />
                Motor de Regras Clínicas Determinísticas (Camada 1)
              </h3>
              <p className="text-xs text-slate-400">
                Regras booleanas de baixo custo e alta transparência para início rápido de operação sem alucinações.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {deterministicRules.map((rule) => (
              <div key={rule.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-white">{rule.title}</h4>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    {rule.costSafety}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px]">
                  <span className="text-amber-400 font-bold">SE (Condição): </span>
                  <span className="text-slate-200">{rule.conditionIf}</span>
                </div>

                <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold">ENTÃO (Ação Automática): </span>
                  <span className="text-emerald-200">{rule.actionThen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 2: STATISTICAL & PREDICTIVE ML MODELS                               */}
      {/* ========================================================================= */}
      {activeLayer === 'predictive' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Modelos Estatísticos & Machine Learning Preditivo (Camada 2)
              </h3>
              <p className="text-xs text-slate-400">
                Algoritmos preditivos para otimização de agenda, prevenção de reinternações e priorização de busca ativa.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {predictiveModels.map((ml) => (
              <div key={ml.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">{ml.algorithm}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {ml.riskLevel}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white">{ml.modelType}</h4>

                <div className="flex items-center space-x-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Probabilidade Preditiva:</span>
                    <span className="text-2xl font-black text-amber-400">{ml.predictedRiskPercent}%</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Intervenção Preventiva Sugerida:</span>
                    <p className="text-slate-200 font-semibold">{ml.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 3: GENERATIVE AI COPILOT & WHO GOVERNANCE                           */}
      {/* ========================================================================= */}
      {activeLayer === 'generative' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  IA Generativa Gemini como Copiloto Explicativo (Camada 3)
                </h3>
                <p className="text-xs text-slate-400">
                  Uso responsável focado em resumos, explicação de alertas, redação de rascunhos e extração de laudos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {generativeAiFeatures.map((gen) => (
                <div key={gen.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      {gen.title}
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">{gen.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-indigo-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Conformidade OMS: {gen.whoCompliance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHO GOVERNANCE PRINCIPLES NOTICE */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-400" />
              Diretrizes de Governança da Organização Mundial da Saúde (OMS)
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              A IA generativa não calcula riscos isoladamente. O sistema garante: <strong>1. Supervisão Humana Obrigatória</strong> (todas as sugestões exigem aceite do médico); <strong>2. Transparência</strong> (algoritmos explicáveis); <strong>3. Proteção da Autonomia do Paciente</strong> e <strong>4. Auditoria Contínua de Viés Clínico</strong>.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
