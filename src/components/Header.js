import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import {Nav,  Navbar, Container } from 'react-bootstrap'
import Logo from '../images/logo.svg'
import SignOutButton from './SignOut'
import { ReactComponent as Facebook } from '../images/facebook.svg'
import { ReactComponent as Twitter } from '../images/twitter.svg'
import { ReactComponent as Instagram } from '../images/instagram.svg'
import { ReactComponent as Tiktok } from '../images/tiktok.svg'
import { ReactComponent as Whatsapp } from '../images/whatsapp.svg'

export default function Header() {
  const history = useHistory()  
  const [userState] = useUserContext()
  const { currentUser } = userState

  const goHome = useCallback(() => {
    history.push('/welcome')
  }, [history])

  return (
    <header>
      <Navbar expand="md" >
        <Navbar.Brand onClick={goHome} className='logo'>
          <img src={Logo} alt="Boric presidente" />
        </Navbar.Brand>
        <Navbar.Toggle className="navbar-dark" />
        <Navbar.Collapse>
          <Nav >
            { currentUser && (
              <Nav.Link>
                <Link className="menu-item" to='/mesas'>Mesas</Link>
              </Nav.Link>                
            )}
            <>
              <Nav.Link>
                <a className="menu-item" href='https://www.boricpresidente.cl/programa/' target='_blank'>Propuestas</a>
              </Nav.Link>
              <Nav.Link>
                <a className="menu-item" href='https://www.boricpresidente.cl/donar-a-la-campana/' target='_blank'>Aporta</a>
              </Nav.Link>
              <Nav.Link>
                <Link className="menu-item" style={{color: '#19CBB5'}} to='/welcome'>¡Participa aquí!</Link>
              </Nav.Link>
              { !currentUser && (
                <Nav.Link>
                  <Link className="menu-item signin" to='/sign-in'>Ingresa</Link>
                </Nav.Link>
              )}
            </>
            { !currentUser && (
              <div className='social-networks'>
                <a href='https://www.facebook.com/gabrielboric/' target='_blank' rel='noopener noreferrer'>
                  <Facebook />
                </a>
                <a href='https://twitter.com/gabrielboric' target='_blank' rel='noopener noreferrer'>
                  <Twitter />
                </a>
                <a href='https://www.instagram.com/gabrielboric' target='_blank' rel='noopener noreferrer'>
                  <Instagram />
                </a>
                <a href='https://www.tiktok.com/@gabrielboric' target='_blank' rel='noopener noreferrer'>
                  <Tiktok />
                </a>
                <a href='https://wa.link/5gu30s' target='_blank' rel='noopener noreferrer'>
                  <Whatsapp />
                </a>
              </div>
            )}
            { currentUser && (
              <Navbar.Brand>
                <SignOutButton />
              </Navbar.Brand>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}
