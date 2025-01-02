import publicApi, { PublicApi } from '@core/apis/public'
import { useQuery } from '@tanstack/react-query'

export class PublicService {
  private static instance: PublicService
  public static getInstance(): PublicService {
    return this.instance || (this.instance = new this())
  }

  private readonly api!: PublicApi
  private constructor() {
    this.api = publicApi
  }

  useGetServiceFee = () => {
    const handleGetServiceFee = async () => {
      const { data } = await this.api.getServiceFee()
      return data
    }
    return useQuery({
      queryKey: ['GET_SERVICE_FEE'],
      queryFn: handleGetServiceFee,
      staleTime: Infinity,
    })
  }
}
const publicService = PublicService.getInstance()
export default publicService
