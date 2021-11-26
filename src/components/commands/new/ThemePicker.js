import { memo, useState } from 'react'
import { Form, Container, Row, Col } from 'react-bootstrap'

const ThemePicker = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)

  const onThemeChange = (e) => {
    setTheme(e.target.value)
    onSelect(e.target.value)
    if (e.target.value) {
      setSelectedTheme(null)
      setSearchQuery('')
    }
  }

  return (
    <Container style={{ marginBottom: '50px' }}>
      <h2
        style={{ fontSize: '20px', marginBottom: '20px' }}
        className='text-center'
      >
        Escribe el tema que convocará a las personas para participar en este
        comando
      </h2>

      <Row className='justify-content-md-center'>
        <Col md={10}>
          <span>
            Por ejemplo: Cultura por Boric, Ciclistas por Boric, Emprendedores
            por Boric, etc.
          </span>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} className='justify-content-md-center'>
        <Col md={10}>
          <Form autoComplete='off'>
            <Form.Group controlId='type'>
              <Form.Control
                size='sm'
                type='text'
                value={theme}
                onChange={onThemeChange}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(ThemePicker)
