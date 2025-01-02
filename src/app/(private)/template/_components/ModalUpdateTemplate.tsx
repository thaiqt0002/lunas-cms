import { useEffect, useState } from 'react'
import { Checkbox, Flex, Form, message, Modal, Select, Typography } from 'antd'
import { HttpStatusCode } from 'axios'

import { PAGE } from '@core/data/page'
import NestedForm from '@core/libs/external-component/json-edit'
import { TNestedForm } from '@core/libs/external-component/json-edit-type'
import { useStore } from '@core/libs/zustands'
import templateService from '@core/services/templates'
import { IBaseTemplate, IUpdateTemplate, IUpdateTemplateRequest } from '@core/types/template'

interface IProps {
  dataUpdate: IBaseTemplate
  isModalOpen: boolean
  handleUpdateForm: () => void
  handleCancel: () => void
}
interface IUpdateForm extends IUpdateTemplate {}
export default function ModalUpdateTemplate({
  dataUpdate,
  handleCancel,
  handleUpdateForm,
  isModalOpen,
}: IProps) {
  const [dataJson, setDataJson] = useState<TNestedForm>({})
  const layouts = useStore().use.layout()
  const products = useStore().use.products()
  const series = useStore().use.series()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: updateTemplate, isPending } = templateService.useUpdate()
  useEffect(() => {
    const { attributes, ...defaultData } = dataUpdate
    form.setFieldsValue(defaultData)
    setDataJson(JSON.parse(attributes))
  }, [dataUpdate])
  const setDefaultJson = (id: number) => {
    const layout = layouts.find((item) => item.id === id)
    if (!layout) return
    setDataJson(JSON.parse(layout.exampleData))
  }
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
  const handleSubmitForm = (value: IUpdateForm) => {
    const { isActive, ...valueRequest } = value
    const templateRequest: IUpdateTemplateRequest = {
      ...valueRequest,
      attributes: JSON.stringify(dataJson),
      isActive: isActive ?? 0,
      id: dataUpdate.id,
    }
    updateTemplate(templateRequest).then(async ({ error, statusCode }) => {
      if (statusCode > HttpStatusCode.BadRequest) {
        messageApi.error(error.desc)
        return
      }
      messageApi.success('Update template success')
      handleUpdateForm()
    })
  }
  const onCancel = () => {
    const { attributes, ...defaultData } = dataUpdate
    form.setFieldsValue(defaultData)
    setDataJson(attributes)
    handleCancel()
  }
  return (
    <Modal
      title="Update Template"
      open={isModalOpen}
      // onOk={handleCreateForm}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Update"
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
        <Form.Item<IUpdateForm>
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

        <Form.Item<IUpdateForm>
          label="Active"
          name="isActive"
          valuePropName="checked"
          labelCol={{
            span: 4,
          }}
        >
          <Checkbox checked={form.getFieldValue('isActive') === 1}></Checkbox>
        </Form.Item>
        <Form.Item<IUpdateForm>
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
