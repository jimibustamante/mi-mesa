const functions = require('firebase-functions')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const admin = require('firebase-admin')

admin.initializeApp()
calendar = google.calendar('v3')
const db = admin.firestore()
const googleCredentials = require('./credentials.json')

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

exports.onNewMesa = functions.firestore
  .document('fl_content/{contentId}')
  .onCreate(async (snapshot, context) => {
    const { id, name, userId, email, mesaId, _fl_meta_, calendarId } = snapshot.data()
    console.info({ id, name, userId, email, mesaId, _fl_meta_, calendarId })
    if (_fl_meta_.schema === 'mesa' && !calendarId) {
      createCalendar({mesaId: id, mesaName: name, userId})
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
  console.log({data})
  try {
    const oauth2Client = await getOAuth2Client()
    if (!event.end) {
      event.end = {
        dateTime: event.start.dateTime,
      }
    }
    const participantsEmail = await getMesaParticipantsEmail(mesaId)
    event.attendees = participantsEmail.map(email => ({email: email, responseStatus: 'needsAction'}))
    console.log({event})

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      resource: event,
      visibility: 'public',
    })
    console.log({response})
    return {
      status: 200,
      message: 'Successfully Event created',
      event: response.data,
    }
  } catch (error) {
    return(ERROR_RESPONSE, error)
    
  }
})