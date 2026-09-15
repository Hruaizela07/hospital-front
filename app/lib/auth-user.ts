import { UserRole } from '~/gql/graphql'

export interface AuthUsers {
  id: string
  userName: string
  role: UserRole
}

const cachedUserStorageKey = 'hospital-web.me'

export function getRoleHomePath(role?: UserRole) {
  switch (role) {
    case UserRole.Doctors:
      return '/doctor'
    case UserRole.Admin:
    default:
      return '/admin'
  }
}

export function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.sessionStorage.getItem(cachedUserStorageKey)
    return value ? JSON.parse(value) as AuthUsers : null
  }
  catch {
    return null
  }
}

export function storeUser(user: AuthUsers | null) {
  if (typeof window === 'undefined') {
    return
  }
  if (!user) {
    window.sessionStorage.removeItem(cachedUserStorageKey)
    return
  }
  window.sessionStorage.setItem(cachedUserStorageKey, JSON.stringify(user))
}
