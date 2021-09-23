import React from 'react'
import { Modal } from 'react-bootstrap'
import { ReactComponent as CloseModalIcon } from '../images/close-modal.svg'

export default function ConsultMoreInfo({show, onHide}) {
  return (
    <Modal  size='lg' className='more-info-modal' show={show} onHide={onHide}>
      <CloseModalIcon className='close-modal' onClick={onHide} />
      <Modal.Body>
        <div>
          <p className='question' style={{color: '#1BDAB0'}}>¿Qué es una consulta ciudadana?</p>
          <p className='answer'>Es un espacio donde podrás contestar de forma individual a un cuestionario. En él, te invitamos 
            a priorizar los temas que más te importan y con ello, aportar a la hoja de ruta de un eventual Gobierno de Apruebo 
            Dignidad.
          </p>
        </div>
        <div>
          <p className='question' style={{color: '#1BDAB0'}}>¿Para qué sirven?</p>
          <p className='answer'>Es la forma más rápida para poder participar. La consulta ciudadana nos servirá para identificar 
            cuáles son los temas más relevantes para la ciudadanía, y con ellos, poder priorizar el trabajo en marzo de 2022.
          </p>
        </div>
        <div>
          <p className='question' style={{color: '#1BDAB0'}}>¿Qué harán con las respuestas?</p>
          <p className='answer'>Tus respuestas serán sistematizadas, junto a la de muchas otras personas, gracias a una tecnología 
            de inteligencia artificial que es capaz de procesar texto y lenguaje.
          </p>
        </div>
      </Modal.Body>
    </Modal>
  )
}
