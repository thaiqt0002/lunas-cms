import { Tag } from 'antd'

interface IProps {
  id: number
  name: string
  onClose?: () => void
}
export default function ProductTag(props: IProps) {
  const { id, name, onClose } = props
  return (
    <Tag
      closable={true}
      bordered={true}
      color="#7CA3FF"
      className="select-none font-semibold"
      onClose={(e) => {
        e.preventDefault()
        onClose?.()
      }}
    >
      {name}
    </Tag>
  )
}
