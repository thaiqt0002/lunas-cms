'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb, Layout } from 'antd'
import { Home } from 'lucide-react'

interface IMainProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function Main({ children }: IMainProps) {
  const { Header, Content, Footer } = Layout
  const pathname = usePathname()
  const path = pathname.split('/').filter((p) => p !== '')
  return (
    <Layout>
      <Header
        style={{
          paddingTop: 16,
          paddingLeft: 16,
          paddingRight: 16,
        }}
        className="bg-transparent"
      >
        <div className="flex size-full items-center bg-white px-6 shadow">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: (
                  <div className="flex items-center gap-x-1">
                    <Home size={16} />
                    <p>Home</p>
                  </div>
                ),
              },
              ...(path.length > 0
                ? [
                    {
                      href: `/${path[0]}`,
                      title: path[0],
                    },
                  ]
                : []),
              ...(path.length > 1
                ? [
                    {
                      href: `/${path[0]}/${path[1]}`,
                      title: path[1],
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </Header>
      <Content className="mx-4 mt-4">{children}</Content>
      <Footer style={{ textAlign: 'center' }}>©2024 Created by Lunas Store</Footer>
    </Layout>
  )
}
