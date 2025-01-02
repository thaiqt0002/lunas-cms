import { RestfulAPI } from '@core/libs/axios'
import { IResBase } from '@core/types/base'
import {
  IBillingDetailData,
  IBillingListData,
  IBillingStatus,
  ICreateBillAdditionalFeeParams,
  ICreateBillingParams,
  IGetBillingParams,
  IPaymentLink,
} from '@core/types/payments'

export class PaymentApi extends RestfulAPI {
  static readonly instance: PaymentApi
  static getInstance = () => {
    return PaymentApi.instance || new PaymentApi()
  }

  private readonly _path!: string
  private constructor() {
    super()
    this._path = 'payment'
  }

  public getPaymentLinkList = async (): Promise<IResBase<IPaymentLink[]>> => {
    const path = `${this._path}/cms/payments`
    return this.getRequest({}, { path })
  }

  public getBillStatusList = async (): Promise<IResBase<IBillingStatus[]>> => {
    const path = `${this._path}/bills/status`
    return this.getRequest({}, { path })
  }

  public getBilling = async (params: IGetBillingParams): Promise<IResBase<IBillingListData[]>> => {
    const path = `${this._path}/cms/bills`
    return this.getRequest(params, { path })
  }

  public createBilling = async (data: ICreateBillingParams): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills`
    return this.postRequest(data, { path })
  }

  public getBillingDetail = async (uuid: string): Promise<IResBase<IBillingDetailData>> => {
    const path = `${this._path}/cms/bills/${uuid}`
    return this.getRequest({}, { path })
  }

  public updateBillingStatus = async (
    uuid: string,
    statuses: number[],
  ): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills/${uuid}/statuses`
    return this.patchRequest(null, { statuses }, { path })
  }

  public updateBillingEstimateDelivery = async (
    uuid: string,
    estimatedDeliveryDate: string,
  ): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills/${uuid}/estimated-delivery-date`
    return this.patchRequest(null, { estimatedDeliveryDate }, { path })
  }

  public createBillAdditionalFee = async (
    uuid: string,
    data: ICreateBillAdditionalFeeParams,
  ): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills/${uuid}/additional-fees`
    return this.postRequest(data, { path })
  }

  public deleteBillStatus = async (uuid: string, statusId: number): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills/${uuid}/statuses/${statusId}`
    return this.deleteRequest(null, { path })
  }

  public deleteBillAdditionalFee = async (
    uuid: string,
    additionalFeeId: number,
  ): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills/${uuid}/additional-fees/${additionalFeeId}`
    return this.deleteRequest(null, { path })
  }

  public deleteBill = async (uuid: string): Promise<IResBase<null>> => {
    const path = `${this._path}/cms/bills/${uuid}`
    return this.deleteRequest(null, { path })
  }
}

const paymentApi = PaymentApi.getInstance()
export default paymentApi
