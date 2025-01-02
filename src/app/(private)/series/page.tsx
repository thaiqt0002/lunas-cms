'use client'
import { useCallback, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  List,
  message,
  Modal,
  Typography,
  Upload,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { HttpStatusCode } from 'axios'
import { Edit2, Plus, Trash2Icon } from 'lucide-react'

import { presignedUrl } from '@core/apis/presignedUrl'
import { API_IMAGE_URL } from '@core/constants'
import { useStore } from '@core/libs/zustands'
import seriesService from '@core/services/series'
import { ICreateSeriesParams } from '@core/types/series'
interface ICreateForm extends ICreateSeriesParams {
  image: {
    file: File & { originFileObj: File }
    fileList: File[]
  }
}
export default function Page() {
  const [createForm] = useForm<ICreateForm>()
  const { mutateAsync: createMutation, isPending: isCreatePending } = seriesService.useCreate()
  const { mutateAsync: deleteMutation, isPending: isDeletePending } = seriesService.useDelete()
  const series = useStore().use.series()
  const [messageApi] = message.useMessage()

  const [enableCreateModal, setEnableCreateModal] = useState<boolean>(false)
  const [enableDeleteModal, setEnableDeleteModal] = useState<string | null>(null)

  const handleCreate = useCallback(() => {
    setEnableCreateModal((prev) => !prev)
  }, [])

  const handleDelete = useCallback((uuid: string | null) => {
    setEnableDeleteModal(uuid)
  }, [])

  const handleSubmit = useCallback(
    (params: ICreateForm) => {
      createMutation({
        name: params.name,
        description: params.description,
      }).then(async ({ data, statusCode }) => {
        if (statusCode < HttpStatusCode.BadRequest) {
          await presignedUrl(data.preSignedUrl, params.image.file.originFileObj).then(() => {
            messageApi.open({
              type: 'success',
              content: 'Create image success',
            })
          })
          messageApi.open({
            type: 'success',
            content: 'Create series success',
          })
          createForm.resetFields()
        }
      })
    },
    [createForm, messageApi, createMutation],
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
  }, [enableDeleteModal, deleteMutation, messageApi])

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Typography.Title
            level={5}
            style={{
              color: '#6C70F0',
            }}
          >
            Trang Series
          </Typography.Title>
          <Button type="primary" onClick={handleCreate} icon={<Plus size={16} />} />
        </Flex>
      }
      className="h-full overflow-y-auto shadow"
    >
      <List
        dataSource={series}
        renderItem={({ uuid, name, description, image }) => (
          <List.Item
            key={uuid}
            actions={[
              <Button key={0} icon={<Edit2 size={16} />} />,
              <Button
                key={1}
                danger
                icon={<Trash2Icon size={16} />}
                onClick={() => handleDelete(uuid)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={48}
                  src={`${API_IMAGE_URL}/${image}`}
                  className="border border-zinc-400"
                />
              }
              title={<p className="font-semibold text-zinc-700">{name}</p>}
              description={<p className="line-clamp-2 text-sm text-zinc-500">{description}</p>}
            />
          </List.Item>
        )}
      />
      <Modal
        title="Create Series"
        open={enableCreateModal}
        onCancel={handleCreate}
        onOk={createForm.submit}
        confirmLoading={isCreatePending}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={createForm}
          onFinish={handleSubmit}
        >
          <Form.Item<ICreateSeriesParams> label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<ICreateSeriesParams> label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload listType="picture-card">
              <Button type="text" className="flex h-fit flex-col">
                <Plus />
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Delete Series"
        open={!!enableDeleteModal}
        onOk={() => handleDeleteConfirm()}
        onCancel={() => setEnableDeleteModal(null)}
        confirmLoading={isDeletePending}
      />
    </Card>
  )
}
