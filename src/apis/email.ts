import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import { IBaseContact } from '@core/types/email'

export class EmailApi extends RestfulAPI {
  static readonly instance: EmailApi
  static getInstance = () => {
    return EmailApi.instance || new EmailApi()
  }
  private readonly _path!: string
  private constructor() {
    super()
    this._path = '/auth'
  }

  public getAllEmail = async (): Promise<IResBase<IBaseContact[]>> => {
    const path = `${this._path}/contacts/cms`
    return this.getRequest({}, { path })
  }
  public deleteEmail = async (id: number): Promise<IResBase<IBaseContact>> => {
    const path = `${this._path}/contacts/cms`
    return this.deleteRequest(id, { path })
  }
}

const emailApi = EmailApi.getInstance()
export default emailApi
