import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useNavigationContext } from '../contexts/NavigationContext'
import { Navbar, Container } from 'react-bootstrap'
import Logo from '../images/logo.svg'
import firebase from 'firebase/app'
import 'firebase/auth'

const SignOutButton = () => {
  const [userState, dispatch] = useUserContext()
  const { currentUser } = userState
  const signOut = () => {
    firebase.auth().signOut()
    dispatch({ type: 'AUTH_SIGNED_OUT' })
    document.location.replace('/')
  }

  return (
    currentUser ? (
      <span className='span-link' onClick={signOut}>
        Sign Out
      </span>
    ) : ( '' )
  )
}

export default function Header() {
  const history = useHistory()  
  const [userState] = useUserContext()
  const { currentUser } = userState
  const [navigationState, dispatchNavigation] = useNavigationContext()
  const { items } = navigationState
  const goHome = useCallback(() => {
    history.push('/')
  }, [history])

  console.log({items})
  return (
    <header>
      <Container fluid>
        <Navbar expand="md" className='navbar-expand-md'>
          <Container fluid>
            <Navbar.Brand onClick={goHome} className='logo'>
              <img src={Logo} alt="Boric presidente" />
            </Navbar.Brand>
            <Navbar.Toggle className="navbar-dark"  />
            <Navbar.Collapse>
              {items.map(item => {
                return (
                  <Navbar.Brand key={item.id} >
                    <Link className="menu-item" to={item.url}>{item.title}</Link>
                  </Navbar.Brand>
                )
              })}
              { !currentUser && (
                <>
                  <Navbar.Brand>
                    <Link className="menu-item" to='/info'>Infórmate</Link>
                  </Navbar.Brand>
                  <Navbar.Brand>
                    <Link className="menu-item" to='/join'>¡Súmate!</Link>
                  </Navbar.Brand>
                  <Navbar.Brand>
                    <Link className="menu-item" to='/community'>Comunidad</Link>
                  </Navbar.Brand>
                  <Navbar.Brand>
                    |
                  </Navbar.Brand>
                  <Navbar.Brand>
                    <Link className="menu-item signin" to='/sign-in'>Ingresa</Link>
                  </Navbar.Brand>
                </>
              )}
              <Navbar.Brand>
                <SignOutButton />
              </Navbar.Brand>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    </header>
  )
}
