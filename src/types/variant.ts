import { IResBase } from './base'

export interface ICreateVariantParams {
  variants: {
    name: string
    fee: number
    uuid: string
    price: number
  }[]
  productUuid: string
}

export interface ICreateVariantImage {
  presignedUrl: string
  uuid: string
}
export interface ICreateVariantRes extends IResBase<Array<ICreateVariantImage>> {}
