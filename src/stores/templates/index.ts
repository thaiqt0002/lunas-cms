import { StateCreator } from 'zustand'

import { IBaseTemplate } from '@core/types/template'

export interface IState {
  template: IBaseTemplate[]
  deleteTemplateId: string
}

export interface IAction {
  addTemplate: (template: IBaseTemplate[]) => void
  setDeleteTemplateId: (id: string) => void
}

export type TCreateTemplateSlice = IState & IAction

export const createTemplateSlice: StateCreator<
  TCreateTemplateSlice,
  [['zustand/devtools', never]],
  []
> = (set) => ({
  template: [],
  addTemplate: (template) => set(() => ({ template })),
  deleteTemplateId: '',
  setDeleteTemplateId: (id) => set(() => ({ deleteTemplateId: id })),
})
