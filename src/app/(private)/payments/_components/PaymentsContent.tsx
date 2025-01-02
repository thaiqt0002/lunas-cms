import { FC } from 'react'
import { Statistic, Table, TableProps, Tag } from 'antd'
import dayjs from 'dayjs'

import paymentService from '@core/services/payments'
import { IPaymentLink } from '@core/types/payments'

const PaymentsContent: FC = () => {
  const { data = [] } = paymentService.usePaymentLinkList()
  const columns: TableProps<IPaymentLink>['columns'] = [
    {
      key: '1',
      title: <p className="pl-4">Order Code</p>,
      dataIndex: 'orderCode',
      width: 160,
      onCell: () => ({
        style: {
          textAlign: 'center',
        },
      }),
      render: (value) => (
        <Tag color="default" className="px-3 py-1 font-medium text-neutral-700">
          #{value}
        </Tag>
      ),
    },
    {
      key: '2',
      title: 'Status',
      dataIndex: 'status',
      width: 180,
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (value) => (
        <Tag
          color={value === 'PAID' ? 'green' : 'processing'}
          className="inline-flex w-32 items-center justify-center px-3 py-1 font-medium"
        >
          <p>{value}</p>
        </Tag>
      ),
    },
    {
      key: '3',
      title: 'Amount',
      dataIndex: 'amount',
      align: 'center',
      width: 200,
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ color: '#87A2FF' }}
          prefix="$"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      key: '4',
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 200,
      render: (value) => (
        <div className="flex flex-col gap-y-1">
          <span className="font-bold text-neutral-700">{dayjs(value).format('MMM DD, YYYY')}</span>
          <span className="text-xs text-neutral-500">{dayjs(value).format('HH:mm A')}</span>
        </div>
      ),
    },
  ]
  return (
    <Table<IPaymentLink>
      dataSource={data}
      columns={columns}
      bordered={false}
      size="small"
      scroll={{ x: 1000 }}
    />
  )
}

export default PaymentsContent
