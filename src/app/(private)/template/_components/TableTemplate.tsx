import { useState } from 'react'
import { message, Popconfirm, Space, Table, TableProps, Tag, Typography } from 'antd'
import { HttpStatusCode } from 'axios'
import { Copy, Pencil, Trash2 } from 'lucide-react'

import { useStore } from '@core/libs/zustands'
import templateService from '@core/services/templates'
import { IBaseTemplate } from '@core/types/template'
interface IProps {
  setCloneTemplate: (template: IBaseTemplate) => void
}
import ModalUpdateTemplate from './ModalUpdateTemplate'

interface DataType extends IBaseTemplate {}
export default function TableTemplate({ setCloneTemplate }: IProps) {
  const templates = useStore().use.template()
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false)
  const [currentData, setCurrentData] = useState<IBaseTemplate>(templates[0])
  const handleUpdateTemplate = () => {
    setIsOpenUpdateModal(false)
  }
  const handleCancelTemplate = () => {
    setIsOpenUpdateModal(false)
  }
  const onClickUpdate = (id: number) => {
    const template = templates.find((item) => item.id === id)

    if (!template) return
    setCurrentData(template)
    setIsOpenUpdateModal(true)
  }
  const onCopyTemplate = (id: number) => {
    const template = templates.find((item) => item.id === id)

    if (!template) return
    setCloneTemplate(template)
  }

  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: deleteTemplate, isPending: isDeleting } = templateService.useDelete()
  const handleDeleteTemplate = (id: number) => {
    deleteTemplate(id).then(async ({ error, statusCode }) => {
      if (statusCode > HttpStatusCode.BadRequest) {
        messageApi.error(error.desc)
        return
      }
      messageApi.success('Delete template success')
    })
  }
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => <a onClick={() => onClickUpdate(record.id)}>{record.id}</a>,
    },
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
    },
    {
      title: 'Attributes',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (_, { attributes }) => (
        <Typography className="max-h-64 overflow-y-auto">
          <pre>{JSON.stringify(JSON.parse(attributes), null, 4)}</pre>
        </Typography>
      ),
    },
    {
      title: 'Active',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (_, { isActive }) => (
        <Tag color={isActive ? 'green' : 'volcano'}>
          {(isActive ? 'Active' : 'Not Active').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Copy className="cursor-pointer" onClick={() => onCopyTemplate(record.id)} />
          <Pencil
            className="cursor-pointer"
            color="blue"
            onClick={() => onClickUpdate(record.id)}
          />
          <Popconfirm
            title="Delete the Template"
            description="Are you sure to delete this template?"
            className="flex w-fit cursor-pointer items-center space-x-2 font-semibold"
            cancelText="No"
            okText="Delete it!"
            onConfirm={() => handleDeleteTemplate(record.id)}
          >
            <Trash2 color="#FF384A" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table<DataType> columns={columns} dataSource={templates} loading={isDeleting} />{' '}
      {contextHolder}
      <ModalUpdateTemplate
        dataUpdate={currentData}
        handleCancel={handleCancelTemplate}
        handleUpdateForm={handleUpdateTemplate}
        isModalOpen={isOpenUpdateModal}
      />
    </>
  )
}
