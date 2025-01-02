import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import { ICreateUserRequest, ICreateUserRes, IGetAllUserRes } from '@core/types/user'

export class UserApi extends RestfulAPI {
  static readonly instance: UserApi
  static getInstance = () => {
    return UserApi.instance || new UserApi()
  }
  private readonly _path!: string
  private constructor() {
    super()
    this._path = '/auth/users'
  }
  public create = async (params: ICreateUserRequest): Promise<ICreateUserRes> => {
    return this.postRequest(params, { path: this._path })
  }
  public getAll = async (): Promise<IGetAllUserRes> => {
    return this.getRequest({}, { path: this._path })
  }
  public delete = async (uuid: string): Promise<IResBase<null>> => {
    return this.deleteRequest(uuid, { path: this._path })
  }
}

const userApi = UserApi.getInstance()
export default userApi
