'use client'
import { FC } from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  FormProps,
  Input,
  InputNumber,
  Row,
  Select,
  TreeSelect,
} from 'antd'
import { Plus } from 'lucide-react'

import { helper } from '@core/libs/helper'
import paymentService from '@core/services/payments'
import productService from '@core/services/product'

interface IItem {
  variantUuid: string
  quantity: number
  price: number
  metadata: {
    productName: string
    variantName: string
    variantImage: string
  }
}

interface ICreateBillingForm {
  paymentMethodId: number
  items: IItem[]
}

const CreateBilling: FC<{
  isOpen?: boolean
  onClose?: () => void
}> = ({ isOpen, onClose }) => {
  const { data } = productService.useGetAll(1, '')
  const [form] = Form.useForm<ICreateBillingForm>()

  const paymentMethods = Form.useWatch('paymentMethodId', form)
  const items = Form.useWatch('items', form)

  const isValidateItems = items?.every((item) => item?.variantUuid && item?.quantity && item?.price)

  const { mutateAsync: createBilling, isPending: isCreateBillingPending } =
    paymentService.useCreateBilling()

  const onFinish: FormProps<ICreateBillingForm>['onFinish'] = (values) => {
    createBilling(values).finally(() => {
      form.resetFields()
    })
  }

  return (
    <Drawer title="Create Billing" open={isOpen} width="60%" onClose={onClose}>
      <Form form={form} initialValues={{ items: [] }} onFinish={onFinish}>
        <Form.Item<ICreateBillingForm>
          label="Payment Method"
          name="paymentMethodId"
          initialValue={2}
        >
          <Select defaultValue={2}>
            {[
              {
                id: 1,
                name: 'COD Bill - Thanh toán bằng tiền mặt',
              },
              { id: 2, name: 'Thanh toán bằng mã QR' },
            ].map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <Row gutter={[16, 16]}>
              {fields.map((field) => (
                <Col key={field.key} span={24}>
                  <Card
                    size="small"
                    title={`Item ${field.name + 1}`}
                    extra={
                      <Button size="small" onClick={() => remove(field.name)}>
                        Remove
                      </Button>
                    }
                  >
                    <Form.Item<IItem[]> label="Product" name={[field.name, 'variantUuid']}>
                      <TreeSelect
                        showSearch
                        filterTreeNode={(input, option) =>
                          helper.searchString(option.title?.toString() ?? '', input)
                        }
                        treeData={
                          data
                            ?.filter((product) => !!product.variants.length)
                            .map((product) => ({
                              value: product.uuid,
                              title: product.name,
                              icon: <Plus size={16} />,
                              selectable: false,
                              children: product.variants.map((variant) => ({
                                value: variant.uuid,
                                title: `${product.name} - ${variant.name}`,
                              })),
                            })) ?? []
                        }
                        onChange={(value) => {
                          const oldData: IItem[] = form.getFieldValue('items')
                          const newData: IItem[] = oldData.map((item, index) => {
                            if (index === field.name) {
                              const product = data?.find((product) =>
                                product.variants.find((variant) => variant.uuid === value),
                              )
                              const variant = product?.variants.find(
                                (variant) => variant.uuid === value,
                              )
                              if (!product || !variant) return item
                              return {
                                ...item,
                                price: product.salePrice + variant.price,
                                metadata: {
                                  productName: product.name,
                                  variantImage: helper.getImageUrl(variant.image.imageUrl),
                                  variantName: variant.name,
                                },
                              }
                            }
                            return item
                          })
                          form.setFieldsValue({
                            items: newData,
                          })
                        }}
                      />
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item<IItem[]>
                          label="Quantity"
                          name={[field.name, 'quantity']}
                          initialValue={1}
                        >
                          <InputNumber
                            type="number"
                            placeholder="Quantity"
                            defaultValue={1}
                            min={1}
                            className="w-full"
                            onChange={(value) => {
                              const oldData: IItem[] = form.getFieldValue('items')
                              const newData: IItem[] = oldData.map((item, index) => {
                                if (index === field.name) {
                                  const product = data?.find((product) =>
                                    product.variants.find(
                                      ({ uuid }) => uuid === oldData[index].variantUuid,
                                    ),
                                  )
                                  const variant = product?.variants.find(
                                    (variant) => variant.uuid === oldData[index].variantUuid,
                                  )
                                  if (!product || !variant) return item
                                  return {
                                    ...item,
                                    quantity: value ?? 1,
                                    price: product.salePrice + variant.price,
                                  }
                                }
                                return item
                              })
                              form.setFieldsValue({
                                items: newData,
                              })
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item<IItem[]> label="Price" name={[field.name, 'price']}>
                          <Input
                            readOnly
                            disabled
                            variant="filled"
                            type="number"
                            placeholder="Price"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
              <Col>
                <Button onClick={() => add()}>Add Item</Button>
              </Col>
            </Row>
          )}
        </Form.List>
        <Divider />
        <Button
          disabled={!paymentMethods || !items?.length || !isValidateItems}
          loading={isCreateBillingPending}
          type="primary"
          htmlType="submit"
          className="w-full"
        >
          Create Billing
        </Button>
      </Form>
    </Drawer>
  )
}

export default CreateBilling
