import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import { IBaseSeries, ICreateSeriesParams, ICreateSeriesRes } from '@core/types/series'

export class SeriesApi extends RestfulAPI {
  private static _instance: SeriesApi
  public static getInstance() {
    return this._instance || (this._instance = new SeriesApi())
  }

  private readonly _path!: string

  private constructor() {
    super()
    this._path = 'ecommerce/series'
  }

  public getAll = async (): Promise<IResBase<IBaseSeries[]>> => {
    return this.getRequest({}, { path: this._path })
  }

  public create = async (params: ICreateSeriesParams): Promise<ICreateSeriesRes> => {
    return this.postRequest(params, {
      path: this._path,
    })
  }

  public delete = async (id: string): Promise<IResBase<null>> => {
    return this.deleteRequest(id, {
      path: this._path,
    })
  }
}

const seriesApi = SeriesApi.getInstance()
export default seriesApi
