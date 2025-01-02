import { IResBase } from './base'

export interface IBaseBrand {
  uuid: string
  name: string
}

export interface IGetBrandsRes extends IResBase<IBaseBrand[]> {}
export interface ICreateBrandParams {
  name: string
}
