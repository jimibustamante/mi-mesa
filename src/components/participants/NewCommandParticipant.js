import { memo, useState } from 'react'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { db } from '../../lib/firebaseApp'
import PhoneInput from 'react-phone-input-2'
import { ReactComponent as CloseModalIcon } from '../../images/close-modal.svg'
import { ReactComponent as SaveIcon } from '../../images/save-icon.svg'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'

const NewParticipant = ({ command, onCreate, show, onClose, participants }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errors, setErrors] = useState({})
  const { createRecord } = useFlameLinkApp()

  const valideteEmail = (email) => {
    const participantsEmail = participants.map(
      (participant) => participant.email
    )
    if (participantsEmail.includes(email)) {
      throw new Error(
        'Ya existe un participante con este email en este comando'
      )
    }
    // Validate email with regex
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(email).toLowerCase())) {
      throw new Error('Dirección de correo inválida')
    }
  }

  const handleSubmit = async (e) => {
    // TODO: Validate
    e.preventDefault()
    try {
      valideteEmail(email)
      const newParticipant = await createRecord('commandParticipant', {
        name,
        commandId: command.id,
        email,
        phone: phoneNumber,
        command: db().doc(`/fl_content/${command.id}`),
      })
      setName('')
      setEmail('')
      onCreate(newParticipant)
      onClose()
    } catch (error) {
      console.error(error)
      setErrors({ email: error.message })
    }
  }

  const disabled = !name || !email

  return (
    <Modal className='new-command-participant' show={show} onHide={onClose}>
      <CloseModalIcon className='close-modal' onClick={onClose} />
      <h2 style={{ marginBottom: '20px' }}>Nuevo Participante</h2>
      <span className='required'>* campos obligatorios</span>
      <Modal.Body>
        <Form autoComplete='off' onSubmit={handleSubmit}>
          <Form.Group
            as={Row}
            className='align-items-center'
            controlId='formParticipant'
          >
            <Form.Label column md='3'>
              Nombre y apellido <span className='required'>*</span>
            </Form.Label>
            <Col sm='9'>
              <Form.Control
                column
                md='9'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className='align-items-center'
            controlId='formParticipant'
          >
            <Form.Label column md='3'>
              Email <span className='required'>*</span>
            </Form.Label>
            <Col sm='9'>
              <Form.Control
                isInvalid={!!errors.email}
                column
                md='9'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <Form.Control.Feedback type='invalid'>
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='align-items-center' controlId='phone'>
            <Form.Label column md='3'>
              Teléfono:
            </Form.Label>
            <Col sm='9'>
              <PhoneInput
                country={'cl'}
                value={phoneNumber}
                placeholder='+56 912345678'
                onChange={(phone) => setPhoneNumber(phone)}
              />
            </Col>
          </Form.Group>
          <Row>
            <Col
              style={{
                marginTop: '30px',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <Button type='submit' disabled={disabled}>
                <SaveIcon className='save-icon' />
                Crear
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default memo(NewParticipant)
