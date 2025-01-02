import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

import configApi, { ConfigApi } from '@core/apis/config'
import { store, TStore } from '@core/stores/config'

export class TemplateService {
  static instance: TemplateService
  public static getInstance() {
    return this.instance || (this.instance = new TemplateService())
  }
  private readonly api!: ConfigApi
  private readonly store!: TStore
  private readonly getKey!: string
  private readonly createKey!: string
  private readonly deleteKey!: string
  private readonly updateKey!: string

  private constructor() {
    this.store = store.getState()
    this.api = configApi

    this.getKey = 'GET_Template'
    this.createKey = 'CREATE_Template'
    this.updateKey = 'UPDATE_Template'
    this.deleteKey = 'DELETE_Template'
  }

  useGetAll = () => {
    return useQuery({
      queryKey: [this.getKey],
      queryFn: this.api.getAllTemplate,
      staleTime: Infinity,
      select: ({ data }) => {
        this.store.addTemplate(data)
      },
    })
  }

  useCreate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.createKey],
      mutationFn: this.api.createTemplate,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
    })
  }
  useUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this.updateKey],
      mutationFn: this.api.updateTemplate,
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
      mutationFn: this.api.deleteTemplate,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this.getKey] })
      },
    })
  }
}

const templateService = TemplateService.getInstance()
export default templateService
