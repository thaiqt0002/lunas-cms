import { RestfulAPI } from '@core/libs/axios'
import { ICreateVariantParams, ICreateVariantRes } from '@core/types/variant'

export class VariantApi extends RestfulAPI {
  static readonly instance: VariantApi
  static getInstance = () => {
    return VariantApi.instance || new VariantApi()
  }
  private readonly _path!: string
  private constructor() {
    super()
    this._path = 'ecommerce/variants'
  }
  public create = async (params: ICreateVariantParams): Promise<ICreateVariantRes> => {
    return this.postRequest(params, {
      path: this._path,
    })
  }
}

const variantApi = VariantApi.getInstance()
export default variantApi
