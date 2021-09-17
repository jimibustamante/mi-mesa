import { memo, useState, useEffect } from 'react'
import { db } from '../../../lib/firebaseApp'
import useFlameLinkApp from '../../../hooks/useFlamelinkApp'
import { ReactComponent as CloseModalIcon } from '../../../images/close-modal.svg'
import { ReactComponent as NextIcon } from '../../../images/next.svg'
import { ReactComponent as PrevIcon } from '../../../images/prev.svg'
import { ReactComponent as TablesIcon } from '../../../images/mesas.svg'

import { useUserContext } from '../../../contexts/UserContext'
import { useMesaContext } from '../../../contexts/MesaContext'
import { Button, Modal, Container, Row, Col, Form } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

import REGIONES_DB from '../../../data/regiones'

const ComunaPicker = ({ onSelect }) => {
  const regiones = Object.keys(REGIONES_DB)

  const [comunas, setComunas] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedComuna, setSelectedComuna] = useState(null)

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value)
  }

  const handleComunaChange = (e) => {
    setSelectedComuna(e.target.value)
    onSelect(e.target.value)
  }

  useEffect(() => {
    if (selectedRegion) {
      const comunas = REGIONES_DB[selectedRegion].comunas
      console.log({comunas})
      setComunas(comunas)
    }
  }, [selectedRegion, REGIONES_DB])

  return (
    <Container >
      <h2 style={{fontSize: '20px'}}  className='text-center'>Indícanos la comuna donde se desarrollará tu Mesa</h2>
      <Form autocomplete="off">
        <Form.Group controlId="type">
          <Form.Label>Región</Form.Label>
          <Form.Control as="select" name='región' value={selectedRegion} onChange={handleRegionChange}>
            {regiones.map((reg) => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </Form.Control>
          {comunas.length > 0 && (
            <>
              <Form.Label>Comuna</Form.Label>
              <Form.Control as="select" name='comuna' value={selectedComuna} onChange={handleComunaChange}>
                {comunas.map((comuna) => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </Form.Control>
            </>
          )}
        </Form.Group>
      </Form>
    </Container>
  )
}

const CausePicker = ({ onSelect, cause }) => {
  const onChange = (e) => {
    onSelect(e.target.value)
  }

  return(
    <Container style={{marginBottom: '50px'}}>
      <h2 style={{fontSize: '20px'}} className='text-center'>En una frase, ¿cuál es la ‘causa social’ que convoca a las y los participantes de esta mesa?</h2>
      <Form autocomplete="off">
        <Form.Group controlId="type">
          <Form.Control type="text" value={cause} onChange={onChange} />
        </Form.Group>
      </Form>
    </Container>    
      
  )
}

const ThemePicker = ({ onSelect, theme }) => {
  const onChange = (e) => {
    onSelect(e.target.value)
  }
  return (
    <Container style={{marginBottom: '50px'}}>
      <h2 style={{fontSize: '20px'}} className='text-center'>¿Cual de las siguientes temáticas será el asunto principal a tratar en esta mesa?</h2>
      <Form autocomplete="off">
        <Form.Group controlId="type">
          <Form.Control type="text" value={theme} onChange={onChange} />
        </Form.Group>
      </Form>
    </Container>
  )
}

const Step1 = memo(() => { 
  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <TablesIcon />
        </Col>
        <Col md={6}>
          <h2>Crea tu mesa de participación</h2>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <p>
            Para configurar tu Mesa, por favor responde las siguientes preguntas....
          </p>
        </Col>
      </Row>
    </Container>
  )
})

const Step2 = memo(({onSelect, isMesaOpen}) => { 
  return (
    <Container>
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
})

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

const NewMesa = ({ onCreate , show, onClose }) => {
  const [type, setType] = useState('')
  const [isOpen, setIsOpen] = useState(null)
  const [comuna, setComuna] = useState('')
  const [cause, setCause] = useState('')
  const [theme, setTheme] = useState('')
  const [lastStep, setLastStep] = useState('')
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  const [userState] = useUserContext()
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const { createRecord, getTypes } = useFlameLinkApp()
  const { currentUser } = userState

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        console.log('Fetching TYPES')
        dispatch({ type: 'SET_MESA_TYPES', payload: types })
      })
    }
  }, [mesaTypes, dispatch])

  const handleCarouselSelect = (selectedIndex, e) => {
    setCarouselCurrentIndex(selectedIndex)
  }

  const mesaName = () => {
    if (type === 'temática') {
      return theme
    } else if (type === 'territorial') {
      return comuna
    } else if (type === 'interés común') {
      return cause
    }
  }

  const createMesa = async () => {
    // TODO: Validate
    const selectedType = mesaTypes.find(mt => mt.name === type)
    if (!selectedType) return

    const newMesa = await createRecord('mesa', {
      name: mesaName(),
      userId: currentUser.uid,
      open: isOpen,
      comuna,
      cause,
      theme,
      mesaType: db().doc(`/fl_content/${selectedType.id}`),
    })
    setIsOpen(null)
    setCause('')
    setTheme('')
    setComuna('')
    setType('')
    setLastStep('')
    onCreate(newMesa)
  }

  const onTypeChange = (typeName) => {
    setType(typeName)
    setCarouselCurrentIndex(index => index + 1)
  }

  const onIsOpenChange = (isOpen) => {
    setIsOpen(isOpen)
    setCarouselCurrentIndex(index => index + 1)
  }

  const onHide = () => {
    setTimeout(() => {
      setCarouselCurrentIndex(0)
    }, 500);
    onClose()
  }

  const onLastStepChange = (lastStep) => {
    console.log(lastStep)
    setLastStep(lastStep)
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <CloseModalIcon className='close-modal' onClick={onHide} />
      <Modal.Body>
        <Carousel
          slide={false}
          activeIndex={carouselCurrentIndex}
          onSelect={handleCarouselSelect}
          nextIcon={<NextIcon />}
          // nextIcon={null}
          nextLabel={null}
          prevIcon={<PrevIcon />}
          prevLabel={null}
          indicators={false}
          interval={null}
          >
          <Carousel.Item>
            <Step1 />
          </Carousel.Item>
          <Carousel.Item>
            <Step2 onSelect={onIsOpenChange} isMesaOpen={isOpen} />
          </Carousel.Item>
          <Carousel.Item>
            <Step3 onSelect={onTypeChange} onLastStepChange={onLastStepChange} type={type} />
          </Carousel.Item>
          <Carousel.Item>
            <Container>
              {lastStep.includes('interés común') && (
                <CausePicker onSelect={(cause) => setCause(cause)} cause={cause} />
              )}
              {lastStep.includes('territorial') && (
                <ComunaPicker onSelect={(comuna) => setComuna(comuna)} />
              )}
              {lastStep.includes('temática') && (
                <ThemePicker onSelect={(theme) => setTheme(theme)} theme={theme} />
              )}
              <Row className='justify-content-md-center'>
                <Col className='mesa-buttons' md={6}>
                  <Button className='button' onClick={createMesa}>Crear Mesa</Button>
                </Col>
              </Row>
            </Container>
          </Carousel.Item>
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}

export default memo(NewMesa)
