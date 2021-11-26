const functions = require('firebase-functions')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const admin = require('firebase-admin')

const firebaseApp = admin.initializeApp()
// const firebaseApp = admin.initializeApp(functions.config().firebase)

calendar = google.calendar('v3')
const db = admin.firestore()
const googleCredentials = require('./credentials.json')

const flamelink = require('flamelink/app')
require('flamelink/cf/content')

const flamelinkApp = flamelink({
  firebaseApp: firebaseApp,
  dbType: 'cf',
  isAdminApp: true,
})

const ERROR_RESPONSE = {
  status: 500,
  message: 'Error creating Google Calendar',
}

const getOAuth2Client = async () => {
  const oauth2Client = new OAuth2(
    googleCredentials.web.client_id,
    googleCredentials.web.client_secret,
    googleCredentials.web.redirect_uris[0]
  )

  oauth2Client.setCredentials({
    refresh_token: googleCredentials.refresh_token,
  })

  await oauth2Client.getAccessToken()
  return oauth2Client
}

const getUserEmail = async (uid) => {
  const user = await admin.auth().getUser(uid)
  return user.email
}

const getParticipantsEmail = async (id, key) => {
  const ref = db.collection('fl_content')
  return ref
    .where(key, '==', id)
    .get()
    .then((snapshot) => {
      let participants = snapshot.docs.map((doc) => doc.data())
      const emails = participants.map((participant) => participant.email)
      return emails
    })
    .catch((err) => {
      console.error(err)
    })
}

const aclResource = (auth, calendarId, role, scope) => {
  return {
    auth,
    calendarId,
    resource: {
      role,
      scope,
    },
  }
}

const createParticipantAcl = async (participant) => {
  const ref = db.collection('fl_content').doc(participant.mesaId)
  const doc = await ref.get()
  if (doc.exists) {
    const mesa = doc.data()
    const oauth2Client = await getOAuth2Client()
    return calendar.acl.insert(
      aclResource(oauth2Client, mesa.calendarId, 'reader', {
        type: 'user',
        value: participant.email,
      })
    )
  }
}

const deleteCalendar = async ({ calendarId }) => {
  try {
    const oauth2Client = await getOAuth2Client()
    return calendar.calendars.delete({
      auth: oauth2Client,
      calendarId,
    })
  } catch (error) {
    return ERROR_RESPONSE
  }
}

const createCalendar = async (data) => {
  console.info('********* START NEW CALENDAR *********')

  const { mesaId, mesaName, userId } = data
  const oauth2Client = await getOAuth2Client()
  const ownerEmail = await getUserEmail(userId)

  return calendar.calendars
    .insert({
      auth: oauth2Client,
      resource: {
        summary: 'Mesa Ciudadana',
        description: mesaName,
        timeZone: 'Chile/Continental',
      },
    })
    .then(async (_calendar) => {
      console.info(`********* CALENDAR CREATED: ${_calendar.data.id} *********`)
      await calendar.acl.insert(
        aclResource(oauth2Client, _calendar.data.id, 'owner', {
          type: 'user',
          value: ownerEmail,
        })
      )
      console.info('********* COORDINATOR ACL CREATED *********')
      await db.collection('fl_content').doc(mesaId).update({
        calendarId: _calendar.data.id,
      })
      console.info('********* MESA UPDATED *********')
      return {
        status: 200,
        message: 'Successfully created Google Calendar',
        calendarId: _calendar.data.id,
      }
    })
    .catch((error) => {
      console.error({ error })
      return ERROR_RESPONSE
    })
}

