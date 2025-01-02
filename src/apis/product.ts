import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import { ICreateProductRequest, ICreateProductRes, IGetAllProductRes } from '@core/types/product'

export class ProductApi extends RestfulAPI {
  static readonly instance: ProductApi
  static getInstance = () => {
    return ProductApi.instance || new ProductApi()
  }
  private readonly _path!: string
  private constructor() {
    super()
    this._path = 'ecommerce/products'
  }
  public create = async (params: ICreateProductRequest): Promise<ICreateProductRes> => {
    return this.postRequest(params, {
      path: this._path,
    })
  }
  public getAll = async (sort: number, search: string): Promise<IGetAllProductRes> => {
    return this.getRequest({ sort, search, limit: 1000000 }, { path: this._path })
  }
  public delete = async (uuid: string): Promise<IResBase<null>> => {
    return this.deleteRequest(uuid, { path: this._path })
  }
}

const productApi = ProductApi.getInstance()
export default productApi
