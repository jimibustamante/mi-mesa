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
    refresh_token: googleCredentials.refresh_token
  })

  await oauth2Client.getAccessToken()
  return oauth2Client
}

const getUserEmail = async (uid) => {
  const user = await admin.auth().getUser(uid)
  return user.email
}

const getMesaParticipantsEmail = async (mesaId) => {
  console.log({getMesaParticipantsEmail: mesaId})
  const ref = db.collection('fl_content')
  return ref.where('mesaId', '==', mesaId).get()
    .then(snapshot => {
      let mesaParticipants = snapshot.docs.map(doc => doc.data())
      const emails = mesaParticipants.map(participant => participant.email)
      return emails
    })
    .catch(err => {
      console.log(err)
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
    return calendar.acl.insert(aclResource(oauth2Client, mesa.calendarId, 'reader', {
      type: 'user',
      value: participant.email,
    }))
  }
}

const deleteCalendar = async ({calendarId}) => {
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

  return calendar.calendars.insert({
    auth: oauth2Client,
    resource: {
      summary: 'Mesa Ciudadana',
      description: mesaName,
      timeZone: 'Chile/Continental',
    },
  }).then(async (_calendar) => {
    console.info(`********* CALENDAR CREATED: ${_calendar.data.id} *********`)
    await calendar.acl.insert(aclResource(oauth2Client, _calendar.data.id, 'owner', {
      type: 'user',
      value: ownerEmail,
    }))
    console.info('********* PARTICIPANT ACL CREATED *********')
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
  .catch(error => {
    console.error({error})
    return(ERROR_RESPONSE)
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
    // timeMin: (new Date()).toISOString(),
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

exports.getMesaParticipantsEmail = functions.https.onCall(async (data, context) => {
  const { mesaId } = data
  return getMesaParticipantsEmail(mesaId)
})

exports.createCalendar = functions.https.onCall(async (data, context) => {
  return createCalendar(data)
})

exports.updateMesaEvent = functions.https.onCall(async (data, context) => {
  const { mesaId, start } = data
  const response = await updateMesaEvent({mesaId, start})
  return response
})

const updateMesaEvent = async ({mesaId, start}) => {
  console.log(`********* START NEW EVENT: ${mesaId} *********`)

  const mesa = await flamelinkApp.content.get({
    schemaKey: 'mesa',
    entryId: mesaId,
    fields: ['id', 'events'],
    populate: {
      field: 'events',
      populate: [
        'start',
      ]
    }
  })

  const startDate = new Date(start)
  const { events } = mesa
  const promises = events.map(event => {
    return new Promise(async (resolve, reject) => {
      try {
        const eventData = await event.get()
        let { start } = eventData.data()
        resolve(new Date(start).getTime())
      } catch (error) {
        reject(error)
      }
    })
  })

  let dates = await Promise.all(promises)
  dates.push(startDate.getTime())
  dates = dates.filter(date => date > new Date().getTime()).sort()
  const minDate = new Date(dates[0])
  console.log({minDate})
  await flamelinkApp.content.update({
    schemaKey: 'mesa',
    entryId: mesaId,
    data: {
      nextEvent: minDate.toISOString(),
    },
  })
  return minDate.toISOString()
}

exports.onNewEvent = functions.firestore
  .document('fl_content/{contentId}')
  .onCreate(async (snapshot, context) => {
    console.log(`********* NEW EVENT CALLBACK *********`)
    try {
      const { id, start, mesa, _fl_meta_ } = snapshot.data()
      if (_fl_meta_.schema === 'evento') {
        const mesaData = await mesa.get()
        await updateMesaEvent({mesaId: mesaData.id, start})
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
      console.log({id, calendarId, _fl_meta_})
      if (_fl_meta_.schema === 'mesa' && calendarId) {
        console.info('********* DELETING CALENDAR *********')
        deleteCalendar({calendarId})
      }
    } catch (error) {
      console.info('********* ERROR: DELETING CALENDAR *********', {error})
    }
  })
  
exports.createCalendarAll = functions.https.onCall(async (data, context) => {
  const oauth2Client = await getOAuth2Client()
  const ref = db.collection('fl_content')
  let query = ref.where('_fl_meta_.schema', '==', 'mesa')

  query.get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const { id, name, email, _fl_meta_, calendarId, mesaId} = doc.data()
        console.log({schema: _fl_meta_.schema, calendarId})
        if (_fl_meta_.schema === 'mesa' && !calendarId) {
          console.log({id, name, email, _fl_meta_, calendarId})
          console.log('\n-- NO CALENDAR ASSIGNED --\n')
          calendar.calendars.insert({
            auth: oauth2Client,
            resource: {
              summary: 'Mesa Ciudadana',
              description: name,
              timeZone: 'Chile/Continental',
            },
          }).then(async (_calendar) => {

            await db.collection('fl_content').doc(id).update({
              calendarId: _calendar.data.id,
            })
            console.log('\n-- CALENDAR ID UPDATED --\n')
            await calendar.acl.insert(aclResource(oauth2Client, _calendar.data.id, 'owner', {
              type: 'user',
              value: email,
            }))
            console.log('\n-- COORDINATOR ACL CREATED --\n')

          })
          .catch(error => {
            console.error(error)
          })
        }
      })
    })
    .catch(error => {
      console.log({error})
      return(ERROR_RESPONSE)
    })
})

exports.createEvent = functions.https.onCall(async (data, context) => {
  const { calendarId, event, mesaId } = data
  console.log('***** CREATING EVENT *****')

  try {
    const oauth2Client = await getOAuth2Client()
    if (!event.end) {
      event.end = {
        dateTime: event.start.dateTime,
      }
    }

    const participantsEmail = await getMesaParticipantsEmail(mesaId)
    event.attendees = participantsEmail.map(email => ({email: email, responseStatus: 'needsAction'}))

    if (!calendarId) {
      console.log('***** NO CALENDAR CREATED YET *****')
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
      }
    })

    console.log({flEvent})

    // Update the mesa's events in Flamelink
    const mesa = await flamelinkApp.content.getByField({
      schemaKey: 'mesa',
      field: 'id',
      value: mesaId,
      fields: ['events'],
    })
    let events = Object.values(mesa)[0].events
    console.log({events})
    events.push(db.doc(`/fl_content/${flEvent.id}`))
    console.log({events})
    await flamelinkApp.content.update({
      schemaKey: 'mesa',
      entryId: mesaId,
      data: {
        events,
      }
    })
    
    return {
      status: 201,
      message: 'Successfully Event created',
      event: response.data,
    }
  } catch (error) {
    console.log({error})
    return(ERROR_RESPONSE, error.message || error)
  }
})

exports.createMesaParticipation = functions.https.onCall(async (data, context) => {
  console.info('***** CREATING MESA PARTICIPATION *****')
  const { mesaId, calendarId, email, phone, name } = data
  console.log({mesaId, calendarId, email, phone})
  try {
    // Create Participation in Firestore
    const participant = {
      email,
      phone,
      name,
      mesaId,
      mesa: db.doc(`/fl_content/${mesaId}`),
    }
    console.log('***** CREATE FLAMELINK PARTICIPANT *****')
    const record = await flamelinkApp.content.add({schemaKey: 'participante', data: participant})
    console.log({participant: record})

    const calendarEvents = await getCalendarEvents(calendarId)
    if (calendarEvents.length <= 0) {
      return {
        status: 400,
        message: '¡Gracias! Esta mesa aún no tiene fecha de reunión. Te contactarán muy pronto.',
      }
    }

    const oauth2Client = await getOAuth2Client()
    const result = []
    await calendarEvents.forEach(async event => {
      if (event.attendees) {
        let attendeesEmail = event.attendees.map(attendee => attendee.email)
        if (attendeesEmail.includes(email)) {
          console.log('***** ALREADY PARTICIPATING *****')
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
    console.error({error})
    return(ERROR_RESPONSE)
  }
})

exports.getOpenMesas = functions.https.onCall(async (data, context) => {
  console.info('***** GETTING OPEN MESAS *****')
  try {
    const openMesas = await flamelinkApp.content.getByField({
      schemaKey: 'mesa',
      field: 'open',
      value: true,
      fields: ['id', 'name', 'open', 'theme', 'cause', 'comuna', 'coordinator', 'mesaType', 'calendarId', 'nextEvent'],
      populate: [
        {
          field: 'coordinator',
          fields: ['id', 'email'],
        },
        {
          field: 'mesaType',
          fields: ['id', 'name'],
        }
      ],
    })
    return openMesas
  } catch (error) {
    console.error({error})
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

    await mesas.forEach(async mesa => {
      const delay = new Promise(resolve => setTimeout(resolve, 1000))
      await delay
      const calendarId = mesa.calendarId
      const mesaEvents = mesa.events
      if (!calendarId) {
        return
      }
      const calendarEvents = await getCalendarEvents(calendarId, oauth2Client)
      if (calendarEvents.length <= 0) {
        return
      } else {
        calendarEvents.forEach(async event => {
          // Check if event already exists
          console.log({mesaEvents})

          const flEvent = await flamelinkApp.content.getByField({
            schemaKey: 'evento',
            field: 'eventId',
            value: event.id,
            fields: ['id'],
          })

          if (flEvent && Object.values(flEvent).length > 0) {
            console.log('***** EVENT ALREADY EXIST *****')
            return
          }
          // Lets create the event in Flamelink
          const newFlEvent = await flamelinkApp.content.add({
            schemaKey: 'evento',
            data: {
              eventId: event.id,
              start: new Date(event.start.dateTime).toISOString(),
              mesa: db.doc(`/fl_content/${mesa.id}`),
            }
          })
          console.log('***** FLAMELINK EVENT CREATED *****')
          mesaEvents?.push(db.doc(`/fl_content/${newFlEvent.id}`))
          await flamelinkApp.content.update({
            schemaKey: 'mesa',
            entryId: mesa.id,
            data: {
              events: mesaEvents || [db.doc(`/fl_content/${newFlEvent.id}`)],
            }
          })

          console.log('***** MESA EVENTS UPDATED! *****')

        })
      }
    })
  } catch (error) {
    console.error({error})
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
