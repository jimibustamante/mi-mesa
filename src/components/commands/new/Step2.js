import { memo } from 'react'
import { Row, Container, Col, Button } from 'react-bootstrap'
import Next from './Next'
import Back from './Back'

const Step2 = ({ onSelect, type, back, next }) => {
  return (
    <Container>
      <Back onBack={back} />
      {type && <Next onNext={next} />}
      <Row className='justify-content-md-center'>
        <Col>
          <h2 className='text-center'>
            ¿Qué tipo de comando
            <br />
            quieres crear?
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col className='mesa-buttons' md={6}>
          <Button
            className={`button ${type === 'territorial' ? 'selected' : ''}`}
            onClick={() => onSelect('territorial')}
          >
            Territorial
          </Button>
          <Button
            className={`button ${type === 'temático' ? 'selected' : ''}`}
            onClick={() => onSelect('temático')}
          >
            Temático
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(Step2)
