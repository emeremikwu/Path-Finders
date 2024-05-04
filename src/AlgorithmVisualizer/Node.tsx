import { PropsWithChildren } from 'react'

interface NodeProps {
  id: string | undefined
  endOfRow?: boolean
  endOfCol?: boolean
}

function Node(props: PropsWithChildren<NodeProps>) {
  const { id, children, endOfRow, endOfCol } = props

  
  const endOfRowClass = endOfRow ? " endOfRow" : ""
  const endOfColClass = endOfCol ? " endOfCol" : ""
  
  const nodeClass = `node${endOfRowClass}${endOfColClass}`
  
  return (
    <div className={nodeClass} id={id}>{children}</div>
  )
}

export default Node