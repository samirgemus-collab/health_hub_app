import React, { useState } from 'react';
import { UserProfile, AuthorizedFamilyMember, FamilyAccessLevel } from '../types/health';
import { 
  User, 
  ShieldCheck, 
  Users, 
  Lock, 
  X, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Key, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Activity, 
  ShieldAlert,
  Download
} from 'lucide-react';

interface PatientProfileRegistrationModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

export const PatientProfileRegistrationModal: React.FC<PatientProfileRegistrationModalProps> = ({
  profile,
  isOpen,
  onClose,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile_data' | 'family_consent'>('profile_data');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState(profile.name);
  const [phoneFormatted, setPhoneFormatted] = useState(profile.phoneFormatted || '(11) 98482-9102');
  const [birthDate, setBirthDate] = useState(profile.birthDate || '1981-05-14');
  const [bloodType, setBloodType] = useState(profile.bloodType);
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [addressFormatted, setAddressFormatted] = useState(profile.addressFormatted || 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP');

  // Family Consent State
  const [familyConsentActive, setFamilyConsentActive] = useState<boolean>(profile.familySharingConsentActive ?? true);
  const [familyMembers, setFamilyMembers] = useState<AuthorizedFamilyMember[]>(profile.authorizedFamilyMembers || [
    {
      id: 'fam_auth_01',
      name: 'Pedro Silva',
      relationship: 'Esposo',
      cpfMasked: '***.331.401-**',
      email: 'pedro.silva@email.com',
      phoneFormatted: '(11) 99842-1020',
      accessLevel: 'full_access',
      authorizedAt: '2026-02-01T10:00:00Z',
      consentHash: '0x8f7a91c4b2e519d0',
      status: 'active'
    },
    {
      id: 'fam_auth_02',
      name: 'Ana Clara Silva',
      relationship: 'Filha',
      cpfMasked: '***.892.104-**',
      email: 'anaclara.silva@email.com',
      phoneFormatted: '(11) 97120-4912',
      accessLevel: 'read_only',
      authorizedAt: '2026-03-10T14:30:00Z',
      consentHash: '0x3c11a49f82d109b4',
      status: 'active'
    }
  ]);

  // Add Family Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [memberName, setMemberName] = useState<string>('');
  const [memberRel, setMemberRel] = useState<string>('Filho(a)');
  const [memberEmail, setMemberEmail] = useState<string>('');
  const [memberPhone, setMemberPhone] = useState<string>('');
  const [memberAccess, setMemberAccess] = useState<FamilyAccessLevel>('read_only');

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveProfileData = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      phoneFormatted,
      birthDate,
      bloodType,
      heightCm,
      weightKg,
      addressFormatted,
      familySharingConsentActive: familyConsentActive,
      authorizedFamilyMembers: familyMembers
    });
    triggerToast('Ficha do cliente e preferências atualizadas com sucesso!');
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) return;

    const newMember: AuthorizedFamilyMember = {
      id: `fam_auth_${Date.now()}`,
      name: memberName,
      relationship: memberRel,
      cpfMasked: '***.***.***-**',
      email: memberEmail,
      phoneFormatted: memberPhone || '(11) 90000-0000',
      accessLevel: memberAccess,
      authorizedAt: new Date().toISOString(),
      consentHash: `0x${Math.floor(Math.random() * 1000000000).toString(16)}`,
      status: 'active'
    };

    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    onUpdateProfile({ authorizedFamilyMembers: updated });
    setShowAddMemberModal(false);
    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    triggerToast(`Familiar ${memberName} autorizado com sucesso! Consentimento gravado em auditoria.`);
  };

  const handleRevokeAccess = (memberId: string, memberName: string) => {
    const updated = familyMembers.map(m => m.id === memberId ? { ...m, status: 'revoked' as const } : m);
    setFamilyMembers(updated);
    onUpdateProfile({ authorizedFamilyMembers: updated });
    triggerToast(`Autorização de compartilhamento com ${memberName} foi REVOGADA imediatamente.`);
  };

  const getAccessBadge = (level: FamilyAccessLevel) => {
    switch (level) {
      case 'full_access':
        return { label: 'Acesso Completo + SOS', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'read_only':
        return { label: 'Apenas Leitura Preventiva', bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
      case 'emergency_only':
        return { label: 'Apenas Alertas SOS', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 text-cyan-400">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                <span>Ficha do Cliente • Dono da Saúde</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Perfil de Saúde & Consentimento LGPD
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SUB-TABS */}
        <div className="flex space-x-2 border-b border-slate-800 pb-3 text-xs">
          <button
            onClick={() => setActiveTab('profile_data')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'profile_data' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ficha Cadastral do Cidadão</span>
          </button>

          <button
            onClick={() => setActiveTab('family_consent')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'family_consent' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Compartilhamento Familiar (LGPD)</span>
          </button>
        </div>

        {/* TAB 1: FICHA CADASTRAL DO CLIENTE */}
        {activeTab === 'profile_data' && (
          <form onSubmit={handleSaveProfileData} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Nome Completo do Cidadão</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">CPF (Mascarado)</label>
                <input
                  type="text"
                  value={profile.cpfMasked}
                  disabled
                  className="w-full p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Data de Nascimento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phoneFormatted}
                  onChange={(e) => setPhoneFormatted(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Tipo Sanguíneo</label>
                <input
                  type="text"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Altura (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Peso (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-bold">Endereço Residencial Cadastrado</label>
                <input
                  type="text"
                  value={addressFormatted}
                  onChange={(e) => setAddressFormatted(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Salvar Ficha do Cliente
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: COMPARTILHAMENTO FAMILIAR (LGPD) */}
        {activeTab === 'family_consent' && (
          <div className="space-y-5 text-xs">
            
            {/* GENERAL CONSENT TOGGLE */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-white text-sm">Consentimento de Compartilhamento Familiar (LGPD Art. 7º/11º)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Autorizo o compartilhamento seguro e criptografado das minhas informações preventivas com os familiares autorizados abaixo.
                </p>
              </div>

              <button
                onClick={() => setFamilyConsentActive(!familyConsentActive)}
                className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all shrink-0 ${
                  familyConsentActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {familyConsentActive ? '✓ Consentimento ATIVO' : 'Consentimento DESATIVADO'}
              </button>
            </div>

            {/* ACTION HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm">Familiares & Representantes Autorizados</h3>
              
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Autorizar Novo Familiar</span>
              </button>
            </div>

            {/* AUTHORIZED MEMBERS LIST */}
            <div className="space-y-3">
              {familyMembers.map((member) => {
                const badge = getAccessBadge(member.accessLevel);
                const isRevoked = member.status === 'revoked';
                return (
                  <div key={member.id} className={`p-4 rounded-2xl border transition-all ${isRevoked ? 'bg-slate-950/40 border-slate-850 opacity-60' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-white text-sm">{member.name}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-bold">{member.relationship}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>{badge.label}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {member.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {member.phoneFormatted}</span>
                        </div>

                        <span className="text-[9px] text-slate-500 font-mono block">
                          Hash LGPD: {member.consentHash} • Autorizado em: {new Date(member.authorizedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {!isRevoked ? (
                        <button
                          onClick={() => handleRevokeAccess(member.id, member.name)}
                          className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center space-x-1 cursor-pointer shrink-0"
                          title="Revogar imediatamente o acesso deste familiar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revogar Acesso</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 bg-rose-950/30 px-3 py-1 rounded-xl border border-rose-500/30 shrink-0">
                          Acesso Revogado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* MODAL ADICIONAR NOVO FAMILIAR */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Autorizar Novo Familiar (LGPD)
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFamilyMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Nome do Familiar</label>
                <input
                  type="text"
                  placeholder="Ex: Ana Clara Silva"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Parentesco</label>
                  <select
                    value={memberRel}
                    onChange={(e) => setMemberRel(e.target.value)}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold"
                  >
                    <option value="Cônjuge / Esposo(a)">Cônjuge / Esposo(a)</option>
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Pai / Mãe">Pai / Mãe</option>
                    <option value="Irmão / Irmã">Irmão / Irmã</option>
                    <option value="Cuidador Legal">Cuidador Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Nível de Acesso</label>
                  <select
                    value={memberAccess}
                    onChange={(e) => setMemberAccess(e.target.value as FamilyAccessLevel)}
                    className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold"
                  >
                    <option value="full_access">Acesso Completo + SOS</option>
                    <option value="read_only">Apenas Leitura Preventiva</option>
                    <option value="emergency_only">Apenas Alertas SOS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">E-mail do Familiar</label>
                <input
                  type="email"
                  placeholder="anaclara@email.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(11) 99000-0000"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  Conceder Autorização
                </button>
              </div>
            </form>
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
