import { TPath } from '../types/path'

export const generatePath = (path: TPath) => {
  switch (path.path) {
    case '':
      return ''

    case 'dashboard':
      return '/dashboard'

    case 'users':
      return '/users'

    case 'template':
      return '/template'
    case 'payments':
      return '/payments'

    case 'products':
      if (path.subPath === null) {
        return '/products'
      }
      return `/products/${path.subPath}`

    case 'series':
      if (path.subPath === null) {
        return '/series'
      }
      return `/series/${path.subPath}`

    case 'email':
      return '/email'

    case 'settings':
      if (path.subPath === null) {
        return '/settings'
      }
      if (path.subPath.path === 'categories') {
        if (path.subPath.subPath === null) {
          return '/settings/categories'
        }
        return `/settings/categories/${path.subPath.subPath}`
      }
      if (path.subPath.path === 'tags') {
        if (path.subPath.subPath === null) {
          return '/settings/tags'
        }
        return `/settings/tags/${path.subPath.subPath}`
      }
      if (path.subPath.path === 'brands') {
        if (path.subPath.subPath === null) {
          return '/settings/brands'
        }
        return `/settings/brands/${path.subPath.subPath}`
      }

      if (path.subPath.path === 'service-fees') {
        if (path.subPath.subPath === null) {
          return '/settings/service-fees'
        }
        return `/settings/service-fees/${path.subPath.subPath}`
      }

      if (path.subPath.path === 'billing-status') {
        if (path.subPath.subPath === null) {
          return '/settings/billing-status'
        }
        return `/settings/billing-status/${path.subPath.subPath}`
      }

    default:
      return '/'
  }
}
