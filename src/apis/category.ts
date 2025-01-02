import { RestfulAPI } from '@core/libs/axios'
import { IResBase, Prettify } from '@core/types/base'
import { ICreateCategoryParams, IGetCategoriesRes } from '@core/types/category'

export class CategoryApi extends RestfulAPI {
  static readonly instance: CategoryApi
  static getInstance = () => {
    return CategoryApi.instance || new CategoryApi()
  }
  private readonly _path!: string
  private constructor() {
    super()
    this._path = 'ecommerce/categories'
  }

  public getAll = async (): Promise<IGetCategoriesRes> => {
    return this.getRequest({}, { path: this._path })
  }

  public create = async (params: Prettify<ICreateCategoryParams>): Promise<IResBase<null>> => {
    return this.postRequest(params, {
      path: this._path,
    })
  }

  public delete = async (uuid: string): Promise<IResBase<null>> => {
    return this.deleteRequest(uuid, {
      path: this._path,
    })
  }
}

const categoryApi = CategoryApi.getInstance()
export default categoryApi
