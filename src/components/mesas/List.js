import { Container, Table } from 'react-bootstrap'
import { useMesaContext } from '../../contexts/MesaContext'

const MesaList = ({ mesas, emptyMessage }) => {
  const [mesaState] = useMesaContext()
  const { mesaTypes } = mesaState

  console.log({mesas})
  function mesaTypeName(mesaId) {
    let mesa = mesaTypes.find(mesa => mesa.id === mesaId)
    return mesa ? mesa.name : ''
  }
  return (
    <section className='mis-mesas'>
      <h3>Mis mesas</h3>
      <Container fluid>
        {mesas.length === 0 && (
          <p className='text-center'>{emptyMessage}</p>
        )}
        { mesas.length > 0 && (
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
                  console.log({mesa})
                  return (
                    <tr key={mesa.id} className='mesa-item'>
                      <td>{mesa.name}</td>
                      <td>{mesaTypeName(mesa.mesaType.id)}</td>
                      <td>10</td>
                      <td>-</td>
                    </tr>
                  )
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </section>
  )
}

export default MesaList
