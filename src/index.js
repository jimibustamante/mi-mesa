import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom'

import { UserContextProvider, useUserContext } from './contexts/UserContext'
import { NavigationContextProvider, useNavigationContext } from './contexts/NavigationContext'

import './App.scss'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import firebaseApp from './lib/firebaseApp'

import flamelink from 'flamelink/app'
import 'flamelink/content'
import 'flamelink/storage'
import 'flamelink/navigation'
import 'flamelink/users'

import Home from './components/Home'
import Header from './components/Header'
import Login from './components/Login'
import CmsContent from './components/CmsContent'

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
    // console.log({firebaseApp: firebaseApp})
    console.log({firebaseApp})
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        // Signed in
        initFlamelink()
        dispatchUser({type: 'AUTH_SIGNED_IN', payload: user})
        history.replace('/')
      } else {
        // Signed out
        dispatchUser({type: 'AUTH_SIGNED_OUT'})
        history.replace('/login')
      }
    })
  }, [history, firebaseApp])
  return ''
}

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <NavigationContextProvider>
        <Router>
          <Header />
          <AuthListener />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/:page" flamelink={flamelink} component={CmsContent} />
          </Switch>
        </Router>
      </NavigationContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
