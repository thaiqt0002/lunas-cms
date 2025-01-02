import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

import userApi, { UserApi } from '@core/apis/user'
import { store, TStore } from '@core/stores/config'

export class UserService {
  static #instance: UserService
  public static getInstance() {
    return this.#instance || (this.#instance = new UserService())
  }
  readonly api!: UserApi
  readonly store!: TStore
  readonly getKey!: string
  readonly createKey!: string
  readonly deleteKey!: string

  private constructor() {
    this.store = store.getState()
    this.api = userApi
    this.getKey = 'GET_USERS'
    this.createKey = 'CREATE_USER'
    this.deleteKey = 'DELETE_USER'
  }

  useCreate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.createKey],
      mutationFn: this.api.create,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
    })
  }

  useGetAll = () => {
    const handleUser = async () => {
      const { data } = await this.api.getAll()
      return data
    }
    return useQuery({
      queryKey: [this.getKey],
      queryFn: handleUser,
      staleTime: 1000 * 60 * 5,
    })
  }

  useDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.deleteKey],
      mutationFn: this.api.delete,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
      onError: () => {
        return null
      },
    })
  }
}

const userService = UserService.getInstance()
export default userService
