import { Layout } from 'antd'

import Main from '@core/components/layout/main'
import Sidebar from '@core/components/layout/sidebar'

export default function LayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <Layout className="h-screen min-h-screen">
      <Sidebar />
      <Main>{children}</Main>
    </Layout>
  )
}
