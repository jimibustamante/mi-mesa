import React from 'react'
import { Modal } from 'react-bootstrap'
import { ReactComponent as CloseModalIcon } from '../images/close-modal.svg'

export default function MesasMoreInfo({show, onHide}) {
  return (
    <Modal  size='lg' className='more-info-modal' show={show} onHide={onHide}>
      <CloseModalIcon className='close-modal' onClick={onHide} />
      <Modal.Body>
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
      </Modal.Body>
    </Modal>
  )
}
