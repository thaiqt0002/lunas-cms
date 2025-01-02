import { JsonEditor } from 'json-edit-react'

import { TNestedForm } from './json-edit-type'
interface IProps {
  data: TNestedForm
  setData: (data: TNestedForm) => void
  className?: string
}
export default function NestedForm({ data, setData, className }: IProps) {
  return (
    <JsonEditor
      data={data}
      setData={setData}
      minWidth={'80%'}
      maxWidth={'100%'}
      defaultValue={''}
      rootName="data"
      showErrorMessages
      showCollectionCount
      theme={'monoDark'}
      className={className ?? ''}
    />
  )
}
