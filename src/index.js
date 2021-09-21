import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom'

import { UserContextProvider, useUserContext } from './contexts/UserContext'
import { MesaContextProvider } from './contexts/MesaContext'
import { NavigationContextProvider, useNavigationContext } from './contexts/NavigationContext'

import './App.scss'

import firebaseApp from './lib/firebaseApp'

import flamelink from 'flamelink/app'
import 'flamelink/content'
import 'flamelink/storage'
import 'flamelink/navigation'
import 'flamelink/users'

import Participar from './components/Participar'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import CmsContent from './components/CmsContent'
import Landing from './components/Landing'
import Mesas from './components/mesas'
import ShowMesa from  './components/mesas/Show'

const AuthListener = () => {
  const [userState, dispatchUser] = useUserContext()
  const [navigationState, dispatchNavigation] = useNavigationContext()
  const history = useHistory()

  const initFlamelink = async () => {
    const flamelinkApp = flamelink({
      firebaseApp: firebaseApp,
      dbType: 'cf',
    })
    const navigation = await flamelinkApp.nav.get('menu', {structure: 'nested'})
    dispatchNavigation({ type: 'SET_NAVIGATION', payload: navigation })
  }

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        // Signed in
        initFlamelink()
        dispatchUser({type: 'AUTH_SIGNED_IN', payload: user})
      } else {
        // Signed out
        dispatchUser({type: 'AUTH_SIGNED_OUT'})
      }
    })
  }, [history, firebaseApp])
  return ''
}

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <MesaContextProvider>
        <NavigationContextProvider>
          <Router>
            <Header />
            <AuthListener />
            <Switch>
              <Route path="/" component={Landing} exact />
              <Route path="/welcome" component={Landing} exact />
              <Route path="/como-participar" component={Participar} exact />
              <Route path="/sign-in" component={Login} exact />
              <Route path="/mesas/:mesaId" component={ShowMesa} exact />
              <Route path="/mesas" component={Mesas} exact />
              <Route path="/:page" flamelink={flamelink} component={CmsContent} />
            </Switch>
            <Footer />
          </Router>
        </NavigationContextProvider>
      </MesaContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
