import { ReactComponent as NextIcon } from '../../../images/next_blue.svg'
import React from 'react'

export default function Next({ onNext }) {
  const styles = {
    position: 'absolute',
    bottom: '0',
    right: '0',
    cursor: 'pointer',
  }
  return (
    <div style={styles}>
      <NextIcon onClick={onNext} />
    </div>
  )
}
