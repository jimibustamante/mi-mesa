import { memo, useState, useEffect, useCallback } from 'react'
import { db } from '../../../lib/firebaseApp'
import useFlameLinkApp from '../../../hooks/useFlamelinkApp'
import { ReactComponent as CloseModalIcon } from '../../../images/close-modal.svg'

import { useUserContext } from '../../../contexts/UserContext'
import { useCommandContext } from '../../../contexts/CommandContext'
import { Button, Modal, Container, Row, Col } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'

import Step1 from './Step1'
import Step2 from './Step2'
import Back from './Back'
import ComunaPicker from './ComunaPicker'
import LocationPicker from './LocationPicker'
import ThemePicker from './ThemePicker'

const NewCommand = ({ onCreate, show, onClose }) => {
  const [type, setType] = useState('')
  const [theme, setTheme] = useState('')
  const [pais, setPais] = useState('Chile')
  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [location, setLocation] = useState('')
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  const [userState] = useUserContext()
  const [commandState, dispatch] = useCommandContext()
  const { commandTypes } = commandState
  const { createRecord, getCommandTypes, getContentBy } = useFlameLinkApp()
  const { currentUser } = userState

  const getCoordinator = useCallback(async () => {
    const data = await getContentBy('coordinador', 'userId', currentUser.uid)
    return data[0] || {}
  }, [currentUser])

  useEffect(() => {
    if (commandTypes.length === 0) {
      getCommandTypes().then((types) => {
        dispatch({ type: 'SET_COMMAND_TYPES', payload: types })
      })
    }
  }, [commandTypes, dispatch])

  const handleCarouselSelect = (selectedIndex, e) => {
    setCarouselCurrentIndex(selectedIndex)
  }

  const commandName = () => {
    if (type === 'temático') {
      return theme
    } else if (type === 'territorial') {
      return location
    } else {
      return ''
    }
  }

  const createCommand = async () => {
    const selectedType = commandTypes.find((mt) => mt.name === type)
    if (!selectedType) return
    const coordinator = await getCoordinator()
    console.log({ coordinator })
    if (!coordinator) return
    const newCommand = await createRecord('command', {
      name: commandName(),
      userId: currentUser.uid,
      theme,
      description: commandName(),
      commune: comuna,
      region,
      country: pais,
      location,
      nextEvent: new Date(0).toISOString(),
      commandType: db().doc(`/fl_content/${selectedType.id}`),
      coordinator: db().doc(`/fl_content/${coordinator.id}`),
    })

    setTheme('')
    setType('')
    setCarouselCurrentIndex(0)
    onCreate(newCommand)
  }

  const onTypeChange = (typeName) => {
    setType(typeName)
    setCarouselCurrentIndex((index) => index + 1)
  }

  const onHide = () => {
    setTimeout(() => {
      setCarouselCurrentIndex(0)
    }, 500)
    onClose()
  }

  const next = () => {
    setCarouselCurrentIndex((index) => index + 1)
  }

  const back = () => {
    setCarouselCurrentIndex((index) => index - 1)
  }

  const createButtonDisabled = useCallback(() => {
    if (!type) return true
    switch (type) {
      case 'territorial':
        console.log({ pais, location, comuna, region, theme })
        if (pais && pais === 'Chile') {
          return !location || !comuna || !region
        }
        return !pais || !location
      case 'temático':
        return !theme
      default:
        return true
    }
  }, [location, pais, comuna, region, type, theme])
  // console.log({carouselCurrentIndex, onCreate , show, onClose})

  const disabled = createButtonDisabled()
  return (
    <Modal show={show} onHide={onHide} size='lg'>
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
              <Step2
                next={next}
                back={back}
                onSelect={onTypeChange}
                type={type}
              />
            </Carousel.Item>
            <Carousel.Item>
              <Container>
                <Back onBack={back} />
                {type && type === 'territorial' && (
                  <>
                    <ComunaPicker
                      onSelect={(comuna) => setComuna(comuna)}
                      onRegionSelect={(region) => setRegion(region)}
                      onPaisSelect={(pais) => setPais(pais)}
                    />
                    <LocationPicker onSelect={(loc) => setLocation(loc)} />
                  </>
                )}
                {type && type === 'temático' && (
                  <ThemePicker
                    onSelect={(theme) => setTheme(theme)}
                    theme={theme}
                  />
                )}
                <Row className='justify-content-md-center'>
                  <Col className='mesa-buttons' md={6}>
                    <Button
                      disabled={disabled}
                      className='button'
                      onClick={createCommand}
                    >
                      Crear Comando
                    </Button>
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

export default memo(NewCommand)
