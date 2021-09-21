import React from 'react'
import Logo from '../images/logo-water.png'
import AprueboDignidad from '../images/apruebo-dignidad.png'
import { ReactComponent as Facebook } from '../images/facebook-water.svg'
import { ReactComponent as Twitter } from '../images/twitter-water.svg'
import { ReactComponent as Instagram } from '../images/instagram-water.svg'
import { ReactComponent as Tiktok } from '../images/tiktok-water.svg'
import { ReactComponent as Whatsapp } from '../images/whatsapp-water.svg'
import { useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation()
  const showFooter = location.pathname.includes('/home')|| location.pathname.includes('/welcome') || location.pathname.includes('/login') || location.pathname.includes('/como-participar') || location.pathname === '/'
  return (
    showFooter ? (
      <footer>
        <img src={Logo} />
        <p>Por un Chile en el que nadie quede fuera.</p>
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
        <img src={AprueboDignidad} />
      </footer>
    ) : null
  )
}
