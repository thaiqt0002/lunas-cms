import { IResBase } from './base'

export interface IBaseCategory {
  uuid: string
  name: string
  slug: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface IBaseSubCategory extends IBaseCategory {}

export interface IBaseParentCategory extends IBaseCategory {
  parentUuid: string
  sub: IBaseSubCategory[]
}

export interface IGetCategoriesRes extends IResBase<IBaseParentCategory[]> {}

export interface ICreateCategoryParams {
  name: string
  description: string
  parentUuid?: string
}