const createCommandCalendar = async (data) => {
  console.info('********* START NEW COMMAND CALENDAR *********')
  const { commandId, commandName, userId } = data
  console.log({ commandId, commandName, userId })
  const oauth2Client = await getOAuth2Client()
  const ownerEmail = await getUserEmail(userId)

  return calendar.calendars
    .insert({
      auth: oauth2Client,
      resource: {
        summary: commandName,
        description: commandName,
        timeZone: 'Chile/Continental',
      },
    })
    .then(async (_calendar) => {
      console.info(`********* CALENDAR CREATED: ${_calendar.data.id} *********`)
      await calendar.acl.insert(
        aclResource(oauth2Client, _calendar.data.id, 'owner', {
          type: 'user',
          value: ownerEmail,
        })
      )
      console.info('********* COORDINATOR ACL CREATED *********')
      await db.collection('fl_content').doc(commandId).update({
        calendarId: _calendar.data.id,
      })
      console.info('********* COMMAND UPDATED *********')
      return {
        status: 200,
        message: 'Successfully created Google Calendar',
        calendarId: _calendar.data.id,
      }
    })
    .catch((error) => {
      console.error({ error })
      return ERROR_RESPONSE
    })
}

const getCalendarEvents = async (calendarId, oauth2Client) => {
  if (!oauth2Client) {
    oauth2Client = await getOAuth2Client()
  }
  const response = await calendar.events.list({
    auth: oauth2Client,
    calendarId,
    orderBy: 'startTime',
    singleEvents: true,
    maxResults: 10,
    showDeleted: false,
  })
  const list = response.data.items
  return list
}

exports.getCalendarEvents = functions.https.onCall(async (data, context) => {
  return getCalendarEvents(data)
})

exports.createParticipantAcl = functions.https.onCall(async (data, context) => {
  createParticipantAcl(data)
})

exports.createCalendar = functions.https.onCall(async (data, context) => {
  return createCalendar(data)
})

exports.createCommandCalendar = functions.https.onCall(
  async (data, context) => {
    return createCommandCalendar(data)
  }
)

exports.updateMesaEvent = functions.https.onCall(async (data, context) => {
  const { mesaId, start } = data
  const response = await updateMesaEvent({ mesaId, start })
  return response
})

const updateMesaEvent = async ({ mesaId, start }) => {
  console.info(`********* START NEW EVENT: ${mesaId} *********`)

  const mesa = await flamelinkApp.content.get({
    schemaKey: 'mesa',
    entryId: mesaId,
    fields: ['id', 'events', 'name'],
    populate: {
      field: 'events',
      populate: ['id', 'start'],
    },
  })

  const startDate = new Date(start)
  const { events } = mesa
  console.info('********* EVENTS LENGTH => ', events?.length || events)
  if (!events || events.length === 0) {
    console.info('********* NO EVENTS *********')
    await flamelinkApp.content.update({
      schemaKey: 'mesa',
      entryId: mesaId,
      data: {
        nextEvent: new Date(0).toISOString(),
      },
    })
    return
  }
  const promises = events.map((event) => {
    return new Promise(async (resolve, reject) => {
      try {
        const eventData = await event.get()
        let { start } = eventData.data()
        resolve(new Date(start))
      } catch (error) {
        reject(error)
      }
    })
  })

  let dates = await Promise.all(promises)
  dates.push(startDate)
  dates = dates.filter((date) => date > new Date()).sort()
  const minDate = dates.length > 0 ? new Date(dates[0]) : startDate
  await flamelinkApp.content.update({
    schemaKey: 'mesa',
    entryId: mesaId,
    data: {
      nextEvent: minDate.toISOString(),
    },
  })
  return minDate.toISOString()
}

const updateCommandEvent = async ({ commandId, start }) => {
  console.info(`********* START NEW COMMAND EVENT: ${commandId} *********`)

  const command = await flamelinkApp.content.get({
    schemaKey: 'command',
    entryId: commandId,
    fields: ['id', 'events', 'name'],
    populate: {
      field: 'events',
      populate: ['id', 'start'],
    },
  })

  const startDate = new Date(start)
  const { events } = command
  console.info('********* EVENTS LENGTH => ', events?.length || events)
  if (!events || events.length === 0) {
    console.info('********* NO EVENTS *********')
    await flamelinkApp.content.update({
      schemaKey: 'command',
      entryId: commandId,
      data: {
        nextEvent: new Date(0).toISOString(),
      },
    })
    return
  }
  const promises = events.map((event) => {
    return new Promise(async (resolve, reject) => {
      try {
        const eventData = await event.get()
        let { start } = eventData.data()
        resolve(new Date(start))
      } catch (error) {
        reject(error)
      }
    })
  })

  let dates = await Promise.all(promises)
  dates.push(startDate)
  dates = dates.filter((date) => date > new Date()).sort()
  const minDate = dates.length > 0 ? new Date(dates[0]) : startDate
  console.log({ nextEvent: minDate.toISOString() })
  await flamelinkApp.content.update({
    schemaKey: 'command',
    entryId: commandId,
    data: {
      nextEvent: minDate.toISOString(),
    },
  })
  return minDate.toISOString()
}

