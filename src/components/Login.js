import React, { useEffect, memo } from 'react'
import firebaseApp, { loginOptions } from '../lib/firebaseApp'
import * as firebaseui from 'firebaseui/dist/esm__es_419'

import 'firebaseui/dist/firebaseui.css'
import '../styles/Login.scss'

function Login() {
  useEffect(() => {
    try {
      if (!firebaseApp) return
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebaseApp.auth())
      ui.start('#firebase-login', loginOptions)
    } catch (error) {
      console.error({ error })
    }
  }, [firebaseApp, firebaseui])

  return (
    <div className='login-wrapper'>
      <div className='text-container'>
        <h2>Crea tu comando ciudadano</h2>
        <h5>¡Acá podrás descargar todos los recursos que necesitas! ¡Únete!</h5>
        <p>
          Crea tu propio comando e invita a más personas a ser parte de esta
          etapa de la campaña. Aquí podrás crear tu comando en base a un
          territorio por ejemplo: Cerro Florida x Boric, y también por temática
          por ejemplo: Veterinarios x Boric.
        </p>
      </div>
      <div className='login-form-container container text-center'>
        <h1>Ingresa sesión</h1>
        <div id='firebase-login' />
      </div>
    </div>
  )
}

export default memo(Login)
