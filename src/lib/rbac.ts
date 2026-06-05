export type Role = 'owner' | 'manager' | 'agent' | 'delivery' | 'viewer'

export const PERMISSIONS: Record<Role, readonly string[]> = {
  owner: ['*'],
  manager: [
    'conversations:read', 'conversations:write',
    'orders:read', 'orders:write', 'orders:status',
    'contacts:read', 'contacts:write',
    'products:read', 'products:write',
    'analytics:read', 'broadcasts:write',
    'settings:read', 'settings:write',
    'staff:read', 'staff:write',
  ],
  agent: [
    'conversations:read', 'conversations:write',
    'orders:read', 'orders:status',
    'contacts:read',
    'products:read',
  ],
  delivery: [
    'orders:read:assigned',
    'orders:status:delivery',
  ],
  viewer: [
    'analytics:read',
    'orders:read',
    'conversations:read',
  ],
} as const

export function can(role: Role, permission: string): boolean {
  const perms = PERMISSIONS[role] as readonly string[]
  return (
    perms.includes('*') ||
    perms.includes(permission) ||
    perms.some(p => permission.startsWith(p.replace(':*', '')))
  )
}

export function requirePermission(role: Role | undefined, permission: string): void {
  if (!role || !can(role, permission)) {
    throw new Error(`Forbidden: requires ${permission}`)
  }
}
