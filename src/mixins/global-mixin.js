const formatConfig = (thousandValue, thousandSeparator) => {
  return (new Intl.NumberFormat(thousandSeparator === ',' ? 'en-GB' : 'de-DE', {
    style: 'decimal',
    minimumFractionDigits: 0
  })).format(thousandValue)
}

const splitValueByDecimalPlace = (amount, thousandSeparator, decimalPlaces, dotPosition) => {
  if (dotPosition > 0) {
    return {
      thousandValue: amount.split('.')[0],
      decimalPlacesValue: thousandSeparator === ',' ? `.${amount.substr(dotPosition + 1, decimalPlaces)}` : `,${amount.substr(dotPosition + 1, decimalPlaces)}`
    }
  }
  return {
    thousandValue: amount,
    decimalPlacesValue: thousandSeparator === ',' ? '.' : ','
  }
}

export const globalMixin = {
  methods: {
    numberFormatter: function (thousandSeparator, decimalPlaces, amount) {
      if (!amount) {
        if (decimalPlaces > 0) {
          return `0${(thousandSeparator === ',' ? '.' : ',') + ''.padEnd(decimalPlaces, '0')}`
        }
        return '0'
      }
      amount = amount.toString()
      decimalPlaces = parseInt(decimalPlaces)
      const dotPosition = amount.indexOf('.')
      const valueByDecimalPlace = splitValueByDecimalPlace(amount, thousandSeparator, decimalPlaces, dotPosition)
      let decimalPlacesValue = valueByDecimalPlace.decimalPlacesValue
      const thousandValue = valueByDecimalPlace.thousandValue

      if (decimalPlaces > 0 && decimalPlacesValue.length < decimalPlaces + 1) {
        decimalPlacesValue = decimalPlacesValue.padEnd(decimalPlaces + 1, '0')
      }

      const thousandValueFormatted = formatConfig(thousandValue, thousandSeparator)

      return decimalPlaces === 0 ? thousandValueFormatted : (thousandValueFormatted + decimalPlacesValue)
    },
    numberUnFormatter: function (number, thousandSeparator) {
      return number.toString().replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
    }
  }
}
