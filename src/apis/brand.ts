import { RestfulAPI } from '@core/libs/axios'
import { IResBase, Prettify } from '@core/types/base'
import { ICreateBrandParams, IGetBrandsRes } from '@core/types/brand'

export class BrandApi extends RestfulAPI {
  private readonly _path!: string
  constructor() {
    super()
    this._path = 'ecommerce/brands'
  }

  public getAll = async (): Promise<IGetBrandsRes> => {
    return this.getRequest({}, { path: this._path })
  }

  public create = async (params: Prettify<ICreateBrandParams>): Promise<IResBase<null>> => {
    return this.postRequest(params, { path: this._path })
  }

  public delete = async (uuid: string): Promise<IResBase<null>> => {
    return this.deleteRequest(uuid, { path: this._path })
  }
}
const brandApi = new BrandApi()
export default brandApi
