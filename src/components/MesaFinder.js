import React, { useEffect, useState } from 'react'
import useFlameLinkApp from '../hooks/useFlamelinkApp'
import { Table } from 'react-bootstrap'
import { useMesaContext } from '../contexts/MesaContext'
import { Button } from '@mui/material'

export default function MesaFinder() {
  const { flamelinkLoaded, getOpenedMesas, getTypes, getCoordinators } = useFlameLinkApp()
  const [mesas, setMesas] = useState([])
  const [sortings, setSortings] = useState({})
  const [coordinators, setCoordinators] = useState([])
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState

  useEffect(() => {
    if (flamelinkLoaded) {
      getOpenedMesas().then(_mesas => {
        console.log(_mesas)
        setMesas(Object.values(_mesas))
      })
      getCoordinators().then(_coordinators => {
        console.log({_coordinators})
        setCoordinators(Object.values(_coordinators))
      })
    }
  }, [flamelinkLoaded])

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        dispatch({ type: 'SET_MESA_TYPES', payload: types })
      })
    }
  }, [mesaTypes, dispatch])

  function mesaTypeName(typeId) {
    if (!mesaTypes) return ''
    return mesaTypes.find(mt => mt.id === typeId)?.name
  }

  function getCoordinatorContact(coordinatorId) {
    if (coordinators.length <= 0) return ''
    const email = coordinators.find(c => c.userId === coordinatorId)?.email
    return email || 'mesas@boricpresidente.cl'
  }

  function setEmail(mesa) {
    console.log({mesa})
    const body = `
      Hola, te envío este correo para unirme a la mesa ciudadana que coordinas.
    `
    const subject = `Mesa Ciudadana - ${mesa.name}`
    return `mailto:${getCoordinatorContact(mesa.userId)}?subject=${decodeURIComponent(subject)}&body=${decodeURIComponent(body)}`
  }

  function sortByMesaTypeName(a, b) {
    const aName = mesaTypeName(a.mesaType.id)
    const bName = mesaTypeName(b.mesaType.id)
    if (aName < bName) return -1
    if (aName > bName) return 1
    return 0
  }

  function sortListBy(event) {
    event.preventDefault()
    const sortBy = event.target.name
    switch (sortBy) {
      case 'mesaType':
        let sortedMesas = Object.assign([], mesas).sort(sortByMesaTypeName)
        if (sortings[sortBy] === 'desc') {
          sortedMesas = sortedMesas.reverse()
        }
        setSortings({ ...sortings, [sortBy]: sortings[sortBy] === 'desc' ? 'asc' : 'desc' })
        setMesas(sortedMesas)
        break
      default:
        break
    }
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Título</th>
          <th>
            <Button as='a' href='#' name='mesaType' onClick={sortListBy}>Mesa</Button>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {mesas.map(mesa => {
          const mailTo = setEmail(mesa)
          return (
            <tr key={mesa.id}>
              <td>{mesa.name}</td>
              <td>{mesaTypeName(mesa.mesaType.id)}</td>
              <td>
                <Button as='a' href={mailTo} className='btn'>
                  Participar
                </Button>
              </td>
            </tr>
          )}
        )}
      </tbody>
    </Table>
  )
}
