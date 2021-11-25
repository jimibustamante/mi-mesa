import { useState } from 'react'
import { Container } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'

import EditCommand from './Edit'
import CommandItem from './CommandListItem'
import { ReactComponent as AddIcon } from '../../images/add.svg'
import DeletePrompt from '../DeletePrompt'

const CommandList = ({ commands, createCommand }) => {
  const [editId, setEditId] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { deleteCommand } = useFlameLinkApp()

  const startEditing = (id) => {
    setEditId(id)
  }

  const deleteAttempt = (id) => {
    setDeleteId(id)
    setShowDelete(true)
  }

  const onConfirmDelete = () => {
    deleteCommand(deleteId)
    setShowDelete(false)
  }

  return (
    <section className='mesas-container'>
      <DeletePrompt
        text='Ojo, estás eliminando un Comando y todo su contenido'
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={onConfirmDelete}
      />
      <EditCommand
        mesaId={editId}
        onCancel={() => setEditId(null)}
        onUpdate={() => setEditId(null)}
      />
      <Container fluid>
        <div className='mesa-list'>
          <div className='mesa-item add-mesa'>
            <div className='body'>
              <a
                className='create-mesa'
                href='#'
                onClick={() => createCommand()}
              >
                <AddIcon className='add-mesa-icon' />
              </a>
              <span className='title'>Crea un nuevo comando</span>
              <span className='subtitle'>
                Suma participantes y accede al material de campaña
              </span>
            </div>
          </div>
          {commands.length > 0 &&
            commands.map((command) => {
              return (
                <CommandItem
                  key={command.id}
                  command={command}
                  onEdit={() => startEditing(command.id)}
                  deleteCommand={() => deleteAttempt(command.id)}
                />
              )
            })}
        </div>
      </Container>
    </section>
  )
}

export default CommandList
