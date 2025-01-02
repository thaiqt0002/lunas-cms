import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { helper } from '../helper'

export interface IResposeError {
  statusCode: number
  message: string
  error: string
}
export interface ICustomError<D = unknown> extends InternalAxiosRequestConfig<D> {
  _retry?: boolean
}

/**
 * Axios client to handle the requests and responses
 * It also handles the token refresh
 * @class axiosClient
 * @constructor baseURL - The base URL for the API
 * @method setupInterceptors - Method to setup the request and response interceptors
 * @method onRequest - Method to add the token to the request
 */
export default class AxiosClient {
  private axiosInstance: AxiosInstance
  private readonly _refreshPath = '/auth/v1/refresh'
  private readonly _signOutPath = '/auth/v1/sign-out'

  constructor(baseURL: string | undefined) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      timeout: 10000,
    })
    this.onRequest = this.onRequest.bind(this)
    this.onResponse = this.onResponse.bind(this)
    this.setupInterceptors()
  }

  /**
   * Method to setup the request and response interceptors
   * @method setupInterceptors
   * @return {void}
   */
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(this.onRequest, this.onRequestError)
    // Add the response interceptor
    this.axiosInstance.interceptors.response.use(this.onResponse, this.onResponseError)
  }

  // ADD A REQUEST INTERCEPTOR
  /**
   * Request interceptor to add the token to the request
   */
  private onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    return config
  }
  /**
   * Request interceptor to handle the request error
   */
  private onRequestError(error: AxiosError): Promise<AxiosError> {
    return Promise.reject(error)
  }

  // ADD A RESPONSE INTERCEPTOR
  /**
   * Response interceptor to handle the response
   */
  private async onResponse(response: AxiosResponse) {
    const { statusCode } = response.data
    const config = response.config as ICustomError
    const is4001 = statusCode === 4001
    const is4003 = statusCode === 4003
    const isNotRetry = !config._retry
    const isNotRefreshPath = !response.request.responseURL.includes(this._refreshPath)
    try {
      if (is4001 && isNotRetry && isNotRefreshPath) {
        config._retry = true
        await this.axiosInstance.get(this._refreshPath)
        return this.axiosInstance(config)
      }
      if (is4003 && isNotRetry) {
        helper.deleteCookie('user')
        return await this.axiosInstance.delete(this._signOutPath)
      }
      return Promise.resolve(response)
    } catch (error) {
      helper.deleteCookie('user')
      return this.axiosInstance.delete(this._signOutPath)
    }
  }
  /**
   * Response interceptor to handle the response error
   * It also handles the token refresh
   * @method onResponseError
   */
  private async onResponseError(error: AxiosError<IResposeError>) {
    return Promise.reject(error)
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}
