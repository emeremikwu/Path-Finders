import { PropsWithChildren } from 'react'

import './Node.css'

interface NodeProps {
  id: string | undefined
}

function Node(props: PropsWithChildren<NodeProps>) {
  const { id, children } = props

  return (
    <div className='node' id={id}>{children}</div>
  )
}

export default Node