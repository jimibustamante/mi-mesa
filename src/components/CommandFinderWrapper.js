import React from 'react'
import CommandFinder from './CommandFinder'
import { Container, Row, Col } from 'react-bootstrap'
import commandImg from '../images/command-img.png'

export default function CommandFinderWrapper() {
  return (
    <div id='command-finder-wrapper'>
      <section id='mesa-finder'>
        <Container>
          <Row className='text-content'>
            <Col xs={12} md={6}>
              <h2>Únete a un comando ciudadano</h2>
              <p>
                ¡Súmate a un Comando Ciudadano! Los necesitamos a todos y todas.
                Encuentra tu comando por <b>palabra clave.</b> ¡Súmate!
              </p>
            </Col>
            <Col xs={12} md={3}>
              <div className='command-finder-img-wrapper'>
                <img src={commandImg} alt='Mesa Ciudadana' />
              </div>
            </Col>
          </Row>
          <CommandFinder />
        </Container>
      </section>
    </div>
  )
}
