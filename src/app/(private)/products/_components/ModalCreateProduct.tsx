import { memo, useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from 'antd'
import { HttpStatusCode } from 'axios'
import { CirclePlus, Plus, UploadIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

import { presignedUrl } from '@core/apis/presignedUrl'
import { ERRORS } from '@core/constants/errors'
import { COUNTRY } from '@core/data/country'
import { PRODUCT_STATUS } from '@core/data/status'
import { cn } from '@core/libs/classnames'
import { useStore } from '@core/libs/zustands'
import productService from '@core/services/product'
import settingsService from '@core/services/settings'
import variantService from '@core/services/variant'
import { ICreateProductParams } from '@core/types/product'
import { ICreateVariantParams } from '@core/types/variant'
interface IProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

interface Option {
  value: string
  label: string
  children?: Option[]
}

interface ITag {
  name: string
}

interface ICreateForm extends ICreateProductParams {
  thumbnail: {
    file: File & { originFileObj: File }
    fileList: File[]
  }
  variant: {
    name: string
    image: {
      file: File & { originFileObj: File }
      fileList: File[]
    }
    fee: number
    price: number
  }[]
  images: {
    file: File & { originFileObj: File }
    fileList: { originFileObj: File }[]
  }
}
function ModalCreateProduct({ handleCancel, handleOk, isModalOpen }: IProps) {
  const queryClient = useQueryClient()
  const { RangePicker } = DatePicker
  const [form] = Form.useForm<ICreateForm>()
  const [tagForm] = Form.useForm<ITag>()

  const { mutateAsync: createProduct, isPending: isCreateProductPending } =
    productService.useCreate()
  const { mutateAsync: createVariant, isPending: isCreateVariantPending } =
    variantService.useCreate()
  const { mutateAsync: createTag, isPending: isCreateTagPending } = settingsService.useCreateTag()

  const tags = useStore().use.tags()
  const series = useStore().use.series()
  const brands = useStore().use.brand()
  const listCategories = useStore().use.categories()

  const [messageApi, contextHolder] = message.useMessage()
  const [createTagModal, setCreateTagModal] = useState<boolean>(false)
  const [categories, setCategories] = useState<Option[]>([])

  const handleCreateVariant = useCallback(
    async (
      variant: {
        name: string
        image: {
          file: File & { originFileObj: File }
          fileList: File[]
        }
        uuid: string
        price: number
      }[],
      productUuid: string,
    ) => {
      const variantRequest: ICreateVariantParams = {
        productUuid,
        variants: variant.map((v) => ({
          name: v.name,
          fee: 0,
          uuid: v.uuid,
          price: +v.price,
        })),
      }
      await createVariant(variantRequest).then(async ({ data, statusCode, error }) => {
        if (statusCode >= HttpStatusCode.BadRequest) {
          const serverError = ERRORS.find((err) => err.code === error.message)
          messageApi.open({
            type: 'error',
            content: serverError
              ? serverError.message
              : 'Something went wrong, please try again later.',
          })
          return
        }
        if (!data) return

        await Promise.all(
          data.map(async (v) => {
            const variantIndex = variant.find(({ uuid }) => uuid == v.uuid)
            if (!variantIndex) return
            presignedUrl(v.presignedUrl, variantIndex.image.file.originFileObj).then(() => {
              messageApi.open({
                type: 'success',
                content: 'Create variant image success',
              })
            })
          }),
        )

        messageApi.open({
          type: 'success',
          content: 'Create variant success',
        })
      })
    },
    [createVariant, messageApi],
  )

  const handleSubmit = useCallback(
    ({
      brandUuid,
      categories,
      tags,
      seriesUuid,
      preorderDate,
      releaseDate,
      images,
      variant,
      thumbnail,
      ...params
    }: ICreateForm) => {
      const productUuid = uuidv4()
      const imagesRequest = images.fileList.map((image) => ({
        file: image.originFileObj,
        uuid: uuidv4(),
      }))

      createProduct({
        uuid: productUuid,
        name: params.name,
        description: params.description,
        originalPrice: params.originalPrice,
        salePrice: params.salePrice,
        quantity: params.quantity,
        country: params.country,
        status: params.status,
        priority: params.priority ?? 1,
        parentCategoryUuid: categories[0],
        subCategoryUuid: categories[1],
        seriesUuid: seriesUuid ?? undefined,
        brandUuid: brandUuid ?? undefined,
        exchangeRateId: params.exchangeRateId ?? undefined,
        preorderStartDate: preorderDate?.[0] ?? undefined,
        preorderEndDate: preorderDate?.[1] ?? undefined,
        releaseDate: releaseDate ?? undefined,
        tags: tags ?? undefined,
        images: imagesRequest.map((image) => image.uuid),
      }).then(async ({ data: { brandUrl, imageUrl }, statusCode, error }) => {
        if (statusCode >= HttpStatusCode.BadRequest) {
          const serverError = ERRORS.find(({ code }) => code === error.message)
          messageApi.open({
            type: 'error',
            content: serverError
              ? serverError.message
              : 'Something went wrong, please try again later.',
          })
          return
        }

        await presignedUrl(brandUrl, thumbnail.file.originFileObj).then(() => {
          messageApi.open({
            type: 'success',
            content: 'Create thumbnail image success',
          })
        })

        await Promise.all(
          imagesRequest.map(async (image) => {
            const imageUrlIndex = imageUrl.find(({ uuid }) => uuid === image.uuid)
            if (!imageUrlIndex) return
            await presignedUrl(imageUrlIndex.url, image.file).then(() => {
              messageApi.open({
                type: 'success',
                content: 'Create product image success',
              })
            })
          }),
        )

        messageApi.open({
          type: 'success',
          content: 'Create product success',
        })

        if (!variant) {
          form.resetFields()
          handleOk()
          return
        }
        const formattedVariant = variant.map((variant) => ({
          ...variant,
          uuid: uuidv4(),
        }))
        await handleCreateVariant(formattedVariant, productUuid)

        form.resetFields()
        handleOk()

        await queryClient.invalidateQueries({
          queryKey: ['GET_PRODUCTS'],
        })
      })
    },
    [createProduct, messageApi, handleCreateVariant, form, handleOk, queryClient],
  )

  const handleCreateForm = () => {
    form
      .validateFields()
      .then(() => {
        form.submit()
      })
      .catch(() => {
        messageApi.open({
          type: 'error',
          content: 'Please fill in all required fields',
        })
      })
  }

  const handleCreateTag = useCallback(
    ({ name }: ITag) => {
      createTag({ names: [name] }).then(({ statusCode, error }) => {
        if (statusCode < HttpStatusCode.BadRequest) {
          setCreateTagModal(false)
          tagForm.resetFields()
          return
        }
        messageApi.open({
          type: 'error',
          content: error.message,
        })
      })
    },
    [createTag, messageApi, tagForm],
  )

  useEffect(() => {
    if (listCategories.length > 0) {
      setCategories(
        listCategories.map(({ uuid, name, sub }) => ({
          value: uuid,
          label: name,
          children: sub.map(({ uuid, name }) => ({ value: uuid, label: name })),
        })),
      )
    }
  }, [listCategories])

  return (
    <Modal
      title="Add Product"
      open={isModalOpen}
      onOk={handleCreateForm}
      onCancel={handleCancel}
      okText="Create"
      width={'100vw'}
      className={cn(
        '[&_.ant-modal-content]:h-[calc(100vh-64px)]',
        '[&_.ant-modal-content]:bg-zinc-50',
        '[&_.ant-modal-content]:grid',
        '[&_.ant-modal-content]:grid-rows-[auto_1fr_auto]',
        '[&_.ant-modal-header]:bg-zinc-50',
        '[&_.ant-modal-header>.ant-modal-title]:pl-2',
        '[&_.ant-modal-header>.ant-modal-title]:pb-2',
        '[&_.ant-modal-header>.ant-modal-title]:border-b',
        '[&_.ant-modal-header>.ant-modal-title]:border-b-neutral-400',
        '[&_.ant-modal-body]:overflow-y-auto',
      )}
      style={{ top: 32 }}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        size="middle"
        onFinish={handleSubmit}
        className={cn(
          'max-w-[1028px]',
          'flex size-full flex-col justify-start rounded-lg',
          '[&_.ant-form-item-label]:font-semibold',
          '[&_.ant-form-item-label_label]:text-neutral-700',
        )}
      >
        <Card className="mb-4">
          <Form.Item<ICreateForm>
            label="Name"
            name="name"
            rules={[{ required: true }]}
            labelCol={{
              span: 2,
            }}
          >
            <Input placeholder="Product name" />
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Desc"
            name="description"
            rules={[{ required: true }]}
            labelCol={{
              span: 2,
            }}
          >
            <Input.TextArea rows={8} placeholder="Product description" />
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Thumbnail"
            name="thumbnail"
            labelCol={{
              span: 2,
            }}
          >
            <Upload.Dragger listType="picture" maxCount={1} accept="image/*">
              <div className="mb-4 flex w-full justify-center">
                <Button shape="circle" size="large" type="primary" className="ant-upload-drag-icon">
                  <Plus />
                </Button>
              </div>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data
                or other banned files.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Image"
            name="images"
            labelCol={{
              span: 2,
            }}
          >
            <Upload listType="picture-card" accept="image/*">
              <Button type="text" className="flex h-fit flex-col">
                <Plus />
              </Button>
            </Upload>
          </Form.Item>
        </Card>

        <Card className="mb-4">
          <Row>
            <Col span={4}>
              <Form.Item<ICreateForm>
                label="O.Price"
                name="originalPrice"
                rules={[{ required: true }]}
                labelCol={{
                  span: 12,
                }}
              >
                <InputNumber min={1} max={100000000} changeOnWheel />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item<ICreateForm>
                label="S.Price"
                name="salePrice"
                rules={[{ required: true }]}
                labelCol={{
                  span: 14,
                }}
              >
                <InputNumber min={1} max={100000000} changeOnWheel />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<ICreateForm>
                label="Quantity"
                name="quantity"
                rules={[{ required: true }]}
                labelCol={{
                  span: 14,
                }}
              >
                <InputNumber min={1} max={100000000} changeOnWheel />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<ICreateForm>
            label="Category"
            name="categories"
            labelCol={{
              span: 2,
            }}
          >
            <Cascader options={categories} placeholder="Please select category" />
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Series"
            name="seriesUuid"
            labelCol={{
              span: 2,
            }}
          >
            <Select allowClear>
              {series &&
                series.map((serie, index) => (
                  <Select.Option key={index} value={serie.uuid}>
                    {serie.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Country"
            name="country"
            labelCol={{
              span: 2,
            }}
          >
            <Select allowClear>
              {COUNTRY.map((country, index) => (
                <Select.Option key={index} value={country.value}>
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        <Card className="mb-4">
          <Form.Item<ICreateForm>
            label="Status"
            name="status"
            labelCol={{
              span: 2,
            }}
          >
            <Select allowClear>
              {PRODUCT_STATUS.map((status, index) => (
                <Select.Option key={index} value={status.value}>
                  {status.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Tags"
            name="tags"
            labelCol={{
              span: 2,
            }}
            className="[&_.ant-form-item-control-input-content]:flex"
          >
            <Select
              mode="multiple"
              size={'middle'}
              placeholder="Please select"
              defaultValue={[]}
              style={{ width: '80%' }}
              optionFilterProp="label"
              options={
                tags &&
                tags.map((tag) => {
                  return {
                    value: tag.id,
                    label: tag.name,
                  }
                })
              }
              onChange={(value) => form.setFieldsValue({ tags: value })}
            />
            <Button
              type="text"
              icon={<Plus />}
              onClick={() => setCreateTagModal(true)}
              className="ml-2 h-full w-fit items-center justify-center"
            />
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Brand"
            name="brandUuid"
            labelCol={{
              span: 2,
            }}
          >
            <Select allowClear>
              {brands &&
                brands.map((brand, index) => (
                  <Select.Option key={index} value={brand.uuid}>
                    {brand.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Priority"
            name="priority"
            labelCol={{
              span: 2,
            }}
          >
            <InputNumber min={1} max={10} defaultValue={1} />
          </Form.Item>

          <Form.Item<ICreateForm>
            label="Order Date"
            name="preorderDate"
            labelCol={{
              span: 2,
            }}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item<ICreateForm>
            label="Release Date"
            name="releaseDate"
            labelCol={{
              span: 2,
            }}
          >
            <DatePicker />
          </Form.Item>
        </Card>

        <Card>
          <Form.List name="variant">
            {(fields, { add, remove }) => (
              <>
                <Flex className="mb-4 border-b pb-2">
                  <Button icon={<CirclePlus size={16} />} className="w-fit" onClick={() => add()}>
                    Add Variant
                  </Button>
                </Flex>
                {fields.map(({ key, name, ...restField }) => (
                  <Flex
                    key={key}
                    vertical
                    align="start"
                    gap={16}
                    className="w-full border-b pb-4 pt-2"
                  >
                    <Row align="middle" justify="start" className="w-full">
                      <Col span={11}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: 'Missing variant name' }]}
                          wrapperCol={{ span: 23 }}
                          className="mb-0 justify-start"
                        >
                          <Input placeholder="Name of variant" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          wrapperCol={{ span: 23 }}
                          className="mb-0"
                        >
                          <Input type="number" placeholder="Price of variant" min={0} />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <Button
                          danger
                          onClick={() => {
                            remove(name)
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>

                    <Form.Item
                      {...restField}
                      name={[name, 'image']}
                      rules={[{ required: true, message: 'Missing variant image' }]}
                      className="w-full"
                    >
                      <Upload listType="picture" maxCount={1}>
                        <Button icon={<UploadIcon size={12} />}>Upload (Max: 1)</Button>
                      </Upload>
                    </Form.Item>
                  </Flex>
                ))}
              </>
            )}
          </Form.List>
        </Card>
      </Form>

      <Modal
        title="Create Tag"
        open={createTagModal}
        onOk={tagForm.submit}
        onCancel={() => setCreateTagModal(false)}
        confirmLoading={isCreateTagPending}
      >
        <Form form={tagForm} onFinish={handleCreateTag}>
          <Form.Item<ITag>
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </Modal>
  )
}

export default memo(ModalCreateProduct)