exports.onNewEvent = functions.firestore
  .document('fl_content/{contentId}')
  .onCreate(async (snapshot, context) => {
    console.info(`********* NEW EVENT CALLBACK *********`)
    try {
      const { id, start, mesa, command, _fl_meta_ } = snapshot.data()
      console.log({ id, start, mesa, command, _fl_meta_ })
      if (_fl_meta_.schema === 'evento') {
        if (mesa) {
          const mesaData = await mesa.get()
          await updateMesaEvent({ mesaId: mesaData.id, start })
        }
        if (command) {
          const commandData = await command.get()
          await updateCommandEvent({ commandId: commandData.id, start })
        }
      }
    } catch (error) {
      console.error(error)
    }
  })

exports.onDeleteMesa = functions.firestore
  .document('fl_content/{contentId}')
  .onDelete(async (snapshot, context) => {
    try {
      const { id, calendarId, _fl_meta_ } = snapshot.data()
      if (_fl_meta_.schema === 'mesa' && calendarId) {
        console.info('********* DELETING CALENDAR *********')
        deleteCalendar({ calendarId })
      }
    } catch (error) {
      console.info('********* ERROR: DELETING CALENDAR *********', { error })
    }
  })

exports.createCalendarAll = functions.https.onCall(async (data, context) => {
  const oauth2Client = await getOAuth2Client()
  const ref = db.collection('fl_content')
  let query = ref.where('_fl_meta_.schema', '==', 'mesa')

  query
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const { id, name, email, _fl_meta_, calendarId, mesaId } = doc.data()
        if (_fl_meta_.schema === 'mesa' && !calendarId) {
          console.info('\n-- NO CALENDAR ASSIGNED --\n')
          calendar.calendars
            .insert({
              auth: oauth2Client,
              resource: {
                summary: 'Mesa Ciudadana',
                description: name,
                timeZone: 'Chile/Continental',
              },
            })
            .then(async (_calendar) => {
              await db.collection('fl_content').doc(id).update({
                calendarId: _calendar.data.id,
              })
              console.info('\n-- CALENDAR ID UPDATED --\n')
              await calendar.acl.insert(
                aclResource(oauth2Client, _calendar.data.id, 'owner', {
                  type: 'user',
                  value: email,
                })
              )
              console.info('\n-- COORDINATOR ACL CREATED --\n')
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
    })
    .catch((error) => {
      console.error({ error })
      return ERROR_RESPONSE
    })
})

exports.createEvent = functions.https.onCall(async (data, context) => {
  const { calendarId, event, mesaId } = data
  console.info('***** CREATING EVENT *****')

  try {
    const oauth2Client = await getOAuth2Client()
    if (!event.end) {
      event.end = {
        dateTime: event.start.dateTime,
      }
    }

    const participantsEmail = await getParticipantsEmail(mesaId, 'mesaId')
    event.attendees = participantsEmail.map((email) => ({
      email: email,
      responseStatus: 'needsAction',
    }))

    if (!calendarId) {
      console.info('***** NO CALENDAR CREATED YET *****')
    }

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      resource: event,
      visibility: 'public',
    })

    // Create new event in Flamelink
    const flEvent = await flamelinkApp.content.add({
      schemaKey: 'evento',
      data: {
        eventId: response?.data.id,
        start: new Date(event.start.dateTime).toISOString(),
        mesa: db.doc(`/fl_content/${mesaId}`),
      },
    })

    // Update the mesa's events in Flamelink
    const mesa = await flamelinkApp.content.getByField({
      schemaKey: 'mesa',
      field: 'id',
      value: mesaId,
      fields: ['events'],
    })
    let events = Object.values(mesa)[0].events
    if (!events || events.length === 0) {
      events = []
    }
    events.push(db.doc(`/fl_content/${flEvent.id}`))
    await flamelinkApp.content.update({
      schemaKey: 'mesa',
      entryId: mesaId,
      data: {
        events,
      },
    })

    return {
      status: 201,
      message: 'Successfully Event created',
      event: response.data,
    }
  } catch (error) {
    console.error({ error })
    return ERROR_RESPONSE, error.message || error
  }
})

