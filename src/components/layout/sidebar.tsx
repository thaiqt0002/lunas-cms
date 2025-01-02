'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Layout, Menu, MenuProps } from 'antd'
import {
  Cuboid,
  HandCoinsIcon,
  LayoutDashboard,
  LayoutTemplate,
  MailIcon,
  ServerIcon,
  Settings,
  User,
} from 'lucide-react'

import { generatePath } from '@core/libs/generatePath'

type TMenuItem = Required<MenuProps>['items'][number]

export default function Sidebar() {
  const { Sider } = Layout
  const router = useRouter()
  const pathname = usePathname()

  const [collapsed, setCollapsed] = useState(false)
  const items = useMemo(
    (): TMenuItem[] => [
      {
        key: generatePath({ path: 'dashboard' }),
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
      },
      {
        key: generatePath({ path: 'users' }),
        label: 'User',
        icon: <User size={20} />,
      },

      {
        key: generatePath({ path: 'payments' }),
        label: 'Payments',
        icon: <HandCoinsIcon size={20} />,
      },
      {
        key: generatePath({ path: 'products', subPath: null }),
        label: 'Product',
        icon: <Cuboid size={20} />,
      },
      {
        key: generatePath({ path: 'series', subPath: null }),
        label: 'Series',
        icon: <ServerIcon size={20} />,
      },
      {
        key: generatePath({ path: 'email' }),
        label: 'Email',
        icon: <MailIcon size={20} />,
      },
      {
        key: generatePath({ path: 'template' }),
        label: 'Template',
        icon: <LayoutTemplate size={20} />,
      },
      {
        key: generatePath({ path: 'settings', subPath: null }),
        label: 'Settings',
        icon: <Settings size={20} />,
        children: [
          {
            key: generatePath({ path: 'settings', subPath: { path: 'categories', subPath: null } }),
            label: 'Categories',
          },
          {
            key: generatePath({ path: 'settings', subPath: { path: 'tags', subPath: null } }),
            label: 'Tags',
          },
          {
            key: generatePath({ path: 'settings', subPath: { path: 'brands', subPath: null } }),
            label: 'Brands',
          },
          {
            key: generatePath({
              path: 'settings',
              subPath: { path: 'service-fees', subPath: null },
            }),
            label: 'Service Fees',
          },
          {
            key: generatePath({
              path: 'settings',
              subPath: { path: 'billing-status', subPath: null },
            }),
            label: 'Billing Status',
          },
        ],
      },
    ],
    [],
  )
  const handleSelect = (select: any) => {
    if (typeof select === 'object') {
      router.push(select.key)
    }
    return
  }
  return (
    <Sider
      breakpoint="lg"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={240}
      className="py-4 text-base font-semibold"
    >
      <div className="mb-4 flex w-full items-center justify-center">
        <div className="flex h-16 w-4/5 items-center justify-center rounded-lg bg-indigo-700">
          {!collapsed && <h1 className="text-2xl font-black italic text-stone-50">Lunas CMS</h1>}
        </div>
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[pathname]}
        items={items}
        className="mt-6"
        onSelect={handleSelect}
      />
    </Sider>
  )
}
