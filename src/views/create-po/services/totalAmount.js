import { globalMixin } from '../../../mixins/global-mixin'

export const convertToNumber = (amount, thousandSeparator) => {
  return parseFloat(
    globalMixin.methods.numberUnFormatter(
      `${amount}`,
      thousandSeparator
    ).replace(',', '.')
  )
}

export const calculateAmount = (decimalPlaces, blList, thousandSeparator) => {
  const calculate = parseInt('1'.padEnd(parseInt(decimalPlaces) + 1, '0'))
  const shouldCalculateTotalAmount = (bl) => {
    return !!bl.amount && !bl.amountError
  }

  return blList.filter(shouldCalculateTotalAmount).map(bl => bl.amount).reduce((total, amount) => {
    return ((total * calculate + convertToNumber(amount, thousandSeparator) * calculate) / calculate).toFixed(2)
  }, 0)
}
