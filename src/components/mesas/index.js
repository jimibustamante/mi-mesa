import React, { useEffect, useState } from 'react'
import { ReactComponent as MesasIcon } from '../../images/mesas.svg'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useUserContext } from '../../contexts/UserContext'
import { useMesaContext } from '../../contexts/MesaContext'
import NewMesa from './new/index'
import MesaList from './List'
import InfoOverlay from '../InfoOverlay'

import '../../styles/Mesas.scss'

export default function Mesas() {
  const [fetched, setFetched] = useState(false)
  const [showNewMesa, setShowNewMesa] = useState(false)
  const { flamelinkApp, getContent } = useFlameLinkApp()
  const [userState] = useUserContext()
  const [mesaState, dispatch] = useMesaContext()
  const { currentUser } = userState
  const { myMesas } = mesaState
  const history = useHistory()
  
  const fetchMyMesas = async () => {
    try {
      let content = await getContent('mesa')
      setFetched(true)
      if (!content) return
      content = Object.values(content)
      const mesas = content.filter((mesa) => mesa.userId === currentUser.id || mesa.userId === currentUser.uid)
      dispatch({type: 'SET_MY_MESAS', payload: mesas})
    } catch (error) {
      history.push('/sign-in')
      throw error
    }
  }

  const subscribeToMesas = async () => {
    flamelinkApp.content.subscribe(
      {
        schemaKey: 'mesa', 
        callback: (err, content) => {
          // TODO: handle error
          setFetched(true)
          if (err) console.error({err})
          if (!content) return
          content = Object.values(content)
          const mesas = content.filter((mesa) => mesa.userId === currentUser.id || mesa.userId === currentUser.uid)
          dispatch({type: 'SET_MY_MESAS', payload: mesas})
        }
      }
    )
  }

  useEffect(() => {
    if (flamelinkApp && myMesas.length === 0) {
      try {
        fetchMyMesas()
        subscribeToMesas()
      } catch (error) {
        history.push('/sign-in')
      }
    }
  }, [flamelinkApp])

  const onMesaCreated = (newMesa) => {
    console.debug({newMesa})
    setShowNewMesa(false)
  }

  if (currentUser) {
    return (
      <>
        <InfoOverlay />
        <NewMesa show={showNewMesa} onCreate={onMesaCreated} onClose={() => setShowNewMesa(false)} />
        <Container id='mesas' className='page-wrapper'>
        <Row className='content-head justify-content-md-between align-items-center'>
          <Col md={6}>
            <div className='title'>
              <MesasIcon />
              <h3>Mis mesas</h3>
            </div>
          </Col>
        </Row>
          <MesaList createMesa={() => setShowNewMesa(true)} mesas={myMesas} emptyMessage='No tienes mesas creadas aun' />
        </Container>
      </>
    )
  } else {
    return ''
  }
}
