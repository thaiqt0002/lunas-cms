import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, message, Modal, Typography, Upload } from 'antd'
import { HttpStatusCode } from 'axios'

import { presignedUrl } from '@core/apis/presignedUrl'
import NestedForm from '@core/libs/external-component/json-edit'
import { TNestedForm } from '@core/libs/external-component/json-edit-type'
import layoutService from '@core/services/layouts'
import { ICreateLayout, ICreateLayoutRequest } from '@core/types/template'

interface IProps {
  isModalOpen: boolean
  handleCreateForm: () => void
  handleCancel: () => void
}
interface ICreateForm extends ICreateLayout {
  exampleImage: {
    file: File & { originFileObj: File }
    fileList: File[]
  }
}
export default function ModalCreateLayout({ isModalOpen, handleCreateForm, handleCancel }: IProps) {
  const [dataJSON, setDataJSON] = useState<TNestedForm>({})
  const [form] = Form.useForm<ICreateForm>()
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: createLayout, isPending } = layoutService.useCreate()
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
  const handleSubmitForm = (values: ICreateForm) => {
    const { name } = values
    const layoutRequest: ICreateLayoutRequest = {
      name,
      exampleData: JSON.stringify(dataJSON),
    }
    createLayout(layoutRequest).then(async ({ data, error, statusCode }) => {
      if (statusCode > HttpStatusCode.BadRequest) {
        messageApi.error(error.desc)
        return
      }
      await presignedUrl(data.preSignedUrl, values.exampleImage.file.originFileObj).then(() => {
        messageApi.open({
          type: 'success',
          content: 'Create image success',
        })
      })
      messageApi.success('Create layout success')
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
      onCancel={handleCancel}
      okText="Create"
      width={'100vw'}
      height={'80vh'}
      className="overflow-y-auto"
      confirmLoading={isPending}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleSubmitForm}
        className="flex size-full flex-col justify-start overflow-y-auto bg-slate-100 pt-6"
      >
        <Form.Item<ICreateForm> name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<ICreateForm> name="exampleImage" label="Example Image">
          <Upload listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Flex justify="center" align="center" className="mt-4 w-full">
          <Typography.Title level={5} className="mx-2">
            Example Data:
          </Typography.Title>
          <NestedForm data={dataJSON} setData={setDataJSON} />
        </Flex>
      </Form>
      {contextHolder}
    </Modal>
  )
}
