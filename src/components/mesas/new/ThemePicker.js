import { memo } from 'react'
import { Form, Container } from 'react-bootstrap'

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

export default memo(ThemePicker)
