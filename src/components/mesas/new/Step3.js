import { memo, useCallback } from 'react'
import { Row, Container, Col } from "react-bootstrap"
import Back from './Back'

const Step3 = ({onSelect, type, onLastStepChange, back}) => { 

  const handleChange = useCallback((e) => {
    onLastStepChange(e.target.name || e.target.getAttribute('name'))
    onSelect(e.target.getAttribute('mesatype'))
  }, [onLastStepChange, onSelect])

  return (
    <Container>
      <Back onBack={back} />
      <Row className='justify-content-md-center'>
        <Col>
          <h2 className='text-center' style={{marginButton: 21}} >
            ¿Cuál dirías que es el motivo<br/>principal que convoca a las y los<br/>participantes de esta mesa?
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col className='options-list' md={10}>
          <span onClick={handleChange} mesatype='territorial' name='territorial' className={`option-button ${type === 'territorial' ? 'selected' : ''}`}>
            <b>1. </b> Nos convoca una preocupación común por el territorio que habitamos.
          </span>
          <span onClick={handleChange} mesatype='por causa' name='por causa territorial' className={`option-button ${type === 'por causa' ? 'selected' : ''}`}>
            <b>2. </b> Nos convoca una ‘causa social específica’ que es propia de un territorio.
          </span>
          <span onClick={handleChange} mesatype='por causa' name='por causa' className={`option-button ${type === 'por causa' ? 'selected' : ''}`}>
            <b>3. </b> Nos convoca una ‘causa social específica’ que afecta a múltiples personas en sus distintos territorios.
          </span>
          <span onClick={handleChange} mesatype='temática' name='temática' className={`option-button ${type === 'temática' ? 'selected' : ''}`}>
            <b>4. </b> Nos convoca un tema programático sobre el que tenemos interés en aportar.
          </span>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(Step3)
