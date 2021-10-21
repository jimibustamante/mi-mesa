import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
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
import CompleteRegister from './components/CompleteRegister'
import CmsContent from './components/CmsContent'
import Landing from './components/Landing'
import Mesas from './components/mesas'
import ShowMesa from  './components/mesas/Show'
import FinderWrapper from './components/FinderWrapper'

// functions.useEmulator("localhost", 5001)
// functions.useFunctionsEmulator("http://localhost:5001")

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

const Background = ({children}) => {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('/busca-tu-mesa')) {
      document.body.classList.add('busca-tu-mesa')
    } else {
      document.body.classList.remove('busca-tu-mesa')
    }
  }, [location])
  return (
    <>
      {children}
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <MesaContextProvider>
        <NavigationContextProvider>
          <Router>
            <Header />
            <AuthListener />
            <Background>
              <Switch>
                <Route path="/" component={() => { window.location = 'https://boricpresidente.cl/participa'; return null;} } exact/>
                {/* <Route path="/" component={Landing} exact /> */}
                <Route path="/welcome" component={Landing} exact />
                <Route path="/busca-tu-mesa" component={FinderWrapper} exact />
                <Route path="/como-participar" component={Participar} exact />
                <Route path="/sign-in" component={Login} exact />
                <Route path="/sign-in-success" component={CompleteRegister} exact />
                <Route path="/mesas/:mesaId" component={ShowMesa} exact />
                <Route path="/mesas" component={Mesas} exact />
                <Route path="/:page" flamelink={flamelink} component={CmsContent} />
              </Switch>
            </Background>
            <Footer />
          </Router>
        </NavigationContextProvider>
      </MesaContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
