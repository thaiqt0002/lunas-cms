'use client'

import { useCallback, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Tag } from 'antd'
import { HttpStatusCode } from 'axios'

import { useStore } from '@core/libs/zustands'
import settingsService from '@core/services/settings'

interface IBrandForm {
  name: string
}
export default function Page() {
  const [form] = Form.useForm<IBrandForm>()
  const brands = useStore().use.brand()
  const { mutateAsync, isPending } = settingsService.useCreateBrand()
  const [messageApi, contextHolder] = message.useMessage()
  const [enableCreateModal, setEnableCreateModal] = useState<boolean>(false)
  const { mutateAsync: deleteMutation, isPending: isDeletePending } =
    settingsService.useDeleteBrand()
  const [enableDeleteModal, setEnableDeleteModal] = useState<string | null>(null)

  const handleCreate = useCallback(() => {
    setEnableCreateModal((prev) => !prev)
  }, [])

  const handleSubmit = useCallback(
    ({ name }: IBrandForm) => {
      mutateAsync({ name: name }).then(({ statusCode, error }) => {
        if (statusCode < HttpStatusCode.BadRequest) {
          setEnableCreateModal(false)
          form.resetFields()
          return
        }
        messageApi.open({
          type: 'error',
          content: error.message,
        })
      })
    },
    [form, mutateAsync, messageApi],
  )
  const handleDelete = useCallback((uuid: string) => {
    setEnableDeleteModal(uuid)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!enableDeleteModal) return
    deleteMutation(enableDeleteModal).then(({ statusCode, error }) => {
      if (statusCode < HttpStatusCode.BadRequest) {
        setEnableDeleteModal(null)
        return
      }
      messageApi.open({
        type: 'error',
        content: error.desc,
      })
    })
  }, [enableDeleteModal, deleteMutation, messageApi])
  return (
    <Card
      title="Brands page"
      extra={
        <Button type="primary" onClick={() => handleCreate()}>
          Create
        </Button>
      }
      styles={{
        header: {
          color: '#6C70F0',
        },
      }}
      className="shadow"
    >
      {brands.map(({ uuid, name }) => (
        <Tag
          key={uuid}
          bordered={true}
          closable={true}
          color="#7CA3FF"
          className="select-none font-semibold"
          onClose={() => handleDelete(uuid)}
        >
          {name}
        </Tag>
      ))}
      <Modal
        title="Create Brand"
        open={enableCreateModal}
        onOk={form.submit}
        onCancel={() => setEnableCreateModal(false)}
        confirmLoading={isPending}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item<IBrandForm>
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
      <Modal
        title="Delete Brands"
        open={!!enableDeleteModal}
        onOk={() => handleDeleteConfirm()}
        onCancel={() => setEnableDeleteModal(null)}
        confirmLoading={isDeletePending}
      />
      {contextHolder}
    </Card>
  )
}
