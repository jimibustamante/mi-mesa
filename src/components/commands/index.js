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
  const { flamelinkApp, flamelinkLoaded, getContent, updateRecord } =
    useFlameLinkApp()
  const [userState] = useUserContext()
  const [commandState, dispatch] = useCommandContext()
  const { currentUser } = userState
  const { myCommands } = commandState
  const history = useHistory()
  console.log({ myCommands })
  const fetchMyCommands = async () => {
    try {
      let content = await getContent('command')
      setFetched(true)
      if (!content) return
      content = Object.values(content)
      const commands = content.filter(
        (command) =>
          command.userId === currentUser.id ||
          command.userId === currentUser.uid
      )
      dispatch({ type: 'SET_MY_COMMANDS', payload: commands })
    } catch (error) {
      history.push('/sign-in')
      throw error
    }
  }

  const subscribeToMesas = async () => {
    flamelinkApp.content.subscribe({
      schemaKey: 'command',
      callback: (err, content) => {
        // TODO: handle error
        setFetched(true)
        if (err) console.error({ err })
        if (!content || !currentUser) return
        content = Object.values(content)
        const command = content.filter(
          (mesa) =>
            mesa?.userId === currentUser.id || mesa?.userId === currentUser.uid
        )
        dispatch({ type: 'SET_MY_COMMANDS', payload: command })
      },
    })
  }

  useEffect(() => {
    if (currentUser && flamelinkLoaded && !fetched) {
      try {
        fetchMyCommands()
        subscribeToMesas()
      } catch (error) {
        history.push('/sign-in')
      }
    }
  }, [flamelinkLoaded, myCommands, currentUser])

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
        message='En breve llegará a tu correo una invitación al calendario de tu mesa. Debes aceptarla antes de crear eventos.'
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
        <CommandList
          createCommand={() => setShowNewCommand(true)}
          commands={myCommands}
          emptyMessage='No tienes comandos creadas aun'
        />
      </Container>
    </>
  )
}
