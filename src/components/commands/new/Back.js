import { ReactComponent as PrevIcon } from '../../../images/prev_blue.svg'
import React from 'react'

export default function Back({ onBack }) {
  const styles = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    cursor: 'pointer',
  }
  return (
    <div style={styles}>
      <PrevIcon onClick={onBack} />
    </div>
  )
}
