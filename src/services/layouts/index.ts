import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

import configApi, { ConfigApi } from '@core/apis/config'
import { store, TStore } from '@core/stores/config'

export class LayoutService {
  static instance: LayoutService
  public static getInstance() {
    return this.instance || (this.instance = new LayoutService())
  }
  private readonly api!: ConfigApi
  private readonly store!: TStore
  private readonly getKey!: string
  private readonly createKey!: string
  private readonly deleteKey!: string

  private constructor() {
    this.store = store.getState()
    this.api = configApi

    this.getKey = 'GET_LAYOUT'
    this.createKey = 'CREATE_LAYOUT'
    this.deleteKey = 'DELETE_LAYOUT'
  }

  useGetAll = () => {
    return useQuery({
      queryKey: [this.getKey],
      queryFn: this.api.getAllLayout,
      staleTime: Infinity,
      select: ({ data }) => {
        this.store.addLayout(data)
      },
    })
  }

  useCreate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.createKey],
      mutationFn: this.api.createLayout,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
    })
  }

  useDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.deleteKey],
      mutationFn: this.api.deleteLayout,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
    })
  }
}

const layoutService = LayoutService.getInstance()
export default layoutService
