import { StateCreator } from 'zustand'

import { IProductBase } from '@core/types/product'

export interface IState {
  products: IProductBase[]
}

export interface IAction {
  addProduct: (products: IProductBase[]) => void
}

export type TCreateProductSlice = IState & IAction

export const createProductSlice: StateCreator<
  TCreateProductSlice,
  [['zustand/devtools', never]],
  []
> = (set) => ({
  products: [],
  addProduct: (products) => set(() => ({ products })),
})
