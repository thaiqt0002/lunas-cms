import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import emailApi, { EmailApi } from '@core/apis/email'

export class EmailService {
  private static instance: EmailService
  public static getInstance(): EmailService {
    return this.instance || (this.instance = new this())
  }

  private readonly api!: EmailApi
  private constructor() {
    this.api = emailApi
  }

  useGetAllEmail = () => {
    const handleGetAllEmail = async () => {
      const { data } = await this.api.getAllEmail()
      return data
    }
    return useQuery({
      queryKey: ['GET_ALL_EMAIL'],
      queryFn: handleGetAllEmail,
      staleTime: Infinity,
    })
  }

  useDeleteEmail = () => {
    const queryClient = useQueryClient()
    const handleDeleteEmail = async (id: number) => {
      const { data } = await this.api.deleteEmail(id)
      return data
    }
    return useMutation({
      mutationFn: handleDeleteEmail,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GET_ALL_EMAIL'],
        })
      },
    })
  }
}

const emailService = EmailService.getInstance()
export default emailService
