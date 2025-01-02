/* eslint-disable */
import BKDRHash from './cores/bkdr-hash'
import { HSL2RGB, RGB2HEX } from './cores/colors'

class ColorHash {
  private readonly _L!: number[]
  private readonly _S!: number[]
  private readonly _hueRange!: { min: number; max: number }[]
  private readonly _hash!: (str: string) => number

  constructor(options: {
    lightness: number[]
    saturation: number[]
    hue?: number | { min: number; max: number } | { min: number; max: number }[]
  }) {
    const [L, S] = [options.lightness, options.saturation].map((param) => {
      param = param !== undefined ? param : [0.35, 0.5, 0.65]
      return Array.isArray(param) ? param.concat() : [param]
    })
    this._L = L
    this._S = S

    if (typeof options.hue === 'number') {
      options.hue = { min: options.hue, max: options.hue }
    }
    if (typeof options.hue === 'object' && !Array.isArray(options.hue)) {
      options.hue = [options.hue]
    }

    if (typeof options.hue === 'undefined' || options.hue === null) {
      options.hue = []
    }

    this._hueRange = options.hue.map((range) => {
      return {
        min: typeof range.min === 'undefined' ? 0 : range.min,
        max: typeof range.max === 'undefined' ? 360 : range.max,
      }
    })

    this._hash = BKDRHash
  }
  /**
   * Returns the hash in [h, s, l].
   * Note that H ∈ [0, 360); S ∈ [0, 1]; L ∈ [0, 1];
   *
   * @param {String} str string to hash
   * @returns {Array} [h, s, l]
   */
  public hsl = (str: string): [number, number, number] => {
    let H: number, S: number, L: number
    let hash = this._hash(str)
    const hueResolution = 727 // 727 is a prime number
    if (this._hueRange.length) {
      const range = this._hueRange[hash % this._hueRange.length]
      H =
        (((hash / this._hueRange.length) % hueResolution) * (range.max - range.min)) /
          hueResolution +
        range.min
    } else {
      H = hash % 359 // 359 is a prime number
    }
    hash = Math.ceil(hash / 360)
    S = this._S[hash % this._S.length]
    hash = Math.ceil(hash / this._S.length)
    L = this._L[hash % this._L.length]
    return [H, S, L]
  }
  /**
   * Returns the hash in [r, g, b].
   * Note that R, G, B ∈ [0, 255]
   *
   * @param {String} str string to hash
   * @returns {Array} [r, g, b]
   */
  public rgb = (str: string): number[] => {
    const hsl = this.hsl(str)
    return HSL2RGB.apply(this, hsl)
  }
  /**
   * Returns the hash in hex
   *
   * @param {String} str string to hash
   * @returns {String} hex with #
   */
  public hex = (str: string): string => {
    const rgb = this.rgb(str)
    return RGB2HEX(rgb)
  }
}

const colorHash = new ColorHash({
  hue: { min: 0, max: 359 },
  saturation: [0.35, 0.5, 0.65],
  lightness: [0.35, 0.5, 0.65],
})
export default colorHash
