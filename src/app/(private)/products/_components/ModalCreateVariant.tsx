import { FC } from 'react'
import { Button, Form, Input, message, Modal, Upload } from 'antd'
import { HttpStatusCode } from 'axios'
import { UploadIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

import { presignedUrl } from '@core/apis/presignedUrl'
import variantService from '@core/services/variant'
import { ICreateVariantParams } from '@core/types/variant'
interface ICreateForm {
  name: string
  fee: number
  price: number
  image: {
    file: File & { originFileObj: File }
    fileList: File[]
  }
}

interface IProps {
  productUuid: string
  isModalOpen: boolean
  onCancel: () => void
}
const ModalCreateVariant: FC<IProps> = ({ productUuid, isModalOpen, onCancel }) => {
  const { mutateAsync } = variantService.useCreate()
  const [form] = Form.useForm<ICreateForm>()
  const [messageApi, contextHolder] = message.useMessage()

  const handleSubmit = async (values: ICreateForm) => {
    const payload: ICreateVariantParams = {
      productUuid,
      variants: [
        {
          uuid: uuidv4(),
          name: values.name,
          fee: +values.fee || 0,
          price: +values.price || 0,
        },
      ],
    }
    const { statusCode, data, error } = await mutateAsync(payload)
    if (statusCode >= HttpStatusCode.BadRequest) {
      messageApi.open({
        type: 'error',
        content: error.message,
      })
    }

    await Promise.all(
      data.map(async (v) => {
        const variantIndex = payload.variants.find(({ uuid }) => uuid === v.uuid)
        if (!variantIndex) return

        presignedUrl(v.presignedUrl, values.image.file.originFileObj).then(() => {
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
    form.resetFields()
  }
  const handleCreateForm = () => {
    form.validateFields().then(() => {
      form.submit()
    })
  }
  return (
    <Modal title="Add variant" open={isModalOpen} onOk={handleCreateForm} onCancel={onCancel}>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item<ICreateForm>
          name="name"
          rules={[{ required: true, message: 'Missing variant name' }]}
          label="Name"
          labelCol={{ span: 3 }}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item<ICreateForm> name={'fee'} label="Fee" labelCol={{ span: 3 }}>
          <Input type="number" defaultValue={0} />
        </Form.Item>

        <Form.Item<ICreateForm> name={'price'} label="Price" labelCol={{ span: 3 }}>
          <Input type="number" defaultValue={0} min={0} />
        </Form.Item>

        <Form.Item<ICreateForm>
          name="image"
          rules={[{ required: true, message: 'Missing variant image' }]}
          className="w-full"
        >
          <Upload listType="picture-card" maxCount={1}>
            <Button icon={<UploadIcon />} />
          </Upload>
        </Form.Item>
        {contextHolder}
      </Form>
    </Modal>
  )
}

export default ModalCreateVariant
