import React, { memo, useEffect, useState, useCallback } from 'react'
import { db } from '../../lib/firebaseApp'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'

import { useMesaContext } from '../../contexts/MesaContext'
import { Button, Modal, Form } from 'react-bootstrap'

function EditMesa({mesaId, onUpdate, onCancel}) {
  const [mesa, setMesa] = useState(null)
  const [type, setType] = useState('')
  const [name, setName] = useState('')

  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const { getMesaById, updateRecord } = useFlameLinkApp()

  const getMesa = useCallback(async () => {
    try {
      const mesa = await getMesaById(mesaId)
      setMesa(mesa)
    } catch (error) {
      console.error(error)
    }
  }, [getMesaById, mesaId])

  const onChange = (e) => {
    let { name, value } = e.target
    if (name === 'mesaType') {
      value = mesaTypes.find(type => type.name === value)
    }
    setMesa({ ...mesa, [name]: value })
  }

  const handleSubmit = async (e) => {
    // TODO: validate
    e.preventDefault()
    const data = {
      name: mesa.name,
      mesaType: db().doc(`/fl_content/${mesa.mesaType.id}`),
    }
    const updatedRecord = await updateRecord('mesa', mesaId, data)
    console.log({updatedRecord})
    onUpdate()
  }

  useEffect(() => {
    console.log({mesaId})
    if(!mesaId) return
    getMesa()
  }, [mesaId])
    
  function mesaTypeName(typeId) {
    return mesaTypes.find(mt => mt.id === typeId).name
  }

  console.log({mesa})

  return (mesa ? (
    <Modal show={mesaId ? true : false} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{mesa.name || ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" placeholder="Nombre Mesa" name='name' value={mesa.name} onChange={onChange} />
          </Form.Group>
          <Form.Group controlId="type">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select" name='mesaType' value={mesaTypeName(mesa.mesaType.id)} onChange={onChange}>
              {mesaTypes.map((_type) => (
                <option key={_type.id} value={_type.name}>{_type.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">Actualizar</Button>
        </Form>
      </Modal.Body>
    </Modal>
  ) : null)
}

export default memo(EditMesa)
