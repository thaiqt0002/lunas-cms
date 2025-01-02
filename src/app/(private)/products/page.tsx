'use client'
import { MouseEvent, useCallback, useState } from 'react'
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  message,
  Popconfirm,
  Space,
  Statistic,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { SearchProps } from 'antd/es/input'
import { HttpStatusCode } from 'axios'
import dayjs from 'dayjs'
import { Edit2, Ellipsis, Eye, Pencil, Plus, Trash2 } from 'lucide-react'

import productService from '@core/services/product'
import { IProductBase } from '@core/types/product'

import DrawerProductDetail from './_components/DrawerProductDetail'
import ModalCreateProduct from './_components/ModalCreateProduct'
import ModalCreateVariant from './_components/ModalCreateVariant'
interface IProductColumns {
  uuid: string
  name: string
  quantity: number
  originalPrice: number
  salePrice: number
  tags: {
    id: number
    name: string
  }[]
  createdAt: Date
}

export default function Page() {
  const { Search } = Input
  const [messageApi, contextHolder] = message.useMessage()
  const [searchText, setSearchText] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<IProductBase>({} as IProductBase)

  const { data: products = [], isFetching } = productService.useGetAll(1, '')
  const { mutateAsync: deleteProduct, isPending: isDeletePending } = productService.useDelete()

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
        <div className="flex gap-x-1" onClick={() => setIsVariantModalOpen(true)}>
          <Edit2 color="#9EA1FF" />
          <span>Add variant</span>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: (
        <Popconfirm
          title="Delete the product"
          description="Are you sure to delete this product?"
          className="flex w-fit items-center space-x-2 font-semibold"
          cancelText="No"
          okText="Delete it!"
          onConfirm={() => handleDeleteProduct()}
        >
          <Trash2 color="#FF384A" />
          <span>Delete</span>
        </Popconfirm>
      ),
    },
  ]

  const columns: TableProps<IProductColumns>['columns'] = [
    {
      dataIndex: 'key',
      title: <p className="pl-2">No</p>,
      width: 50,
      rowScope: 'row',
      fixed: 'left',
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: <p className="w-60">Name</p>,
      width: 200,
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
      render: (text, record) => (
        <Tooltip title={text} placement="topLeft">
          <a className="line-clamp-2" onClick={() => openDrawer(record)}>
            <Typography.Text>{text}</Typography.Text>
          </a>
        </Tooltip>
      ),
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Quantity',
      align: 'right',
      width: 120,
      sorter: (a, b) => a.quantity - b.quantity,
      onCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: '1px solid #f0f0f0',
          borderLeft: '1px solid #f0f0f0',
        },
      }),
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ color: '#87A2FF' }}
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      title: 'O.Price',
      align: 'right',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
      width: 140,
      sorter: (a, b) => a.originalPrice - b.originalPrice,
      onCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: '1px solid #f0f0f0',
        },
      }),
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ color: '#87A2FF' }}
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      title: 'S.Price',
      align: 'right',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 140,
      sorter: (a, b) => a.salePrice - b.salePrice,
      onCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: '1px solid #f0f0f0',
        },
      }),
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ color: '#87A2FF' }}
          suffix="₫"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      onCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: '1px solid #f0f0f0',
        },
      }),
      render: (value) => (
        <div className="flex flex-col items-start gap-y-1">
          <span className="font-bold text-neutral-700">{dayjs(value).format('MMM DD, YYYY')}</span>
          <span className="text-xs text-neutral-500">{dayjs(value).format('HH:mm A')}</span>
        </div>
      ),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      width: 240,
      render: (_, { tags }) => (
        <div className="inline-flex size-full !max-h-24 flex-wrap gap-y-2 overflow-y-auto">
          {tags.slice(0, 3).map(({ id, name }) => (
            <Tag color={'geekblue'} key={id} className="h-fit">
              {name.toUpperCase()}
            </Tag>
          ))}
        </div>
      ),
      onCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: '1px solid #f0f0f0',
        },
      }),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => handleClickDropdown(e, record)}>
            <Space>
              <Ellipsis />
            </Space>
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

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchText(value)
  }

  const findProduct = (uuid: string) => {
    return products.find((product) => product.uuid === uuid)
  }

  const handleClickDropdown = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    { uuid }: IProductColumns,
  ) => {
    e.preventDefault()
    const rowProduct = findProduct(uuid)
    rowProduct && setCurrentProduct(rowProduct)
  }

  const openDrawer = (record: IProductColumns | undefined = undefined) => {
    if (record && record.uuid != currentProduct.uuid) {
      const rowProduct = findProduct(record.uuid)
      rowProduct && setCurrentProduct(rowProduct)
    }
    setIsOpenDrawer(true)
  }

  const handleOk = useCallback(() => setIsModalOpen(false), [])

  const handleCancel = useCallback(() => setIsModalOpen(false), [])

  const handleDeleteProduct = () => {
    deleteProduct(currentProduct.uuid).then(({ statusCode, error }) => {
      if (statusCode < HttpStatusCode.BadRequest) {
        messageApi.open({
          type: 'success',
          content: 'Delete product successfully',
        })
      }

      messageApi.open({
        type: 'error',
        content: error.desc,
      })
    })
  }

  return (
    <Card
      title={
        <Flex justify="space-between" align="center" className="mt-4 w-full">
          <Typography.Title
            level={5}
            style={{
              color: '#6C70F0',
            }}
          >
            Trang sản phẩm
            <Search placeholder="Search product" onSearch={onSearch} enterButton className="px-3" />
          </Typography.Title>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
        </Flex>
      }
      className="h-full overflow-y-auto shadow"
    >
      {contextHolder}
      <Table<IProductColumns>
        size="small"
        scroll={{ x: 1000, y: 1200 }}
        virtual
        columns={columns}
        dataSource={products.map((product, index) => ({
          key: index + 1,
          ...product,
        }))}
        loading={!!(isFetching || isDeletePending)}
      />
      <ModalCreateProduct
        handleCancel={handleCancel}
        handleOk={handleOk}
        isModalOpen={isModalOpen}
      />
      <DrawerProductDetail
        isOpenDrawer={isOpenDrawer}
        setIsOpenDrawer={setIsOpenDrawer}
        product={currentProduct}
      />
      <ModalCreateVariant
        productUuid={currentProduct.uuid}
        isModalOpen={isVariantModalOpen}
        onCancel={() => setIsVariantModalOpen(false)}
      />
    </Card>
  )
}
