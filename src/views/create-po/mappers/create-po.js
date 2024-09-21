export function toCreatePoData (
  {
    blList,
    companyName,
    email,
    contactNumber,
    areaCode,
    countryCode
  },
  { convertAmountToNumber }
) {
  function buildBlInvList () {
    return blList
      .filter(bl => !!bl.number && !!bl.amount && !!bl.currency)
      .map(bl => ({
        number: bl.number,
        currency: bl.currency,
        amount: convertAmountToNumber(bl.amount),
        remark: bl.remark ? bl.remark : null
      }))
  }

  return {
    companyName: companyName,
    emailAddress: email,
    contactNumber: contactNumber,
    blInvList: buildBlInvList(),
    areaCode,
    countryCode
  }
}
