import React, { useEffect, useState } from 'react'
import { ReactComponent as CommandIcon } from '../../images/megafono.svg'
import { functions } from '../../lib/firebaseApp'
import { useHistory } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useUserContext } from '../../contexts/UserContext'
import { useCommandContext } from '../../contexts/CommandContext'
import NewCommand from './new/index'
import CommandList from './List'
import Alert from '../Alert'
import Loading from '../Loading'

import '../../styles/Commands.scss'

export default function Commands() {
  const [fetched, setFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showNewCommand, setShowNewCommand] = useState(false)
  const [calendarAlert, setCalendarAlert] = useState(false)
  const { flamelinkLoaded, getUserCommands, updateRecord } = useFlameLinkApp()
  const [userState] = useUserContext()
  const [commandState, dispatch] = useCommandContext()
  const { currentUser } = userState
  const { myCommands } = commandState
  const history = useHistory()

  const fetchMyCommands = async () => {
    try {
      let content = await getUserCommands(currentUser.id || currentUser.uid)
      setFetched(true)
      if (!content) return
      const commands = Object.values(content)
      dispatch({ type: 'SET_MY_COMMANDS', payload: commands })
    } catch (error) {
      history.push('/sign-in')
      throw error
    }
  }

  useEffect(() => {
    if (currentUser && flamelinkLoaded && !fetched) {
      try {
        fetchMyCommands()
      } catch (error) {
        history.push('/sign-in')
      }
    }
  }, [flamelinkLoaded, currentUser, fetched])

  const onCommandCreated = async (newCommand) => {
    setShowNewCommand(false)
    setLoading(true)
    // functions().useEmulator('localhost', 5001)
    const createCommandCalendar = functions().httpsCallable(
      'createCommandCalendar'
    )
    const data = {
      commandId: newCommand.id,
      commandName: newCommand.name,
      userId: newCommand.userId,
    }
    const response = await createCommandCalendar(data)
    const calendarId = response.data.calendarId
    if (calendarId) {
      await updateRecord('command', newCommand.id, {
        calendarId,
      })
    }
    setLoading(false)
    setCalendarAlert(true)
  }

  return (
    <>
      <Alert
        show={calendarAlert}
        onHide={() => setCalendarAlert(false)}
        message='Hemos creado un calendario para este comando. Para activarlo debes aceptar la invitación de calendario que enviamos a tu correo.'
      />
      {loading && <Loading />}
      <NewCommand
        show={showNewCommand}
        onCreate={onCommandCreated}
        onClose={() => setShowNewCommand(false)}
      />
      <Container id='commands' className='page-wrapper'>
        <div className='content-head justify-content-md-between align-items-center'>
          <CommandIcon />
          <div className='title'>
            <h3>Comando Ciudadano</h3>
            <h2>Crea tu comando ciudadano con Gabriel</h2>
          </div>
        </div>
        <div className='text-container'>
          <p>
            Bienvenido a tu sesión de Comando Ciudadano. Aquí encontrarás
            algunas herramientas para hacer campaña como materiales gráficos
            para imprimir y redes sociales, además de manuales con información
            importante de cómo hacer campaña.
          </p>
          <p>
            Muy pronto te contactará un coordinador de nuestra campaña para
            crear un chat de Whatsapp al que puedan unirse más personas para
            participar de tu Comando Ciudadano. Si tienes cualquier duda
            llámanos o escríbenos por Whatsapp al número +56 9 3376 2034
          </p>
        </div>
        <CommandList
          createCommand={() => setShowNewCommand(true)}
          commands={myCommands}
          emptyMessage='No tienes comandos creadas aun'
        />
      </Container>
    </>
  )
}
