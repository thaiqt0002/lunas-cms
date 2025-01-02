'use client'
import { useState } from 'react'
import { Button, Card, Collapse, Divider, Flex, Typography } from 'antd'

import { IBaseTemplate } from '@core/types/template'

import ModalCreateLayout from './_components/ModalCreateLayout'
import ModalCreateTemplate from './_components/ModalCreateTemplate'
import TableLayout from './_components/TableLayout'
import TableTemplate from './_components/TableTemplate'

export default function Template() {
  const [isOpenTemplateModal, setIsOpenTemplateModal] = useState<boolean>(false)
  const [isOpenLayoutModal, setIsOpenLayoutModal] = useState<boolean>(false)
  const [cloneTemplate, setCloneTemplate] = useState<IBaseTemplate>()
  const onCloneTemplate = (template: IBaseTemplate) => {
    setCloneTemplate(template)
    setIsOpenTemplateModal(true)
  }
  const handleCreateTemplate = () => {
    setIsOpenTemplateModal(false)
  }
  const handleCancelTemplate = () => {
    setIsOpenTemplateModal(false)
  }
  const handleCreateLayout = () => {
    setIsOpenLayoutModal(false)
  }
  const handleCancelLayout = () => {
    setIsOpenLayoutModal(false)
  }
  return (
    <Card
      title={
        <Flex justify="space-between" align="center" className="mt-4 w-full">
          <Typography.Title level={4}>Template Page</Typography.Title>
        </Flex>
      }
      className="h-full overflow-y-auto shadow"
    >
      <Collapse
        size="large"
        items={[
          {
            key: '1',
            label: (
              <Flex justify="space-between" align="center" className="w-full">
                <Typography.Title level={4}>Layout Management</Typography.Title>
                <Button type="primary" onClick={() => setIsOpenLayoutModal(true)}>
                  Create
                </Button>
              </Flex>
            ),
            children: <TableLayout />,
          },
        ]}
      />
      <Divider orientation="left"></Divider>
      <Collapse
        size="large"
        items={[
          {
            key: '2',
            label: (
              <Flex justify="space-between" align="center" className="w-full">
                <Typography.Title level={4}>Template Management</Typography.Title>
                <Button type="primary" onClick={() => setIsOpenTemplateModal(true)}>
                  Create
                </Button>
              </Flex>
            ),
            children: <TableTemplate setCloneTemplate={onCloneTemplate} />,
          },
        ]}
      />
      <ModalCreateLayout
        handleCancel={handleCancelLayout}
        handleCreateForm={handleCreateLayout}
        isModalOpen={isOpenLayoutModal}
      />
      <ModalCreateTemplate
        handleCancel={handleCancelTemplate}
        handleCreateForm={handleCreateTemplate}
        isModalOpen={isOpenTemplateModal}
        dataClone={cloneTemplate}
      />
    </Card>
  )
}
