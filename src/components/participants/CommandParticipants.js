import React, { useEffect, useState } from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useUserContext } from '../../contexts/UserContext'
import DeletePrompt from '../../components/DeletePrompt'
import NewParticipant from './NewCommandParticipant'
import EditParticipant from './EditParticipant'
import { ReactComponent as ParticipantIcon } from '../../images/participant.svg'
// import { ReactComponent as EmailIcon } from '../../images/mail_blue.svg'
import { ReactComponent as DeleteIcon } from '../../images/delete_blue.svg'

export default function CommandParticipants({ command }) {
  const [participants, setParticipants] = useState([])
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [fetched, setFetched] = useState(false)
  const [showNewParticipant, setShowNewParticipant] = useState(false)
  const [userState] = useUserContext()
  const { currentUser } = userState
  const { getContentBy, flamelinkApp, deleteCommandParticipant } =
    useFlameLinkApp()

  const fetchParticipants = async () => {
    const participants = await getContentBy(
      'commandParticipant',
      'commandId',
      command.id
    )
    setParticipants(participants)
    setFetched(true)
  }

  const subscribeParticipants = async () => {
    flamelinkApp.content.subscribe({
      schemaKey: 'commandParticipant',
      callback: (err, content) => {
        // TODO: handle error
        fetchParticipants()
      },
    })
  }

  useEffect(() => {
    if (currentUser && !fetched) {
      fetchParticipants()
    }
  }, [currentUser, fetched])

  useEffect(() => {
    if (flamelinkApp) subscribeParticipants()
  }, [])

  const onCreateParticipant = (participant) => {
    fetchParticipants()
  }

  const editParticipant = (participant) => {
    setEditingParticipant(participant)
    setShowEdit(true)
  }

  const deleteAttempt = (id) => {
    setDeleteId(id)
    setShowDelete(true)
  }

  const onConfirmDelete = async () => {
    await deleteCommandParticipant(deleteId)
    setShowDelete(false)
    fetchParticipants()
  }

  return (
    <Container id='command-participants-list'>
      <DeletePrompt
        text='Ojo, estás eliminando un participante de este comando'
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={onConfirmDelete}
      />
      {editingParticipant && (
        <EditParticipant
          onUpdate={onCreateParticipant}
          show={showEdit}
          participant={editingParticipant}
          participants={participants}
          onClose={(e) => setShowEdit(false)}
        />
      )}
      <NewParticipant
        command={command}
        participants={participants}
        show={showNewParticipant}
        onCreate={onCreateParticipant}
        onClose={(e) => setShowNewParticipant(false)}
      />
      <Row md={12} className='participants-header'>
        <Col>
          <ParticipantIcon />
          <span className='participants-title'>Participantes</span>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={8}>
          <div className='list-container'>
            {participants && participants.length === 0 && (
              <p className='empty-list'>Aún no hay participantes</p>
            )}
            {participants.length > 0 && (
              <ul className='list'>
                {participants.map((participant, index) => (
                  <li key={participant.id}>
                    <div className='name'>{participant.name}</div>
                    <div className='actions'>
                      {/* <div className='action'>
                        <EmailIcon />
                      </div> */}
                      <div
                        className='action'
                        onClick={() => deleteAttempt(participant.id)}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button
              variant='primary'
              onClick={(e) => setShowNewParticipant(true)}
            >
              + Sumar participantes
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
