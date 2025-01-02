'use client'

import { createContext, FC, useContext, useRef } from 'react'

import { store } from '@core/stores/config'
import { TCreateStore } from '@core/types/zustand'

import { createSelectors } from './selector'

export const StoreContext = createContext<TCreateStore | null>(null)

export interface IStoreProviderProps {
  children: React.ReactNode
}

export const StoreProvider: FC<IStoreProviderProps> = ({ children }) => {
  const storeRef = useRef<TCreateStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = store
  }
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
}
export const useStore = () => {
  const storeContext = useContext(StoreContext)
  if (!storeContext) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return createSelectors(storeContext)
}
