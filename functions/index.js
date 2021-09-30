const functions = require('firebase-functions')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

calendar = google.calendar('v3')

const googleCredentials = require('./credentials.json')

const ERROR_RESPONSE = {
  status: 500,
  message: 'Error creating Google Calendar',
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// exports.test = functions.https.onCall((data, context) => {

exports.createCalendar = functions.https.onCall(async (data, context) => {
  console.log({data})
  const { mesaId, mesaName } = data
  const oauth2Client = new OAuth2(
    googleCredentials.web.client_id,
    googleCredentials.web.client_secret,
    googleCredentials.web.redirect_uris[0]
  )

  oauth2Client.setCredentials({
    refresh_token: googleCredentials.refresh_token
  })

  await oauth2Client.getAccessToken()
  // return 
  return calendar.calendars.insert({
    auth: oauth2Client,
    resource: {
      summary: mesaName || 'New Calendar',
      description: mesaName || 'New Calendar',
      // location: data.data.location,
      // colorId: data.data.colorId,
      // timeZone: data.data.timeZone,
    },
  })
    .then(calendar => {
      console.log({calendar})
      return {
        status: 200,
        message: 'Successfully created Google Calendar',
        calendarId: calendar.data.id,
      }
    })
    .catch(error => {
      console.log({error})
      return(ERROR_RESPONSE)
    })
})