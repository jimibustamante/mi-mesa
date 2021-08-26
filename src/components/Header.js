import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { useNavigationContext } from '../contexts/NavigationContext'
import { Navbar, Container } from 'react-bootstrap'
import Logo from '../images/logo.png'
import firebase from 'firebase/app'
import 'firebase/auth'

const SignOutButton = () => {
  const [userState, dispatch] = useUserContext()
  const currentUser = userState.user
  const signOut = () => {
    firebase.auth().signOut()
    dispatch({ type: 'AUTH_SIGNED_OUT' })
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
  // const [userState, dispatch] = useUserContext()
  const [navigationState, dispatchNavigation] = useNavigationContext()
  const { items } = navigationState

  const goHome = useCallback(() => {
    history.push('/')
  }, [history])

  console.log({items})
  return (
    <header>
      <Container>
        <Navbar expand="sm">
          <Container>
            <Navbar.Brand onClick={goHome} className='logo'>
              <img src={Logo} alt="Boric presidente" />
            </Navbar.Brand>
            {items.map(item => {
              return (
                <Navbar.Brand key={item.id} >
                  <Link className="menu-item" to={item.url}>{item.title}</Link>
                </Navbar.Brand>
              )
            })}
            <Navbar.Brand>
              <SignOutButton />
            </Navbar.Brand>
          </Container>
        </Navbar>
      </Container>
    </header>
  )
}
