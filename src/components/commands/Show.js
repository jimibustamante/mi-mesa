import { useEffect, useState, useCallback } from 'react'
import { functions } from '../../lib/firebaseApp'
import { useParams } from 'react-router-dom'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useCommandContext } from '../../contexts/CommandContext'
import { Container, Row, Col } from 'react-bootstrap'
import Participants from '../participants/CommandParticipants'
import DocsList from './DocsList'
import Events from './Events'
import Alert from '../Alert'

import { ReactComponent as CommandIcon } from '../../images/megafono_blue.svg'

export default function Show() {
  const { commandId } = useParams()
  const [showAlert, setShowAlert] = useState(false)
  const [commandState, dispatch] = useCommandContext()
  const { commandTypes } = commandState
  console.log({ commandTypes })
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
      // else {
      // functions().useEmulator('localhost', 5001)
      // const fillMesasTypeName = functions().httpsCallable('fillMesasTypeName')
      // await fillMesasTypeName()
      // const updateMesaEvent = functions().httpsCallable('updateMesaEvent')
      // const resp = await updateMesaEvent({commandId, start: new Date(2021, 10, 23, 18, 0)})
      // console.log({resp})
      // }
    } catch (error) {
      console.error(error)
    }
  }, [getCommandById, commandId])

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
      <Alert
        show={showAlert}
        onHide={() => setShowAlert(false)}
        message='Para que los eventos aparezcan en tu calendario, debes aceptar la invitación que llegó a tu correo.'
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
            necesitas apoyo no dudes en escribirnos a
            comandosciudadanos@boricpresidente.cl
          </p>
        </Col>
      </Row>
      <Participants command={command} />
      <DocsList command={command} commandTypes={commandTypes} />
      {command.calendarId && <Events command={command} />}
    </Container>
  ) : (
    // TODO: Here should be a loading component
    ''
  )
}
