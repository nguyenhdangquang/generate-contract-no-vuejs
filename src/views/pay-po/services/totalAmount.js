import { globalMixin } from '../../../mixins/global-mixin'

export const convertToNumber = (amount, thousandSeparator) => {
  return parseFloat(
    globalMixin.methods.numberUnFormatter(
      `${amount}`,
      thousandSeparator
    ).replace(',', '.')
  )
}

export const calculateAmount = (decimalPlaces, poList, thousandSeparator) => {
  const calculate = parseInt('1'.padEnd(parseInt(decimalPlaces) + 1, '0'))
  const shouldCalculateTotalAmount = (po) => {
    return !!po.amount && !po.error
  }

  return poList
    .filter(shouldCalculateTotalAmount)
    .map(po => po.amount)
    .reduce((total, amount) => {
      return (total * calculate + convertToNumber(amount, thousandSeparator) * calculate) / calculate
    }, 0)
}
