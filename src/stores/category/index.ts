import { StateCreator } from 'zustand'

import { IBaseParentCategory } from '@core/types/category'

interface IState {
  categories: IBaseParentCategory[]
  parentCategory: string | null
  enableCategoryModal: boolean
  enableAddCategoryModal: boolean
  enableAddSubCategoryModal: boolean
}

interface IAction {
  addCategory: (categories: IState['categories']) => void
  updateParentCategory: (parentCategory: IState['parentCategory']) => void
}

export type TCreateCategorySlice = IState & IAction

export const createCategorySlice: StateCreator<
  TCreateCategorySlice,
  [['zustand/devtools', never]],
  []
> = (set) => ({
  categories: [],
  parentCategory: null,
  enableCategoryModal: false,
  enableAddCategoryModal: false,
  enableAddSubCategoryModal: false,
  addCategory: (categories) => set(() => ({ categories })),
  updateParentCategory: (parentCategory) => set(() => ({ parentCategory })),
})
