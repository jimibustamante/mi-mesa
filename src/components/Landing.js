import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Container, Row, Carousel} from 'react-bootstrap'
import LandingImage1 from '../images/landing-img-1.png'
import LandingImage2 from '../images/landing-img-2.png'
import CarouselImage1 from '../images/territorios1.png'
import CarouselImage2 from '../images/territorios2.png'
import CarouselImage3 from '../images/territorios3.png'

import { ReactComponent as Arrow } from '../images/arrow.svg'
import ChileImg from '../images/chile.png'

import MesasMoreInfo from '../components/MesasMoreInfo'
import ConsultMoreInfo from '../components/ConsultMoreInfo'

export default function Landing() {
  const [showInfoMesas, setShowInfoMesas] = useState(false)
  const [showInfoConsult, setShowInfoConsult] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div id='landing'>
      <MesasMoreInfo show={showInfoMesas} onHide={() => setShowInfoMesas(false)} />
      <ConsultMoreInfo show={showInfoConsult} onHide={() => setShowInfoConsult(false)} />
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
          Este un espacio de participación donde todas las personas podemos compartir nuestras ideas, propuestas, anhelos, prioridades y opiniones para construir, juntas y juntos, el gobierno del cambio.
        </p>
      </div>
      <section id='mesas-content' className='mesas'>
        <div className='mesas-container' >
          <Row style={{marginBottom: '100px'}}>
            <Col className='col-wrapper' xs={12} md={6}>
              <h2>Mesas<br/>Ciudadanas</h2>
              <p>¡Únete a una o crea la tuya propia! Siéntate virtual o presencialmente con otras personas, conversa sobre los temas que te interesan y aporta a la construcción de un programa que nace desde la ciudadanía.</p>
              <button onClick={() => setShowInfoMesas(true)} className='more-info'>
                Conoce más    +
              </button>
              <div className='mesa-buttons'>
                <a className='btn' href='https://forms.gle/gx5VToy6BgKjuBxT9' target='_blank' >
                  Únete a una mesa
                </a>
                <Button as={Link} to='/sign-in'>Crea tu mesa</Button>
              </div>
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
            <Col className='col-wrapper' style={{alignItems: 'flex-end'}} xs={12} md={6}>
              <h2 className='green' style={{textAlign: 'right'}} >Consulta<br/>Ciudadana</h2>
              <p style={{textAlign: 'right'}}>Contesta estas preguntas y cuéntanos los temas que más te importan.</p>
              <button onClick={() => setShowInfoConsult(true)} className='more-info'>
                Conoce más    +
              </button>
              <div className='mesa-buttons'>
                <a className='btn' style={{backgroundColor: '#59C885'}} href='https://tll5o6hb21g.typeform.com/to/gRt8fnSE' target='_blank' >
                  ¡Responde acá!
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className='territorios'>
        <Carousel fade controls={false} touch={false} interval={5000}>
          <Carousel.Item>
            <img src={CarouselImage1} alt='Norte' />
          </Carousel.Item>
          <Carousel.Item>
            <img src={CarouselImage2} alt='Centro' />
          </Carousel.Item>
          <Carousel.Item>
            <img src={CarouselImage3} alt='Sur' />
          </Carousel.Item>
        </Carousel>
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
