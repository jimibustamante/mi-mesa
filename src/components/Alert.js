import React from 'react'
import { ReactComponent as Icon } from '../images/alert-icon.svg'
import { Button, Modal, Container, Row, Col, Form } from 'react-bootstrap'

export default function Alert({ message, show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} className='alert-container'>
      <Modal.Body >

          <Icon className='alert-icon' />
          <p className='alert-text'>
            {message}
          </p>
          <button onClick={onHide} className='alert-button'>OK</button>

      </Modal.Body>
    </Modal>
  )
}
