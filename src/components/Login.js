import React, { useEffect, memo } from 'react'
import firebaseApp, { loginOptions } from '../lib/firebaseApp'
import * as firebaseui from 'firebaseui/dist/esm__es_419'
import 'firebase/auth'

import 'firebaseui/dist/firebaseui.css'
import '../styles/Login.scss'

function Login() {
  useEffect(() => {
    try {
      if (!firebaseApp) return
      const ui = new firebaseui.auth.AuthUI(firebaseApp.auth())
      ui.start('#firebase-login', loginOptions)
    } catch (error) {
      console.error({error})
    }

  }, [firebaseApp])

  return (
    <div className="login-container container text-center">
      <h1>Ingresa</h1>
      <div id="firebase-login" />
    </div>
  )
}

export default memo(Login)