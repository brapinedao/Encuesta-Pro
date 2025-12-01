/**
 * JWT Utilities
 * Funciones para manejar tokens JWT
 */

export interface ITokenPayload {
  sub: string
  uid: string
  companyId: string
  jti: string
  exp: number
  iss: string
  aud: string
}

/**
 * Decodifica un token JWT sin verificar la firma
 * @param token - Token JWT a decodificar
 * @returns Payload del token decodificado
 */
export function decodeToken(token: string): ITokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const base64Url = parts[1]!
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error al decodificar token:', error)
    return null
  }
}

/**
 * Verifica si un token JWT ha expirado
 * @param token - Token JWT a verificar
 * @returns true si el token ha expirado, false en caso contrario
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) {
    return true
  }

  // exp está en segundos, Date.now() está en milisegundos
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * Obtiene el tiempo de expiración de un token en milisegundos
 * @param token - Token JWT
 * @returns Timestamp de expiración en milisegundos, o null si no se puede obtener
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) {
    return null
  }

  // Convertir de segundos a milisegundos
  return payload.exp * 1000
}

/**
 * Obtiene el tiempo restante antes de que expire el token en milisegundos
 * @param token - Token JWT
 * @returns Milisegundos restantes, o 0 si ya expiró
 */
export function getTokenTimeRemaining(token: string): number {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) {
    return 0
  }

  const timeRemaining = expirationTime - Date.now()
  return timeRemaining > 0 ? timeRemaining : 0
}

/**
 * Alias de decodeToken para compatibilidad
 */
export const parseJwt = decodeToken
