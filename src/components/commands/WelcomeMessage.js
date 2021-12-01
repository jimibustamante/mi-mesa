import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useUserContext } from '../../contexts/UserContext'
import { ReactComponent as CloseModalIcon } from '../../images/close-modal.svg'

export default function WelcomeMessage() {
  const [show, setShow] = useState(false)
  const [userState] = useUserContext()
  const { currentUser } = userState

  // Get the user's first time value from localStorage
  const getFirstTime = () => {
    const firstTime = localStorage.getItem(
      `${currentUser.id || currentUser.uid}.firstTime`
    )
    console.log({ firstTime })
    return !firstTime || firstTime === 'false' ? false : true
  }

  // Saves in localStorage when user got to the welcome message view for the first time.
  const saveFirstTime = (value) => {
    localStorage.setItem(
      `${currentUser.id || currentUser.uid}.firstTime`,
      value.toString()
    )
  }

  useEffect(() => {
    if (!currentUser) return
    const firstTime = getFirstTime()
    if (!firstTime) {
      saveFirstTime(true)
      setShow(true)
    }
  }, [currentUser])

  return (
    <Modal
      size='md'
      className='more-info-modal'
      show={show}
      onHide={() => setShow(false)}
      centered
    >
      <CloseModalIcon className='close-modal' onClick={() => setShow(false)} />
      <Modal.Body className='welcome-message-body more-info-modal-body'>
        <h2>¿Cómo armar tu comando?</h2>
        <p>
          Para armar tu comando ciudadano solo debes seguir los siguientes
          pasos:
        </p>
        <ol>
          <li>
            <p>Haz clic en “Crea un nuevo comando”</p>
          </li>
          <li>
            <p>Contesta las preguntas que vienen a continuación</p>
          </li>
          <li>
            <p>
              Invita a tus amigos, familiares, vecinos y todas las personas que
              quieras
            </p>
          </li>
          <li>
            <p>
              Arma un grupo de Whatsapp, Telegram, Instagram, Facebook o incluso
              un formulario y coordinen todas las actividades que harán como
              comando.
            </p>
          </li>
        </ol>
      </Modal.Body>
    </Modal>
  )
}
