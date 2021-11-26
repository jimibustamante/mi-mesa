import React, { useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { VscLoading as LoadingIcon } from 'react-icons/vsc'
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed'
import { ReactComponent as EventsIcon } from '../../images/events-icon.svg'

import { functions } from '../../lib/firebaseApp'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterDateFns'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import '../../styles/CommandEvents.scss'

export default function Events({ command }) {
  const [startTime, setStartTime] = useState(null)
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)

  function embedSrc() {
    return `https://calendar.google.com/calendar/embed?wkst=1&bgcolor=%23ffffff&ctz=America%2FSantiago&src=${command.calendarId}&color=%23D81B60`
  }

  const createCommandEvent = async () => {
    setLoading(true)
    // functions().useEmulator('localhost', 5001)
    try {
      const _createCommandEvent =
        functions().httpsCallable('createCommandEvent')
      const { calendarId } = command
      const event = {
        summary: eventName,
        start: {
          dateTime: startTime || new Date().toISOString(),
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      }
      await _createCommandEvent({ calendarId, event, commandId: command.id })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setEventName('')
      setStartTime(null)
    }
  }

  const handleChange = (newValue) => {
    setStartTime(newValue)
  }

  const disabled = !eventName || !startTime
  console.log({ command })
  return (
    <section id='command-events'>
      <Row md={12} className='events-header'>
        <Col>
          <EventsIcon />
          <span className='events-title'>Eventos</span>
        </Col>
      </Row>
      <Row md={12}>
        <Col>
          <p>
            <b>Organiza la reunión de tu comando.</b>
          </p>
          <p>Organiza los eventos de tu comando ciudadano</p>
        </Col>
      </Row>
      <Form onSubmit={createCommandEvent} autoComplete='off'>
        <Form.Group as={Row}>
          <Form.Label column md='2'>
            Nombre evento:
          </Form.Label>
          <Col md='4'>
            <Form.Control
              type='text'
              name='event-name'
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column md='2'>
            Inicio:
          </Form.Label>
          <Col md='4' className='date-picker'>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DateTimePicker
                value={startTime}
                palceholder='Seleccione fecha y hora'
                toolbarPlaceholder='Seleccione fecha y hora'
                minDateTime={new Date()}
                minutesStep='5'
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Col>
        </Form.Group>
        <Row>
          <Col md='12'>
            <div className='command-buttons'>
              <Button disabled={disabled} onClick={createCommandEvent}>
                Crea tu evento
                {loading && <LoadingIcon className='loading-icon' />}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      <ResponsiveEmbed aspectRatio='4by3'>
        <div className='iframe-wrapper'>
          {command && command.calendarId && !loading && (
            <iframe
              src={embedSrc()}
              style={{ borderWidth: 0 }}
              width='800'
              height='600'
              scrolling='no'
            ></iframe>
          )}
        </div>
      </ResponsiveEmbed>
    </section>
  )
}
