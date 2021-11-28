import { memo, useState, useEffect } from 'react'
import REGIONES_DB from '../../../data/regiones'
import PAISES_DB from '../../../data/paises'
import { Form, Container, Row, Col } from 'react-bootstrap'

const ComunaPicker = ({ onSelect, onRegionSelect, onPaisSelect }) => {
  const regiones = Object.keys(REGIONES_DB)
  const paises = PAISES_DB
  console.log({ paises })
  const [comunas, setComunas] = useState([])
  const [selectedPais, setSelectedPais] = useState('Chile')
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedComuna, setSelectedComuna] = useState(null)

  const handlePaisChange = (e) => {
    setSelectedPais(e.target.value)
    setSelectedRegion(null)
    setSelectedComuna(null)
    onPaisSelect(e.target.value)
  }

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value)
    onRegionSelect(e.target.value)
  }

  const handleComunaChange = (e) => {
    setSelectedComuna(e.target.value)
    onSelect(e.target.value)
  }

  useEffect(() => {
    if (selectedRegion) {
      const comunas = REGIONES_DB[selectedRegion].comunas
      setComunas(comunas)
    }
  }, [selectedRegion, REGIONES_DB])

  return (
    <Container style={{ marginBottom: '50px' }}>
      <h2
        style={{ fontSize: '20px', marginBottom: '25px' }}
        className='text-center'
      >
        Indícanos el lugar de tu comando
      </h2>
      <Form autoComplete='off'>
        <Form.Group controlId='type'>
          <Row className='justify-content-sm-center'>
            <Col sm={6}>
              <Form.Control
                style={{ marginBottom: '30px' }}
                as='select'
                name='país'
                value={selectedPais}
                placeholder='País'
                onChange={handlePaisChange}
              >
                <option key='none' value=''>
                  Selecciona tu país
                </option>
                {paises.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          {selectedPais && selectedPais === 'Chile' && (
            <Row className='justify-content-sm-center'>
              <Col sm={6}>
                <Form.Control
                  style={{ marginBottom: '30px' }}
                  as='select'
                  name='región'
                  value={selectedRegion}
                  placeholder='Región'
                  onChange={handleRegionChange}
                >
                  <option key='none' value=''>
                    Selecciona región
                  </option>
                  {regiones.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
          )}
          {selectedPais && selectedPais === 'Chile' && comunas.length > 0 && (
            <Row className='justify-content-sm-center'>
              <Col sm={6}>
                <Form.Control
                  as='select'
                  name='comuna'
                  value={selectedComuna}
                  onChange={handleComunaChange}
                >
                  <option key='none' value=''>
                    Selecciona comuna
                  </option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
          )}
        </Form.Group>
      </Form>
    </Container>
  )
}

export default memo(ComunaPicker)
