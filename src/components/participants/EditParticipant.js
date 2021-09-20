import { memo, useState, useEffect } from 'react'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { db } from '../../lib/firebaseApp'
import { ReactComponent as CloseModalIcon } from '../../images/close-modal.svg'
import { ReactComponent as SaveIcon } from '../../images/save-icon.svg'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'

const EditParticipant = ({ onUpdate , show, onClose, participant, participants }) => {
  const [name, setName] = useState(participant.name)
  const [email, setEmail] = useState(participant.email)
  const [errors, setErrors] = useState({})
  const { updateRecord } = useFlameLinkApp()

  const valideteEmail = (email) => {
    const repeatedEmail = participants.find(_participant => _participant.email === email && _participant.id !== participant.id)
    if (repeatedEmail) {
      throw new Error('Ya existe un participante con este email en esta mesa')
    }
    // Validate email with regex
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(email).toLowerCase())) {
      throw new Error('Dirección de correo inválida')
    }
  }

  const handleSubmit = async (e) => {
    // TODO: Validate
    e.preventDefault()
    try {
      valideteEmail(email)
      const updatedParticipant = await updateRecord('participante', participant.id, {
        name,
        email,
      })
      setName('')
      setEmail('')
      setErrors({})
      onUpdate(updatedParticipant)
      onClose()
      
    } catch (error) {
      console.error(error)
      setErrors({ email: error.message })
    }
  }

  useEffect(() => {
    setErrors({})
    if (show) {
      participant && setName(participant.name)
      participant && setEmail(participant.email)
    }
  }, [show])

  const disabled = !name || !email

  return (
    <Modal className='new-participant' show={show} onHide={onClose} >
      <CloseModalIcon className='close-modal' onClick={onClose} />
      <h2 style={{marginBottom: '20px'}}>Editar Participante</h2>
      <Modal.Body>
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <Form.Group as={Row} className="align-items-center" controlId="formParticipant">
            <Form.Label column md="3">Nombre y apellido</Form.Label>
            <Col sm="9">
              <Form.Control column md="9" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-center" controlId="formParticipant">
            <Form.Label column md="3">Email</Form.Label>
            <Col sm="9">
              <Form.Control isInvalid={!!errors.email} column md="9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
          <Row>
            <Col style={{marginTop: '30px', justifyContent: 'center', display: 'flex'}}>
              <Button type="submit" disabled={disabled}>
                <SaveIcon className='save-icon' />
                Actualizar
              </Button>
            </Col>
          </Row>
              
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default memo(EditParticipant)
