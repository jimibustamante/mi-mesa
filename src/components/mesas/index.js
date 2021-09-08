import React, { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useUserContext } from '../../contexts/UserContext'
import NewMesa from './New'
import MesaList from './List'

import '../../styles/Mesas.scss'

export default function Mesas() {
  const [fetched, setFetched] = useState(false)
  const [misMesas, setMisMesas] = useState([])
  const [showNewMesa, setShowNewMesa] = useState(false)
  const { flamelinkApp, getContent } = useFlameLinkApp()
  const [userState] = useUserContext()
  const { currentUser } = userState

  const fetchMisMesas = async () => {
    let content = await getContent('mesa')
    setFetched(true)
    if (!content) return
    content = Object.values(content)
    const mesas = content.filter((mesa) => mesa.user_id === currentUser.id)
    setMisMesas(mesas)
  }

  const subscribeToMesas = async () => {
    flamelinkApp.content.subscribe(
      {
        schemaKey: 'mesa', 
        callback: (err, content) => {
          // TODO: handle error
          setFetched(true)
          if (err) console.log({err})
          if (!content) return
          content = Object.values(content)
          const mesas = content.filter((mesa) => mesa.user_id === currentUser.id)
          setMisMesas(mesas)
        }
      }
    )
  }

  useEffect(() => {
    if (flamelinkApp && misMesas.length === 0) {
      subscribeToMesas()
      // fetchMisMesas()
      console.log({add: flamelinkApp.content.add})
    }
  }, [flamelinkApp])

  const onMesaCreated = (newMesa) => {
    console.log({newMesa})
    setShowNewMesa(false)
  }

  if (currentUser) {
    const { displayName: name, email } = currentUser
    return (
      <>
        <NewMesa show={showNewMesa} onCreate={onMesaCreated} onClose={() => setShowNewMesa(false)} />
        <Container id='mesas' className='page-wrapper'>
          <h1>Hola, {name || 'amige'}</h1>

          <MesaList mesas={misMesas} emptyMessage='No tienes mesas creadas aun' />

          <Button onClick={() => setShowNewMesa(true)}>Crear mesa</Button>
        </Container>
      </>
    )
  } else {
    return ''
  }
}
