import { memo } from "react"
import { Row, Container, Col } from "react-bootstrap"
import { ReactComponent as TablesIcon } from '../../../images/mesas.svg'
import Next from './Next'

const Step1 = ({next}) => { 
  return (
    <Container fluid>
      <Next onNext={next} />
      <Row>
        <Col lg={4} >
          <TablesIcon />
        </Col>
        <Col lg={8}>
          <h2>Crea tu mesa de participación</h2>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <p>
            Para configurar tu Mesa, por favor responde las siguientes preguntas....
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(Step1)
