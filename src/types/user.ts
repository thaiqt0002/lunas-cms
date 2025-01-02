import { IResBase } from './base'

interface Emails {
  id: number
  email: string
  userUuid: string
  code: string
  expiredAt: Date
  verifiedAt: Date
  createdAt: Date
}

interface CustomAddresses {
  id: number
  userUuid: string
  fullname: string
  phoneNumber: string
  emailId: number
  wardId: string
  street: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}
export interface ICreateUserParams {
  fullname: string
  username: string
  email: string
  password: string
  roleId: string
}

export interface ICreateUserRequest {
  fullname: string
  username: string
  email: string
  password: string
  roleId: string
}

export interface IBaseUser {
  uuid: string
  fullname: string
  username: string
  email: string
  roleId: string
  phone: string
  avatar: string
  emails: Emails[]
  customAddresses: CustomAddresses[]
  isActivated: boolean
  createdAt: Date
}

export interface IGetAllUserRes extends IResBase<IBaseUser[]> {}

export interface ICreateUserRes extends IResBase<null> {}
