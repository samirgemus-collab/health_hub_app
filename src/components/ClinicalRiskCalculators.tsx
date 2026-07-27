import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/health';
import { 
  Calculator, 
  HeartPulse, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  FileText, 
  Database, 
  Check, 
  Edit3, 
  XCircle, 
  Bone, 
  Droplet, 
  Stethoscope, 
  HelpCircle,
  TrendingUp,
  Info,
  Clock
} from 'lucide-react';

interface ClinicalRiskCalculatorsProps {
  profile: UserProfile;
  userRole: UserRole;
}

type StepNumber = 1 | 2 | 3;
type CalculatorType = 'prevent' | 'kfre' | 'frax' | 'caprini' | 'rcri';

export const ClinicalRiskCalculators: React.FC<ClinicalRiskCalculatorsProps> = ({
  profile,
  userRole,
}) => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('prevent');

  // ETAPA 1: RESPOSTAS DO PACIENTE (Sim / Não / Não sei)
  const [patientAnswers, setPatientAnswers] = useState<Record<string, 'yes' | 'no' | 'unknown'>>({
    smoker: 'no',
    exSmoker: 'yes',
    alcohol: 'no',
    physicalActivity: 'yes',
    familyInfartStroke: 'yes',
    familyHipFracture: 'no',
    previousFractureLightFall: 'no',
    previousThrombosis: 'no',
    useHormonesOrContraceptive: 'no',
    pregnantOrPostpartum: 'no',
    corticosteroidsUse: 'no',
    immobilizedRecently: 'no',
    previousSurgeries: 'yes',
    knownDiseases: 'yes'
  });

  // ETAPA 2: DADOS EXTRAÍDOS AUTOMATICAMENTE PELA PLATAFORMA (LIS / RIS / FHIR)
  const autoExtractedData = {
    age: profile.age,
    sex: profile.sex === 'female' ? 'Feminino' : 'Masculino',
    bmi: profile.bmi,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    totalCholesterol: 185,
    hdlCholesterol: 52,
    fastingGlucose: 92,
    hba1cPercent: 5.4,
    serumCreatinine: 0.85,
    eGFR: 94, // mL/min/1.73m²
    urineAlbuminCreatinineRatio: 12, // mg/g
    boneDensitometryTScore: -1.2, // Femoral Neck T-score
    diagnoses: ['Hipertensão Arterial Sistêmica (I10)'],
    medications: ['Enalapril 10mg'],
    lastLabDate: '2026-07-15 (Fleury / LIS)'
  };

  // ETAPA 3: VALIDAÇÃO MÉDICA
  const [doctorValidationStatus, setDoctorValidationStatus] = useState<'pending' | 'confirmed' | 'edited' | 'not_applicable'>('pending');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [showConfirmationToast, setShowConfirmationToast] = useState(false);

  const handleAnswerChange = (key: string, value: 'yes' | 'no' | 'unknown') => {
    setPatientAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirmValidation = (status: 'confirmed' | 'edited' | 'not_applicable') => {
    setDoctorValidationStatus(status);
    setShowConfirmationToast(true);
    setTimeout(() => setShowConfirmationToast(false), 3000);
  };

  // SCORE CALCULATORS RESULTS SIMULATION
  const getPreventScore = () => {
    // PREVENT (Cardiovascular 10-year Risk)
    return {
      riskPercent: 4.2,
      riskLevel: 'Baixo a Moderado',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      recommendation: 'Manter controle pressórico e perfil lipídico dentro da meta.'
    };
  };

  const getKfreScore = () => {
    // KFRE (Kidney Failure Risk Equation 2 & 5 years)
    return {
      twoYearRiskPercent: 0.4,
      fiveYearRiskPercent: 1.2,
      riskLevel: 'Risco Baixo de Falência Renal',
      color: 'text-teal-400',
      badgeBg: 'bg-teal-500/20 border-teal-500/30 text-teal-300',
      recommendation: 'Manter hidratação adequada e eGFR anual.'
    };
  };

  const getFraxScore = () => {
    // FRAX (10-year Fracture Risk)
    return {
      majorOsteoporoticFracturePercent: 3.8,
      hipFracturePercent: 0.9,
      riskLevel: 'Risco Baixo de Fratura por Fragilidade',
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      recommendation: 'Prática de exercícios com carga e suplementação de Vitamina D se indicada.'
    };
  };

  const getCapriniScore = () => {
    // Caprini (VTE Risk)
    return {
      scorePoints: 2,
      riskLevel: 'Risco Moderado de Tromboembolismo Venoso',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      recommendation: 'Deambulação precoce pós-operatória e meias elásticas de compressão.'
    };
  };

  const getRcriScore = () => {
    // RCRI / Lee (Revised Cardiac Risk Index)
    return {
      scorePoints: 1,
      riskLevel: 'Classe I (Risco de Complicação Cardíaca Cirúrgica < 0.4%)',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      recommendation: 'Liberado para procedimentos cirúrgicos de baixo/médio porte.'
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {showConfirmationToast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Status do Escore Validado pelo Médico com Sucesso!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Modelo Híbrido em 3 Etapas • Calculadoras de Risco Clínico</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Estratificação de Risco & Anamnese Híbrida
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Coleta inteligente onde o paciente responde apenas o que conhece (hábitos/antecedentes), a plataforma preenche 80% dos dados via LIS/FHIR e o médico valida a decisão clínica final.
          </p>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              currentStep === 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Paciente</span>
          </button>
          <span className="text-slate-600">→</span>
          <button
            onClick={() => setCurrentStep(2)}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              currentStep === 2 ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2. Plataforma (LIS)</span>
          </button>
          <span className="text-slate-600">→</span>
          <button
            onClick={() => setCurrentStep(3)}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              currentStep === 3 ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Validação Médica</span>
          </button>
        </div>
      </div>

      {/* CALCULATOR SELECTOR SUB-BAR */}
      <div className="flex space-x-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveCalculator('prevent')}
          className={`px-3.5 py-2 rounded-xl font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalculator === 'prevent' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className="w-4 h-4" /> Risco Cardiovascular (PREVENT)
        </button>
        <button
          onClick={() => setActiveCalculator('kfre')}
          className={`px-3.5 py-2 rounded-xl font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalculator === 'kfre' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Droplet className="w-4 h-4" /> Risco Renal (KDIGO / KFRE)
        </button>
        <button
          onClick={() => setActiveCalculator('frax')}
          className={`px-3.5 py-2 rounded-xl font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalculator === 'frax' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bone className="w-4 h-4" /> Risco de Osteoporose (FRAX)
        </button>
        <button
          onClick={() => setActiveCalculator('caprini')}
          className={`px-3.5 py-2 rounded-xl font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalculator === 'caprini' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Risco de Trombose (Caprini)
        </button>
        <button
          onClick={() => setActiveCalculator('rcri')}
          className={`px-3.5 py-2 rounded-xl font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCalculator === 'rcri' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Risco Cirúrgico (RCRI / Lee)
        </button>
      </div>

      {/* STEP 1: PATIENT QUESTIONNAIRE */}
      {currentStep === 1 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Etapa 1 de 3 • Preenchimento do Paciente
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1">
                Questionário Inicial de Hábitos & Antecedentes (3 a 5 min)
              </h3>
              <p className="text-xs text-slate-400">
                Responda com opções objetivas. Os resultados laboratoriais e exames anteriores serão preenchidos automaticamente pela clínica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* QUESTION CARDS */}
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold">1. Fuma atualmente ou já fumou anteriormente?</span>
              <div className="flex space-x-2 pt-1">
                {(['yes', 'no', 'unknown'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAnswerChange('smoker', v)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      patientAnswers.smoker === v 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : 'Não sei'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold">2. Consome bebidas alcoólicas regularmente?</span>
              <div className="flex space-x-2 pt-1">
                {(['yes', 'no', 'unknown'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAnswerChange('alcohol', v)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      patientAnswers.alcohol === v 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : 'Não sei'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold">3. Algum pai ou irmão teve infarto, AVC ou fratura de quadril?</span>
              <div className="flex space-x-2 pt-1">
                {(['yes', 'no', 'unknown'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAnswerChange('familyInfartStroke', v)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      patientAnswers.familyInfartStroke === v 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : 'Não sei'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold">4. Já sofreu fratura óssea após uma queda leve?</span>
              <div className="flex space-x-2 pt-1">
                {(['yes', 'no', 'unknown'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAnswerChange('previousFractureLightFall', v)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      patientAnswers.previousFractureLightFall === v 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : 'Não sei'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold">5. Já teve histórico de trombose venosa ou embolia pulmonar?</span>
              <div className="flex space-x-2 pt-1">
                {(['yes', 'no', 'unknown'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAnswerChange('previousThrombosis', v)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      patientAnswers.previousThrombosis === v 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : 'Não sei'}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold">6. Faz uso contínuo de medicamentos corticoides?</span>
              <div className="flex space-x-2 pt-1">
                {(['yes', 'no', 'unknown'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleAnswerChange('corticosteroidsUse', v)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                      patientAnswers.corticosteroidsUse === v 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : 'Não sei'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Avançar para Etapa 2 (Busca Automática LIS/HIS)</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AUTOMATIC DATA COLLECTION FROM PLATFORM (LIS/RIS/FHIR) */}
      {currentStep === 2 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                Etapa 2 de 3 • Automação de Prontuário & Laboratório
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1">
                Dados Extraídos Automáticos da Plataforma (FHIR / LIS / RIS)
              </h3>
              <p className="text-xs text-slate-400">
                Redução de 80% do preenchimento manual. As métricas foram capturadas diretamente do histórico do paciente.
              </p>
            </div>

            <div className="p-3 bg-teal-950/50 rounded-2xl border border-teal-500/30 text-teal-300 text-xs font-bold shrink-0 flex items-center space-x-2">
              <Database className="w-5 h-5 text-teal-400" />
              <span>Sincronizado com Fleury / LIS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Idade / Sexo Biológico</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.age} anos • {autoExtractedData.sex}</p>
              <span className="text-[9px] text-teal-400 font-mono">[Cadastro FHIR]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Índice de Massa Corporal (IMC)</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.bmi} kg/m² ({autoExtractedData.weightKg}kg / {autoExtractedData.heightCm}cm)</p>
              <span className="text-[9px] text-teal-400 font-mono">[Biometria]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pressão Arterial Repouso</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.bloodPressureSystolic} x {autoExtractedData.bloodPressureDiastolic} mmHg</p>
              <span className="text-[9px] text-teal-400 font-mono">[Wearable Bluetooth]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Colesterol Total / HDL</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.totalCholesterol} / {autoExtractedData.hdlCholesterol} mg/dL</p>
              <span className="text-[9px] text-teal-400 font-mono">[LIS {autoExtractedData.lastLabDate}]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Creatinina / eGFR Renal</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.serumCreatinine} mg/dL ({autoExtractedData.eGFR} mL/min)</p>
              <span className="text-[9px] text-teal-400 font-mono">[KDIGO Estágio G1]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Albuminúria Urinária</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.urineAlbuminCreatinineRatio} mg/g (Normal)</p>
              <span className="text-[9px] text-teal-400 font-mono">[A1 Normal]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Densitometria Óssea Colo Femoral</span>
              <p className="text-base font-extrabold text-white">T-Score: {autoExtractedData.boneDensitometryTScore}</p>
              <span className="text-[9px] text-teal-400 font-mono">[DEXA RIS]</span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Diagnósticos & Prescrições</span>
              <p className="text-base font-extrabold text-white">{autoExtractedData.diagnoses.join(', ')}</p>
              <span className="text-[9px] text-teal-400 font-mono">[Prontuário Ativo]</span>
            </div>

          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs"
            >
              ← Voltar para Questionário
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <span>Avançar para Etapa 3 (Validação Médica)</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DOCTOR VALIDATION & CALCULATOR SCORES SUMMARY */}
      {currentStep === 3 && (
        <div className="space-y-6">
          
          {/* CALCULATOR DISPLAY SUMMARY CARD */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Etapa 3 de 3 • Validação & Decisão Clínica Médica
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">
                  Escore Calculado: {
                    activeCalculator === 'prevent' ? 'Risco Cardiovascular (PREVENT)' :
                    activeCalculator === 'kfre' ? 'Falência Renal (KDIGO / KFRE)' :
                    activeCalculator === 'frax' ? 'Osteoporose & Fraturas (FRAX)' :
                    activeCalculator === 'caprini' ? 'Tromboembolismo (Caprini)' :
                    'Complicação Cirúrgica (RCRI / Lee)'
                  }
                </h3>
              </div>
            </div>

            {/* PREVENT RESULT DISPLAY */}
            {activeCalculator === 'prevent' && (() => {
              const res = getPreventScore();
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Probabilidade de Infarto / AVC em 10 anos</p>
                      <p className={`text-4xl font-black ${res.color} mt-1`}>{res.riskPercent}%</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${res.badgeBg}`}>
                      {res.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{res.recommendation}</p>
                </div>
              );
            })()}

            {/* KFRE RESULT DISPLAY */}
            {activeCalculator === 'kfre' && (() => {
              const res = getKfreScore();
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Risco de Falência Renal (2 Anos)</p>
                      <p className={`text-3xl font-black ${res.color} mt-1`}>{res.twoYearRiskPercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Risco de Falência Renal (5 Anos)</p>
                      <p className={`text-3xl font-black ${res.color} mt-1`}>{res.fiveYearRiskPercent}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{res.recommendation}</p>
                </div>
              );
            })()}

            {/* FRAX RESULT DISPLAY */}
            {activeCalculator === 'frax' && (() => {
              const res = getFraxScore();
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Fratura Osteoporótica Maior (10 anos)</p>
                      <p className={`text-3xl font-black ${res.color} mt-1`}>{res.majorOsteoporoticFracturePercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Fratura de Quadril (10 anos)</p>
                      <p className={`text-3xl font-black ${res.color} mt-1`}>{res.hipFracturePercent}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{res.recommendation}</p>
                </div>
              );
            })()}

            {/* CAPRINI RESULT DISPLAY */}
            {activeCalculator === 'caprini' && (() => {
              const res = getCapriniScore();
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Pontuação Caprini VTE</p>
                      <p className={`text-4xl font-black ${res.color} mt-1`}>{res.scorePoints} Pontos</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${res.badgeBg}`}>
                      {res.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{res.recommendation}</p>
                </div>
              );
            })()}

            {/* RCRI RESULT DISPLAY */}
            {activeCalculator === 'rcri' && (() => {
              const res = getRcriScore();
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Fatores de Risco Cardíaco Pré-Operatório</p>
                      <p className={`text-4xl font-black ${res.color} mt-1`}>{res.scorePoints} Fator</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${res.badgeBg}`}>
                      {res.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{res.recommendation}</p>
                </div>
              );
            })()}

            {/* DOCTOR VALIDATION ACTIONS */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Confirmação do Profissional de Saúde (Médico ou Enfermeiro)
              </h4>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleConfirmValidation('confirmed')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all ${
                    doctorValidationStatus === 'confirmed'
                      ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                      : 'bg-slate-900 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar Dados</span>
                </button>

                <button
                  onClick={() => handleConfirmValidation('edited')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all ${
                    doctorValidationStatus === 'edited'
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                      : 'bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-amber-950'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Corrigir Informação</span>
                </button>

                <button
                  onClick={() => handleConfirmValidation('not_applicable')}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-1.5 transition-all ${
                    doctorValidationStatus === 'not_applicable'
                      ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-400'
                      : 'bg-slate-900 text-rose-300 border border-rose-500/30 hover:bg-rose-950'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Risco Não Aplicável a Este Paciente</span>
                </button>
              </div>

              {/* MANDATORY LEGAL DISCLAIMER NOTICE */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start space-x-3 text-xs text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-extrabold text-white text-xs">Aviso Obrigatório de Interpretabilidade Clínica:</strong>
                  <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                    Estimativa de risco calculada com base nos dados disponíveis. O resultado deve ser interpretado por profissional de saúde.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
