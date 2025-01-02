'use client'
import { FC } from 'react'

import layoutService from '@core/services/layouts'
import productService from '@core/services/product'
import seriesService from '@core/services/series'
import settingsService from '@core/services/settings'
import templateService from '@core/services/templates'
import userService from '@core/services/user'

const GetMe: FC = () => {
  seriesService.useGetAll()
  settingsService.useGetTags()
  settingsService.useGetCategories()
  userService.useGetAll()
  settingsService.useGetBrands()
  productService.useGetAll(1, '')
  layoutService.useGetAll()
  templateService.useGetAll()
  return null
}
export { GetMe }
