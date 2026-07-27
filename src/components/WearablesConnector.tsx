import React, { useState, useEffect } from 'react';
import { UserProfile, WearableDevice } from '../types/health';
import { 
  Watch, 
  Smartphone, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  Battery, 
  Activity, 
  Heart, 
  Footprints, 
  Moon,
  Sliders,
  Radio,
  AlertTriangle,
  Flame,
  Droplets,
  Thermometer,
  ShieldCheck,
  Plus,
  Trash2,
  Settings,
  Bluetooth,
  Key,
  X,
  HelpCircle,
  Search,
  Info
} from 'lucide-react';

interface WearablesConnectorProps {
  profile: UserProfile;
  devices: WearableDevice[];
}

export interface CustomDeviceConfig {
  id: string;
  name: string;
  brand: 'Apple Watch' | 'Galaxy Watch' | 'Garmin' | 'Fitbit' | 'Google Pixel Watch' | 'Omron BLE' | 'Dexcom CGM' | 'Oura Ring' | 'Custom BLE Sensor';
  platform: 'Apple HealthKit' | 'Google Health Connect' | 'Garmin Connect API' | 'Direct Bluetooth BLE' | 'Dexcom Cloud';
  macAddressOrUuid: string;
  status: 'connected' | 'syncing' | 'disconnected';
  batteryPercent: number;
  lastSync: string;
  allowedMetrics: {
    heartRate: boolean;
    spO2: boolean;
    bloodPressure: boolean;
    glucose: boolean;
    sleep: boolean;
    temperature: boolean;
  };
}

