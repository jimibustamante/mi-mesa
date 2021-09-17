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
  const { getContentBy, flamelinkApp, getFolderFiles, getFileUrl, getTypes } = useFlameLinkApp()


  const getMesa = useCallback(async () => {
    try {
      const mesa = await getContentBy('mesa', 'id', mesaId)
      console.log({mesa})
      setMesa(mesa)
    } catch (error) {
      console.error(error)
    }
  }, [getContentBy, mesaId])

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        console.log('Fetching TYPES')
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
        <Row md={12} className='show-mesa-header'>
          <Col md={2}>
            <TableIcon className='show-mesa-header-icon' />
          </Col>
          <Col md={6}>
            <h2 className='name'>{mesa.name}</h2>
          </Col>
        </Row>
        {/* <Participants mesa={mesa} /> */}
        <DocsList mesa={mesa} mesaTypes={mesaTypes} />
      </Container>
    ) : (
      // TODO: Here should be a loading component
      ''
    )
  )
}
