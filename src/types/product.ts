import { IResBase } from './base'

export interface ICreateProductParams {
  name: string
  description: string
  originalPrice: number
  salePrice: number
  quantity: number
  country: string
  brandUuid: string
  status: string
  priority: number
  parentCategoryUuid?: string
  subCategoryUuid?: string
  seriesUuid?: string
  exchangeRateId?: number
  preorderDate?: Date[]
  releaseDate?: Date
  tags: number[]
  categories: string[]
}

export interface ICreateProductRequest {
  uuid: string
  name: string
  description: string
  originalPrice: number
  salePrice: number
  quantity: number
  country: string
  brandUuid: string
  status: string
  priority: number
  parentCategoryUuid?: string
  subCategoryUuid?: string
  seriesUuid?: string
  exchangeRateId?: number
  preorderStartDate?: Date
  preorderEndDate?: Date
  releaseDate?: Date
  tags?: number[]
  images: string[]
}
export interface ICreateProductRes
  extends IResBase<{
    brandUrl: string
    imageUrl: {
      uuid: string
      url: string
    }[]
  }> {}

export interface IProductBase {
  uuid: string
  name: string
  description: string
  originalPrice: number
  salePrice: number
  quantity: number
  country: string
  thumbnail: string
  brand: string
  status: string
  priority: number
  parentCategory: {
    uuid: string
    name: string
    description: string
  }
  subCategory: {
    uuid: string
    name: string
    description: string
  }
  series: {
    uuid: string
    name: string
    description: string
    image: string
  }
  tags: {
    id: number
    name: string
  }[]
  variants: {
    uuid: string
    name: string
    fee: number
    price: number
    productUuid: string
    image: {
      id: number
      imageUrl: string
    }
  }[]
  productImages: {
    uuid: string
    imageUrl: string
  }[]
  createdAt: Date
  updatedAt: Date
  preorderStartDate: Date
  preorderEndDate: Date
}
export interface IGetAllProductRes {
  data: {
    products: IProductBase[]
    total: number
    page: number
    totalPages: number
  }
}
