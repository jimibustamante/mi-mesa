import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Button, Col, Container, Row } from 'react-bootstrap'
import LandingImage1 from '../images/landing-img-1.png'
import LandingImage2 from '../images/landing-img-2.png'
import { ReactComponent as Arrow } from '../images/arrow.svg'
import ChileImg from '../images/chile.png'

export default function Landing() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div id='landing'>
      <section className='landing-text'>
        <Container fluid>
          <h2>¡Participa!</h2>
          <p className='subtitle'>Conoce más sobre el proceso participativo 
            <a href='#mesas-content'>
              <Arrow href='#mesas-content' />
            </a>
          </p>
        </Container>
      </section>
      <div className='description'>
            <p>
              Este un espacio de participación donde todas las personas podrán compartir<br/>ideas, propuestas, anhelos, prioridades y opiniones para para construir, juntos<br/>y juntas, un Gobierno a puertas abiertas y de cara a la ciudadanía.
            </p>
            {/* <div className='see-more'>
              <a href='#mesas-content'>Conoce más</a>
              <ArrowDown />
            </div> */}
          </div>
      <section id='mesas-content' className='mesas'>
        <div className='mesas-container' >
          <Row style={{marginBottom: '100px'}}>
            <Col xs={12} md={6}>
              <h2>Mesas<br/>Ciudadanas</h2>
              <p>¡Únete a una o crea la tuya propia! Siéntate virtual o presencialmente con otras personas, conversa sobre los temas que te interesan y aporta a la construcción de un programa que nace desde la ciudadanía.</p>
              <Button as={Link} to='/como-participar'>¡Súmate acá!</Button>

            </Col>
            <Col xs={12} md={6}>
              <img src={LandingImage1} alt='Chile' />
            </Col>
          </Row>
        </div>
        <div className='mesas-container'>
          <Row>
            <Col xs={12} md={6}>
              <img src={LandingImage2} alt='Chile' />
            </Col>
            <Col xs={12} md={6}>
              <h2 className='green' style={{textAlign: 'right'}} >Consulta<br/>Ciudadana</h2>
              <p style={{textAlign: 'right'}}>Contesta estas preguntas y cuéntanos los temas que más te importan.</p>
              <Button as={Link} to='/como-participar' style={{float: 'right'}} className='green'>Responde acá</Button>
            </Col>
          </Row>
        </div>
      </section>

      <section className='territorios'>
        <img src={ChileImg} alt='Chile' className='territorios-img' />
        <div className='content'>
          <span className='text-med'>
            Infórmate desde tu
          </span>
          <h2>Territorio</h2>
          <a href='https://forms.gle/gx5VToy6BgKjuBxT9' target='_blank' className='btn red'>Descubre más</a>
        </div>
      </section>

      <section className='contact'>
        <div className='content'>
          <h2>¿Tienes dudas?</h2>
          <span className='text-med'>
            ¡Ponte en contacto con nosotros!
          </span>
          <a className='btn' href='mailto:contacto@boricpresidente.cl'>Contacto</a>
        </div>
      </section>
    </div>
  )
}
