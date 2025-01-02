import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import paymentApi, { PaymentApi } from '@core/apis/payments'
import { ICreateBillAdditionalFeeParams, ICreateBillingParams } from '@core/types/payments'

export class PaymentService {
  static #instance: PaymentService
  public static getInstance() {
    return this.#instance || (this.#instance = new PaymentService())
  }
  private readonly api!: PaymentApi
  private readonly getKey!: string

  private constructor() {
    this.api = paymentApi
    this.getKey = 'GET_PAYMENTS'
  }

  usePaymentLinkList = () => {
    const handlePaymentLink = async () => {
      const { data } = await this.api.getPaymentLinkList()
      return data
    }
    return useQuery({
      queryKey: ['GET_PAYMENT_LINK'],
      queryFn: handlePaymentLink,
      staleTime: Infinity,
    })
  }

  useBillingStatusList = () => {
    const handleBillStatus = async () => {
      const { data } = await this.api.getBillStatusList()
      return data
    }
    return useQuery({
      queryKey: ['GET_BILL_STATUS'],
      queryFn: handleBillStatus,
      staleTime: Infinity,
    })
  }

  useBillingList = () => {
    const handlePayments = async () => {
      const { data } = await this.api.getBilling({
        page: 1,
        limit: 1000,
      })
      return data
    }
    return useQuery({
      queryKey: ['GET_PAYMENTS'],
      queryFn: handlePayments,
      staleTime: Infinity,
    })
  }

  useBillingDetail = (uuid: string) => {
    const handlePaymentDetail = async () => {
      const { data } = await this.api.getBillingDetail(uuid)
      return data
    }
    return useQuery({
      queryKey: ['GET_PAYMENT_DETAIL', uuid],
      queryFn: handlePaymentDetail,
      staleTime: Infinity,
    })
  }

  useCreateBilling = () => {
    const queryClient = useQueryClient()
    const handleCreateBilling = async (data: ICreateBillingParams) => {
      const { statusCode } = await this.api.createBilling(data)
      return statusCode
    }
    return useMutation({
      mutationKey: ['CREATE_BILLING'],
      mutationFn: handleCreateBilling,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENTS'],
        })
      },
    })
  }

  useUpdateBillingStatus = () => {
    const queryClient = useQueryClient()
    const handleUpdateStatus = async (data: { uuid: string; statuses: number[] }) => {
      const { statusCode } = await this.api.updateBillingStatus(data.uuid, data.statuses)
      return statusCode
    }
    return useMutation({
      mutationKey: ['UPDATE_BILLING_STATUS'],
      mutationFn: handleUpdateStatus,
      onSuccess: (_, { uuid }) => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENT_DETAIL', uuid],
        })
      },
    })
  }

  useUpdateBillingEstimateDelivery = () => {
    const queryClient = useQueryClient()
    const handleUpdateEstimateDelivery = async (data: {
      uuid: string
      estimatedDeliveryDate: string
    }) => {
      const { statusCode } = await this.api.updateBillingEstimateDelivery(
        data.uuid,
        data.estimatedDeliveryDate,
      )
      return statusCode
    }
    return useMutation({
      mutationKey: ['UPDATE_ESTIMATE_DELIVERY'],
      mutationFn: handleUpdateEstimateDelivery,
      onSuccess: (_, { uuid }) => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENT_DETAIL', uuid],
        })
      },
    })
  }

  useCreateBillAdditionalFee = () => {
    const queryClient = useQueryClient()
    const handleCreateFee = async (data: {
      uuid: string
      params: ICreateBillAdditionalFeeParams
    }) => {
      const { statusCode } = await this.api.createBillAdditionalFee(data.uuid, data.params)
      return statusCode
    }
    return useMutation({
      mutationKey: ['CREATE_BILL_ADDITIONAL_FEE'],
      mutationFn: handleCreateFee,
      onSuccess: (_, { uuid }) => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENT_DETAIL', uuid],
        })
      },
    })
  }

  useDeleteBillAdditionalFee = () => {
    const queryClient = useQueryClient()
    const handleDeleteFee = async (data: { uuid: string; id: number }) => {
      const { statusCode } = await this.api.deleteBillAdditionalFee(data.uuid, data.id)
      return statusCode
    }
    return useMutation({
      mutationKey: ['DELETE_BILL_ADDITIONAL_FEE'],
      mutationFn: handleDeleteFee,
      onSuccess: (_, { uuid }) => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENT_DETAIL', uuid],
        })
      },
    })
  }

  useDeleteBillStatus = () => {
    const queryClient = useQueryClient()
    const handleDeleteStatus = async (data: { uuid: string; id: number }) => {
      const { statusCode } = await this.api.deleteBillStatus(data.uuid, data.id)
      return statusCode
    }
    return useMutation({
      mutationKey: ['DELETE_BILL_STATUS'],
      mutationFn: handleDeleteStatus,
      onSuccess: (_, { uuid }) => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENT_DETAIL', uuid],
        })
      },
    })
  }

  useDeleteBill = () => {
    const queryClient = useQueryClient()
    const handleDeleteBill = async (uuid: string) => {
      const { statusCode } = await this.api.deleteBill(uuid)
      return statusCode
    }
    return useMutation({
      mutationKey: ['DELETE_BILL'],
      mutationFn: handleDeleteBill,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GET_PAYMENTS'],
        })
      },
    })
  }
}

const paymentService = PaymentService.getInstance()
export default paymentService
