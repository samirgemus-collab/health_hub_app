import React, { useState } from 'react';
import { UserProfile, WearableDevice } from '../types/health';
import { 
  mockWearableDevices 
} from '../mock/healthData';
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
  Moon,
  Sliders,
  AlertTriangle,
  Droplets,
  Thermometer,
  ShieldCheck,
  Plus,
  Trash2,
  Bluetooth,
  HelpCircle,
  Search,
  Info,
  Lock,
  RotateCcw,
  Check,
  FileCheck,
  Scale
} from 'lucide-react';

interface WearablesConnectorProps {
  profile: UserProfile;
  devices?: WearableDevice[];
}

export const WearablesConnector: React.FC<WearablesConnectorProps> = ({
  profile,
}) => {
  const [deviceList, setDeviceList] = useState<WearableDevice[]>(mockWearableDevices);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredBleDevices, setDiscoveredBleDevices] = useState<{ name: string; type: string; rssi: number }[]>([]);
  const [selectedHub, setSelectedHub] = useState<'all' | 'healthkit' | 'google_health_connect' | 'samsung_health' | 'ble_direct'>('all');
  const [showRevokeToast, setShowRevokeToast] = useState(false);

  const handleStartBleScan = async () => {
    setIsScanning(true);
    setDiscoveredBleDevices([]);

    try {
      if ('bluetooth' in navigator) {
        // Attempt native Web Bluetooth API request if available
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'blood_pressure', 'glucose', 'health_thermometer']
        });
        if (device) {
          setDiscoveredBleDevices([{ name: device.name || 'Dispositivo Bluetooth Conectado', type: 'Dispositivo BLE Detectado', rssi: -65 }]);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          setDiscoveredBleDevices([
            { name: 'Omron Evolv (BP BLE)', type: 'Equipamento Médico (Anvisa)', rssi: -58 },
            { name: 'Accu-Chek Instant (Glicemia BLE)', type: 'Equipamento Médico (Anvisa)', rssi: -64 },
            { name: 'Garmin Forerunner 965', type: 'Dispositivo de Bem-Estar', rssi: -72 }
          ]);
        }, 1500);
      }
    } catch (err) {
      // User canceled or Bluetooth unavailable fallback
      setTimeout(() => {
        setDiscoveredBleDevices([
          { name: 'Omron Evolv BLE (Braçote)', type: 'Equipamento Médico (Anvisa)', rssi: -55 },
          { name: 'Accu-Chek Instant (Glicosímetro)', type: 'Equipamento Médico (Anvisa)', rssi: -62 }
        ]);
      }, 1200);
    } finally {
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  const handleToggleSharing = (deviceId: string) => {
    setDeviceList(prev => prev.map(d => d.id === deviceId ? { ...d, sharingWithCareTeam: !d.sharingWithCareTeam } : d));
  };

  const handleRevokeDevice = (deviceId: string) => {
    setDeviceList(prev => prev.filter(d => d.id !== deviceId));
    setShowRevokeToast(true);
    setTimeout(() => setShowRevokeToast(false), 3000);
  };

  const filteredDevices = selectedHub === 'all' 
    ? deviceList 
    : deviceList.filter(d => d.connectionType === selectedHub);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. HEADER BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <Bluetooth className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <span>Telemetria Conectada • Dono da Saúde</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Integração com Dispositivos & Wearables
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Conecte seus smartwatches, balanças, glicosímetros e medidores digitais para monitoramento contínuo.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartBleScan}
          disabled={isScanning}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Procurando Dispositivos BLE...' : '🔍 Buscar Dispositivos Bluetooth'}</span>
        </button>
      </div>

      {/* 2. HUBS DE CONEXÃO SUPORTADOS (HEALTHKIT / GOOGLE CONNECT / SAMSUNG HEALTH) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" /> Hubs de Saúde & Plataformas Compatíveis
          </h2>
          <span className="text-xs text-slate-400">Selecione para filtrar</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedHub(selectedHub === 'healthkit' ? 'all' : 'healthkit')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHub === 'healthkit' ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/40' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Apple HealthKit</span>
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400">Apple Watch, ECG & Saúde do iPhone</p>
          </button>

          <button
            onClick={() => setSelectedHub(selectedHub === 'google_health_connect' ? 'all' : 'google_health_connect')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHub === 'google_health_connect' ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/40' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Google Health Connect</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">Fitbit, Garmin & Balanças Android</p>
          </button>

          <button
            onClick={() => setSelectedHub(selectedHub === 'samsung_health' ? 'all' : 'samsung_health')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHub === 'samsung_health' ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/40' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Samsung Health</span>
              <Watch className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400">Galaxy Watch & Sensores BioActive</p>
          </button>

          <button
            onClick={() => setSelectedHub(selectedHub === 'ble_direct' ? 'all' : 'ble_direct')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedHub === 'ble_direct' ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/40' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Bluetooth LE Direct</span>
              <Bluetooth className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-[11px] text-slate-400">Omron, Accu-Chek & Sensores Diretos</p>
          </button>
        </div>
      </section>

      {/* 3. DISCOVERED BLE DEVICES MODAL/PANEL */}
      {discoveredBleDevices.length > 0 && (
        <div className="p-6 bg-slate-900 rounded-3xl border border-cyan-500/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Bluetooth className="w-4 h-4 text-cyan-400 animate-pulse" /> Dispositivos Próximos Encontrados
            </h3>
            <button
              onClick={() => setDiscoveredBleDevices([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fechar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoveredBleDevices.map((dev, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{dev.name}</h4>
                  <span className="text-[10px] text-teal-400 font-bold block mt-0.5">{dev.type}</span>
                </div>
                <button
                  onClick={() => {
                    setDeviceList(prev => [...prev, {
                      id: `dev_new_${Date.now()}`,
                      name: dev.name,
                      brand: 'Omron BLE',
                      platform: 'Bluetooth LE Direct',
                      connectionType: 'ble_direct',
                      deviceCategory: 'medical_grade',
                      anvisaFdaApprovalStatus: 'Homologado Anvisa (Equipamento Médico)',
                      batteryPercent: 100,
                      lastSync: 'Agora',
                      status: 'connected',
                      metricsProvided: ['Pressão Arterial', 'Frequência Cardíaca'],
                      permissionsGranted: ['blood_pressure', 'heart_rate'],
                      sharingWithCareTeam: true
                    }]);
                    setDiscoveredBleDevices([]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  Conectar Dispositivo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DISPOSITIVOS PAREADOS & CONFIGURAÇÕES LGPD */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-black text-white">Dispositivos Conectados ({filteredDevices.length})</h2>
            <p className="text-xs text-slate-400">Gerencie a origem dos dados, permissões e consentimento de compartilhamento.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDevices.map((device) => {
            const isMedical = device.deviceCategory === 'medical_grade';
            return (
              <div
                key={device.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Header: Title & Device Grade Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-extrabold text-white">{device.name}</h3>
                      </div>
                      <p className="text-[11px] text-slate-400">{device.platform}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider shrink-0 ${
                      isMedical 
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' 
                        : 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                    }`}>
                      {isMedical ? '🏥 Finalidade Médica (Anvisa)' : '⌚ Bem-Estar & Fitness'}
                    </span>
                  </div>

                  {/* Homologation & Sync Status */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Classificação Oficial:</span>
                      <span className="text-slate-200 font-bold">{device.anvisaFdaApprovalStatus || 'Dispositivo Compatível'}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Última Sincronização:</span>
                      <span className="text-teal-400 font-bold">{device.lastSync} (Automática)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Nível da Bateria:</span>
                      <span className="text-slate-200 font-bold flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5 text-emerald-400 inline" /> {device.batteryPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Metrics Provided */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Métricas Importadas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {device.metricsProvided.map((m, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium">
                          ✓ {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sharing Permission Toggle */}
                  <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-400" /> Compartilhar com Equipe Médica
                    </span>
                    <button
                      onClick={() => handleToggleSharing(device.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                        device.sharingWithCareTeam
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {device.sharingWithCareTeam ? 'Permitido (LGPD)' : 'Ocultado'}
                    </button>
                  </div>
                </div>

                {/* Revoke Action */}
                <div className="border-t border-slate-800/60 pt-3 flex justify-end">
                  <button
                    onClick={() => handleRevokeDevice(device.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revogar Conexão deste Dispositivo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ORIENTAÇÃO DE SEGURANÇA CLÍNICA & CALIBRAÇÃO */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 bg-slate-950/80">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Diretrizes de Segurança Telemétrica & Calibração
            </h3>
            <p className="text-xs text-slate-400">
              Esclarecimentos fundamentais sobre a precisão de dispositivos e interpretação de medições.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Precisão Médica vs Bem-Estar
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Nem todos os dispositivos possuem finalidade médica. Smartbands e relógios de bem-estar servem para acompanhar tendências de atividade e sono. Equipamentos de pressão (Omron) e glicosímetros (Accu-Chek) possuem certificação médica Anvisa/FDA para apoio clínico.
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Artefatos de Medição & Calibração
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Variações isoladas em medições podem sofrer interferência de posicionamento do pulso, movimentação, bateria fraca ou calibração. A plataforma notifica sobre alterações recorrentes para confirmação sem gerar pânico desnecessário.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-2xl border border-teal-500/30 text-xs text-teal-200 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Mensagem Padrão do Copiloto em Alertas Telemétricos:</strong> "Identificamos medidas acima da sua meta em diferentes momentos. Confirme se as medições foram realizadas corretamente e compartilhe essas informações com seu profissional de saúde."
          </p>
        </div>
      </section>

      {/* Toast Notification */}
      {showRevokeToast && (
        <div className="fixed bottom-6 right-6 p-4 bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce z-50">
          <Check className="w-4 h-4" />
          <span>Conexão do dispositivo revogada com sucesso (LGPD).</span>
        </div>
      )}

    </div>
  );
};
