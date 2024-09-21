import { globalMixin } from '../../../mixins/global-mixin'

export const validateBLAmount = (amount, thousandSeparator, decimalPlaces, decimalCharacter, bankMaxAllowedAmount, typeErrorMessage) => {
  let error = null
  if (!amount && amount !== 0) {
    error = typeErrorMessage.BL_AMOUNT_ERRORS.Required
  } else {
    var amountFormatter = globalMixin.methods.numberUnFormatter(amount, thousandSeparator)
    amountFormatter = amountFormatter
      .replace(new RegExp(`[^\\d\\${decimalCharacter}-]`, 'g'), '') // Clear characters other than "number" and "." and "-"
      .replace(new RegExp(`\\${decimalCharacter}{2,}`, 'g'), decimalCharacter) // Keep only the first one. Clear extra
      .replace(/-{2,}/g, '-')
      .replace(new RegExp(`(-\\${decimalCharacter})`, 'g'), `-0${decimalCharacter}`) // -.1 => -0.1
      .replace(new RegExp(`(\\${decimalCharacter}-)`, 'g'), decimalCharacter) // .-1 => 0.1
      .replace(decimalCharacter, '$#$')
      .replace(new RegExp(`\\${decimalCharacter}`, 'g'), '')
      .replace('$#$', decimalCharacter)
      .replace(new RegExp(`^(-)*(\\d+)\\${decimalCharacter}(\\d\\d).*$`), `$1$2${decimalCharacter}$3`) // Only two decimals can be entered
    const amountNumber = parseFloat(amountFormatter.replace(',', '.'))

    if (amountNumber <= 0 || !amountNumber) {
      error = typeErrorMessage.BL_AMOUNT_ERRORS.GreaterThan0
    }

    if (typeof amountNumber !== 'number' || Number.isNaN(amountNumber)) {
      error = typeErrorMessage.BL_AMOUNT_ERRORS.Required
      amount = ''
    } else {
      if (amountNumber > bankMaxAllowedAmount) {
        error = typeErrorMessage.BL_AMOUNT_ERRORS.AmountExceedsPaymentLimit
      }
      amount = globalMixin.methods.numberFormatter(thousandSeparator, decimalPlaces, amountNumber)
    }
  }

  return { error, amount }
}