exports.createCommandEvent = functions.https.onCall(async (data, context) => {
  const { calendarId, event, commandId } = data
  console.info('***** CREATING EVENT *****')

  try {
    const oauth2Client = await getOAuth2Client()
    if (!event.end) {
      event.end = {
        dateTime: event.start.dateTime,
      }
    }

    const participantsEmail = await getParticipantsEmail(commandId, 'commandId')
    event.attendees = participantsEmail.map((email) => ({
      email: email,
      responseStatus: 'needsAction',
    }))

    if (!calendarId) {
      console.info('***** NO CALENDAR CREATED YET *****')
    }

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      resource: event,
      visibility: 'public',
    })

    // Create new event in Flamelink
    const flEvent = await flamelinkApp.content.add({
      schemaKey: 'evento',
      data: {
        eventId: response?.data.id,
        start: new Date(event.start.dateTime).toISOString(),
        command: db.doc(`/fl_content/${commandId}`),
      },
    })

    // Update the mesa's events in Flamelink
    const command = await flamelinkApp.content.getByField({
      schemaKey: 'command',
      field: 'id',
      value: commandId,
      fields: ['events'],
    })
    let events = Object.values(command)[0].events
    if (!events || events.length === 0) {
      events = []
    }
    events.push(db.doc(`/fl_content/${flEvent.id}`))
    await flamelinkApp.content.update({
      schemaKey: 'command',
      entryId: commandId,
      data: {
        events,
      },
    })

    return {
      status: 201,
      message: 'Successfully Event created',
      event: response.data,
    }
  } catch (error) {
    console.error({ error })
    return ERROR_RESPONSE, error.message || error
  }
})

exports.createMesaParticipation = functions.https.onCall(
  async (data, context) => {
    console.info('***** CREATING MESA PARTICIPATION *****')
    const { mesaId, calendarId, email, phone, name } = data
    try {
      // Create Participation in Firestore
      const participant = {
        email,
        phone,
        name,
        mesaId,
        mesa: db.doc(`/fl_content/${mesaId}`),
      }
      console.info('***** CREATE FLAMELINK PARTICIPANT *****')
      const record = await flamelinkApp.content.add({
        schemaKey: 'participante',
        data: participant,
      })

      const calendarEvents = await getCalendarEvents(calendarId)
      if (calendarEvents.length <= 0) {
        return {
          status: 400,
          message:
            '¡Gracias! Esta mesa aún no tiene fecha de reunión. Te contactarán muy pronto.',
        }
      }

      const oauth2Client = await getOAuth2Client()
      const result = []
      await calendarEvents.forEach(async (event) => {
        if (event.attendees) {
          let attendeesEmail = event.attendees.map((attendee) => attendee.email)
          if (attendeesEmail.includes(email)) {
            console.info('***** ALREADY PARTICIPATING *****')
            return
          }
        }
        let attendees = event.attendees || []
        attendees.push({
          email,
          responseStatus: 'needsAction',
        })
        event.attendees = attendees
        const response = await calendar.events.patch({
          auth: oauth2Client,
          calendarId,
          eventId: event.id,
          sendUpdates: 'all',
          resource: event,
        })
        result.push(response.data)
      })

      return {
        status: 200,
        message: 'Successfully invited',
      }
    } catch (error) {
      console.error({ error })
      return ERROR_RESPONSE
    }
  }
)

