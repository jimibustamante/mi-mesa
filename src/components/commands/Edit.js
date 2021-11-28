import React, { memo, useEffect, useState, useCallback } from 'react'
import { db } from '../../lib/firebaseApp'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'

import { useCommandContext } from '../../contexts/CommandContext'
import { Button, Modal, Form } from 'react-bootstrap'

function EditMesa({ commandId, onUpdate, onCancel }) {
  const [command, setCommand] = useState(null)
  const [type, setType] = useState('')
  const [name, setName] = useState('')

  const [commandState, dispatch] = useCommandContext()
  const { commandTypes } = commandState
  const { getCommandById, updateRecord } = useFlameLinkApp()

  const getMesa = useCallback(async () => {
    try {
      const command = await getCommandById(commandId)
      setCommand(command)
    } catch (error) {
      console.error(error)
    }
  }, [getCommandById, commandId])

  const onChange = (e) => {
    let { name, value } = e.target
    if (name === 'commandType') {
      value = commandTypes.find((type) => type.name === value)
    }
    setCommand({ ...command, [name]: value })
  }

  const handleSubmit = async (e) => {
    // TODO: validate
    e.preventDefault()
    const data = {
      name: command.name,
      commandType: db().doc(`/fl_content/${command.commandType.id}`),
    }
    const updatedRecord = await updateRecord('command', commandId, data)

    onUpdate()
  }

  useEffect(() => {
    if (!commandId) return
    getMesa()
  }, [commandId])

  function commandTypeName(typeId) {
    return commandTypes.find((ct) => ct.id === typeId).name
  }

  return command ? (
    <Modal show={commandId ? true : false} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{command.name || ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nombre Mesa'
              name='name'
              value={command.name}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group controlId='type'>
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as='select'
              name='commandType'
              value={commandTypeName(command.commandType.id)}
              onChange={onChange}
            >
              {commandTypes.map((_type) => (
                <option key={_type.id} value={_type.name}>
                  {_type.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant='primary' type='submit'>
            Actualizar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  ) : null
}

export default memo(EditMesa)
