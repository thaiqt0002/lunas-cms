'use client'

import { Button, Card, Flex, List, Typography } from 'antd'
import { Edit2Icon } from 'lucide-react'

import { cn } from '@core/libs/classnames'
import paymentService from '@core/services/payments'

export default function Page() {
  const { data = [] } = paymentService.useBillingStatusList()
  return (
    <Card
      title={
        <Flex justify="space-between" align="center" className="mt-4 w-full">
          <Typography.Title level={4}>Billing Status </Typography.Title>
          <Button type="primary">Create</Button>
        </Flex>
      }
      className="shadow"
    >
      <List
        grid={{
          gutter: 16,
          column: 4,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              bordered={false}
              className={cn(
                'shadow',
                'border-blue-200 bg-sky-50',
                '[&_.ant-card-head]:text-blue-600',
                '[&_.ant-card-head]:border-b-blue-200',
              )}
            >
              <div className="flex items-start gap-x-3">
                <Button type="primary" size="small" shape="circle" icon={<Edit2Icon size={14} />} />
                <Typography.Text className="font-medium text-blue-500">{item.name}</Typography.Text>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  )
}
