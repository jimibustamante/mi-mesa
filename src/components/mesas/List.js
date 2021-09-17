import { useState } from 'react'
import { Container } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'

import EditMesa from './Edit'
import MesaItem from './MesaListItem'
import { ReactComponent as AddIcon } from '../../images/add.svg'
import DeletePrompt from '../DeletePrompt'

const MesaList = ({ mesas, emptyMessage, createMesa }) => {
  const [editId, setEditId] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { deleteMesa } = useFlameLinkApp()

  const startEditing = (id) => {
    setEditId(id)
  }

  const deteteMesa = (id) => {
    setDeleteId(id)
    setShowDelete(true)
  }

  const onConfirmDelete = () => {
    deleteMesa(deleteId)
    setShowDelete(false)
  }

  return (
    <section className='mesas-container'>
      <DeletePrompt
        text='Ojo, estás eliminando una Mesa y todo su contenido'
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={onConfirmDelete} 
      />
      <EditMesa mesaId={editId} onCancel={() => setEditId(null)} onUpdate={() => setEditId(null)} />
      <Container fluid>
        <div className='mesa-list'>
          <div className='mesa-item add-mesa'>
            <div className='mesa-item shadow'>
              <div className='body' />
            </div>
            <div className='body'>
              <a className='create-mesa' href='#' onClick={() => createMesa()}>
                <AddIcon className='add-mesa-icon' />
              </a>
              <span className='title'>Crea una nueva mesa</span>
              <span className='subtitle'>Suma participantes y arma tu mesa</span>
            </div>
          </div>
          {mesas.length > 0 && mesas.map(mesa => {
            return (
              <MesaItem
                key={mesa.id}
                mesa={mesa}
                onEdit={() => startEditing(mesa.id)}
                deleteMesa={() => deteteMesa(mesa.id)}
              />
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default MesaList
