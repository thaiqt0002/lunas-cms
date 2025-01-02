import { StateCreator } from 'zustand'

import { IBaseSeries } from '@core/types/series'

export interface IState {
  series: IBaseSeries[]
  deleteSeriesUuid: string
}

export interface IAction {
  addSeries: (series: IBaseSeries[]) => void
  setDeleteSeriesUuid: (uuid: string) => void
}

export type TCreateSeriesSlice = IState & IAction

export const createSeriesSlice: StateCreator<
  TCreateSeriesSlice,
  [['zustand/devtools', never]],
  []
> = (set) => ({
  series: [],
  addSeries: (series) => set(() => ({ series })),
  deleteSeriesUuid: '',
  setDeleteSeriesUuid: (uuid) => set(() => ({ deleteSeriesUuid: uuid })),
})
