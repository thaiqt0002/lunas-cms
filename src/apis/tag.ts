import { RestfulAPI } from '@core/libs/axios'
import { IResBase, Prettify } from '@core/types/base'
import { ICreateTagParams, IGetTagRes } from '@core/types/tag'

export class TagApi extends RestfulAPI {
  private readonly _path!: string
  constructor() {
    super()
    this._path = 'ecommerce/tags'
  }

  public getAll = async (): Promise<IGetTagRes> => {
    return this.getRequest({}, { path: this._path })
  }

  public create = async (params: Prettify<ICreateTagParams>): Promise<IResBase<null>> => {
    return this.postRequest(params, { path: this._path })
  }

  public delete = async (id: number): Promise<IResBase<null>> => {
    return this.deleteRequest(id, { path: this._path })
  }
}
const tagApi = new TagApi()
export default tagApi
