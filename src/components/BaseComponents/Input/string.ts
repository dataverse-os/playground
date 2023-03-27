export const checkUniqueChar = (str: string, char: string) => {
  let firstAppear = true
  return str.split('').map((c) => {
    if (c === char) {
      if (firstAppear) {
        firstAppear = false
        return char
      } else {
        return ''
      }
    }
    return c
  }).join('')
}

export const decimalPlacesLimit = (str: string, place: number) => {
  if(place === 0 && str.includes('.')) {
    return false
  }
  const splitStr = str.split('.')
  if(splitStr[1] && splitStr[1].length > place) {
    return false
  } 
  return true
}