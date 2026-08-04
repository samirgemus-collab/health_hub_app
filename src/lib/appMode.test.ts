import { describe, it, expect } from 'vitest';
import { resolveAppMode, roleToPortal } from './appMode';

describe('appMode - Lógica Pura (H-001 Auth)', () => {

  it('@spec:AC-001 resolveAppMode com demoFlag=true deve retornar demo', () => {
    const mode = resolveAppMode({ demoFlag: 'true' });
    expect(mode).toBe('demo');
  });

  it('@spec:AC-001 resolveAppMode com url e anonKey deve retornar real', () => {
    const mode = resolveAppMode({
      url: 'https://xyz.supabase.co',
      anonKey: 'ey...secret',
    });
    expect(mode).toBe('real');
  });

  it('@spec:AC-001 resolveAppMode com env vazio deve retornar blocked (fail-closed)', () => {
    const mode = resolveAppMode({});
    expect(mode).toBe('blocked');
  });

  it('@spec:AC-001 resolveAppMode com env parcial (apenas url) deve retornar blocked', () => {
    const mode = resolveAppMode({ url: 'https://xyz.supabase.co' });
    expect(mode).toBe('blocked');
  });

  it('@spec:AC-001 resolveAppMode com env parcial (apenas key) deve retornar blocked', () => {
    const mode = resolveAppMode({ anonKey: 'ey...secret' });
    expect(mode).toBe('blocked');
  });

  it('@spec:AC-002 roleToPortal mapeia papéis válidos corretamente', () => {
    expect(roleToPortal('patient')).toBe('patient');
    expect(roleToPortal('doctor')).toBe('doctor');
    expect(roleToPortal('healthcare_team')).toBe('team');
    expect(roleToPortal('admin')).toBe('admin');
  });

  it('@spec:AC-002 roleToPortal retorna null para papéis inválidos ou ausentes', () => {
    expect(roleToPortal('super_user')).toBeNull();
    expect(roleToPortal('')).toBeNull();
    expect(roleToPortal(undefined)).toBeNull();
  });

});
