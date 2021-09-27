import React from 'react'
import { VscLoading } from 'react-icons/vsc'

export default function Loading() {
  return (
    <div id='loading'>
      <VscLoading className='spin' size={75} />
    </div>
  )
}
