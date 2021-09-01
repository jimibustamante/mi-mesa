import React from 'react'
import { Container } from 'react-bootstrap'
import LandingImage1 from '../images/landing-img-1.png'
import LandingImage2 from '../images/landing-img-2.png'
import LandingImage3 from '../images/landing-img-3.png'
import ChileImg from '../images/chile.png'

export default function Landing() {
  return (
    <div id='landing'>
      <section className='landing-text'>
        <Container fluid>
          <h2>Proceso<br/>Participativo</h2>
          <p>Invitamos a toda la ciudadanía a ser parte del próximo gobierno de Gabriel Boric. Acá podrás presentar ideas, propuestas y anhelos de este nuevo proceso político.</p>
        </Container>
      </section>
      <section className='mesas'>
        <Container fluid>
          <div className='items-list'>
            <div className='item text'>
              <span className='text-med'>
                Nemo enim ipsam
              </span>
              <h2>Mesas<br/>Ciudadanas</h2>
              <span className='text-sm'>
                Invitamos a la ciudadanía a participar de mesas ciudadanas que tienen por objetivo crear instancias de escucha y participación.
              </span>
            </div> 
            <div className='item item-card' style={{backgroundImage: `url(${LandingImage1})`}}>
              <div className='card-content'>
                <h3>Mesas territoriales</h3>
                <span className='text-sm'>
                Júntate con amigos, familiares, vecinos y arma tu propia mesa.
                </span>
                <button>
                  ¡Súmate!
                </button>
              </div>
            </div>
            <div className='item item-card' style={{backgroundImage: `url(${LandingImage2})`}}>
              <div className='card-content'>
                <h3>Mesas temáticas</h3>
                <span className='text-sm'>
                ¡Queremos escuchar todas las opiniones y anhelos de la ciudadanía!
                </span>
                <button>
                  ¡Participa!
                </button>
              </div>
            </div>
            <div className='item item-card' style={{backgroundImage: `url(${LandingImage3})`}}>
              <div className='card-content'>
                <h3>Mesas por Causa</h3>
                <span className='text-sm'>
                ¿El reciclaje de plásticos es tu foco de trabajo? ¡Queremos escucharte!
                </span>
                <button>
                  ¡Únete!
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className='territorios'>
        <img src={ChileImg} alt='Chile' className='territorios-img' />
        <div className='content'>
          <span className='text-med'>
            Nemo enim ipsam
          </span>
          <h2>Territorios</h2>
          <button>Descubre más</button>
        </div>
      </section>
    </div>
  )
}
