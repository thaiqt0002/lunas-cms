export interface IBaseServiceFee {
  id: number
  type: string
  name: string
  description: string
  fee: number
}

export interface IBillingStatus {
  id: number
  type: string
  name: string
}

export interface IGetBillingParams {
  page: number
  limit: number
}

export interface IBillingListData {
  uuid: string
  userUuid: string | null
  orderCode: string
  customerEmail: string | null
  customerFullname: string | null
  customerPhoneNumber: string | null
  customerProvince: string | null
  customerDistrict: string | null
  customerWard: string | null
  note: string | null
  status: 'CREATED' | 'APPROVED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED'
  amountTotal: number
  amountPaid: number
  isPublic: number
  estimatedDeliveryDate: string | null
  createdAt: string
  updatedAt: string
}
export interface IBillingPaymentLink {
  id: string
  type: 'BILL' | 'ADDITIONAL_FEE'
  amount: number
  amountPaid: number
  amountRemaining: number
  status: 'PENDING' | 'PAID' | 'EXPIRED'
  checkoutUrl: string
  qrCode: string
}

export interface IBillingDetailData {
  uuid: string
  orderCode: string
  customerEmail: string
  customerProvince: string
  customerDistrict: string
  customerWard: string
  customerStreet: string
  customerFullname: string
  customerPhoneNumber: string
  createdAt: string
  estimatedDeliveryDate: string
  note: string
  amountTotal: number
  amountPaid: number
  isPublic: number
  publicKey: string
  serviceFee: {
    id: string
    type: string
    name: string
    description: string
    fee: number
  }
  paymentMethod: {
    id: string
    name: string
    type: string
  }
  billDetails: {
    variantUuid: string
    quantity: number
    metadata: {
      productName: string
      variantName: string
      variantImage: string
    }
  }[]
  statuses: {
    id: number
    type: string
    name: string
    createdAt: string
  }[]
  additionFees: {
    id: number
    value: number
    description: string
    isPaid: number
    createdAt: string
  }[]
  paymentLink: IBillingPaymentLink[]
  transactions: {
    uuid: string
    paymentLinkId: string
    amount: number
    description: string
    accountNumber: string
    transactionDateTime: string
    counterAccountBankId: string
    counterAccountBankName: string
    counterAccountName: string | null
    counterAccountNumber: string | null
    virtualAccountName: string
    virtualAccountNumber: string
  }
}

export interface IPaymentLinkTransaction {
  uuid: string
  amount: number
  description: string
  accountNumber: string
  transactionDateTime: string
}

export interface IPaymentLink {
  id: string
  orderCode: string
  type: 'BILL'
  amount: number
  amountPaid: number
  amountRemaining: number
  status: 'PENDING' | 'PAID' | 'EXPIRED'
  checkoutUrl: string
  createdAt: string
  canceledAt: string | null
  transactions: IPaymentLinkTransaction[]
}
export interface ICreateBillAdditionalFeeParams {
  value: number
  description: string
}

export interface ICreateBillingParams {
  paymentMethodId: number
  items: {
    variantUuid: string
    quantity: number
    price: number
    metadata: {
      productName: string
      variantName: string
      variantImage: string
    }
  }[]
}
