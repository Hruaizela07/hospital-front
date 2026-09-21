const DEFAULT_ADMIN_PATH = '/dashboard'

/**
 * Guards against open redirects: only same-origin, absolute paths are allowed
 * through. Anything else (missing, protocol-relative `//evil.com`, or a full
 * URL) falls back to the default admin landing page.
 */

export function safeRedirect(to: string | null | undefined, fallback = DEFAULT_ADMIN_PATH) {
  if (!to || !to.startsWith('/') || to.startsWith('//'))
    return fallback

  return to
}
