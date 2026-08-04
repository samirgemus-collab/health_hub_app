export type AppMode = 'real' | 'demo' | 'blocked';

export function resolveAppMode(env: {
  url?: string;
  anonKey?: string;
  demoFlag?: string;
}): AppMode {
  if (env.demoFlag === 'true') return 'demo'; // demo SÓ com flag explícita
  if (env.url && env.anonKey) return 'real';
  return 'blocked'; // fail-closed: sem env e sem flag = bloqueado
}

export function roleToPortal(role?: string): string | null {
  switch (role) {
    case 'patient': return 'patient';
    case 'doctor': return 'doctor';
    case 'healthcare_team': return 'team';
    case 'admin': return 'admin';
    default: return null;
  }
}
