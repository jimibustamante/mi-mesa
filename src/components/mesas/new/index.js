import { memo, useState, useEffect, useCallback } from 'react'
import { db } from '../../../lib/firebaseApp'
import useFlameLinkApp from '../../../hooks/useFlamelinkApp'
import { ReactComponent as CloseModalIcon } from '../../../images/close-modal.svg'

import { useUserContext } from '../../../contexts/UserContext'
import { useMesaContext } from '../../../contexts/MesaContext'
import { Button, Modal, Container, Row, Col, Form } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Back from './Back'
import ComunaPicker from './ComunaPicker'
import CausePicker from './CausePicker'
import ThemePicker from './ThemePicker'

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
  const { createRecord, getTypes, getContentBy } = useFlameLinkApp()
  const { currentUser } = userState

  const getCoordinator = useCallback(async () => {
    const data = await getContentBy('coordinador', 'userId', currentUser.uid)
    return data[0] || {}
  }, [currentUser])
    
  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
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
    } else if (type === 'por causa') {
      return cause
    }
  }

  const createMesa = async () => {
    // TODO: Validate
    const selectedType = mesaTypes.find(mt => mt.name === type)
    if (!selectedType) return
    const coordinator = await getCoordinator()

    const newMesa = await createRecord('mesa', {
      name: mesaName(),
      userId: currentUser.uid,
      open: isOpen,
      comuna,
      cause,
      theme,
      nextEvent: (new Date(0)).toISOString(),
      mesaType: db().doc(`/fl_content/${selectedType.id}`),
      coordinator: db().doc(`/fl_content/${coordinator.id}`),
    })
    setIsOpen(null)
    setCause('')
    setTheme('')
    setComuna('')
    setType('')
    setLastStep('')
    setCarouselCurrentIndex(0)
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
    setLastStep(lastStep)
  }

  const next = () => {
    setCarouselCurrentIndex(index => index + 1)
  }

  const back = () => {
    setCarouselCurrentIndex(index => index - 1)
  }

  const createButtonDisabled = useCallback(() => {
    switch (lastStep) {
      case 'territorial':
        return comuna === ''
      case 'por causa':
        return cause.length < 5
      case 'temática':
        return theme.length < 5
      case 'por causa territorial':
        return cause.length < 5 || comuna === ''
      default:
        return true
    }
  }, [cause, comuna, lastStep, theme])
  // console.log({carouselCurrentIndex, onCreate , show, onClose})

  const disabled = createButtonDisabled()
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <CloseModalIcon className='close-modal' onClick={onHide} />
      {show && (
        <Modal.Body>
          <Carousel
            slide={false}
            controls={false}
            activeIndex={carouselCurrentIndex}
            onSelect={handleCarouselSelect}
            indicators={false}
            interval={null}
            >
            <Carousel.Item>
              
              <Step1 next={next} />
            </Carousel.Item>
            <Carousel.Item>
              <Step2 next={next} back={back} onSelect={onIsOpenChange} isMesaOpen={isOpen} />
            </Carousel.Item>
            <Carousel.Item>
              <Step3 back={back} onSelect={onTypeChange} onLastStepChange={onLastStepChange} type={type} />
            </Carousel.Item>
            <Carousel.Item>
              <Container>
                <Back onBack={back} />
                {lastStep.includes('por causa') && (
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
                    <Button disabled={disabled} className='button' onClick={createMesa}>Crear Mesa</Button>
                  </Col>
                </Row>
              </Container>
            </Carousel.Item>
          </Carousel>
        </Modal.Body>
      )}
    </Modal>
  )
}

export default memo(NewMesa)
