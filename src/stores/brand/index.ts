import { StateCreator } from 'zustand'

import { IBaseBrand } from '@core/types/brand'

export interface IState {
  brand: IBaseBrand[]
  deleteBrandUuid: string
}

export interface IAction {
  addBrand: (brand: IBaseBrand[]) => void
  setDeleteBrandUuid: (uuid: string) => void
}

export type TCreateBrandSlice = IState & IAction

export const createBrandSlice: StateCreator<
  TCreateBrandSlice,
  [['zustand/devtools', never]],
  []
> = (set) => ({
  brand: [],
  addBrand: (brand) => set(() => ({ brand })),
  deleteBrandUuid: '',
  setDeleteBrandUuid: (uuid) => set(() => ({ deleteBrandUuid: uuid })),
})
