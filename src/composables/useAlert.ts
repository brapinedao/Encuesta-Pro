import '@/styles/css/alert.css'
import { ALERT_TIMEOUT } from '@/constants/'

export const useAlert = () => {
  const showAlert = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default',
    timeout: number = 6000,
  ) => {
    const alert = document.createElement('div')
    alert.classList.add('custom-alert', `custom-alert--${type}`)
    alert.innerText = message

    document.body.appendChild(alert)

    setTimeout(() => {
      alert.classList.add('hide')
      setTimeout(() => alert.remove(), ALERT_TIMEOUT)
    }, timeout)
  }

  return {
    showAlert,
  }
}
