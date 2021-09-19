import { memo } from 'react'
import { Row, Container, Col, Button } from "react-bootstrap"
import Next from './Next'
import Back from './Back'

const Step2 = ({onSelect, isMesaOpen, back, next}) => { 
  return (
    <Container>
      <Back onBack={back} />
      {isMesaOpen !== null && (
        <Next onNext={next} />
      )}
      <Row className='justify-content-md-center'>
        <Col>
          <h2 className='text-center'>¿Esta mesa será<br/> abierta o cerrada?</h2>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md={6}>
          <span style={{display: 'block'}} className='text-center small-text display-block'>
          * Si marcas ‘abierta’ permitirás que personas puedan inscribirse para sumarse a la mesa.
          </span>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col className='mesa-buttons' md={6}>
          <Button className={`button ${isMesaOpen === true ? 'selected' : ''}`} onClick={() => onSelect(true)}>Abierta</Button>
          <Button className={`button ${isMesaOpen === false ? 'selected' : ''}`} onClick={() => onSelect(false)}>Cerrada</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(Step2)
