import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import {
  ICreateLayoutRequest,
  ICreateLayoutRes,
  ICreateTemplateRequest,
  IGetAllLayoutRes,
  IGetAllTemplateRes,
  IUpdateTemplateRequest,
} from '@core/types/template'

export class ConfigApi extends RestfulAPI {
  static readonly instance: ConfigApi
  static getInstance = () => {
    return ConfigApi.instance || new ConfigApi()
  }
  private readonly _layoutPath!: string
  private readonly _templatePath!: string
  private constructor() {
    super()
    this._layoutPath = 'ecommerce/configs/layouts'
    this._templatePath = 'ecommerce/configs/templates'
  }
  public createLayout = async (params: ICreateLayoutRequest): Promise<ICreateLayoutRes> => {
    return this.postRequest(params, {
      path: this._layoutPath,
    })
  }
  public getAllLayout = async (): Promise<IGetAllLayoutRes> => {
    return this.getRequest({}, { path: this._layoutPath })
  }
  public deleteLayout = async (id: number): Promise<IResBase<null>> => {
    return this.deleteRequest(id, { path: this._layoutPath })
  }
  public createTemplate = async (params: ICreateTemplateRequest): Promise<IResBase<null>> => {
    return this.postRequest(params, {
      path: this._templatePath,
    })
  }
  public getAllTemplate = async (): Promise<IGetAllTemplateRes> => {
    return this.getRequest({}, { path: this._templatePath })
  }
  public deleteTemplate = async (id: number): Promise<IResBase<null>> => {
    return this.deleteRequest(id, { path: this._templatePath })
  }

  public updateTemplate = async (data: IUpdateTemplateRequest): Promise<IResBase<null>> => {
    const { id, ...body } = data
    return this.patchRequest(id, body, { path: this._templatePath })
  }
}

const configApi = ConfigApi.getInstance()
export default configApi
