import { StateCreator } from 'zustand'

import { IBaseTag } from '@core/types/tag'

export interface IState {
  tags: IBaseTag[]
  showTagModal: boolean
}

export interface IAction {
  addTag: (tags: IState['tags']) => void
  onToggleTagModal: () => void
}

export type TCreateTagSlice = IState & IAction

export const createTagSlice: StateCreator<TCreateTagSlice, [['zustand/devtools', never]], []> = (
  set,
) => ({
  tags: [],
  addTag: (tags) => set(() => ({ tags })),
  showTagModal: false,
  onToggleTagModal: () => set(({ showTagModal }) => ({ showTagModal: !showTagModal })),
})
