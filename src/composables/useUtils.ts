export const useUtils = () => {
  const isEmptyOrZero = <T extends Record<string, unknown>>(obj: T): boolean => {
    return Object.values(obj).every(
      (value) =>
        value === 0 || value === '' || value === null || value === undefined || value === '0',
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return {
    isEmptyOrZero,
    formatCurrency,
  }
}
