import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'

import brandApi, { BrandApi } from '@core/apis/brand'
import categoryApi, { CategoryApi } from '@core/apis/category'
import tagApi, { TagApi } from '@core/apis/tag'
import { store, TStore } from '@core/stores/config'

export class SettingsService {
  static instance: SettingsService
  static getInstance(): SettingsService {
    return this.instance || (this.instance = new this())
  }
  private readonly _store!: TStore
  private readonly _getCategoriesKey!: string
  private readonly _createCategoryKey!: string
  private readonly _deleteCategoryKey!: string

  private readonly _getTagsKey!: string
  private readonly _createTagKey!: string
  private readonly _deleteTagKey!: string
  private readonly _tagApi!: TagApi
  private readonly _categoryApi!: CategoryApi

  private readonly _getBrandsKey!: string
  private readonly _createBrandsKey!: string
  private readonly _deleteBrandsKey!: string
  private readonly _brandApi!: BrandApi

  private constructor() {
    this._store = store.getState()

    this._getCategoriesKey = 'GET_CATEGORIES'
    this._createCategoryKey = 'CREATE_CATEGORY'
    this._deleteCategoryKey = 'DELETE_CATEGORY'

    this._getTagsKey = 'GET_TAGS'
    this._createTagKey = 'CREATE_TAG'
    this._deleteTagKey = 'DELETE_TAG'

    this._getBrandsKey = 'GET_BRANDS'

    this._tagApi = tagApi
    this._categoryApi = categoryApi
    this._brandApi = brandApi
  }

  public useGetCategories = () => {
    return useQuery({
      queryKey: [this._getCategoriesKey],
      queryFn: this._categoryApi.getAll,
      staleTime: Infinity,
      select: ({ data }) => {
        this._store.addCategory(data)
      },
    })
  }

  public useCreateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this._createCategoryKey],
      mutationFn: this._categoryApi.create,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this._getCategoriesKey] })
      },
      onError: () => {
        return null
      },
    })
  }

  public useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this._deleteCategoryKey],
      mutationFn: this._categoryApi.delete,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this._getCategoriesKey] })
      },
      onError: () => {
        return null
      },
    })
  }

  public useGetTags = () => {
    return useQuery({
      queryKey: [this._getTagsKey],
      queryFn: this._tagApi.getAll,
      staleTime: Infinity,
      select: ({ data }) => {
        this._store.addTag(data)
      },
    })
  }

  public useCreateTag = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this._createTagKey],
      mutationFn: this._tagApi.create,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this._getTagsKey] })
      },
      onError: () => {
        return null
      },
    })
  }

  public useDeleteTag = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: [this._deleteTagKey],
      mutationFn: this._tagApi.delete,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this._getTagsKey] })
      },
      onError: () => {
        return null
      },
    })
  }

  public useCreateBrand = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: this._brandApi.create,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this._getBrandsKey] })
      },
      onError: () => {
        return null
      },
    })
  }

  public useDeleteBrand = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: this._brandApi.delete,
      onSuccess: ({ statusCode }) => {
        if (statusCode >= HttpStatusCode.BadRequest) return
        return queryClient.invalidateQueries({ queryKey: [this._getBrandsKey] })
      },
      onError: () => {
        return null
      },
    })
  }

  public useGetBrands = () => {
    return useQuery({
      queryKey: [this._getBrandsKey],
      queryFn: this._brandApi.getAll,
      staleTime: Infinity,
      select: ({ data }) => {
        this._store.addBrand(data)
      },
    })
  }
}

const settingsService = SettingsService.getInstance()
export default settingsService
