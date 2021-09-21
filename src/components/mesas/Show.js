import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useMesaContext } from '../../contexts/MesaContext'
import { Container, Row, Col } from 'react-bootstrap'
import Participants from '../participants/Participants'
import DocsList from './DocsList'
import { ReactComponent as TableIcon } from '../../images/table.svg'

export default function Show() {
  const { mesaId } = useParams()
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const [mesa, setMesa] = useState(null)
  const { getMesaById, getTypes } = useFlameLinkApp()


  const getMesa = useCallback(async () => {
    try {
      const mesa = await getMesaById(mesaId)
      setMesa(mesa)
    } catch (error) {
      console.error(error)
    }
  }, [getMesaById, mesaId])

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        dispatch({ type: 'SET_MESA_TYPES', payload: types })
      })
    }
  }, [mesaTypes, dispatch])

  useEffect(() => {
    if (!mesaId) return
    if (mesaTypes.length > 0)
      getMesa()
  }, [mesaId, mesaTypes])

  return (
    mesa ? (
      <Container id='show-mesa'>
        <Row style={{marginBottom: '25px'}} md={12} className='show-mesa-header'>
          <Col md={2}>
            <TableIcon className='show-mesa-header-icon' />
          </Col>
          <Col md={6}>
            <h2 className='name'>{mesa.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Hola! Aquí está todo lo que necesitas para armar tu Mesa Ciudadana. 
              Por favor lee con cuidado los documentos metodológicos, revisa los videos tutoriales, 
              y revisa también las herramientas de tabulación de los resultados de tu Mesa Ciudadana. 
              Queremos que conozcas bien toda la información antes de iniciar el trabajo de tu mesa. 
              Si necesitas apoyo no dudes en escribirnos en mesasciudadanas@boricpresidente.cl
            </p>
          </Col>
        </Row>
        <Participants mesa={mesa} />
        <DocsList mesa={mesa} mesaTypes={mesaTypes} />
      </Container>
    ) : (
      // TODO: Here should be a loading component
      ''
    )
  )
}
