import { useState } from 'react'
import { Button, Container, Table, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import EditMesa from './Edit'
import MesaItem from './MesaItem'
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
        {/* { mesas.length > 0 && (
          <Table striped bordered hover className='mesa-list'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Participantes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              { mesas.map((mesa) => {
                  return (
                    <tr key={mesa.id} className='mesa-item'>
                      <td>
                        <Link to={`/mesas/${mesa.id}`}>{mesa.name}</Link>
                      </td>
                      <td>{mesaTypeName(mesa.mesaType.id)}</td>
                      <td>10</td>
                      <td>
                        <span className='span-link' onClick={() => startEditing(mesa.id)}>Editar</span>
                      </td>
                    </tr>
                  )
              })}
            </tbody>
          </Table>
        )} */}
      </Container>
    </section>
  )
}

export default MesaList
