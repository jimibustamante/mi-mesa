import { memo, useState, useEffect } from 'react'
import { Form, Container, Row, Col } from 'react-bootstrap'
import mesasTematicas from '../../../data/mesas-tematicas.js'

const ThemePicker = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredThemes, setFilteredThemes] = useState([])
  const [alternativeTheme, setAlternativeTheme] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)

  const onAlternativeChange = (e) => {
    setAlternativeTheme(e.target.value)
    onSelect(e.target.value)
    if (e.target.value) {
      setSelectedTheme(null)
      setSearchQuery('')
    }
  }

  const onQueryChange = () => {
    if (searchQuery.length > 1) {
      let filtered = mesasTematicas.filter((theme) => {
        const res = theme.toLowerCase().search(searchQuery.toLowerCase())
        return res >= 0
      })
      setFilteredThemes(filtered)
    } else {
      setFilteredThemes([])
    }
  }

  const onClickItemSearch = (e) => {
    setSearchQuery(e.target.innerText)
    setFilteredThemes([])
    setSelectedTheme(e.target.innerText)
    onSelect(e.target.innerText)
  }

  useEffect(() => {
    onQueryChange()
  }, [searchQuery])

  return (
    <Container style={{marginBottom: '50px'}}>
      <h2 style={{fontSize: '20px', marginBottom: '20px'}} className='text-center'>¿Cual de las siguientes temáticas será el asunto principal a tratar en esta mesa?</h2>
      <Row style={{marginBottom: '50px'}} className='justify-content-md-center' >
        <Col md={10}>
          <Form autoComplete="off">
            <Form.Group controlId="type" className='dropdown-container'>
              <Form.Control size='sm' type="text" value={searchQuery} placeholder='Buscar...' onChange={(e) => setSearchQuery(e.target.value)} />
              <div className='theme-dropdown'>
                {filteredThemes.map((theme, i) => {
                  return (
                    <div key={i} className='theme-item' onFocus={() => {debugger; setSelectedTheme(null); setSearchQuery('')}} onClick={onClickItemSearch}>
                      {theme}
                    </div>
                  )
                })}
              </div>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md={10}>
          <span>* Si tu tema no aparece en la lista, por favor indica cuál sería la temática de la mesa: </span>
        </Col>
      </Row>
      <Row style={{marginTop: '20px'}} className='justify-content-md-center'>
        <Col md={10}>
          <Form autoComplete="off">
            <Form.Group controlId="type">
              <Form.Control size='sm' type="text" value={alternativeTheme} onChange={onAlternativeChange} />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(ThemePicker)
