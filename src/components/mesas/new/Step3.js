import { memo } from 'react'
import { Row, Container, Col, Button } from "react-bootstrap"

const Step3 = memo(({onSelect, type, onLastStepChange}) => { 

  const handleChange = (e) => {
    onLastStepChange(e.target.name || e.target.getAttribute('name'))
    onSelect(e.target.getAttribute('mesaType'))
  }

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col>
          <h2 className='text-center' style={{marginButton: 21}} >
            ¿Cuál dirías que es el motivo<br/>principal que convoca a las y los<br/>participantes de esta mesa?
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col className='options-list' md={10}>
          <span onClick={handleChange} mesaType='territorial' name='territorial' className={`option-button ${type === 'territorial' ? 'selected' : ''}`}>
            <b>1.</b> Nos convoca una preocupación común por el territorio que habitamos.
          </span>
          <span onClick={handleChange} mesaType='interés común' name='interés común territorial' className={`option-button ${type === 'interés común' ? 'selected' : ''}`}>
            <b>2.</b> Nos convoca una ‘causa social específica’ que es propia de un territorio.
          </span>
          <span onClick={handleChange} mesaType='interés común' name='interés común' className={`option-button ${type === 'interés común' ? 'selected' : ''}`}>
            <b>3.</b> Nos convoca una ‘causa social específica’ que afecta a múltiples personas en sus distintos territorios.
          </span>
          <span onClick={handleChange} mesaType='temática' name='temática' className={`option-button ${type === 'temática' ? 'selected' : ''}`}>
            <b>4.</b> Nos convoca un tema programático sobre el que tenemos interés en aportar.
          </span>
        </Col>
      </Row>
    </Container>
  )
})

export default Step3
