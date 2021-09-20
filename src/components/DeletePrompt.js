import React from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import { ReactComponent as AddIcon } from '../images/warning.svg'
import { ReactComponent as CloseModalIcon } from '../images/close-modal.svg'

export default function DeletePrompt({show, onHide, onConfirm, text}) {
  
  return (
    <Modal size='md' className='delete-prompt' show={show} onHide={onHide}>
      <Modal.Body>
        <CloseModalIcon className='close-modal' onClick={onHide} />
        <Row className='justify-content-sm-center'>
          <Col className='text-center' xs={12}>
            <AddIcon />
          </Col>
        </Row>
        <Row className='justify-content-sm-center'>
          <Col xs={12}>
            <p className='text-center'>{text}</p>
          </Col>
        </Row>
        <Row className='justify-content-sm-center'>
          <Col xs={12}>
            <h3>¿Estás seguro?</h3>
          </Col>
        </Row>
        <Row className='justify-content-sm-center'>
          <Col xs={12} className='mesa-buttons'>
            <span className='mesa-button' onClick={onHide}>Cancelar</span>
            <button onClick={onConfirm}>eliminar</button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
