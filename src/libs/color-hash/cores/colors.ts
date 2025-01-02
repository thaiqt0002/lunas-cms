/* eslint-disable */
/**
 * Convert HEX color to RGB color
 * @param hex
 */
const RGB2HEX = (RGBArray: number[]) => {
  let hex = '#'
  RGBArray.forEach((color) => {
    if (color < 16) {
      hex += '0'
    }
    hex += color.toString(16)
  })
  return hex
}

/**
 * Convert HSL color to RGB color
 * @param H
 * @param S
 * @param L
 */
const HSL2RGB = (H: number, S: number, L: number) => {
  H /= 360
  let q: number = L < 0.5 ? L * (1 + S) : L + S - L * S
  let p: number = 2 * L - q

  return [H + 1 / 3, H, H - 1 / 3].map((color) => {
    if (color < 0) {
      color++
    }
    if (color > 1) {
      color--
    }
    if (color < 1 / 6) {
      color = p + (q - p) * 6 * color
    } else if (color < 0.5) {
      color = q
    } else if (color < 2 / 3) {
      color = p + (q - p) * 6 * (2 / 3 - color)
    } else {
      color = p
    }
    return Math.round(color * 255)
  })
}

export { RGB2HEX, HSL2RGB }
