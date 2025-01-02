/* eslint-disable */
/**
 * BKDR Hash (modified version)
 */
const BKDRHash = (str: string) => {
  const seed = 131
  const seed2 = 137
  let hash: number = 0
  // make hash more sensitive for short string like 'a', 'b', 'c'
  str += 'x'
  // Note: Number.MAX_SAFE_INTEGER equals 9007199254740991
  const MAX_SAFE_INTEGER = Math.floor(9007199254740991 / seed2)
  str.split('').forEach((char) => {
    if (hash > MAX_SAFE_INTEGER) {
      hash = Math.floor(hash / seed2)
    }
    hash = hash * seed + char.charCodeAt(0)
  })
  return hash
}

export default BKDRHash
