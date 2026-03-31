// Tiny event bus so other routes can tell the header to show sign-in.
export const OPEN_AUTH_MODAL_EVENT = 'programming-humour:open-auth-modal'

export function requestOpenAuthModal() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_AUTH_MODAL_EVENT))
}
