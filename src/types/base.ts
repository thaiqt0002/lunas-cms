import { HttpStatusCode } from 'axios'
import { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type Pretify<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]: T[P]
}

export type Prettify<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]: T[P]
}
export type METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export enum EInputType {
  TEXT = 'text',
  SELECT = 'select',
  PASSWORD = 'password',
  TEXTAREA = 'textarea',
}

export interface IPagination {
  page: number
  perPage: number
}

export type TAnyObject = Record<string, unknown>

export type AnyEntity = any

export interface IError {
  statusCode?: HttpStatusCode
  message?: string
  code?: string
  desc?: string
}

export interface IResBase<T> {
  statusCode: HttpStatusCode
  message: string | null
  error: IError
  data: T
}

export interface IIcon
  extends ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>> {}

export interface IFile {
  file: File
  preview: string
}

export interface IPreSignedUrlSeries {
  name: string
  preSignedUrl: string
}

export interface IMetadata {
  page: number
  perPage: number
  total: number
  totalPage: number
}

export enum EStatusProduct {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PRE_ORDER = 'PRE_ORDER',
  ORDER = 'ORDER',
}

export interface IBaseId {
  id: number
}
