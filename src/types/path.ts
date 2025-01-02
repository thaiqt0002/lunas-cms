type TDashboardPath = {
  path: 'dashboard' | ''
}

type TUserPath = {
  path: 'users' | ''
}

type TPaymentPath = {
  path: 'payments' | ''
}

type TProductPath = {
  path: 'products'
  subPath: 'create' | 'edit' | 'delete' | null
}
type TTemplatePath = {
  path: 'template' | ''
}
type TSeriesPath = {
  path: 'series'
  subPath: 'create' | 'edit' | 'delete' | null
}

type TSettingsPath = {
  path: 'settings'
  subPath:
    | {
        path: 'categories'
        subPath: 'create' | 'edit' | 'delete' | null
      }
    | {
        path: 'tags'
        subPath: 'create' | 'edit' | 'delete' | null
      }
    | {
        path: 'brands'
        subPath: 'create' | 'edit' | 'delete' | null
      }
    | {
        path: 'service-fees'
        subPath: 'edit' | 'delete' | null
      }
    | {
        path: 'billing-status'
        subPath: 'edit' | 'delete' | null
      }
    | null
}

type TEmailPath = {
  path: 'email' | ''
}

export type TPath =
  | TDashboardPath
  | TProductPath
  | TSeriesPath
  | TUserPath
  | TTemplatePath
  | TPaymentPath
  | TEmailPath
  | TSettingsPath
