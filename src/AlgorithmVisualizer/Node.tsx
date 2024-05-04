import {ReactNode} from 'react'
import './Node.css'

function Node({children}: {children?: ReactNode}) {
  return (
    <div className='node'>{children}</div>
  )
}

export default Node