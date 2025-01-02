import { IBaseId, IResBase } from './base'

export interface IBaseTag {
  id: number
  name: string
}

export interface IGetTagRes extends IResBase<IBaseTag[]> {}

export interface ICreateTagParams {
  names: string[]
}

export interface IDeleteTagParams extends IBaseId {}
