function getBlErrorField (field) {
  const splitted = field.split('/')

  if (
    [2, 3].indexOf(splitted.length) === -1 ||
    !/^[a-zA-Z0-9]+$/.test(splitted[1])
  ) {
    return null
  }

  if (splitted[2]) {
    if (!/^[a-zA-Z]+$/.test(splitted[2])) {
      return null
    }

    return {
      type: 'BL_ERROR',
      number: splitted[1],
      field: splitted[2]
    }
  }

  return {
    type: 'BL_ERROR',
    index: parseInt(splitted[1])
  }
}

export function extractField (field) {
  if (!field) {
    return null
  }

  if (field.startsWith('blInv')) {
    return getBlErrorField(field)
  }

  return {
    field
  }
}
