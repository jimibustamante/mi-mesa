import React, { useState } from 'react'
import { functions } from '../../lib/firebaseApp'
import { Modal, Form, Button } from 'react-bootstrap'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ReactComponent as CloseModalIcon } from '../../images/close-modal.svg'
import Alert from '../Alert'

export default function Participate({mesa, show, onClose}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [alertMessage, setAlertMessage] = useState(null)

  // Validate email with regex
  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const invite = async (e) => {
    e?.preventDefault()
    try {
      const response = await functions().httpsCallable('createMesaParticipation')({
        name,
        email,
        phone,
        calendarId: mesa.calendarId,
        mesaId: mesa.id,
      })

      if (response.data.status === 200) {
        setAlertMessage('¡Has sido invitado a la Mesa! Pronto recibirás una invitación a tu correo')
      } else {
        throw new Error(response.data.message)
      }
      onClose()
    } catch (error) {
      console.log({error})
      setAlertMessage(error.message || 'No se ha podido crear la invitación.')
      onClose()
    }
  }

  const disabled = !name || !email || !phone
  return (
    <>
      <Alert message={alertMessage} show={!!alertMessage} onHide={() => setAlertMessage(null)} />
      <Modal size='md' className='participate-modal' show={show} onHide={onClose}>
        <CloseModalIcon className='close-modal' onClick={onClose} />
        <Modal.Body>
          <p>
            Ingresa tus datos para completar la inscripción a la mesa:
          </p>
          <Form autoComplete='off' onSubmit={invite}>
            <Form.Group controlId='name'>
              <Form.Label>Nombre:
                <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} />
              </Form.Label>
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email:
                <Form.Control type='email' value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Label>
            </Form.Group>
            <Form.Group controlId='phone'>
              <Form.Label>Teléfono:
                <PhoneInput
                  country={'cl'}
                  value={phone}
                  placeholder='+56 912345678'
                  onChange={(phone) => setPhone(phone)}
                />
              </Form.Label>
            </Form.Group>
            <Form.Group>
              <Button disabled={disabled} type='submit' className='btn'>
                Enviar
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
