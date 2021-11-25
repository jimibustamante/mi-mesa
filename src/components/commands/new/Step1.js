import { memo } from 'react'
import { Row, Container, Col } from 'react-bootstrap'
import Next from './Next'

const Step1 = ({ next }) => {
  return (
    <Container fluid>
      <Next onNext={next} />
      <Row>
        <Col sm={12}>
          <h2>Crea tu comando ciudadano</h2>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <p>
            Para crear tu comando, por favor responde las siguientes
            preguntas...
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(Step1)
