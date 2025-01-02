import { Descriptions, Divider, Drawer, Flex, Image, List, Tag, Typography } from 'antd'
import dayjs from 'dayjs'

import { API_IMAGE_URL } from '@core/constants'
import { cn } from '@core/libs/classnames'
import { IProductBase } from '@core/types/product'
interface DescriptionItemProps {
  title: string
  content: React.ReactNode
}
interface IProps {
  isOpenDrawer: boolean
  setIsOpenDrawer: (isOpenDrawer: boolean) => void
  product?: IProductBase
}
const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="flex flex-col">
    <p className="text-base font-bold">{title}:</p>
    <p className="pl-2">{content}</p>
  </div>
)
const DrawerProductDetail = ({ isOpenDrawer, setIsOpenDrawer, product }: IProps) => {
  return (
    <Drawer
      title="Product Detail"
      headerStyle={{
        color: '#6C70F0',
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
            children: product?.uuid,
            span: 3,
          },
          {
            key: '2',
            label: 'Name',
            children: product?.name,
            span: 1,
          },
          {
            key: '3',
            label: 'Thumbnail',
            children: (
              <Image
                className="rounded-lg border object-cover"
                width={200}
                src={`${API_IMAGE_URL}/${product?.thumbnail}`}
                alt="Product Thumbnail"
              />
            ),
            span: 3,
          },
          {
            key: '4',
            label: 'Description',
            children: <div className="whitespace-pre-wrap">{product?.description}</div>,

            span: 3,
          },
          {
            key: '5',
            label: 'Series',
            children: product?.series?.name,
            span: 3,
          },
          {
            key: '6',
            label: 'Category',
            children: product?.parentCategory?.name,
            span: 1,
          },
          {
            key: '7',
            label: 'Sub Category',
            children: product?.subCategory?.name,
            span: 2,
          },
          {
            key: '8',
            label: 'Status',
            children: <Tag color="green">{product?.status}</Tag>,
            span: 3,
          },
          {
            key: '9',
            label: 'Tags',
            children: (
              <Flex wrap gap="8px 0">
                {product?.tags &&
                  product?.tags.length > 0 &&
                  product?.tags.map((tag) => {
                    return (
                      <Tag color={'geekblue'} key={tag.id}>
                        {tag.name.toUpperCase()}
                      </Tag>
                    )
                  })}
              </Flex>
            ),
            span: 3,
          },
          {
            key: '10',
            label: 'Country',
            children: product?.country,
            span: 3,
          },
          {
            key: '11',
            label: 'Sale Price',
            children: Intl.NumberFormat('vi-VN').format(product?.salePrice ?? 0) + ' VND' || 'None',
            span: 3,
          },
          {
            key: '12',
            label: 'Original Price',
            children: Intl.NumberFormat('vi-VN').format(product?.originalPrice ?? 0) || 'None',
            span: 3,
          },
          {
            key: '13',
            label: 'Quantity',
            children: Intl.NumberFormat('vi-VN').format(product?.quantity ?? 0) || 'None',
            span: 3,
          },
          {
            key: '14',
            label: 'Pre-order Start Date',
            children: dayjs(product?.preorderStartDate?.toString()).format('DD/MM/YYYY') || 'None',
            span: 1,
          },
          {
            key: '15',
            label: 'Pre-order End Date',
            children: dayjs(product?.preorderEndDate?.toString()).format('DD/MM/YYYY') || 'None',
            span: 2,
          },
          {
            key: '16',
            label: 'Created At',
            children: dayjs(product?.createdAt?.toString()).format('DD/MM/YYYY') || 'None',
            span: 1,
          },
          {
            key: '17',
            label: 'Updated At',
            children: dayjs(product?.updatedAt?.toString()).format('DD/MM/YYYY') || 'None',
            span: 2,
          },
          {
            key: '18',
            label: 'Images',
            children: (
              <Flex wrap gap="12px">
                {product?.productImages &&
                  product?.productImages.length > 0 &&
                  product?.productImages.map((image, index) => {
                    return (
                      <Image
                        key={index}
                        width={120}
                        src={`${API_IMAGE_URL}/${image.imageUrl}`}
                        alt={product.name}
                        className="mr-2 rounded-lg border object-cover"
                      />
                    )
                  })}
              </Flex>
            ),
          },
        ]}
      />
      <Divider />
      <Typography.Title level={4}>Variants</Typography.Title>
      <List
        grid={{ gutter: 16, column: 4 }}
        itemLayout="horizontal"
        dataSource={product?.variants}
        renderItem={(variant) => (
          <List.Item>
            <List.Item.Meta
              title={variant.name}
              avatar={
                <Image
                  width={64}
                  height={64}
                  alt={variant.name}
                  src={`${API_IMAGE_URL}/${variant?.image.imageUrl}`}
                  className="aspect-square rounded-lg bg-slate-50 object-contain shadow"
                />
              }
              description={<p>Price: {variant.price}</p>}
            />
          </List.Item>
        )}
      />
      <Divider />
    </Drawer>
  )
}

export default DrawerProductDetail
