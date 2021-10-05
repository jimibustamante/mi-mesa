import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { functions } from '../../lib/firebaseApp'
import { useMesaContext } from '../../contexts/MesaContext'
import { Container, Row, Col } from 'react-bootstrap'
import Participants from '../participants/Participants'
import DocsList from './DocsList'
import Events from './Events'
import { ReactComponent as TableIcon } from '../../images/table.svg'

export default function Show() {
  const { mesaId } = useParams()
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const [mesa, setMesa] = useState(null)
  const { getMesaById, getTypes, updateRecord } = useFlameLinkApp()

  const getMesa = useCallback(async () => {
    try {
      const mesa = await getMesaById(mesaId)
      console.log({mesa})
      setMesa(mesa)
      if (!mesa.calendarId) {
        // functions().useEmulator("localhost", 5001)
        const createCalendar = functions().httpsCallable('createCalendar')
        const data = {
          mesaId: mesaId,
          mesaName: mesa.name,
          userId: mesa.userId,
        }
        const response = await createCalendar(data)
        const calendarId = response.data.calendarId
        if (calendarId) {
            await updateRecord('mesa', mesa.id, {
            calendarId,
          })
          setMesa({...mesa, calendarId})
        }
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

  // useEffect(() => {
  //   // console.log({mesa})
  //   functions().useEmulator("localhost", 5001)
  //   const createCalendarAll = functions().httpsCallable('createCalendarAll')
  //   createCalendarAll().then((resp) => {
  //     console.log({resp})
  //   })
  // }, [])

  
  return (
    mesa ? (
      <Container id='show-mesa'>
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
        <Events mesa={mesa} />
      </Container>
    ) : (
      // TODO: Here should be a loading component
      ''
    )
  )
}
