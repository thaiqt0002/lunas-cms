import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { createBrandSlice, TCreateBrandSlice } from './brand'
import { createCategorySlice, TCreateCategorySlice } from './category'
import { createLayoutSlice, TCreateLayoutSlice } from './layouts'
import { createProductSlice, TCreateProductSlice } from './products'
import { createSeriesSlice, TCreateSeriesSlice } from './series'
import { createTagSlice, TCreateTagSlice } from './tags'
import { createTemplateSlice, TCreateTemplateSlice } from './templates'
import { createUserSlice, TCreateUserSlice } from './users'

export type TStore = TCreateTagSlice &
  TCreateSeriesSlice &
  TCreateCategorySlice &
  TCreateProductSlice &
  TCreateUserSlice &
  TCreateBrandSlice &
  TCreateLayoutSlice &
  TCreateTemplateSlice
export const store = create<TStore>()(
  devtools((...args) => ({
    ...createTagSlice(...args),
    ...createSeriesSlice(...args),
    ...createCategorySlice(...args),
    ...createProductSlice(...args),
    ...createUserSlice(...args),
    ...createBrandSlice(...args),
    ...createLayoutSlice(...args),
    ...createTemplateSlice(...args),
  })),
)
