'use client'
import { useCallback, useDeferredValue, useState } from 'react'
import { Button, Card, Divider, Flex, Form, GetProps, Input, message, Modal } from 'antd'
import { HttpStatusCode } from 'axios'

import ProductTag from '@core/components/commons/tag'
import { helper } from '@core/libs/helper'
import { useStore } from '@core/libs/zustands'
import settingsService from '@core/services/settings'

type SearchProps = GetProps<typeof Input.Search>

interface ITagForm {
  name: string
}

export default function Page() {
  const tags = useStore().use.tags()
  const { mutateAsync, isPending } = settingsService.useCreateTag()
  const { mutateAsync: deleteMutation, isPending: isDeletePending } = settingsService.useDeleteTag()
  const [messageApi, contextHolder] = message.useMessage()
  const [enableDeleteModal, setEnableDeleteModal] = useState<number | null>(null)
  const [enableCreateModal, setEnableCreateModal] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const deferredSearch = useDeferredValue(searchValue)
  const [form] = Form.useForm<ITagForm>()

  const handleDelete = useCallback((id: number) => {
    setEnableDeleteModal(id)
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

  const handleCreate = useCallback(() => {
    setEnableCreateModal(true)
  }, [])

  const onSearch: SearchProps['onSearch'] = (value) => setSearchValue(value)

  const handleSubmit = useCallback(
    ({ name }: ITagForm) => {
      mutateAsync({ names: [name] }).then(({ statusCode, error }) => {
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
  return (
    <Card
      title="Tag Page"
      headStyle={{
        color: '#6C70F0',
      }}
      className="shadow"
    >
      <Input.Search
        placeholder="Search tags"
        width={'60%'}
        size="middle"
        enterButton={true}
        onSearch={onSearch}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Divider />
      <Flex wrap gap="8px 4px">
        {tags.map(({ id, name }) => {
          const isMatch = helper.searchString(name, deferredSearch)
          if (deferredSearch && !isMatch) return null
          return <ProductTag id={id} key={id} name={name} onClose={() => handleDelete(id)} />
        })}
      </Flex>
      <Divider />
      <Button type="primary" onClick={handleCreate}>
        New Tag
      </Button>
      <Modal
        title="Create Tag"
        open={enableCreateModal}
        onOk={form.submit}
        onCancel={() => setEnableCreateModal(false)}
        confirmLoading={isPending}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item<ITagForm>
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
        title="Delete Tag"
        open={!!enableDeleteModal}
        onOk={() => handleDeleteConfirm()}
        onCancel={() => setEnableDeleteModal(null)}
        confirmLoading={isDeletePending}
      />
      {contextHolder}
    </Card>
  )
}
