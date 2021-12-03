import { useEffect, useState, useCallback } from 'react'
import { functions } from '../../lib/firebaseApp'
import { useParams, Link } from 'react-router-dom'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useCommandContext } from '../../contexts/CommandContext'
import { useUserContext } from '../../contexts/UserContext'
import { Container, Row, Col } from 'react-bootstrap'
import Participants from '../participants/CommandParticipants'
import DocsList from './DocsList'
import Events from './Events'
import Alert from '../Alert'

import { ReactComponent as CommandIcon } from '../../images/megafono_blue.svg'
import { ReactComponent as Arrow } from '../../images/arrow-left.svg'

export default function Show() {
  const { commandId } = useParams()
  const [showAlert, setShowAlert] = useState(false)
  const [showInvitationAlert, setShowInvitationAlert] = useState(false)
  const [commandState, dispatch] = useCommandContext()
  const [userState] = useUserContext()
  const { currentUser } = userState
  const { commandTypes } = commandState
  const [command, commandMesa] = useState(null)
  const { getCommandById, getCommandTypes } = useFlameLinkApp()

  const getCommand = useCallback(async () => {
    try {
      const command = await getCommandById(commandId)
      commandMesa(command)
      if (!command.calendarId) {
        setShowAlert(true)
        // functions().useEmulator('localhost', 5001)
        const createCommandCalendar = functions().httpsCallable(
          'createCommandCalendar'
        )
        const data = {
          commandId: command.id,
          commandName: command.name,
          userId: command.userId,
        }
        await createCommandCalendar(data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [getCommandById, commandId])

  const resendInvitation = async () => {
    try {
      // functions().useEmulator('localhost', 5001)
      const { email } = currentUser
      // const relateCommandCoordinator = functions().httpsCallable(
      //   'relateCommandCoordinator'
      // )
      // await relateCommandCoordinator()

      const resendInvitation = functions().httpsCallable('resendInvitation')
      const data = {
        calendarId: command.calendarId,
        email,
      }
      await resendInvitation(data)
      setShowInvitationAlert(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (commandTypes.length === 0) {
      getCommandTypes().then((types) => {
        dispatch({ type: 'SET_COMMAND_TYPES', payload: types })
      })
    }
  }, [commandTypes, dispatch])

  useEffect(() => {
    if (!commandId) return
    if (commandTypes.length > 0) getCommand()
  }, [commandId, commandTypes])

  return command ? (
    <Container id='show-command'>
      <Link to='/comandos' className='back-link'>
        <Arrow />
        <span className='back-link-text'> Volver a mis comandos</span>
      </Link>
      <Alert
        show={showAlert}
        onHide={() => setShowAlert(false)}
        message='Para que los eventos aparezcan en tu calendario, debes aceptar la invitación que llegó a tu correo.'
      />
      <Alert
        show={showInvitationAlert}
        onHide={() => setShowInvitationAlert(false)}
        message='La invitación fue reenviada correctamente.'
      />
      <Row
        style={{ marginBottom: '25px' }}
        md={12}
        className='show-mesa-header'
      >
        <Col md={2}>
          <CommandIcon className='show-mesa-header-icon' />
        </Col>
        <Col md={6}>
          <h2 className='name'>{command.name}</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Aquí está todo lo que necesitas para armar tu Comando Ciudadano. Por
            favor revisa el material que dispondes para hacer campaña. Si
            necesitas apoyo, no dudes en llámanos o escríbenos por Whatsapp al
            número{' '}
            <a
              href='https://api.whatsapp.com/send?phone=56933762034&text=Hola!'
              target='_blank'
              title='Contacto Whatsapp'
            >
              +56 9 3376 2034
            </a>
            .
          </p>
        </Col>
      </Row>
      <Participants command={command} />
      <DocsList command={command} commandTypes={commandTypes} />
      {command.calendarId && (
        <>
          <Events command={command} />
          <div className='resend-invitation-wrapper'>
            <span>
              Si no haz recibido aún la invitación o no puedes verlo
              correctamente, <b onClick={resendInvitation}>haz clic aquí</b>
            </span>
            <button
              className='btn resend-invitation'
              onClick={resendInvitation}
            >
              Enviar invitación
            </button>
          </div>
        </>
      )}
    </Container>
  ) : (
    // TODO: Here should be a loading component
    ''
  )
}
