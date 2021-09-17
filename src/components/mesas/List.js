import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import EditMesa from './Edit'
import MesaItem from './MesaListItem'
import { ReactComponent as AddIcon } from '../../images/add.svg'

const MesaList = ({ mesas, emptyMessage, createMesa }) => {
  const [editId, setEditId] = useState(null)

  const startEditing = (id) => {
    setEditId(id)
  }

  return (
    <section className='mesas-container'>
      <EditMesa mesaId={editId} onCancel={() => setEditId(null)} onUpdate={() => setEditId(null)} />
      <Container fluid>
        {mesas.length === 0 && (
          <p className='text-center'>{emptyMessage}</p>
        )}
        {mesas.length > 0 && (
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
            {mesas.map(mesa => {
              return (
                <MesaItem
                  key={mesa.id}
                  mesa={mesa}
                  onEdit={() => startEditing(mesa.id)}
                />
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}

export default MesaList
