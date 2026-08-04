import React, { useState } from 'react';
import { UserProfile, HealthAssessmentResult, CheckupResultCategory } from '../types/health';
import { mockCheckupResult } from '../mock/healthData';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Stethoscope, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Heart, 
  Activity, 
  Moon, 
  Smile, 
  Shield, 
  UserCheck,
  RotateCcw
} from 'lucide-react';

interface PreventiveCheckupModuleProps {
  profile: UserProfile;
  onNavigateToTab?: (tab: string) => void;
}

export const PreventiveCheckupModule: React.FC<PreventiveCheckupModuleProps> = ({
  profile,
  onNavigateToTab
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State across 7 structured areas
  const [formData, setFormData] = useState({
    // 1. Dados gerais
    occupation: 'Analista de Tecnologia',
    workRoutine: 'Sedentária / Computador (8h por dia)',
    waistCircumferenceCm: '78',

    // 2. Histórico pessoal
    hasPriorSurgeries: 'não',
    priorHospitalizations: 'não',
    knownAllergies: 'Nenhuma alergia grave relatada',
    currentMedsCount: '2 medicamentos de uso diário',

    // 3. Histórico familiar
    familyConditions: ['Hipertensão (Mãe)', 'Diabetes Tipo 2 (Avó Materna)'],

    // 4. Estilo de vida
    physicalActivityFrequency: '3x por semana (Caminhada 40 min)',
    smokingStatus: 'Não fumante',
    alcoholConsumption: 'Ocasional (Socialmente)',
    dietHabits: 'Equilibrada com consumo fracionado de vegetais',
    sittingHoursPerDay: '7 a 8 horas',
    hydrationPerDay: '1.5 a 2 litros',

    // 5. Saúde emocional
    stressLevel: 'Moderado (Picos em fechamentos de projetos)',
    sleepQuality: 'Boa (6 a 7 horas por noite)',
    workloadFeeling: 'Adequada',

    // 6. Prevenção
    lastDentalVisit: 'Há 6 meses',
    lastGeneralCheckup: 'Há 8 meses',
    vaccinationUpToDate: 'sim',

    // 7. Segurança
    dizzinessOrFalls: 'não',
    homeHazards: 'não',
    multipleMedsRisk: 'baixo'
  });

  const steps = [
    { id: 0, title: '1. Dados Gerais', icon: Activity },
    { id: 1, title: '2. Histórico Pessoal', icon: ClipboardCheck },
    { id: 2, title: '3. Histórico Familiar', icon: Heart },
    { id: 3, title: '4. Estilo de Vida', icon: Activity },
    { id: 4, title: '5. Saúde Emocional', icon: Smile },
    { id: 5, title: '6. Prevenção', icon: ShieldCheck },
    { id: 6, title: '7. Segurança', icon: Shield }
  ];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveProgress = () => {
    triggerToast('Progresso do Check-up salvo com sucesso! Você pode continuar a qualquer momento.');
  };

  const handleFinishCheckup = () => {
    setIsCompleted(true);
    triggerToast('Check-up Preventivo concluído! Seus resultados foram organizados por categorias.');
  };

  const getCategoryBadge = (cat: CheckupResultCategory) => {
    switch (cat) {
      case 'in_order':
        return { label: 'Em Dia', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'needs_update':
        return { label: 'Precisa Atualizar', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30', icon: AlertCircle };
      case 'deserves_conference':
        return { label: 'Merece Conferência', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30', icon: HelpCircle };
      case 'professional_evaluation_recommended':
        return { label: 'Avaliação Profissional Recomendada', bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', icon: Stethoscope };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* MODULE BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Módulo de Prevenção • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Check-up Preventivo Inteligente
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Responda a questionários estruturados sobre seus hábitos, histórico e prevenção para manter sua saúde acompanhada.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleSaveProgress}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-cyan-400" />
            <span>Salvar Rascunho</span>
          </button>
        </div>
      </div>

      {/* QUESTIONNAIRE OR RESULT VIEW */}
      {!isCompleted ? (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          
          {/* STEPPER HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto gap-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              const isPast = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                      : isPast 
                      ? 'text-teal-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* STEP 0: DADOS GERAIS */}
          {activeStep === 0 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">1. Dados Gerais & Rotina Laboral</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Ocupação / Profissão Atual</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Circunferência Abdominal (cm)</label>
                  <input
                    type="number"
                    value={formData.waistCircumferenceCm}
                    onChange={(e) => setFormData({ ...formData, waistCircumferenceCm: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Rotina de Trabalho</label>
                  <select
                    value={formData.workRoutine}
                    onChange={(e) => setFormData({ ...formData, workRoutine: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="Sedentária / Computador (8h por dia)">Predominantemente sentada (Escritório / Computador)</option>
                    <option value="Moderadamente Ativa">Moderadamente ativa (Caminhadas frequentes)</option>
                    <option value="Intensa">Fisicamente exigente / Esforço físico</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: HISTÓRICO PESSOAL */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">2. Histórico Pessoal & Procedimentos Anteriores</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Cirurgias Anteriores Realizadas</label>
                  <select
                    value={formData.hasPriorSurgeries}
                    onChange={(e) => setFormData({ ...formData, hasPriorSurgeries: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="não">Não realizei cirurgias relevantes</option>
                    <option value="sim">Sim (Registrado no histórico)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Histórico de Internações Hospitalares</label>
                  <select
                    value={formData.priorHospitalizations}
                    onChange={(e) => setFormData({ ...formData, priorHospitalizations: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="não">Nenhuma internação nos últimos 5 anos</option>
                    <option value="sim">Sim (Registrado no prontuário)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Alergias Medicamentosas ou Alimentares</label>
                  <input
                    type="text"
                    value={formData.knownAllergies}
                    onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HISTÓRICO FAMILIAR */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">3. Histórico de Saúde Familiar</h3>
              <p className="text-slate-400">
                Selecione as condições relevantes identificadas na sua família de 1º e 2º grau:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Hipertensão Arterial', 'Diabetes Mellitus', 'Doença Coronariana / Infarto', 'Câncer (Mama, Próstata, Cólon)', 'Osteoporose', 'Trombose'].map((cond) => (
                  <label key={cond} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      defaultChecked={formData.familyConditions.some(c => c.includes(cond))}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">{cond}</span>
                  </label>
                ))}
              </div>

              <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-[11px] text-cyan-200">
                💡 <em>O histórico familiar ajuda a personalizar o plano preventivo, mas não determina ocorrência de doenças.</em>
              </div>
            </div>
          )}

          {/* STEP 3: ESTILO DE VIDA */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">4. Estilo de Vida & Hábitos Diários</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Frequência de Atividade Física</label>
                  <select
                    value={formData.physicalActivityFrequency}
                    onChange={(e) => setFormData({ ...formData, physicalActivityFrequency: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="3x por semana (Caminhada 40 min)">3 a 4 vezes por semana (Recomendado)</option>
                    <option value="1 a 2 vezes por semana">1 a 2 vezes por semana</option>
                    <option value="Sedentário">Raramente / Sedentário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Consumo de Tabaco</label>
                  <select
                    value={formData.smokingStatus}
                    onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="Não fumante">Não fumante (Nunca fumou)</option>
                    <option value="Ex-fumante">Ex-fumante (Parou há +1 ano)</option>
                    <option value="Fumante ocasional">Fumante ocasional / diário</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SAÚDE EMOCIONAL */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">5. Saúde Emocional & Qualidade do Sono</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Percepção Geral de Estresse</label>
                  <select
                    value={formData.stressLevel}
                    onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="Baixo / Sob Controle">Baixo / Sob Controle</option>
                    <option value="Moderado (Picos em fechamentos de projetos)">Moderado</option>
                    <option value="Elevado">Elevado / Frequente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Qualidade Habitual do Sono</label>
                  <select
                    value={formData.sleepQuality}
                    onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="Boa (6 a 7 horas por noite)">Boa (Repousante 7-8h)</option>
                    <option value="Regular (Despertar noturno)">Regular (Acorda cansado)</option>
                    <option value="Insônia frequente">Insônia frequente</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PREVENÇÃO */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">6. Prevenção, Consultas & Rastreamentos</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Última Avaliação Odontológica</label>
                  <input
                    type="text"
                    value={formData.lastDentalVisit}
                    onChange={(e) => setFormData({ ...formData, lastDentalVisit: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Último Check-up Médico de Rotina</label>
                  <input
                    type="text"
                    value={formData.lastGeneralCheckup}
                    onChange={(e) => setFormData({ ...formData, lastGeneralCheckup: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SEGURANÇA */}
          {activeStep === 6 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <h3 className="text-sm font-extrabold text-white">7. Segurança Domiciliar & Uso de Medicamentos</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Episódios de Tontura ou Quedas nos Últimos 12 Meses</label>
                  <select
                    value={formData.dizzinessOrFalls}
                    onChange={(e) => setFormData({ ...formData, dizzinessOrFalls: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="não">Nenhum episódio relatado</option>
                    <option value="sim">Sim (Episódios esporádicos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Uso Simultâneo de 5 ou Mais Medicamentos</label>
                  <select
                    value={formData.multipleMedsRisk}
                    onChange={(e) => setFormData({ ...formData, multipleMedsRisk: e.target.value })}
                    className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-white"
                  >
                    <option value="baixo">Não (Menos de 5 medicamentos)</option>
                    <option value="polifarmacia">Sim (Necessita revisão médica)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-5">
            <button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center space-x-1 cursor-pointer disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {activeStep < 6 ? (
              <button
                onClick={() => setActiveStep(prev => Math.min(6, prev + 1))}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <span>Próximo Passo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishCheckup}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center space-x-2 cursor-pointer shadow-xl shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir Check-up & Ver Resultado</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        /* RESULT VIEW WITH 4 CATEGORIES */
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Acompanhamento Preventivo Concluído</span>
                <h2 className="text-xl font-black text-white mt-0.5">Seu Panorama de Saúde Preventiva</h2>
              </div>
              <button
                onClick={() => setIsCompleted(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Check-up</span>
              </button>
            </div>

            {/* COMPLETENESS INDICATOR (NON-ALARMIST) */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block">Indicador de Completude Preventiva:</span>
                <h3 className="text-2xl font-black text-teal-300">75% Preenchido</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Origem dos dados: Informado por você • Validação: Aguardando revisão profissional na próxima consulta.
                </p>
              </div>

              <div className="w-full sm:w-48 bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full w-[75%]" />
              </div>
            </div>

            {/* 4 CATEGORIES RESULTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCheckupResult.categoryResults.map((catGroup) => {
                const badge = getCategoryBadge(catGroup.category);
                const BadgeIcon = badge.icon;
                return (
                  <div key={catGroup.category} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`p-2 rounded-xl border text-xs ${badge.bg}`}>
                          <BadgeIcon className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="font-extrabold text-white text-sm">{catGroup.title}</h4>
                          <span className="text-[10px] text-slate-400">{catGroup.itemCount} item(ns) nesta categoria</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{catGroup.description}</p>

                    <div className="space-y-3 pt-1">
                      {catGroup.items.map((item) => (
                        <div key={item.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-white">{item.title}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.domain}</span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{item.description}</p>
                          <div className="p-2 bg-slate-950 rounded-lg text-teal-300 text-[10px] font-medium border border-slate-850">
                            <strong>Ação Preventiva Sugerida:</strong> {item.recommendedAction}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 p-4 bg-teal-500 text-slate-950 font-black text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
