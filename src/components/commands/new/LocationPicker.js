import { memo } from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap'

const LocationPicker = ({ onSelect, cause }) => {
  const onChange = (e) => {
    onSelect(e.target.value)
  }

  return (
    <Container style={{ marginBottom: '50px' }}>
      <Row className='justify-content-sm-center'>
        <Col md={8}>
          <h2
            style={{ fontSize: '20px', marginBottom: '20px' }}
            className='text-center'
          >
            Escribe el nombre de tu barrio, calle o comuna
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-sm-center'>
        <Col md={8}>
          <Form autoComplete='off'>
            <Form.Group controlId='type'>
              <Form.Control type='text' value={cause} onChange={onChange} />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(LocationPicker)
