import { useEffect, useState } from 'react'
import { Checkbox, Flex, Form, message, Modal, Select, Typography } from 'antd'
import { HttpStatusCode } from 'axios'

import { PAGE } from '@core/data/page'
import NestedForm from '@core/libs/external-component/json-edit'
import { TNestedForm } from '@core/libs/external-component/json-edit-type'
import { useStore } from '@core/libs/zustands'
import templateService from '@core/services/templates'
import { IBaseTemplate, ICreateTemplate, ICreateTemplateRequest } from '@core/types/template'
interface IProps {
  isModalOpen: boolean
  handleCreateForm: () => void
  handleCancel: () => void
  dataClone?: IBaseTemplate
}
interface ICreateForm extends ICreateTemplate {}
export default function ModalCreateTemplate({
  handleCancel,
  handleCreateForm,
  isModalOpen,
  dataClone,
}: IProps) {
  const [dataJson, setDataJson] = useState<TNestedForm>({})
  const products = useStore().use.products()
  const series = useStore().use.series()
  const layouts = useStore().use.layout()
  const [form] = Form.useForm<ICreateForm>()
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: createTemplate, isPending } = templateService.useCreate()
  useEffect(() => {
    if (dataClone) {
      const { attributes, ...defaultData } = dataClone
      form.setFieldsValue(defaultData)
      setDataJson(JSON.parse(attributes))
    }
  }, [dataClone])
  const handleChangeProductSelect = async (value: string) => {
    const productClone = products.find(({ uuid }) => uuid === value)
    if (!productClone) return
    const textField = document.createElement('textarea')
    textField.innerText = JSON.stringify(productClone)
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    messageApi.success(`Copy ${productClone.name} to clipboard success`)
  }
  const handleChangeSeriesSelect = async (value: string) => {
    const seriesClone = series.find(({ uuid }) => uuid === value)
    if (!seriesClone) return
    const textField = document.createElement('textarea')
    textField.innerText = JSON.stringify(seriesClone)
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    messageApi.success(`Copy ${seriesClone.name} to clipboard success`)
  }
  const setDefaultJson = (id: number) => {
    const layout = layouts.find((item) => item.id === id)
    if (!layout) return
    setDataJson(JSON.parse(layout.exampleData))
  }
  const onCancelModal = () => {
    form.resetFields()
    setDataJson({})
    handleCancel()
  }
  const handleOk = () => {
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
  const handleSubmitForm = (value: ICreateForm) => {
    const { isActive, ...valueRequest } = value
    const templateRequest: ICreateTemplateRequest = {
      ...valueRequest,
      attributes: JSON.stringify(dataJson),
      priority: 0,
      isActive: isActive ?? 0,
    }
    createTemplate(templateRequest).then(async ({ error, statusCode }) => {
      if (statusCode > HttpStatusCode.BadRequest) {
        messageApi.error(error.desc)
        return
      }
      messageApi.success('Create template success')
      form.resetFields()
      handleCreateForm()
    })
  }
  return (
    <Modal
      title="Add Template"
      open={isModalOpen}
      // onOk={handleCreateForm}
      onOk={handleOk}
      onCancel={onCancelModal}
      okText="Create"
      width={'100vw'}
      height={'80vh'}
      className="overflow-y-auto"
    >
      <Flex justify="space-between" align="center" className="my-2 w-full">
        <Typography.Title level={5}>Copy Product</Typography.Title>
        <Select
          placeholder="Select product to copy"
          style={{ width: '50%' }}
          onChange={handleChangeProductSelect}
          showSearch
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={products.map((product) => ({
            label: product.name,
            value: product.uuid,
          }))}
        />
      </Flex>
      <Flex justify="space-between" align="center" className="my-2 w-full">
        <Typography.Title level={5}>Copy Series</Typography.Title>
        <Select
          placeholder="Select series to copy"
          style={{ width: '50%' }}
          onChange={handleChangeSeriesSelect}
          showSearch
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={series.map((ser) => ({
            label: ser.name,
            value: ser.uuid,
          }))}
        />
      </Flex>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleSubmitForm}
        className="flex size-full flex-col justify-start overflow-y-auto bg-slate-100 pt-6"
      >
        <Form.Item<ICreateForm>
          label="Page"
          name="page"
          labelCol={{
            span: 4,
          }}
        >
          <Select allowClear placeholder="Select page">
            {PAGE.map((page, index) => (
              <Select.Option key={index} value={page.value}>
                {page.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item<ICreateForm>
          label="Active"
          name="isActive"
          valuePropName="checked"
          labelCol={{
            span: 4,
          }}
        >
          <Checkbox></Checkbox>
        </Form.Item>
        <Form.Item<ICreateForm>
          label="Layout"
          name="layoutId"
          labelCol={{
            span: 4,
          }}
        >
          <Select allowClear placeholder="Select Layout" onChange={setDefaultJson}>
            {layouts.map((layout, index) => (
              <Select.Option key={index} value={layout.id}>
                {layout.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <NestedForm data={dataJson} setData={setDataJson} className="w-full" />
      {contextHolder}
    </Modal>
  )
}
