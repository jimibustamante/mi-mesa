import { useEffect, useState, useCallback } from 'react'
import { functions } from '../../lib/firebaseApp'
import { useParams } from 'react-router-dom'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { useMesaContext } from '../../contexts/MesaContext'
import { Container, Row, Col } from 'react-bootstrap'
import Participants from '../participants/Participants'
import DocsList from './DocsList'
import Events from './Events'
import Alert from '../Alert'

import { ReactComponent as TableIcon } from '../../images/table.svg'

export default function Show() {
  const { mesaId } = useParams()
  const [showAlert, setShowAlert] = useState(false)
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const [mesa, setMesa] = useState(null)
  const { getMesaById, getTypes } = useFlameLinkApp()

  const getMesa = useCallback(async () => {
    try {
      const mesa = await getMesaById(mesaId)
      setMesa(mesa)
      if (!mesa.calendarId) {
        setShowAlert(true)
      // functions().useEmulator("localhost", 5001)
      const createCalendar = functions().httpsCallable('createCalendar')
        const data = {
          mesaId: mesa.id,
          mesaName: mesa.name,
          userId: mesa.userId,
        }
        await createCalendar(data)
      } 
      else {
        functions().useEmulator("localhost", 5001)
        const createAllEvents = functions().httpsCallable('createAllEvents')
        await createAllEvents()
        // const updateMesaEvent = functions().httpsCallable('updateMesaEvent')
        // const resp = await updateMesaEvent({mesaId, start: new Date(2021, 10, 23, 18, 0)})
        // console.log({resp})
      }
    } catch (error) {
      console.error(error)
    }
  }, [getMesaById, mesaId])

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        dispatch({ type: 'SET_MESA_TYPES', payload: types })
      })
    }
  }, [mesaTypes, dispatch])

  useEffect(() => {
    if (!mesaId) return
    if (mesaTypes.length > 0)
      getMesa()
  }, [mesaId, mesaTypes])


  return (
    mesa ? (
      <Container id='show-mesa'>
        <Alert show={showAlert} onHide={() => setShowAlert(false)} message='Para que los eventos aparezcan en tu calendario, debes aceptar la invitación que llegó a tu correo.' />
        <Row style={{marginBottom: '25px'}} md={12} className='show-mesa-header'>
          <Col md={2}>
            <TableIcon className='show-mesa-header-icon' />
          </Col>
          <Col md={6}>
            <h2 className='name'>{mesa.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Hola! Aquí está todo lo que necesitas para armar tu Mesa Ciudadana. 
              Por favor lee con cuidado los documentos metodológicos, revisa los videos tutoriales, 
              y revisa también las herramientas de tabulación de los resultados de tu Mesa Ciudadana. 
              Queremos que conozcas bien toda la información antes de iniciar el trabajo de tu mesa. 
              Si necesitas apoyo no dudes en escribirnos en mesas@boricpresidente.cl
            </p>
          </Col>
        </Row>
        <Participants mesa={mesa} />
        <DocsList mesa={mesa} mesaTypes={mesaTypes} />
        {mesa.calendarId && <Events mesa={mesa} />}
      </Container>
    ) : (
      // TODO: Here should be a loading component
      ''
    )
  )
}
