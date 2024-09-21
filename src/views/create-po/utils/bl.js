export function isValidBl (bl) {
  if (!!bl.remark && bl.remarkError) {
    return false
  }

  return !!bl.number &&
    !!bl.amount &&
    !!bl.currency &&
    !bl.numberError &&
    !bl.amountError &&
    !bl.remarkError
}

export function areValidBls (bls) {
  return bls.every(isValidBl)
}

export function isEmptyBl (bl) {
  const doesNotHaveData = !bl.number &&
    !bl.amount &&
    !bl.remark
  const doesNotHaveError = !bl.numberError &&
    !bl.amountError &&
    !bl.remarkError

  return doesNotHaveData && doesNotHaveError
}
