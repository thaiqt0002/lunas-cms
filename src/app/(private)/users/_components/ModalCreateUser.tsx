import { Form, Input, message, Modal, Select } from 'antd'
import { HttpStatusCode } from 'axios'

import userService from '@core/services/user'
import { ICreateUserParams } from '@core/types/user'

interface IProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

interface ICreateForm extends ICreateUserParams {}

export default function ModalCreateUser({ handleCancel, handleOk, isModalOpen }: IProps) {
  const [form] = Form.useForm<ICreateForm>()

  const { mutateAsync: createUser, isPending: isCreateUserPending } = userService.useCreate()

  const [messageApi, contextHolder] = message.useMessage()

  const handleSubmit = (params: ICreateForm) => {
    createUser({
      email: params.email,
      fullname: params.fullname,
      password: params.password,
      roleId: params.roleId,
      username: params.username,
    }).then(({ statusCode, error }) => {
      if (statusCode < HttpStatusCode.BadRequest) {
        handleOk()
        return
      }
      messageApi.open({
        type: 'error',
        content: error.desc,
      })
    })
  }

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
  return (
    <Modal
      title="Add User"
      open={isModalOpen}
      onOk={handleCreateForm}
      onCancel={handleCancel}
      okText="Create"
      width={'50vw'}
      height={'80vh'}
      className="overflow-y-auto"
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleSubmit}
        className="h-full overflow-y-auto"
      >
        <Form.Item<ICreateForm> label="Full Name" name="fullname" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item<ICreateForm> label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<ICreateForm> label="Username" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item<ICreateForm> label="Password" name="password" rules={[{ required: true }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item<ICreateForm> label="Role" name="roleId" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="1">Admin</Select.Option>
            <Select.Option value="2">User</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      {contextHolder}
    </Modal>
  )
}
