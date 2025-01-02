'use client'
import { Button, Card, Flex, List, Typography } from 'antd'
import { Edit2Icon } from 'lucide-react'

import { cn } from '@core/libs/classnames'
import publicService from '@core/services/public'

export default function Page() {
  const { data = [] } = publicService.useGetServiceFee()
  return (
    <Card
      title={
        <Flex justify="space-between" align="center" className="mt-4 w-full">
          <Typography.Title level={4}>Service Fee Page</Typography.Title>
          <Button type="primary">Create</Button>
        </Flex>
      }
    >
      <List
        grid={{
          gutter: 16,
          column: 3,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card
              bordered={false}
              title={item.name}
              extra={<Button type="primary" shape="circle" icon={<Edit2Icon size={14} />} />}
              className={cn(
                'border-blue-200 bg-sky-50',
                '[&_.ant-card-head]:text-blue-600',
                '[&_.ant-card-head]:border-b-blue-200',
              )}
            >
              <Typography.Text className="font-medium text-blue-500">
                {item.description}
              </Typography.Text>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  )
}
