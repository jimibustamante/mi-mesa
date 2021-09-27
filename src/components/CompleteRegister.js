import React, { useState, useEffect } from 'react'

import Loading from './Loading'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { Button, Container, Form, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import useFlameLinkApp from '../hooks/useFlamelinkApp'

import '../styles/CompleteRegister.scss'

import REGIONES_DB from '../data/regiones'

// Complete register component.
// This component is responsible for the complete register process.

export default function CompleteRegister() {
  const [loading, setLoading] = useState(true)
  const [coordinator, setCoordinator] = useState(null)
  const [phoneNumber, setPhoneNumbre] = useState('')
  const [comunas, setComunas] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedComuna, setSelectedComuna] = useState(null)
  const history = useHistory()
  const [userState] = useUserContext()
  const { currentUser } = userState

  const { getCoordinator, createRecord } = useFlameLinkApp()

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value)
  }

  const handleComunaChange = (e) => {
    setSelectedComuna(e.target.value)
  }

  const regiones = Object.keys(REGIONES_DB)

  // Validates phone number format with regex.
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11}$/
    return regex.test(phoneNumber)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const coordinator = await createRecord('coordinador', {
        name: currentUser.displayName,
        email: currentUser.email,
        userId: currentUser.uid || currentUser.id,
        phone: phoneNumber,
        comuna: selectedComuna,
      })
      console.log({coordinator})
      debugger
      if (coordinator) {
        setCoordinator(coordinator)
        history.push('/mesas')
      } else {
        console.error('Error creating coordinator')
      }
    } catch (error) {
      console.error({error})
    }
  }

  // Redirects to "/mesas" if user has phone number registered.
  const disabled = !validatePhoneNumber(phoneNumber) || !selectedRegion || !selectedComuna

  useEffect(() => {
    if (selectedRegion) {
      const comunas = REGIONES_DB[selectedRegion].comunas
      setComunas(comunas)
    }
  }, [selectedRegion, REGIONES_DB])

  useEffect(() => {
    if (currentUser && !coordinator) {
      getCoordinator(currentUser.id || currentUser.uid).then((_coordinator) => {
        console.log({_coordinator})
        setCoordinator(_coordinator)
        setLoading(false)
        if (_coordinator) {
          history.push('/mesas')
        }
      })
    }
  }, [coordinator, currentUser])

  return (
    loading ? <Loading /> :
      <Container id='complete-register'>
        <div className='form-wrapper'>
          <Form onSubmit={handleSubmit}>
            <h3>Por favor ingresa tu teléfono</h3>
            <p>Nuestro equipo se pondrá en contacto contigo</p>
            <Row className='justify-content-sm-center'>
              <Col sm={12} md={10}>
                <Form.Group >
                  <PhoneInput
                    country={'cl'}
                    value={phoneNumber}
                    placeholder='+56 912345678'
                    onChange={(phone) => setPhoneNumbre(phone)}
                    regions={['south-america']}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h3>¿En qué comuna vives?</h3>
            <Form.Group >
              <Row className='justify-content-sm-center'>
                <Col sm={12} md={10}>
                  <Form.Control style={{marginBottom: '30px'}} as="select" name='región' value={selectedRegion} placeholder='Región' onChange={handleRegionChange}>
                    <option key='none' value=''>Selecciona región</option>
                    {regiones.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
              {comunas.length > 0 && (
                <Row className='justify-content-sm-center'>
                  <Col sm={12} md={10}>
                    <Form.Control as="select" name='comuna' value={selectedComuna} onChange={handleComunaChange}>
                      <option key='none' value=''>Selecciona comuna</option>
                      {comunas.map((comuna) => (
                        <option key={comuna} value={comuna}>{comuna}</option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              )}
            </Form.Group>
            <Row className='justify-content-sm-center'>
              <Col className='mesa-buttons'>
                <Button type='submit' disabled={disabled}>
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
  )
}
