import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

import productApi, { ProductApi } from '@core/apis/product'
import { store, TStore } from '@core/stores/config'

export class ProductService {
  static #instance: ProductService
  public static getInstance() {
    return this.#instance || (this.#instance = new ProductService())
  }
  readonly #api!: ProductApi
  readonly #store!: TStore
  readonly #getKey!: string
  readonly #createKey!: string
  readonly #deleteKey!: string

  private constructor() {
    this.#store = store.getState()
    this.#api = productApi
    this.#getKey = 'GET_PRODUCTS'
    this.#createKey = 'CREATE_PRODUCT'
    this.#deleteKey = 'DELETE_PRODUCT'
  }

  useCreate = () => {
    return useMutation({
      mutationKey: [this.#createKey],
      mutationFn: this.#api.create,
    })
  }
  useGetAll = (sort: number, search: string) => {
    const handleProducts = async () => {
      const { data } = await this.#api.getAll(sort, search)
      return data.products
    }
    return useQuery({
      queryKey: [this.#getKey],
      queryFn: handleProducts,
      staleTime: Infinity,
      select: (data) => {
        this.#store.addProduct(data)
        return data
      },
    })
  }
  public useDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.#deleteKey],
      mutationFn: this.#api.delete,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.#getKey] })
      },
      onError: () => {
        return null
      },
    })
  }
}

const productService = ProductService.getInstance()
export default productService
