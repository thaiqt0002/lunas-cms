import { StateCreator } from 'zustand'

import { IBaseLayout } from '@core/types/template'

export interface IState {
  layout: IBaseLayout[]
  deleteLayoutId: string
}

export interface IAction {
  addLayout: (layout: IBaseLayout[]) => void
  setDeleteLayoutId: (id: string) => void
}

export type TCreateLayoutSlice = IState & IAction

export const createLayoutSlice: StateCreator<
  TCreateLayoutSlice,
  [['zustand/devtools', never]],
  []
> = (set) => ({
  layout: [],
  addLayout: (layout) => set(() => ({ layout })),
  deleteLayoutId: '',
  setDeleteLayoutId: (id) => set(() => ({ deleteLayoutId: id })),
})