exports.createCommandParticipation = functions.https.onCall(
  async (data, context) => {
    console.info('***** CREATING COMMAND PARTICIPATION *****')
    const { commandId, calendarId, email, phone, name } = data
    try {
      // Create Participation in Firestore
      const commandParticipant = {
        email,
        phone,
        name,
        commandId,
        command: db.doc(`/fl_content/${commandId}`),
      }
      console.info('***** CREATE FLAMELINK PARTICIPANT *****')
      const record = await flamelinkApp.content.add({
        schemaKey: 'commandParticipant',
        data: commandParticipant,
      })

      const calendarEvents = await getCalendarEvents(calendarId)
      if (calendarEvents.length <= 0) {
        return {
          status: 400,
          message:
            'Gracias, hemos hecho llegar tu información a la coordinación de este comando. Te contactarán muy pronto.',
        }
      }

      const oauth2Client = await getOAuth2Client()
      const result = []
      await calendarEvents.forEach(async (event) => {
        if (event.attendees) {
          let attendeesEmail = event.attendees.map((attendee) => attendee.email)
          if (attendeesEmail.includes(email)) {
            console.info('***** ALREADY PARTICIPATING *****')
            return
          }
        }
        let attendees = event.attendees || []
        attendees.push({
          email,
          responseStatus: 'needsAction',
        })
        event.attendees = attendees
        const response = await calendar.events.patch({
          auth: oauth2Client,
          calendarId,
          eventId: event.id,
          sendUpdates: 'all',
          resource: event,
        })
        result.push(response.data)
      })

      return {
        status: 200,
        message: 'Successfully invited',
      }
    } catch (error) {
      console.error({ error })
      return ERROR_RESPONSE
    }
  }
)

exports.getOpenMesas = functions.https.onCall(async (data, context) => {
  console.info('***** GETTING OPEN MESAS *****')
  try {
    const openMesas = await flamelinkApp.content.getByField({
      schemaKey: 'mesa',
      field: 'open',
      value: true,
      fields: [
        'id',
        'name',
        'open',
        'theme',
        'cause',
        'comuna',
        'coordinator',
        'mesaType',
        'calendarId',
        'nextEvent',
      ],
      populate: [
        {
          field: 'coordinator',
          fields: ['id', 'email'],
        },
        {
          field: 'mesaType',
          fields: ['id', 'name'],
        },
      ],
    })
    return openMesas
  } catch (error) {
    console.error({ error })
    return error.message || error
  }
})

exports.createAllEvents = functions.https.onCall(async (data, context) => {
  console.info('***** CREATING ALL EVENTS *****')
  try {
    const oauth2Client = await getOAuth2Client()
    let mesas = await flamelinkApp.content.get({
      schemaKey: 'mesa',
      fields: ['id', 'calendarId', 'events'],
    })
    mesas = Object.values(mesas)

    await mesas.forEach(async (mesa) => {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000))
      await delay
      const calendarId = mesa.calendarId
      const mesaEvents = mesa.events
      if (!calendarId) {
        console.info('********* NO CALENDAR *********')
        await flamelinkApp.content.update({
          schemaKey: 'mesa',
          entryId: mesa.id,
          data: {
            nextEvent: new Date(0).toISOString(),
          },
        })
        return
      }
      const calendarEvents = await getCalendarEvents(calendarId, oauth2Client)
      // if (calendarId === 'c_vj9u7er7ohekjmjkjauicd1524@group.calendar.google.com') {
      //   console.info('******* CALENDAR ID: ' + calendarId + ' *******')
      //   console.info(events)
      // }
      if (calendarEvents.length <= 0) {
        console.info('********* NO EVENTS *********')
        await flamelinkApp.content.update({
          schemaKey: 'mesa',
          entryId: mesa.id,
          data: {
            nextEvent: new Date(0).toISOString(),
          },
        })
        return
      } else {
        calendarEvents.forEach(async (event) => {
          // Check if event already exists
          const flEvent = await flamelinkApp.content.getByField({
            schemaKey: 'evento',
            field: 'eventId',
            value: event.id,
            fields: ['id'],
          })

          if (flEvent && Object.values(flEvent).length > 0) {
            console.info('***** EVENT ALREADY EXIST *****')
            await updateMesaEvent({
              mesaId: mesa.id,
              start: new Date(event.start.dateTime),
            })
            return
          }
          // Lets create the event in Flamelink
          const newFlEvent = await flamelinkApp.content.add({
            schemaKey: 'evento',
            data: {
              eventId: event.id,
              start: new Date(event.start.dateTime).toISOString(),
              mesa: db.doc(`/fl_content/${mesa.id}`),
            },
          })
          console.info('***** FLAMELINK EVENT CREATED *****')
          mesaEvents?.push(db.doc(`/fl_content/${newFlEvent.id}`))
          await flamelinkApp.content.update({
            schemaKey: 'mesa',
            entryId: mesa.id,
            data: {
              events: mesaEvents || [db.doc(`/fl_content/${newFlEvent.id}`)],
            },
          })

          console.info('***** MESA EVENTS UPDATED! *****')
        })
      }
    })
  } catch (error) {
    console.error({ error })
    return error.message || error
  }
})