export const WearablesConnector: React.FC<WearablesConnectorProps> = ({
  profile,
}) => {
  // Pre-configured default paired devices
  const [pairedDevices, setPairedDevices] = useState<CustomDeviceConfig[]>([
    {
      id: 'dev_01',
      name: 'Apple Watch Series 9',
      brand: 'Apple Watch',
      platform: 'Apple HealthKit',
      macAddressOrUuid: 'A1:B2:C3:D4:E5:F6',
      status: 'connected',
      batteryPercent: 88,
      lastSync: 'Há 5 minutos',
      allowedMetrics: {
        heartRate: true,
        spO2: true,
        bloodPressure: false,
        glucose: false,
        sleep: true,
        temperature: true
      }
    },
    {
      id: 'dev_02',
      name: 'Esfigmomanômetro Omron Evolv BLE',
      brand: 'Omron BLE',
      platform: 'Direct Bluetooth BLE',
      macAddressOrUuid: 'F4:01:C2:88:99:AA',
      status: 'connected',
      batteryPercent: 95,
      lastSync: 'Há 2 horas',
      allowedMetrics: {
        heartRate: true,
        spO2: false,
        bloodPressure: true,
        glucose: false,
        sleep: false,
        temperature: false
      }
    },
    {
      id: 'dev_03',
      name: 'Dexcom G7 Continuous Glucose Monitor',
      brand: 'Dexcom CGM',
      platform: 'Dexcom Cloud',
      macAddressOrUuid: 'DX-G7-948120',
      status: 'connected',
      batteryPercent: 100,
      lastSync: 'Há 15 minutos',
      allowedMetrics: {
        heartRate: false,
        spO2: false,
        bloodPressure: false,
        glucose: true,
        sleep: false,
        temperature: false
      }
    }
  ]);

  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);
  const [showMacHelp, setShowMacHelp] = useState(false);
  const [isScanningBle, setIsScanningBle] = useState(false);

  // Form states for pairing new custom device
  const [newDevName, setNewDevName] = useState('');
  const [newDevBrand, setNewDevBrand] = useState<CustomDeviceConfig['brand']>('Custom BLE Sensor');
  const [newDevMac, setNewDevMac] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Live Simulated Telemetry Stream Metrics
  const [heartRate, setHeartRate] = useState(74);
  const [spO2, setSpO2] = useState(98);
  const [systolicBP, setSystolicBP] = useState(122);
  const [diastolicBP, setDiastolicBP] = useState(80);
  const [glucoseMgDl, setGlucoseMgDl] = useState(108);

  // LIVE STREAMING TELEMETRY SIMULATOR
  useEffect(() => {
    let interval: any = null;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        setHeartRate(Math.floor(68 + Math.random() * 20));
        setSpO2(Math.floor(96 + Math.random() * 3));
        setSystolicBP(Math.floor(118 + Math.random() * 22));
        setDiastolicBP(Math.floor(76 + Math.random() * 10));
        setGlucoseMgDl(Math.floor(98 + Math.random() * 30));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // TOGGLE INDIVIDUAL METRIC PERMISSION FOR A DEVICE
  const handleToggleMetricPermission = (deviceId: string, metricKey: keyof CustomDeviceConfig['allowedMetrics']) => {
    setPairedDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          allowedMetrics: {
            ...d.allowedMetrics,
            [metricKey]: !d.allowedMetrics[metricKey]
          }
        };
      }
      return d;
    }));
  };

  // WEB BLUETOOTH BLE AUTOMATIC SCANNER
  const handleAutoScanBluetooth = async () => {
    setIsScanningBle(true);
    try {
      if (navigator.bluetooth) {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'health_thermometer', 0x180D, 0x1822]
        });
        if (device) {
          setNewDevName(device.name || 'Sensor Bluetooth Biomédico');
          setNewDevMac(device.id || 'E4:A1:B8:99:00:11');
          setToastMessage(`Dispositivo "${device.name || 'Sensor BLE'}" encontrado e MAC preenchido!`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3500);
        }
      } else {
        // Simulação caso navegador não possua suporte nativo a Web Bluetooth
        setTimeout(() => {
          setNewDevName('Oxímetro Bluetooth BLE Detectado');
          setNewDevMac('E4:A1:B8:99:00:11');
          setIsScanningBle(false);
          setToastMessage('Sensor Bluetooth localizado automaticamente!');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3500);
        }, 1200);
        return;
      }
    } catch (err) {
      console.warn('Busca Bluetooth cancelada ou simulada:', err);
      // Fallback simulado
      setNewDevName('Medidor Digital Bluetooth Detectado');
      setNewDevMac('D8:88:99:AA:BB:CC');
    } finally {
      setIsScanningBle(false);
    }
  };

  // ADD NEW CUSTOM IOT DEVICE
  const handlePairNewDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice: CustomDeviceConfig = {
      id: `dev_${Date.now()}`,
      name: newDevName || 'Sensor Biomédico Bluetooth BLE',
      brand: newDevBrand,
      platform: 'Direct Bluetooth BLE',
      macAddressOrUuid: newDevMac || 'E4:A1:B8:99:00:11',
      status: 'connected',
      batteryPercent: 100,
      lastSync: 'Agora mesmo',
      allowedMetrics: {
        heartRate: true,
        spO2: true,
        bloodPressure: true,
        glucose: true,
        sleep: false,
        temperature: true
      }
    };

    setPairedDevices(prev => [...prev, newDevice]);
    setShowPairModal(false);
    setNewDevName('');
    setNewDevMac('');

    setToastMessage(`Novo dispositivo "${newDevice.name}" pareado com sucesso!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // UNPAIR DEVICE
  const handleUnpairDevice = (deviceId: string, deviceName: string) => {
    setPairedDevices(prev => prev.filter(d => d.id !== deviceId));
    setToastMessage(`Dispositivo "${deviceName}" despareado.`);
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

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Gerenciador do Usuário • Escolha de Dispositivos IoT & Controle de Permissões</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Seleção & Configuração de Dispositivos IoT
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Escolha os relógios, oxímetros ou sensores de glicemia que você está utilizando e controle individualmente quais dados de saúde podem ser compartilhados com a equipe médica.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowPairModal(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Escolher / Parear Novo Dispositivo IoT</span>
          </button>
        </div>
      </div>

      {/* LIVE TELEMETRY DISPLAY */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 space-y-4 bg-cyan-950/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveStreaming ? 'bg-emerald-400 opacity-75' : 'bg-slate-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveStreaming ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
            </span>
            <h3 className="text-sm font-extrabold text-white">
              Telemetria dos Dispositivos Selecionados pelo Paciente
            </h3>
          </div>

          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isLiveStreaming ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isLiveStreaming ? 'Pausar Telemetria' : '⚡ Transmitir Dados dos Dispositivos Ativos'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-rose-400 font-bold block">Heart Rate</span>
            <p className="text-2xl font-black text-white">{heartRate} <span className="text-xs font-normal text-slate-400">BPM</span></p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-teal-400 font-bold block">SpO₂</span>
            <p className="text-2xl font-black text-white">{spO2} <span className="text-xs font-normal text-slate-400">%</span></p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-bold block">Pressão Arterial</span>
            <p className="text-2xl font-black text-white">{systolicBP}/{diastolicBP} <span className="text-xs font-normal text-slate-400">mmHg</span></p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">Glicemia Contínua</span>
            <p className="text-2xl font-black text-white">{glucoseMgDl} <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
          </div>
        </div>
      </div>

      {/* PAIRED DEVICES LIST & GRANULAR PERMISSION TOGGLES */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Bluetooth className="w-5 h-5 text-cyan-400" />
          Seus Dispositivos IoT Escolhidos & Controle Granular de Permissões ({pairedDevices.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pairedDevices.map((dev) => (
            <div key={dev.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between text-xs">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                      <Watch className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm line-clamp-1">{dev.name}</h4>
                      <p className="text-[11px] text-slate-400">{dev.platform} • {dev.macAddressOrUuid}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnpairDevice(dev.id, dev.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Desparear Dispositivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* STATUS & BATTERY BAR */}
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Conectado ({dev.batteryPercent}%)
                  </span>
                  <span className="text-slate-400">{dev.lastSync}</span>
                </div>

                {/* GRANULAR PERMISSION TOGGLES FOR THIS SPECIFIC DEVICE */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-extrabold text-cyan-300 uppercase block">
                    Permissões de Dados deste IoT:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      onClick={() => handleToggleMetricPermission(dev.id, 'heartRate')}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        dev.allowedMetrics.heartRate 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>❤️ Batimentos</span>
                      <span>{dev.allowedMetrics.heartRate ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleMetricPermission(dev.id, 'spO2')}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        dev.allowedMetrics.spO2 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>🫁 Oxigênio SpO₂</span>
                      <span>{dev.allowedMetrics.spO2 ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleMetricPermission(dev.id, 'bloodPressure')}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        dev.allowedMetrics.bloodPressure 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>⚡ Pressão Arterial</span>
                      <span>{dev.allowedMetrics.bloodPressure ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleMetricPermission(dev.id, 'glucose')}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        dev.allowedMetrics.glucose 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>🩸 Glicemia</span>
                      <span>{dev.allowedMetrics.glucose ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* MODAL: PAREAR NOVO DISPOSITIVO IOT COM BUSCA AUTOMÁTICA & INSTRUÇÕES DE MAC */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-lg w-full border border-slate-800 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Bluetooth className="w-5 h-5 text-cyan-400" />
                Escolher & Parear Dispositivo IoT
              </h3>
              <button onClick={() => setShowPairModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCANNER AUTOMÁTICO WEB BLUETOOTH */}
            <div className="p-3.5 bg-cyan-950/30 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-extrabold text-white">Escanear Bluetooth BLE Automaticamente</p>
                <p className="text-[11px] text-slate-300">Localize seu oxímetro ou relógio sem precisar digitar o MAC.</p>
              </div>

              <button
                type="button"
                onClick={handleAutoScanBluetooth}
                disabled={isScanningBle}
                className="py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Search className={`w-3.5 h-3.5 ${isScanningBle ? 'animate-spin' : ''}`} />
                <span>{isScanningBle ? 'Buscando...' : '🔍 Escanear'}</span>
              </button>
            </div>

            <form onSubmit={handlePairNewDevice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome do Dispositivo / Sensor</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Meu Anel Oura Ring ou Oxímetro de Dedo"
                  value={newDevName}
                  onChange={(e) => setNewDevName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Marca / Categoria do Dispositivo</label>
                <select
                  value={newDevBrand}
                  onChange={(e) => setNewDevBrand(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Apple Watch">Apple Watch (HealthKit)</option>
                  <option value="Galaxy Watch">Galaxy Watch (Health Connect)</option>
                  <option value="Garmin">Garmin (Connect API)</option>
                  <option value="Omron BLE">Omron BLE (Pressão Arterial)</option>
                  <option value="Dexcom CGM">Dexcom G7 (Monitor Glicêmico)</option>
                  <option value="Oura Ring">Oura Ring Gen3</option>
                  <option value="Custom BLE Sensor">Sensor Bluetooth BLE Customizado</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Endereço MAC / UUID Bluetooth</label>
                  <button
                    type="button"
                    onClick={() => setShowMacHelp(!showMacHelp)}
                    className="text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Como saber o MAC?</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="ex: E4:A1:B8:99:00:11 ou clique em Escanear"
                  value={newDevMac}
                  onChange={(e) => setNewDevMac(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-cyan-400 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* INSTRUÇÕES PASSO A PASSO DE COMO DESCOBRIR O MAC */}
              {showMacHelp && (
                <div className="p-4 bg-slate-900 rounded-2xl border border-cyan-500/40 text-xs space-y-2 animate-fadeIn text-slate-200 leading-relaxed">
                  <h4 className="font-extrabold text-cyan-300 text-sm flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    Guia Passo a Passo: Como encontrar o Endereço MAC do seu IoT
                  </h4>

                  <div className="space-y-1.5 text-[11px] pt-1">
                    <p><strong className="text-white">1. No Android (Relógios e Oxímetros):</strong> Vá em <em>Ajustes &gt; Conexões &gt; Bluetooth</em>. Toque no ícone de engrenagem ao lado do seu dispositivo para copiar o MAC (formato `XX:XX:XX:XX:XX:XX`).</p>
                    <p><strong className="text-white">2. No iPhone / Apple Watch:</strong> Vá em <em>Ajustes &gt; Geral &gt; Sobre &gt; Endereço Bluetooth</em>.</p>
                    <p><strong className="text-white">3. Em Oxímetros e Medidores de Pressão (Omron/Dexcom):</strong> O código MAC fica impresso na <strong>etiqueta adesiva na parte traseira</strong> do aparelho ou na caixa original.</p>
                    <p className="text-cyan-400 font-bold">💡 Dica Prática: Clique no botão "🔍 Escanear" no topo do formulário para capturar o MAC automaticamente via Bluetooth!</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPairModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Parear Dispositivo IoT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
