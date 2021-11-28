import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import { Nav, Navbar } from 'react-bootstrap'
import Logo from '../images/logo.svg'
import SignOutButton from './SignOut'

export default function Header() {
  const history = useHistory()
  const [userState] = useUserContext()
  const { currentUser } = userState

  const goHome = useCallback(() => {
    history.push('/welcome')
  }, [history])

  return (
    <header>
      <Navbar expand='md'>
        <Nav.Link href='https://boricpresidente.cl' className='logo'>
          <img src={Logo} alt='Boric presidente' />
        </Nav.Link>
        <Navbar.Toggle className='navbar-dark' />
        <Navbar.Collapse>
          <Nav>
            <>
              <Nav.Item>
                <a
                  className='menu-item'
                  href='https://boricpresidente.cl/propuestas'
                  target='_blank'
                >
                  Propuestas
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className='menu-item'
                  href='https://boricpresidente.cl/unete'
                  target='_blank'
                >
                  Únete
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className='menu-item'
                  href='https://boricpresidente.cl/aporta'
                  target='_blank'
                >
                  Aporta
                </a>
              </Nav.Item>
              {/* <Nav.Item>
                <a
                  className='menu-item'
                  href='https://boricpresidente.cl/participa'
                >
                  Participa aquí
                </a>
              </Nav.Item> */}
              {!currentUser && (
                <Nav.Item>
                  <Link className='menu-item signin' to='/sign-in'>
                    Ingresa
                  </Link>
                </Nav.Item>
              )}
            </>
            {currentUser && (
              <Nav.Item>
                <Link className='menu-item' to='/comandos'>
                  Comandos
                </Link>
              </Nav.Item>
            )}
            {currentUser && (
              <Nav.Item>
                <Link className='menu-item' to='/mesas'>
                  Mesas
                </Link>
              </Nav.Item>
            )}
            {currentUser && (
              <Nav.Item>
                <SignOutButton />
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}
