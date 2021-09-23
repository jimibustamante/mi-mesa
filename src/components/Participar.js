import React, { useEffect } from 'react'
import { Col, Container, Row, Button} from 'react-bootstrap'
import ComoParticiparImage1 from '../images/como-participar-img-1.png'
import ComoParticiparImage1Mob from '../images/como-participar-img-1-mob.png'
import ComoParticiparImage2 from '../images/como-participar-img-2.png'
import ComoParticiparImage2Mob from '../images/como-participar-img-2-mob.png'
import { Link } from 'react-router-dom'
import { ReactComponent as ArrowDown } from '../images/arrow-down.svg'
import { ReactComponent as NotepadIcon } from '../images/notepad-icon.svg'
export default function Participar() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div id='participar'>
      <section className='landing-text'>
        <Container fluid>
          <h2>¿Cómo<br/>participar?</h2>
          <p className='subtitle'>Tenemos dos mecanismos de participación abiertos a toda la ciudadanía para que creemos, 
            juntos y juntas, el futuro Gobierno de Gabriel Boric.
            <br/>
            <a href='#content'>
              <ArrowDown href='#content' />
            </a>
          </p>
        </Container>
      </section>
      <section id='content' className='description'>
        <Row>
          <Col xs={12}>
            <h2>
              Mesas<br/>Ciudadanas
            </h2>
          </Col>
        </Row>
      </section>

      <section className='mesas'>
        <div className='mesas-container' >
          <Row style={{marginBottom: '100px'}}>
            <Col xs={12} md={6}>
              <img src={ComoParticiparImage1} className='hide-mob' alt='¿Cómo participar?' />
              <img src={ComoParticiparImage1Mob} className='hide-desk' alt='¿Cómo participar?' />
            </Col>
            <Col xs={12} md={6} style={{margin: '30px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <p className='question'>¿Qué es una mesa ciudadana?</p>
                <p className='answer'>Son espacios de participación donde te <b>invitamos a sentarte a una mesa, virtual o presencial</b>
                  , y así conversar sobre un tema, un territorio o una causa. Puedes crear la tuya propia o sumarte a una ya existente.
                </p>
              </div>
              <div>
                <p className='question'>¿Para qué sirven?</p>
                <p className='answer'>Queremos escuchar a la ciudadanía, por eso creamos las mesas ciudadanas que tienen por objetivo <b>
                  generar conversaciones</b> de manera descentralizada, tanto a nivel territorial como de sector de interés, que incidan 
                  directamente en el programa de gobierno de Gabriel Boric. Todo lo que sea compartido en estas mesas será sistematizado 
                  por el equipo de Gabriel y utilizado para no sólo enriquecer el programa, sino también para priorizar el trabajo durante 
                  os primeros meses de un eventual gobierno.
                </p>
              </div>
              <div>
                <p className='question'>¿Cómo puedo participar?</p>
                <p className='answer'>Puedes <b>crear tu propia mesa o o unirte a una ya existente,</b> gestionada desde nuestro comando 
                  para sumarlas a este proyecto transformador. En ambos casos podrás elegir el tema o causa a tratar para hacer llegar tus 
                  ideas, propuestas y anhelos para este nuevo gobierno.
                </p>
              </div>
              <div className='buttons'>
                <a className='btn' href='https://forms.gle/gx5VToy6BgKjuBxT9' target='_blank' >
                  Únete a una mesa
                </a>
                <Button as={Link} to='/sign-in'>Create tu mesa</Button>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className='consulta-ciudadana'>
        <div className='header'>
          <h2>
            Consulta<br/>Ciudadana
          </h2>
          <NotepadIcon />
        </div>
        <div className='mesas-container' >
          <Row style={{marginBottom: '100px'}}>
            <Col className='faqs' xs={12} md={6} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <p className='question' style={{color: '#59C885'}}>¿Qué es una consulta ciudadana?</p>
                <p className='answer'>Es un espacio donde podrás contestar de forma individual a un cuestionario. En él, te invitamos 
                  a priorizar los temas que más te importan y con ello, aportar a la hoja de ruta de un eventual Gobierno de Apruebo 
                  Dignidad.
                </p>
              </div>
              <div>
                <p className='question' style={{color: '#59C885'}}>¿Para qué sirven?</p>
                <p className='answer'>Es la forma más rápida para poder participar. La consulta ciudadana nos servirá para identificar 
                  cuáles son los temas más relevantes para la ciudadanía, y con ellos, poder priorizar el trabajo en marzo de 2022.
                </p>
              </div>
              <div>
                <p className='question' style={{color: '#59C885'}}>¿Qué harán con las respuestas?</p>
                <p className='answer'>Tus respuestas serán sistematizadas, junto a la de muchas otras personas, gracias a una tecnología 
                  de inteligencia artificial que es capaz de procesar texto y lenguaje.
                </p>
              </div>
              <div className='buttons' style={{display: 'flex', gap: '10px'}}>
                <a className='btn' style={{backgroundColor: '#59C885'}} href='https://tll5o6hb21g.typeform.com/to/gRt8fnSE' target='_blank' >
                  Contesta acá
                </a>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <img src={ComoParticiparImage2} className='hide-mob' alt='¿Cómo participar?' />
              <img src={ComoParticiparImage2Mob} className='hide-desk' alt='¿Cómo participar?' />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}
