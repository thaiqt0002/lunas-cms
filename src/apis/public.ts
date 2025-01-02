import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import { IBaseServiceFee } from '@core/types/payments'

export class PublicApi extends RestfulAPI {
  private readonly _path!: string
  constructor() {
    super()
    this._path = 'public'
  }

  public getServiceFee = async (): Promise<IResBase<IBaseServiceFee[]>> => {
    const path = `${this._path}/service-fee`
    return this.getRequest({}, { path })
  }
}

const publicApi = new PublicApi()
export default publicApi