// Lets fill "mesaTypeName" attribute in each Participant in the database
exports.fillMesasTypeName = functions.https.onCall(async (data, context) => {
  console.info('***** FILLING MESAS TYPE NAME *****')
  try {
    let participants = await flamelinkApp.content.get({
      schemaKey: 'participante',
      // limit: 50,
      fields: ['id', 'mesa'],
      populate: [
        {
          field: 'mesa',
          fields: ['id', 'name', 'mesaType'],
          populate: [
            {
              field: 'mesaType',
              fields: ['id', 'name'],
            },
          ],
        },
      ],
    })
    participants = Object.values(participants)
    console.log({ participants: participants.length })
    participants.forEach(async (participant) => {
      if (!participant.mesa || !participant.mesa.mesaType) {
        console.info('********* NO MESA OR MESA TYPE *********')
        return
      }
      console.log({
        mesa: participant.mesa,
        mesaType: participant.mesa?.mesaType?.name,
      })
      await flamelinkApp.content.update({
        schemaKey: 'participante',
        entryId: participant.id,
        data: {
          mesaTypeName: participant.mesa.mesaType.name,
        },
      })
      console.info(
        `Mesa ${
          participant?.mesa?.name || 'sin nombre'
        } actualizada exitosamente!`
      )
    })
    return participants.length
  } catch (error) {
    console.error({ error })
    return error.message || error
  }
})

// exports.relateMesaToCoordinator = functions.https.onCall(async (data, context) => {
//   try {
//     const ref = db.collection('fl_content')
//     let query = ref.where('_fl_meta_.schema', '==', 'mesa')
//     const snapshot = await query.get()
//     snapshot.docs.forEach(async (doc) => {
//       const { id, _fl_meta_, userId, name, coordinator } = doc.data()
//       console.log({name, coordinator})

//       if (_fl_meta_.schema === 'mesa') {
//         if (userId) {
//           let coordinatorQuery = ref.where('_fl_meta_.schema', '==', 'coordinador').where('userId', '==', userId)
//           const coordinatorSnapshot = await coordinatorQuery.get()
//           if (coordinatorSnapshot.docs.length === 0) {
//             console.log('\n-- NO COORDINATOR FOUND --\n')
//           } else {
//             console.log('\n-- COORDINATOR FOUND --\n')
//             const coordinatorDoc = coordinatorSnapshot.docs[0].data()
//             console.log({coordinatorDoc})

//             const response = await db.collection('fl_content').doc(id).update({
//               coordinator: db.collection('fl_content').doc(coordinatorDoc.id)
//             })
//             console.log({response})
//             console.log('\n-- COORDINATOR UPDATED --\n')
//           }
//         }
//       }
//     })
//     return {
//       status: 200,
//       message: 'Successfully related mesa to coordinator',
//       mesaId,
//     }
//   } catch (error) {
//     return(ERROR_RESPONSE, error)
//   }
// })
