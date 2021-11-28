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
        ¿Qué nombre le damos a este comando ciudadano? Describe el tema que lo
        convoca
      </h2>

      <Row className='justify-content-md-center'>
        <Col md={10}>
          <span>
            Usa un nombre descriptivo del tema que convoca a este comando como
            por ejemplo “Cultura x Boric” o “Ciclistas x Boric”
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
