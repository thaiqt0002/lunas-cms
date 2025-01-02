import { IResBase } from './base'

export interface IBaseSeries {
  uuid: string
  name: string
  slug: string
  description: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateSeriesParams {
  name: string
  description: string
}

export interface ICreateSeriesRes
  extends IResBase<{
    preSignedUrl: string
  }> {}

// export interface ISeriesPreSignedUrl {
//   preSignedUrl: string
// }
//
//
//.d export interface ICreateSeriesResponse extends IResBase<ISeriesPreSignedUrl> {}
