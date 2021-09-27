import React, { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import {Nav,  Navbar } from 'react-bootstrap'
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
        <Nav.Link href='https://boricpresidente.cl' className='logo'>
          <img src={Logo} alt="Boric presidente" />
        </Nav.Link>
        <Navbar.Toggle className="navbar-dark" />
        <Navbar.Collapse>
          <Nav >
            { currentUser && (
              <Nav.Item>
                <Link className="menu-item" to='/mesas'>Mesas</Link>
              </Nav.Item>
            )}
            <>
              <Nav.Item>
                <a className="menu-item" href='https://boricpresidente.cl/propuestas' target='_blank'>Propuestas</a>
              </Nav.Item>
              <Nav.Item>
                <a className="menu-item" href='https://boricpresidente.cl/aporta' target='_blank'>Aporta</a>
              </Nav.Item>
              <Nav.Item>
                <Link className="menu-item" style={{color: '#19CBB5'}} to='/'>¡Participa aquí!</Link>
              </Nav.Item>
              { !currentUser && (
                <Nav.Item>
                  <Link className="menu-item signin" to='/sign-in'>Ingresa</Link>
                </Nav.Item>
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
