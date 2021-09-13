import { memo, useState } from 'react'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'

import { Button, Modal, Form } from 'react-bootstrap'

const NewParticipant = ({ mesa, onCreate , show, onClose }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { createRecord } = useFlameLinkApp()

  const handleSubmit = async (e) => {
    // TODO: Validate
    e.preventDefault()
    const newMesa = await createRecord('participante', {
      name,
      mesaId: mesa.id,
      email,
    })
    setName('')
    onCreate(newMesa)
  }

  return (
    <Modal show={show} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Participante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formParticipant">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formParticipant">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">Crear</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default memo(NewParticipant)
