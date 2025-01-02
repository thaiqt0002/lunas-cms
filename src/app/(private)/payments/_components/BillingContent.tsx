'use client'
import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  DescriptionsProps,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  QRCode,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  TableProps,
  Tag,
  Timeline,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import {
  MoreVertical,
  PencilIcon,
  PlusIcon,
  ScanLineIcon,
  Trash2Icon,
  TrashIcon,
  Upload,
  User2Icon,
} from 'lucide-react'

import { cn } from '@core/libs/classnames'
import colorHash from '@core/libs/color-hash'
import { helper } from '@core/libs/helper'
import paymentService from '@core/services/payments'
import { IBillingListData, IBillingPaymentLink } from '@core/types/payments'

import CreateBilling from './CreateBilling'

const BillingContent = () => {
  const { data = [] } = paymentService.useBillingList()
  const { data: statuses = [] } = paymentService.useBillingStatusList()
  const { mutateAsync: mutateAsyncBillingStatus, isPending: isUpdateBillingStatusPending } =
    paymentService.useUpdateBillingStatus()

  const { mutateAsync: mutateAsyncDeleteBill } = paymentService.useDeleteBill()

  const [openDetailDrawer, setOpenDetailDrawer] = useState<string | null>(null)

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
  const [isOpenDeleteStatusModal, setIsOpenDeleteStatusModal] = useState(false)
  const [isOpenCreateBillingDrawer, setIsOpenCreateBillingDrawer] = useState(false)
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string | null>(null)

  const { data: billingDetail, isFetching: isBillingDetailFetching } =
    paymentService.useBillingDetail(openDetailDrawer || '')

  const {
    mutateAsync: mutateAsyncBillingEstimateDelivery,
    isPending: isUpdateBillingEstimateDeliveryPending,
  } = paymentService.useUpdateBillingEstimateDelivery()

  const { mutateAsync: mutateAsyncCreateAdditionalFee } =
    paymentService.useCreateBillAdditionalFee()

  const { mutateAsync: mutateAsyncDeleteAdditionalFee } =
    paymentService.useDeleteBillAdditionalFee()

  const { mutateAsync: mutateAsyncDeleteBillStatus, isPending: isDeleteBillStatusPending } =
    paymentService.useDeleteBillStatus()

  const onStatusChange = (type: 'ADD' | 'DELETE') => {
    if (!statuses || !statuses.length || !openDetailDrawer || !selectedStatus) return
    const newStatuses =
      type === 'ADD'
        ? [...(billingDetail?.statuses?.map(({ id }) => id) || []), selectedStatus]
        : billingDetail?.statuses?.filter(({ id }) => id !== selectedStatus).map(({ id }) => id) ||
          []
    mutateAsyncBillingStatus({ uuid: openDetailDrawer, statuses: newStatuses }).finally(
      () => selectedStatus && setSelectedStatus(null),
    )
  }

  const columns: TableProps<IBillingListData>['columns'] = [
    {
      key: '0',
      title: <p className="pl-4">ID</p>,
      dataIndex: 'orderCode',
      width: 160,
      render: (value) => (
        <Tag color="blue" className="px-3 py-1 font-medium text-blue-500">
          #{value}
        </Tag>
      ),
      fixed: 'left',
    },
    {
      key: '1',
      title: 'User',
      width: 200,
      render: (value) => {
        return (
          <div className="flex select-none items-center gap-x-3">
            {value.customerFullname ? (
              <>
                <Avatar
                  style={{
                    backgroundColor: colorHash.hex(value.customerFullname + value.customerEmail),
                  }}
                  icon={<User2Icon size={14} />}
                />
                <div className="flex flex-col text-sm">
                  <p className="font-bold text-neutral-700">
                    {value?.customerFullname ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    @{value?.customerEmail?.split('@', 1) ?? ''}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm font-bold text-neutral-600">Unknown</p>
            )}
          </div>
        )
      },
    },
    {
      key: '2',
      dataIndex: 'customerPhoneNumber',
      width: 160,
      title: 'Phone Number',
    },
    {
      key: '3',
      title: 'Address',
      width: 240,
      render: (value) => {
        return (
          <div className="flex flex-col gap-y-1">
            {value.customerProvince && (
              <>
                <span className="font-bold text-neutral-700">{value.customerProvince}</span>
                <span className="text-xs text-neutral-500">
                  {value.customerDistrict}, {value.customerWard}
                </span>
              </>
            )}
          </div>
        )
      },
    },
    {
      key: '4',
      dataIndex: 'amountTotal',
      title: 'Total Amount',
      align: 'center',
      width: 160,
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (value) => {
        return (
          <Statistic
            value={value}
            valueStyle={{ color: '#87A2FF' }}
            prefix="$"
            className="font-semibold [&_span]:!text-lg"
          />
        )
      },
    },
    {
      key: '5',
      dataIndex: 'amountPaid',
      title: 'Paid Amount',
      align: 'center',
      width: 160,
      onCell: () => ({
        style: { textAlign: 'center' },
      }),
      render: (value) => {
        return (
          <Statistic
            value={value}
            valueStyle={{ color: '#87A2FF' }}
            prefix="$"
            className="font-semibold [&_span]:!text-lg"
          />
        )
      },
    },
    {
      key: '6',
      dataIndex: 'status',
      title: 'Status',
      align: 'center',
      width: 160,
      render: (value) => <Tag color={value === 'APPROVED' ? 'green' : 'blue'}>{value}</Tag>,
    },
    {
      key: '6',
      dataIndex: 'isPublic',
      title: 'Type',
      align: 'center',
      width: 160,
      render: (value) => <Tag color={value ? 'blue' : 'green'}>{value ? 'Public' : 'Private'}</Tag>,
    },
    {
      key: '7',
      dataIndex: 'createdAt',
      title: 'Created At',
      width: 160,
      render: (value) => (
        <div className="flex flex-col gap-y-1">
          <span className="font-bold text-neutral-700">{dayjs(value).format('MMM DD, YYYY')}</span>
          <span className="text-xs text-neutral-500">{dayjs(value).format('HH:mm A')}</span>
        </div>
      ),
    },
    {
      key: '8',
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
                    onClick={() => setOpenDetailDrawer(value.uuid)}
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
                    onClick={() => mutateAsyncDeleteBill(value.uuid)}
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
  const detailCustomerItems: DescriptionsProps['items'] = [
    {
      label: 'Customer Name',
      span: 3,
      children: billingDetail?.customerFullname,
    },
    {
      label: 'Email',
      span: 3,
      children: billingDetail?.customerEmail,
    },
    {
      label: 'Phone Number',
      span: 3,
      children: billingDetail?.customerPhoneNumber,
    },
    {
      label: 'Address',
      span: 3,
      children: (
        <div className="">
          <p className="font-semibold">
            {billingDetail?.customerProvince}, {billingDetail?.customerDistrict},{' '}
            {billingDetail?.customerWard}
          </p>
          <p className="text-xs font-medium text-neutral-500">{billingDetail?.customerStreet}</p>
        </div>
      ),
    },
  ]
  const detailPaymentItems = (paymentLink: IBillingPaymentLink): DescriptionsProps['items'] => [
    {
      label: 'Service Fee',
      span: 2,
      children: (
        <Card
          title={billingDetail?.serviceFee?.name}
          className={cn(
            'mt-4 max-w-[320px] border-blue-200 bg-sky-50',
            '[&_.ant-card-head]:text-blue-600',
            '[&_.ant-card-head]:border-b-blue-200',
          )}
        >
          <Typography.Text className="font-medium text-blue-500">
            {billingDetail?.serviceFee?.description}
          </Typography.Text>
        </Card>
      ),
    },
    {
      label: 'QR Code',
      span: 1,
      children: <QRCode value={paymentLink?.qrCode || ''} />,
    },
    {
      label: 'Status',
      span: 1,
      children: (
        <Tag color={paymentLink.status === 'PAID' ? 'green' : 'blue'}>{paymentLink.status}</Tag>
      ),
    },
    {
      label: 'Checkout URL',
      span: 2,
      children: (
        <a
          href={paymentLink.checkoutUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          {paymentLink.checkoutUrl}
        </a>
      ),
    },
    {
      label: 'Amount Total',
      span: 1,
      children: (
        <Statistic
          value={paymentLink.amount || 0}
          valueStyle={{ color: '#87A2FF' }}
          prefix="$"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      label: 'Amount Paid',
      span: 1,
      children: (
        <Statistic
          value={paymentLink.amountPaid || 0}
          valueStyle={{ color: '#87A2FF' }}
          prefix="$"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      label: 'Amount Remaining',
      span: 1,
      children: (
        <Statistic
          value={paymentLink?.amountRemaining || 0}
          valueStyle={{ color: '#87A2FF' }}
          prefix="$"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
  ]
  const detailBillingItems: DescriptionsProps['items'] = [
    {
      label: 'Billing ID',
      span: 3,
      children: billingDetail?.uuid,
    },
    {
      label: 'Amount Total',
      span: 3,
      children: (
        <Statistic
          value={billingDetail?.amountTotal}
          valueStyle={{ color: '#87A2FF' }}
          prefix="$"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      label: 'Amount Paid',
      span: 3,
      children: (
        <Statistic
          value={billingDetail?.amountPaid ?? 0}
          valueStyle={{ color: '#87A2FF' }}
          prefix="$"
          className="font-semibold [&_span]:!text-lg"
        />
      ),
    },
    {
      label: 'Payment Link',
      span: 3,
      children: (() => {
        const url = new URL('https://dev.payment.lunas.vn/thanh-toan-pub')
        url.searchParams.append('publicKey', billingDetail?.publicKey || '')
        url.searchParams.append('orderCode', billingDetail?.orderCode || '')
        return (
          <a href={url.toString()} target="_blank">
            {url.toString()}
          </a>
        )
      })(),
    },
    {
      label: 'Billing Detail URL',
      span: 3,
      children: (() => {
        const url = new URL('https://dev.payment.lunas.vn/don-hang')
        url.searchParams.append('publicKey', billingDetail?.publicKey || '')
        url.searchParams.append('orderCode', billingDetail?.orderCode || '')
        return (
          <a href={url.toString()} target="_blank">
            {url.toString()}
          </a>
        )
      })(),
    },
    {
      label: 'Created At',
      span: 3,
      children: (
        <div className="flex flex-col gap-y-1">
          <span className="font-bold text-neutral-700">
            {dayjs(billingDetail?.createdAt).format('MMM DD, YYYY')}
          </span>
          <span className="text-xs text-neutral-500">
            {dayjs(billingDetail?.createdAt).format('HH:mm A')}
          </span>
        </div>
      ),
    },
    {
      label: 'Estimated Delivery Date',
      span: 3,
      children: (
        <>
          {billingDetail?.estimatedDeliveryDate ? (
            <Space align="center" className="gap-x-4">
              <div className="flex flex-col gap-y-1">
                <span className="font-bold text-neutral-700">
                  {dayjs(billingDetail?.estimatedDeliveryDate).format('MMM DD, YYYY')}
                </span>
                <span className="text-xs text-neutral-500">
                  {dayjs(billingDetail?.estimatedDeliveryDate).format('HH:mm A')}
                </span>
              </div>
              <Button
                type="primary"
                danger
                icon={<TrashIcon size={16} />}
                loading={isUpdateBillingEstimateDeliveryPending}
                className="flex items-center justify-center"
                onClick={() => {
                  if (!openDetailDrawer) return
                  mutateAsyncBillingEstimateDelivery({
                    uuid: openDetailDrawer,
                    estimatedDeliveryDate: '',
                  })
                }}
              />
            </Space>
          ) : (
            <Space align="center">
              <DatePicker
                onChange={(value) => {
                  setEstimatedDeliveryDate(value?.toISOString())
                }}
                needConfirm
              />
              <Button
                type="primary"
                icon={<Upload size={16} />}
                loading={isUpdateBillingEstimateDeliveryPending}
                disabled={!estimatedDeliveryDate}
                className="!size-8"
                onClick={() => {
                  if (!openDetailDrawer || !estimatedDeliveryDate) return
                  mutateAsyncBillingEstimateDelivery({
                    uuid: openDetailDrawer,
                    estimatedDeliveryDate: estimatedDeliveryDate,
                  }).finally(() => setEstimatedDeliveryDate(null))
                }}
              />
            </Space>
          )}
        </>
      ),
    },
    {
      label: 'Note',
      span: 3,
      children: billingDetail?.note,
    },
    {
      label: 'Payment Method',
      span: 3,
      children: billingDetail?.paymentMethod?.name,
    },
    {
      label: 'Service Fee',
      span: 3,
      children: (
        <Card
          title={billingDetail?.serviceFee?.name}
          className={cn(
            'mt-4 max-w-[320px] border-blue-200 bg-sky-50',
            '[&_.ant-card-head]:text-blue-600',
            '[&_.ant-card-head]:border-b-blue-200',
          )}
        >
          <Typography.Text className="font-medium text-blue-500">
            {billingDetail?.serviceFee?.description}
          </Typography.Text>
        </Card>
      ),
    },
  ]
  const [createAdditionalFee] = Form.useForm()
  const onCreateAdditionalFeeFinish = (values: { value: number; description: string }) => {
    if (!openDetailDrawer) return
    mutateAsyncCreateAdditionalFee({
      uuid: openDetailDrawer,
      params: values,
    }).finally(() => createAdditionalFee.resetFields())
  }
  return (
    <>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Button type="primary" onClick={() => setIsOpenCreateBillingDrawer(true)}>
            Create Billing
          </Button>
        </Col>
        <Col span={24}>
          <Table<IBillingListData>
            bordered
            dataSource={data}
            columns={columns}
            size="small"
            scroll={{ x: 1240 }}
          />
        </Col>
      </Row>
      <Drawer
        width={'80%'}
        open={!!openDetailDrawer}
        loading={isBillingDetailFetching}
        title={<p className="text-xl font-medium text-neutral-700">Billing Detail</p>}
        rootClassName={cn(
          '[&_.ant-drawer-content-wrapper]:mr-2',
          '[&_.ant-drawer-content-wrapper]:my-2',
        )}
        className="rounded-2xl"
        onClose={() => setOpenDetailDrawer(null)}
      >
        <Descriptions
          bordered
          size="small"
          labelStyle={{ width: 140 }}
          title="Customer Information"
          items={detailCustomerItems}
        />

        <Divider />

        <Descriptions
          bordered
          title="Billing Information"
          size="small"
          labelStyle={{ width: 140 }}
          items={detailBillingItems}
          className="mt-4"
        />

        <Card title="Status Timeline" className="mt-4">
          <Timeline
            mode="left"
            items={
              billingDetail?.statuses?.map((status) => ({
                position: 'right',
                children: (
                  <div className="group flex min-h-8 items-center gap-x-2 pb-2">
                    <Typography.Text type="secondary" className="select-none text-nowrap text-xs">
                      {dayjs(status.createdAt).format('HH:mm A')} {' - '}
                      {status.name}
                    </Typography.Text>
                    <Popconfirm
                      title="Are you sure to delete this status?"
                      description="This action cannot be undone."
                      onConfirm={() => {
                        mutateAsyncDeleteBillStatus({
                          uuid: openDetailDrawer ?? '',
                          id: status.id,
                        }).then(() => {
                          setIsOpenDeleteStatusModal(false)
                        })
                      }}
                    >
                      <Button
                        danger
                        type="primary"
                        size="small"
                        icon={<TrashIcon size={16} />}
                        className="hidden items-center justify-center group-hover:flex"
                        onClick={() => setIsOpenDeleteStatusModal(true)}
                      />
                    </Popconfirm>
                  </div>
                ),
              })) || []
            }
            className="w-fit"
          />
          <Row align="middle" gutter={16}>
            <Col span={8}>
              <Select
                className="w-full"
                options={statuses
                  .filter(
                    ({ id }) =>
                      !billingDetail?.statuses?.find(({ id: statusId }) => statusId === id),
                  )
                  .map(({ name, id }) => ({
                    label: name,
                    value: id,
                  }))}
                showSearch
                placeholder="Select status"
                filterOption={(input, option) => helper.searchString(option?.label || '', input)}
                onChange={(value) => setSelectedStatus(value)}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusIcon size={16} />}
                disabled={!selectedStatus}
                loading={isUpdateBillingStatusPending}
                onClick={() => onStatusChange('ADD')}
              />
            </Col>
          </Row>
        </Card>
        <Divider />

        <Card title="Additional Fee Information" className="mt-4">
          <List>
            {billingDetail?.additionFees?.map((additionalFee) => (
              <List.Item key={additionalFee.id}>
                <List.Item.Meta
                  title={<p className="text-sm font-bold">{additionalFee.description}</p>}
                  description={additionalFee.description}
                />
                <div className="flex gap-x-2">
                  <Statistic
                    value={additionalFee.value}
                    valueStyle={{ color: '#87A2FF' }}
                    prefix="$"
                    className="font-semibold [&_span]:!text-lg"
                  />
                  <Popconfirm
                    title="Are you sure to delete this additional fee?"
                    description="This action cannot be undone."
                    onConfirm={() =>
                      mutateAsyncDeleteAdditionalFee({
                        uuid: openDetailDrawer ?? '',
                        id: additionalFee.id,
                      })
                    }
                  >
                    <Button
                      danger
                      disabled={!!additionalFee.isPaid}
                      type="primary"
                      size="small"
                      icon={<TrashIcon size={16} />}
                      className="mt-2 flex items-center justify-center"
                    />
                  </Popconfirm>
                </div>
              </List.Item>
            ))}
          </List>

          <Form<{
            value: number
            description: string
          }>
            form={createAdditionalFee}
            onFinish={onCreateAdditionalFeeFinish}
          >
            <div className="mt-4 flex flex-col gap-x-2 *:mb-2">
              <Form.Item name="value" rules={[{ required: true, message: 'Please input value!' }]}>
                <InputNumber placeholder="value" className="w-96" />
              </Form.Item>

              <Form.Item
                name="description"
                rules={[{ required: true, message: 'Please input description!' }]}
                className="w-96"
              >
                <Input.TextArea placeholder="description" />
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Divider />
        {billingDetail?.paymentLink?.map((paymentLink, index) => (
          <Descriptions
            key={index}
            bordered
            size="small"
            labelStyle={{ width: 140 }}
            title={`Payment ID: ${paymentLink.id} - ${paymentLink.type === 'BILL' ? 'Bill' : 'Addition Fee'}`}
            items={detailPaymentItems(paymentLink)}
            className="mt-4"
          />
        ))}

        <Divider />
        <List
          header={<p className="text-lg font-bold text-neutral-700">Items Detail</p>}
          dataSource={billingDetail?.billDetails}
          renderItem={(item) => (
            <List.Item key={item.variantUuid}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.metadata.variantImage}
                    size={48}
                    shape="square"
                    className="shadow"
                  />
                }
                title={<p className="text-sm font-bold">{item.metadata.productName}</p>}
                description={item.metadata.variantName}
              />
            </List.Item>
          )}
        />
      </Drawer>
      <CreateBilling
        isOpen={isOpenCreateBillingDrawer}
        onClose={() => setIsOpenCreateBillingDrawer(false)}
      />
    </>
  )
}

export default BillingContent
