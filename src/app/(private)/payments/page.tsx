'use client'
import { useState } from 'react'
import { Card, Flex, Typography } from 'antd'

import BillingContent from '@core/app/(private)/payments/_components/BillingContent'

import PaymentsContent from './_components/PaymentsContent'

export default function Page() {
  const [activeTab, setActiveTab] = useState<string>('Billing')
  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }
  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Typography.Title
            level={5}
            style={{
              color: '#6C70F0',
            }}
          >
            Trang thanh toán
          </Typography.Title>
        </Flex>
      }
      tabList={[
        {
          key: 'Billing',
          tab: 'Hóa đơn',
        },
        {
          key: 'Payment',
          tab: 'Thanh toán',
        },
        {
          key: 'Transaction',
          tab: 'Giao dịch',
        },
      ]}
      tabProps={{
        size: 'small',
      }}
      onTabChange={handleTabChange}
      className="shadow"
    >
      {activeTab === 'Billing' && <BillingContent />}
      {activeTab === 'Payment' && <PaymentsContent />}
      {activeTab === 'Transaction' && <div>Transaction</div>}
    </Card>
  )
}
