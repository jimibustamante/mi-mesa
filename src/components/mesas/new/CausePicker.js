import { memo } from 'react'
import { Container, Form } from 'react-bootstrap'

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

export default memo(CausePicker)
