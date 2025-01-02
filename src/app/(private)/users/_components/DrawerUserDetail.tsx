import { Descriptions, Drawer, Image } from 'antd'
import dayjs from 'dayjs'

import { API_IMAGE_URL } from '@core/constants'
import { cn } from '@core/libs/classnames'
import { IBaseUser } from '@core/types/user'

interface IProps {
  isOpenDrawer: boolean
  setIsOpenDrawer: (isOpenDrawer: boolean) => void
  user: IBaseUser
}

const DrawerUserDetail = ({ isOpenDrawer, setIsOpenDrawer, user }: IProps) => {
  const Array = [
    { int: 1, text: 'a' },
    { int: 2, text: 'b' },
    { int: 3, text: 'c' },
  ]

  return (
    <Drawer
      title="Product Detail"
      styles={{
        header: {
          color: '#6C70F0',
        },
      }}
      width={'80vw'}
      placement="right"
      onClose={() => setIsOpenDrawer(false)}
      open={isOpenDrawer}
      rootClassName={cn(
        '[&_.ant-drawer-content-wrapper]:mr-2',
        '[&_.ant-drawer-content-wrapper]:my-2',
      )}
      className="rounded-2xl"
    >
      <Descriptions
        title="Product Info"
        bordered
        items={[
          {
            key: '1',
            label: 'Uuid',
            children: user.uuid,
            span: 3,
          },
          {
            key: '2',
            label: 'Email',
            children: user.email,
            span: 1,
          },
          {
            key: '3',
            label: 'Avatar',
            children: (
              <Image
                className="rounded-lg border object-cover"
                width={200}
                src={`${API_IMAGE_URL}/${user.avatar}`}
                alt="Avatar"
              />
            ),
            span: 2,
          },
          {
            key: '3',
            label: 'Fullname',
            children: user.fullname,
            span: 3,
          },
          {
            key: '4',
            label: 'Username',
            children: user.username,
            span: 3,
          },
          {
            key: '5',
            label: 'Phone Number',
            children: user.phone,
            span: 3,
          },
          {
            key: '6',
            label: 'Sub Email',
            children: (
              <div className="flex flex-col gap-4">
                {user.emails
                  ? user.emails.map((item, index) => (
                      <Descriptions
                        key={index}
                        bordered
                        items={[
                          {
                            key: '1',
                            label: 'Email',
                            children: item.email,
                            span: 3,
                          },
                          {
                            key: '2',
                            label: 'Created At',
                            children: <p>{dayjs(item.createdAt).format('DD/MM/YYYY')}</p>,
                            span: 1,
                          },
                          {
                            key: '3',
                            label: 'Verified At',
                            children: <p>{dayjs(item.verifiedAt).format('DD/MM/YYYY')}</p>,
                            span: 1,
                          },
                        ]}
                      ></Descriptions>
                    ))
                  : null}
              </div>
            ),
            span: 3,
          },
          {
            key: '7',
            label: 'Custom Address',
            children: (
              <div className="flex flex-col gap-4">
                {user.customAddresses
                  ? user.customAddresses.map((item, index) => (
                      <Descriptions
                        bordered
                        key={index}
                        items={[
                          {
                            key: '1',
                            label: 'Fullname',
                            children: item.fullname,
                          },
                          {
                            key: '2',
                            label: 'Phone Number',
                            children: item.phoneNumber,
                          },
                          {
                            key: '3',
                            label: 'Ward Id',
                            children: item.wardId,
                          },
                          {
                            key: '4',
                            label: 'Street',
                            children: item.street,
                          },
                        ]}
                      ></Descriptions>
                    ))
                  : null}
              </div>
            ),
            span: 3,
          },
        ]}
      />
    </Drawer>
  )
}

export default DrawerUserDetail
