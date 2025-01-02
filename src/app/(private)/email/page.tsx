'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Dropdown,
  Flex,
  Table,
  TableProps,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { MoreVertical, PencilIcon, Plus, ScanLineIcon, Trash2Icon } from 'lucide-react'

import emailService from '@core/services/email'

interface IEmailColumns {
  id: number
  topic: string
  email: string
  name: string
  createdAt: Date | string
}

export default function Page() {
  const { data: emails, isFetching } = emailService.useGetAllEmail()
  const { mutate: deleteEmail } = emailService.useDeleteEmail()
  const [openDrawer, setOpenDrawer] = useState<number | null>(null)
  const emailDetail = emails?.find((email) => email.id === openDrawer)
  const columns: TableProps<IEmailColumns>['columns'] = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'index',
      width: 60,
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (value) => value,
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 240,
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (_, record) => (
        <div className="flex flex-col gap-y-1">
          <span className="font-bold text-neutral-700">
            {dayjs(record.createdAt).format('MMM DD, YYYY')}
          </span>
          <span className="text-xs text-neutral-500">
            {dayjs(record.createdAt).format('HH:mm A')}
          </span>
        </div>
      ),
    },
    {
      key: '7',
      title: '',
      width: 40,
      align: 'center',
      render: (value) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <button
                    className="flex size-full items-center gap-x-2"
                    onClick={() => setOpenDrawer(value.id)}
                  >
                    <ScanLineIcon size={16} />
                    <p>View Detail</p>
                  </button>
                ),
              },
              {
                key: '2',
                label: (
                  <button className="flex items-center gap-x-2">
                    <PencilIcon size={16} />
                    <p>Edit</p>
                  </button>
                ),
              },
              {
                key: '3',
                label: (
                  <button
                    className="flex items-center gap-x-2"
                    onClick={() => deleteEmail(value.id)}
                  >
                    <Trash2Icon size={16} />
                    <p>Delete</p>
                  </button>
                ),
              },
            ],
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" shape="circle" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
      fixed: 'right',
    },
  ]
  return (
    <Card
      title={
        <Flex justify="space-between" align="center" className="w-full">
          <Typography.Title
            level={5}
            style={{
              color: '#6C70F0',
            }}
          >
            Trang Email Users
          </Typography.Title>
          <Button type="primary" size="middle" icon={<Plus size={18} />} />
        </Flex>
      }
    >
      <Table<IEmailColumns>
        bordered
        columns={columns}
        dataSource={emails}
        scroll={{ x: 1200 }}
        size="small"
        loading={isFetching}
      ></Table>
      <Drawer
        open={!!openDrawer}
        title={<p className="text-xl font-medium text-neutral-700">Email Detail</p>}
        width={'60%'}
        onClose={() => setOpenDrawer(null)}
      >
        <Descriptions
          bordered
          title="Email Detail"
          size="small"
          column={1}
          labelStyle={{ width: 120 }}
          items={[
            {
              label: 'Topic',
              children: emailDetail?.topic,
            },
            {
              label: 'Email',
              children: emailDetail?.email,
            },
            {
              label: 'Name',
              children: emailDetail?.name,
            },
            {
              label: 'Content',
              children: <p className="whitespace-pre-wrap">{emailDetail?.content}</p>,
            },
            {
              label: 'Created At',
              children: (
                <div className="flex flex-col gap-y-1">
                  <span className="font-bold text-neutral-700">
                    {dayjs(emailDetail?.createdAt).format('MMM DD, YYYY')}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {dayjs(emailDetail?.createdAt).format('HH:mm A')}
                  </span>
                </div>
              ),
            },
          ]}
        />
      </Drawer>
    </Card>
  )
}
