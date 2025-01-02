import { IResBase } from './base'

export interface IBaseTemplate {
  id: number
  layoutId: number
  page: string
  isActive: boolean
  attributes: string
}
export interface ICreateTemplate extends Omit<IBaseTemplate, 'attributes' | 'id'> {}
export interface IUpdateTemplate extends Omit<IBaseTemplate, 'attributes' | 'id'> {}
export interface IUpdateTemplateRequest extends IBaseTemplate {}
export interface ICreateTemplateRequest extends Omit<IBaseTemplate, 'id'> {
  priority: number
}
export interface IGetAllTemplateRes {
  data: IBaseTemplate[]
}
export interface IBaseLayout {
  id: number
  name: string
  exampleData: string
  exampleImage: string
}
export interface ICreateLayout extends Omit<IBaseLayout, 'exampleImage' | 'id'> {}

export interface ICreateLayoutRequest extends ICreateLayout {}
export interface ICreateLayoutRes
  extends IResBase<{
    preSignedUrl: string
  }> {}

export interface IGetAllLayoutRes {
  data: IBaseLayout[]
}
