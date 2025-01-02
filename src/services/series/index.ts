import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

import seriesApi, { SeriesApi } from '@core/apis/series'
import { store, TStore } from '@core/stores/config'

export class SeriesService {
  static instance: SeriesService
  public static getInstance() {
    return this.instance || (this.instance = new SeriesService())
  }
  private readonly api!: SeriesApi
  private readonly store!: TStore
  private readonly getKey!: string
  private readonly createKey!: string

  private constructor() {
    this.store = store.getState()
    this.api = seriesApi

    this.getKey = 'GET_SERIES'
    this.createKey = 'CREATE_SERIES'
  }

  useGetAll = () => {
    return useQuery({
      queryKey: [this.getKey],
      queryFn: this.api.getAll,
      staleTime: Infinity,
      select: ({ data }) => {
        this.store.addSeries(data)
      },
    })
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

  useDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.getKey],
      mutationFn: this.api.delete,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
    })
  }
}

const seriesService = SeriesService.getInstance()
export default seriesService
