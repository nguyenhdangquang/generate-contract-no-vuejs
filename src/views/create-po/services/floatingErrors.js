export const detectFloatingErrors = (blList) => {
  return blList.filter(item => item.amountError || item.numberError || item.remarkError)
}
