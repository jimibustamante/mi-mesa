import React, { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useUserContext } from '../../contexts/UserContext'
import Participant from '../../classes/participant'
import NewParticipant from './NewParticipant'

export default function Participants({mesa}) {
  const [participants, setParticipants] = useState([])
  const [fetched, setFetched] = useState(false)
  const [showNewParticipant, setShowNewParticipant] = useState(false)
  const [userState] = useUserContext()
  const { currentUser } = userState
  const { getContentBy, flamelinkApp } = useFlameLinkApp()

  const fetchParticipants = async () => {
    console.log(mesa.id)
    const participants = await getContentBy('participante', 'mesaId', mesa.id)
    debugger
    setParticipants(participants)
    setFetched(true)
    console.log({participants})
  }

  const subscribeParticipants = async () => {
    flamelinkApp.content.subscribe(
      {
        schemaKey: 'participante', 
        callback: (err, content) => {
          // TODO: handle error
          console.log('Fetch participant callback', {content})
          fetchParticipants()
        }
      }
    )
  }

  useEffect(() => {
    if (currentUser && !fetched) {
      fetchParticipants()
    }
  }, [currentUser, fetched])

  useEffect(() => {
    if (flamelinkApp)
      subscribeParticipants()
  }, [])

  const onCreateParticipant = (participant) => {
    console.log({participant})
  }

  return (
    <Container>
      <NewParticipant mesa={mesa} show={showNewParticipant} onCreate={onCreateParticipant} onClose={e => setShowNewParticipant(false)}/>
      <h3>Participantes</h3>
      {participants && participants.length === 0 && (
        <p className='empty-list'>Esta Mesa aun no tiene Participantes.</p>
      )}
      <Button variant='primary' onClick={e => setShowNewParticipant(true)}>+Participante</Button>
      {/* <Button onClick={() => setShowNewMesa(true)}>Crear mesa</Button> */}
    </Container>
  )
}
