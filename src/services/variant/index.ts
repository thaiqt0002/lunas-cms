import { useMutation } from '@tanstack/react-query'

import variantApi, { VariantApi } from '@core/apis/variant'
import { store, TStore } from '@core/stores/config'

export class VariantService {
  static #instance: VariantService
  public static getInstance() {
    return this.#instance || (this.#instance = new VariantService())
  }
  readonly #api!: VariantApi
  readonly #store!: TStore
  readonly #getKey!: string
  readonly #createKey!: string

  private constructor() {
    this.#store = store.getState()
    this.#api = variantApi
    this.#getKey = 'GET_PRODUCTS'
    this.#createKey = 'CREATE_VARIANT'
  }

  useCreate = () => {
    return useMutation({
      mutationKey: [this.#createKey],
      mutationFn: this.#api.create,
    })
  }
}

const variantService = VariantService.getInstance()
export default variantService
