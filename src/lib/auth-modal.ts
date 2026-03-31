/** Open the header sign-in dialog from anywhere (e.g. add-joke access denied). */
export const OPEN_AUTH_MODAL_EVENT = 'programming-humour:open-auth-modal'

export function requestOpenAuthModal() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_AUTH_MODAL_EVENT))
}
