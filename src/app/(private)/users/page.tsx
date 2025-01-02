'use client'
import { MouseEvent, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Flex,
  MenuProps,
  message,
  Popconfirm,
  Table,
  TableProps,
  Tag,
  Typography,
} from 'antd'
import { HttpStatusCode } from 'axios'
import dayjs from 'dayjs'
import { Ellipsis, Eye, Pencil, Plus, Trash2, User2Icon } from 'lucide-react'

import { cn } from '@core/libs/classnames'
import colorHash from '@core/libs/color-hash'
import userService from '@core/services/user'
import { IBaseUser } from '@core/types/user'

import DrawerUserDetail from './_components/DrawerUserDetail'
import ModalCreateUser from './_components/ModalCreateUser'

interface IUserColumns {
  username: string
  fullname: string
  email: string
  roleId: string
  createdAt: Date
  isActivated: boolean
}

export default function Page() {
  const [messageApi, contextHolder] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<IBaseUser>({} as IBaseUser)
  const { data: users = [], isFetching } = userService.useGetAll()
  const { mutateAsync: deleteUser, isPending: isDeletePending } = userService.useDelete()

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const findUser = (email: string) => {
    return users.find((user) => user.email === email)
  }

  const handleDeleteUser = (email: string) => {
    const currentUser = findUser(email)
    if (currentUser) {
      deleteUser(currentUser.uuid).then(({ statusCode }) => {
        if (statusCode < HttpStatusCode.BadRequest) {
          messageApi.open({
            type: 'success',
            content: 'Delete user successfully',
          })
        } else {
          messageApi.open({
            type: 'error',
            content: 'Delete user failed',
          })
        }
      })
    }
  }
  const handleClickDropdown = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    data: IUserColumns,
  ) => {
    e.preventDefault()
    setLoading(true)
    const rowUser = findUser(data.email)
    if (rowUser) {
      setCurrentUser(rowUser)
    }
    setLoading(false)
  }
  const openDrawer = (record: IUserColumns | undefined = undefined) => {
    if (record && record.email != currentUser.uuid) {
      setLoading(true)
      const rowUser = findUser(record.email)
      if (rowUser) {
        setCurrentUser(rowUser)
      }
    }
    setLoading(false)
    setIsOpenDrawer(true)
  }
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Detail',
      icon: <Eye color="#9EA1FF" />,
      onClick: () => openDrawer(),
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Edit',
      icon: <Pencil color="#4277EF" />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: (
        <Popconfirm
          title="Delete the product"
          description="Are you sure to delete this product?"
          className="flex w-fit items-center space-x-2 font-semibold"
          cancelText="No"
          okText="Delete it!"
          onConfirm={() => handleDeleteUser(currentUser.email)}
        >
          <Trash2 color="#FF384A" />
          <span>Delete</span>
        </Popconfirm>
      ),
    },
  ]
  const columns: TableProps<IUserColumns>['columns'] = [
    {
      title: 'No.',
      key: 'index',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => {
        return (
          <div className="flex select-none items-center gap-x-3" onClick={() => openDrawer(record)}>
            <Avatar
              style={{
                backgroundColor: colorHash.hex(record.fullname + record.email),
              }}
              icon={<User2Icon size={14} />}
            />
            <div className="flex flex-col text-sm">
              <p className="font-bold text-neutral-700">{record.fullname}</p>
              <p className="text-xs text-neutral-500">@{record.email.split('@', 1)}</p>
            </div>
          </div>
        )
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'roleId',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      width: 100,
      render: (roleId) =>
        roleId === 1 ? (
          <Tag color="purple" className="font-bold">
            ADMIN
          </Tag>
        ) : (
          <Tag color="blue" className="font-bold">
            USER
          </Tag>
        ),
    },
    {
      title: 'Activated',
      dataIndex: 'isActivated',
      key: 'isActivated',
      onHeaderCell: () => ({
        style: { textAlign: 'center' },
      }),
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      width: 100,
      render: (activated) =>
        activated === 1 ? <Checkbox checked /> : <Checkbox checked={false} />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => handleClickDropdown(e, record)}>
            <Ellipsis />
          </a>
        </Dropdown>
      ),
      onCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: '1px solid #f0f0f0',
        },
      }),
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
            Trang người dùng
          </Typography.Title>
          <Button
            type="primary"
            size="middle"
            icon={<Plus size={18} />}
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
        </Flex>
      }
      className="h-full overflow-y-auto"
    >
      {contextHolder}
      <Table<IUserColumns>
        columns={columns}
        dataSource={users.map((user, index) => ({
          key: index + 1,
          ...user,
        }))}
        loading={!!(loading || isFetching || isDeletePending)}
      />
      <ModalCreateUser handleCancel={handleCancel} handleOk={handleOk} isModalOpen={isModalOpen} />
      <DrawerUserDetail
        isOpenDrawer={isOpenDrawer}
        setIsOpenDrawer={setIsOpenDrawer}
        user={currentUser}
      />
    </Card>
  )
}
