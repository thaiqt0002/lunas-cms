import { Image, message, Popconfirm, Table, TableColumnsType } from 'antd'
import { HttpStatusCode } from 'axios'
import { Trash2 } from 'lucide-react'

import { helper } from '@core/libs/helper'
import { useStore } from '@core/libs/zustands'
import layoutService from '@core/services/layouts'
import { IBaseLayout } from '@core/types/template'

interface DataType extends IBaseLayout {}
export default function TableLayout() {
  const layout = useStore().use.layout()
  const [messageApi, contextHolder] = message.useMessage()
  const handleDeleteLayout = (id: number) => {
    deleteLayout(id).then(async ({ data, error, statusCode }) => {
      if (statusCode > HttpStatusCode.BadRequest) {
        messageApi.error(error.desc)
        return
      }
      messageApi.success('Delete layout success')
    })
  }
  const { mutateAsync: deleteLayout, isPending: isDeleting } = layoutService.useDelete()
  const columns: TableColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Example Image',
      dataIndex: 'exampleImage',
      key: 'exampleImage',
      render: (_, record) => (
        <Image width={150} src={helper.getImageUrl(record.exampleImage)} alt={record.name} />
      ),
    },
    {
      title: 'Example Data',
      dataIndex: 'exampleData',
      key: 'exampleData',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Popconfirm
          title="Delete the layout"
          description="Are you sure to delete this layout?"
          className="flex w-fit cursor-pointer items-center space-x-2 font-semibold"
          cancelText="No"
          okText="Delete it!"
          onConfirm={() => handleDeleteLayout(record.id)}
        >
          <Trash2 color="#FF384A" />
          <span>Delete</span>
        </Popconfirm>
      ),
    },
  ]

  return (
    <>
      <Table<DataType> columns={columns} dataSource={layout} loading={isDeleting} />
      {contextHolder}
    </>
  )
}
