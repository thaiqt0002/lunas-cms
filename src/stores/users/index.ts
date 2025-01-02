import { StateCreator } from 'zustand'

import { IBaseUser } from '@core/types/user'

export interface IState {
  users: IBaseUser[]
}

export interface IAction {
  addUser: (users: IBaseUser[]) => void
}

export type TCreateUserSlice = IState & IAction

export const createUserSlice: StateCreator<TCreateUserSlice, [['zustand/devtools', never]], []> = (
  set,
) => ({
  users: [],
  addUser: (users) => set(() => ({ users })),
})
