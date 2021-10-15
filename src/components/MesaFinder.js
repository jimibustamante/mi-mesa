import React, { useEffect, useState } from 'react'
import { functions } from '../lib/firebaseApp'
import { ReactComponent as SearchIcon } from '../images/search-icon.svg'
import useFlameLinkApp from '../hooks/useFlamelinkApp'
import { Table, Button } from 'react-bootstrap'
import { useMesaContext } from '../contexts/MesaContext'
// import { Button } from '@mui/material'
import Participate from './participants/Participate'

const FinderFileters = ({filters, mesaTypes, setFilters}) => {
  const { type, query } = filters

  const onChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  return (
    <div className='filters'>
      <label>
        <SearchIcon />
        <input type="text" placeholder='Buscar por palabra clave' value={query} name='query' onChange={onChange} />
      </label>
      <label>
        Tipo de de mesa:
        <select value={filters.type} name='type' onChange={onChange}>
          <option value="">Todo</option>
          {mesaTypes?.map(mesaType => (
            <option key={mesaType.id} value={mesaType.name}>
              {mesaType.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default function MesaFinder() {
  const { flamelinkLoaded, getOpenedMesas, getTypes, getCoordinators } = useFlameLinkApp()
  const [mesas, setMesas] = useState([])
  const [filteredMesas, setFilteredMesas] = useState([])
  const [filters, setFilters] = useState({})
  const [sortings, setSortings] = useState({})
  const [coordinators, setCoordinators] = useState([])
  const [showParticipate, setShowParticipate] = useState(false)
  const [toParticipateMesa, setToParticipateMesa] = useState(null)
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState

  // useEffect(() => {
  //   if (mesas.length) {
  //     const mesa = mesas[0]
  //     functions().useEmulator("localhost", 5001)
  //     functions().httpsCallable('getCalendarEvents')(mesa.calendarId).then(res => {
  //       console.log({res})
  //     })
  //   }
  // }, [mesas])

  const filterMesas = () => {
    const { type, query } = filters
    const filteredMesas = mesas.filter(mesa => {
      if (type && mesaTypeName(mesa?.mesaType.id) !== type) return false
      if (query && mesa.name.toLowerCase().indexOf(query.toLowerCase()) === -1) return false
      return true
    })
    return filteredMesas
  }

  useEffect(() => {
    if (filters) {
      setFilteredMesas(filterMesas())
    }
  }, [filters])

  useEffect(() => {
    if (flamelinkLoaded) {
      getOpenedMesas().then(_mesas => {
        setMesas(Object.values(_mesas))
      })
      getCoordinators().then(_coordinators => {
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

  // function setEmail(mesa) {
  //   const body = `
  //     Hola, te envío este correo para unirme a la mesa ciudadana que coordinas.
  //   `
  //   const subject = `Mesa Ciudadana - ${mesa.name}`
  //   return `mailto:${getCoordinatorContact(mesa.userId)}?subject=${decodeURIComponent(subject)}&body=${decodeURIComponent(body)}`
  // }

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

  const participate = (mesa) => {
    setToParticipateMesa(mesa)
    setShowParticipate(true)
  }

  const list = Object.keys(filters).length > 0 ? filteredMesas : mesas
  return (
    <div id='find-your-mesa'>
      {toParticipateMesa && (
        <Participate mesa={toParticipateMesa} show={showParticipate} onClose={() => setShowParticipate(false)} />
      )}
      <FinderFileters filters={filters} mesaTypes={mesaTypes} setFilters={setFilters} />
      <div className='table-wrapper'>
        <Table>
          <thead className='sticky-top'>
            <tr>
              <th>Nombre mesa</th>
              <th>
                <a name='mesaType' href='#' onClick={sortListBy}>Tipo de mesa</a>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(mesa => {
              return (
                <tr key={mesa.id}>
                  <td>{mesa.name}</td>
                  <td>{mesaTypeName(mesa.mesaType.id)}</td>
                  <td>
                    <Button onClick={() => participate(mesa)} className='btn'>
                      Participar
                    </Button>
                  </td>
                </tr>
              )}
            )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}