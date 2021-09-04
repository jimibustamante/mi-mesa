import React, { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import useFlameLinkApp from '../hooks/useFlamelinkApp'
import { useUserContext } from '../contexts/UserContext'

import '../styles/Mesas.scss'

const NewMesa = ({ onCreate }) => {
  const [name, setName] = useState('')
  const { user } = useUserContext()
  const { createRecord } = useFlameLinkApp()

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecord('mesas', {
      name,
      owner: user.uid,
    })
    setName('')
    onCreate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la mesa"
      />
      <button type="submit">Crear</button>
    </form>
  )
}

const ListaMesas = ({ mesas, emptyMessage }) => {
  return (
    <Container>
      {mesas.length > 0 ? (
        mesas.map((mesa) => (
          <div key={mesa.id}>
            <h3>{mesa.name}</h3>
          </div>
        ))) : (
          <p>{emptyMessage}</p>
        )}
    </Container>
  )
}

export default function Mesas() {
  const [misMesas, setMisMesas] = useState([])
  const [showNewMesa, setShowNewMesa] = useState(false)
  const { flamelinkApp, getContent } = useFlameLinkApp()
  const [userState] = useUserContext()
  const { currentUser } = userState

  const getElements = async () => {
    const content = await getContent('mesa')
    console.log({content})
  }

  useEffect(() => {
    if (flamelinkApp) {
      getElements()
      console.log({add: flamelinkApp.content.add})
    }
  }, [flamelinkApp, getElements])

  console.log({showNewMesa})

  if (currentUser) {
    const { displayName: name, email } = currentUser
    return (
      <Container id='mesas' className='page-wrapper'>
        <h1>Hola, {name || 'amigo'}</h1>

        <section className='mis-mesas'>
          <h2>Mis mesas</h2>
          <ListaMesas mesas={misMesas} emptyMessage='No tienes mesas creadas aun' />
        </section>

        <Button onClick={() => setShowNewMesa(true)}>Crear mesa</Button>
      </Container>
    )
  } else {
    return ''
  }
}
