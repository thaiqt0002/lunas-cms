'use client'
import { Fragment, useCallback, useState } from 'react'
import {
  Button,
  Card,
  Collapse,
  Divider,
  Flex,
  Form,
  Input,
  List,
  message,
  Modal,
  Space,
  Typography,
} from 'antd'
import { HttpStatusCode } from 'axios'

import { useStore } from '@core/libs/zustands'
import settingsService from '@core/services/settings'
import { ICreateCategoryParams } from '@core/types/category'

export default function Page() {
  const categories = useStore().use.categories()
  const { mutateAsync: createMutation, isPending: isCreatePending } =
    settingsService.useCreateCategory()
  const { mutateAsync: deleteMutation, isPending: isDeletePending } =
    settingsService.useDeleteCategory()
  const [messageApi, contextHolder] = message.useMessage()
  const [selectedParent, setSelectedParent] = useState<string | null>(null)
  const [enableCreateModal, setEnableCreateModal] = useState<boolean>(false)
  const [enableCreateSubModal, setEnableCreateSubModal] = useState<boolean>(false)
  const [enableDeleteModal, setEnableDeleteModal] = useState<string | null>(null)
  const [createParentForm] = Form.useForm<ICreateCategoryParams>()
  const [createSubForm] = Form.useForm<ICreateCategoryParams>()

  const handleEnableCreateModal = useCallback(() => {
    setEnableCreateModal((prev) => !prev)
  }, [])

  const handleEnableCreateSubModal = useCallback((uuid: string | null) => {
    setEnableCreateSubModal((prev) => !prev)
    setSelectedParent(uuid)
  }, [])

  const handleEnableDeleteModal = useCallback((uuid: string | null) => {
    setEnableDeleteModal(uuid)
  }, [])

  const handleSubmit = useCallback(
    (params: ICreateCategoryParams) => {
      createMutation(params).then(({ statusCode, error }) => {
        if (statusCode < HttpStatusCode.BadRequest) {
          setEnableCreateModal(false)
          createParentForm.resetFields()
          return
        }
        messageApi.open({
          type: 'error',
          content: error.desc,
        })
      })
    },
    [createMutation, createParentForm, messageApi],
  )

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
  }, [deleteMutation, enableDeleteModal, messageApi])

  const handleSubSubmit = useCallback(
    (params: ICreateCategoryParams) => {
      if (!selectedParent) {
        return
      }
      createMutation({ ...params, parentUuid: selectedParent }).then(({ statusCode, error }) => {
        if (statusCode < HttpStatusCode.BadRequest) {
          setSelectedParent(null)
          setEnableCreateSubModal(false)
          createSubForm.resetFields()
          messageApi.open({
            type: 'success',
            content: 'Sub category created',
          })
          return
        }
        messageApi.open({
          type: 'error',
          content: error.message,
        })
      })
    },
    [createMutation, createSubForm, messageApi, selectedParent],
  )

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <h1>Categories</h1>
          <Button type="primary" onClick={handleEnableCreateModal}>
            Create
          </Button>
        </div>
      }
      className="h-full overflow-y-auto shadow"
      styles={{
        header: {
          color: '#6C70F0',
        },
      }}
    >
      <Space direction="vertical" className="w-full" size="middle">
        {categories.map(({ uuid, name, sub, description }) => (
          <Collapse
            key={uuid}
            size="small"
            className="line-clamp-2 border border-indigo-600 bg-indigo-50"
            items={[
              {
                key: uuid,
                label: (
                  <Fragment>
                    <Flex align="start" vertical className="*:mb-0">
                      <Typography.Paragraph className="font-bold text-indigo-700">
                        {name}
                      </Typography.Paragraph>
                      <Typography.Paragraph
                        type="secondary"
                        className="line-clamp-2 text-sm text-indigo-400"
                      >
                        {description}
                      </Typography.Paragraph>
                    </Flex>
                  </Fragment>
                ),
                children: (
                  <Fragment>
                    <List
                      dataSource={sub}
                      renderItem={(item) => (
                        <List.Item
                          className="px-4"
                          actions={[
                            <Button key={1} size="small" type="default">
                              Edit
                            </Button>,
                            <Button
                              key={2}
                              size="small"
                              type="default"
                              danger
                              onClick={() => handleEnableDeleteModal(item.uuid)}
                            >
                              Delete
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <p className="text-sm font-semibold text-zinc-600">{item.name}</p>
                            }
                            description={
                              <p className="text-xs text-zinc-400">{item.description}</p>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <Divider />
                    <Flex justify="end" gap={16}>
                      <Button type="default" onClick={() => handleEnableDeleteModal(uuid)}>
                        Delete
                      </Button>
                      <Button type="primary" onClick={() => handleEnableCreateSubModal(uuid)}>
                        Create
                      </Button>
                    </Flex>
                  </Fragment>
                ),
              },
            ]}
          />
        ))}
      </Space>
      <Modal
        title="Create Parent Category"
        open={enableCreateModal}
        onCancel={handleEnableCreateModal}
        onOk={createParentForm.submit}
        confirmLoading={isCreatePending}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={createParentForm}
          onFinish={handleSubmit}
        >
          <Form.Item<ICreateCategoryParams>
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 3, message: 'Name must be at least 3 characters' },
              { max: 255, message: 'Name must be at most 255 characters' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<ICreateCategoryParams>
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create Sub Category"
        open={enableCreateSubModal}
        onCancel={() => handleEnableCreateSubModal(null)}
        onOk={createSubForm.submit}
        confirmLoading={isCreatePending}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={createSubForm}
          onFinish={handleSubSubmit}
        >
          <Form.Item<ICreateCategoryParams>
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 3, message: 'Name must be at least 3 characters' },
              { max: 255, message: 'Name must be at most 255 characters' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ICreateCategoryParams>
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Category"
        open={!!enableDeleteModal}
        onCancel={() => handleEnableDeleteModal(null)}
        onOk={handleDeleteConfirm}
        confirmLoading={isDeletePending}
      />
      {contextHolder}
    </Card>
  )
}
