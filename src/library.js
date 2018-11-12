export const removeDuplicates = array => {
  return array.filter((item, index) =>  array.indexOf(item) === index)
}

export const zip = (array1, array2) => {
  return array1.map((item, index) => {
    return [item, array2[index]]
  })
}

export const equals = (value1, value2) => {
  if (value1 === value2) {
    return true
  } else if (Array.isArray(value1)) {
    if (Array.isArray(value2)) {
      if (value1.length === value2.length) {
        return zip(value1, value2).every(([item1, item2]) => equals(item1, item2))
      } else {
        return false
      }
    } else {
      return false
    }
  } else if (typeof value1 === 'object') {
    if (typeof value2  === 'object') {
      const keys1 = Object.keys(value1)
      const keys2 = Object.keys(value2)
      return removeDuplicates([...keys1, ...keys2]).every(key => equals(value1[key], value2[key]))
    } else {
      return false
    }
  } else {
    return false
  }
}

export const ensureArray = value => {
  if (typeof value === 'undefined') {
    return []
  } else if (value instanceof Array) {
    return value
  } else {
    return [value]
  }
}

export const flatten = array => {
  return array.reduce((accumulator, value) => Array.isArray(value) ? accumulator.concat(flatten(value)) : accumulator.concat(value), []);
}