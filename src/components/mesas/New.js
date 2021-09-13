import { memo, useState, useEffect } from 'react'
import { db } from '../../lib/firebaseApp'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'

import { useUserContext } from '../../contexts/UserContext'
import { useMesaContext } from '../../contexts/MesaContext'
import { Button, Modal, Form } from 'react-bootstrap'

const NewMesa = ({ onCreate , show, onClose }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [userState] = useUserContext()
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const { createRecord, getTypes } = useFlameLinkApp()
  const { currentUser } = userState

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        console.log('Fetching TYPES')
        dispatch({ type: 'SET_MESA_TYPES', payload: types })
      })
    }
  }, [mesaTypes, dispatch])

  const handleSubmit = async (e) => {
    // TODO: Validate
    e.preventDefault()
    const selectedType = mesaTypes.find(mt => mt.name === type)
    if (!selectedType) return
    const newMesa = await createRecord('mesa', {
      name,
      userId: currentUser.uid,
      mesaType: db().doc(`/fl_content/${selectedType.id}`),
    })
    setName('')
    onCreate(newMesa)
  }

  return (
    <Modal show={show} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>Nueva Mesa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formMesa">
            <Form.Label>Nombre Mesa</Form.Label>
            <Form.Control type="text" placeholder="Nombre Mesa" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formMesaType">
            <Form.Label>Tipo Mesa</Form.Label>
            <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
              <option key='none' value=''></option>              
              {mesaTypes.map((_type) => (
                <option key={_type.id} value={_type.name}>{_type.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">Crear</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default memo(NewMesa)
