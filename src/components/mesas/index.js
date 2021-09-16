import React, { useEffect, useState } from 'react'

import { ReactComponent as EditIcon } from '../../images/edit.svg'
import { ReactComponent as AddIcon } from '../../images/add.svg'
import { ReactComponent as MesasIcon } from '../../images/mesas.svg'

import { Container, Button, Row, Col } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useUserContext } from '../../contexts/UserContext'
import { useMesaContext } from '../../contexts/MesaContext'
import NewMesa from './New'
import MesaList from './List'

import '../../styles/Mesas.scss'

export default function Mesas() {
  const [fetched, setFetched] = useState(false)
  const [showNewMesa, setShowNewMesa] = useState(false)
  const { flamelinkApp, getContent } = useFlameLinkApp()
  const [userState] = useUserContext()
  const [mesaState, dispatch] = useMesaContext()
  const { currentUser } = userState
  const { myMesas } = mesaState
  
  const fetchMyMesas = async () => {
    let content = await getContent('mesa')
    console.log('Fetched', {content})
    setFetched(true)
    if (!content) return
    content = Object.values(content)
    const mesas = content.filter((mesa) => mesa.userId === currentUser.id || mesa.userId === currentUser.uid)
    dispatch({type: 'SET_MY_MESAS', payload: mesas})
  }

  const subscribeToMesas = async () => {
    flamelinkApp.content.subscribe(
      {
        schemaKey: 'mesa', 
        callback: (err, content) => {
          // TODO: handle error
          console.log('Fetch callback', {content})
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
      fetchMyMesas()
      subscribeToMesas()
    }
  }, [flamelinkApp])

  const onMesaCreated = (newMesa) => {
    console.debug({newMesa})
    setShowNewMesa(false)
  }

  if (currentUser) {
    const { displayName: name, email } = currentUser
    return (
      <>
        <NewMesa show={showNewMesa} onCreate={onMesaCreated} onClose={() => setShowNewMesa(false)} />
        <Container id='mesas' className='page-wrapper'>
        <Row className='content-head justify-content-md-between align-items-center'>
          <Col md={6}>
            <div className='title'>
              <MesasIcon />
              <h3>Mis mesas</h3>
            </div>
          </Col>
          <Col md={6}>
            <div className='buttons'>
              <Button size='md' className='button secondary' variant='secondary'>
                <EditIcon className='icon' size='15' />Editar mis Mesas
              </Button>
              <Button onClick={() => setShowNewMesa(true)} size='md' className='button primary' variant='secondary'>
                <AddIcon className='icon' size={15} />Crear nueva mesa
              </Button>
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
