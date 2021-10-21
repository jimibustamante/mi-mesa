import React from 'react'
import MesaFinder from './MesaFinder'
import { Container, Row, Col } from 'react-bootstrap'
import mesaImg from '../images/mesa.png'

export default function FinderWrapper() {
  return (
    <div id='mesa-finder-wrapper'>
      <section id='mesa-finder'>
        <Container>
          <Row className='text-content'>
            <Col xs={12} md={6}>
              <h2>Únete a una mesa</h2>
              <p>Revisa la oferta de mesas acá. Puedes buscar por <b>interés, causa o territorio</b> como también por <b>palabra clave.</b> ¡Súmate!</p>
            </Col>
            <Col xs={12} md={3}>
              <div className='mesa-finder-img-wrapper'>
                <img src={mesaImg} alt='Mesa Ciudadana' />
              </div>
            </Col>
          </Row>
          <MesaFinder />
        </Container>
      </section>
    </div>
  )
}
