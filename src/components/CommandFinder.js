import React, { useEffect, useState } from 'react'
import { ReactComponent as SearchIcon } from '../images/search-icon.svg'
import useFlameLinkApp from '../hooks/useFlamelinkApp'
import { Table, Button } from 'react-bootstrap'
import { useCommandContext } from '../contexts/CommandContext'
import ParticipateToCommand from './participants/ParticipateToCommand'
import { VscLoading as LoadingSpinner } from 'react-icons/vsc'

const FinderFileters = ({ filters, commandTypes, setFilters }) => {
  const { type, query } = filters

  const onChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  return (
    <div className='filters'>
      <label>
        <SearchIcon />
        <input
          type='text'
          placeholder='Buscar por palabra clave'
          value={query}
          name='query'
          onChange={onChange}
        />
      </label>
      <label>
        Tipo de comando:
        <select value={filters.type} name='type' onChange={onChange}>
          <option value=''>Todo</option>
          {commandTypes?.map((commandType) => (
            <option key={commandType.id} value={commandType.name}>
              {commandType.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default function MesaFinder() {
  const { flamelinkLoaded, getCommands, getCommandTypes } = useFlameLinkApp()
  const [loading, setLoading] = useState(true)
  const [commands, setCommands] = useState([])
  const [filteredCommands, setFilteredMesas] = useState([])
  const [filters, setFilters] = useState({})
  const [sortings, setSortings] = useState({})
  const [showParticipate, setShowParticipate] = useState(false)
  const [toParticipateCommand, setToParticipateCommand] = useState(null)
  const [commandState, dispatch] = useCommandContext()
  const { commandTypes } = commandState

  const filterCommands = () => {
    const { type, query } = filters
    const filteredCommands = commands.filter((command) => {
      if (type && commandTypeName(command?.commandType.id) !== type)
        return false
      if (
        query &&
        command.name.toLowerCase().indexOf(query.toLowerCase()) === -1
      )
        return false
      return true
    })
    return filteredCommands
  }

  useEffect(() => {
    if (filters) {
      setFilteredMesas(filterCommands())
    }
  }, [filters])

  useEffect(() => {
    getCommands({ query: filters.query || '' }).then((_commands) => {
      console.log({ _commands })
      setCommands(_commands)
      setLoading(false)
    })
  }, [flamelinkLoaded])

  useEffect(() => {
    if (commandTypes.length === 0) {
      getCommandTypes().then((types) => {
        dispatch({ type: 'SET_COMMAND_TYPES', payload: types })
      })
    }
  }, [commandTypes, dispatch])

  function commandTypeName(typeId) {
    if (!commandTypes) return ''
    return commandTypes.find((mt) => mt.id === typeId)?.name
  }

  function sortByCommandTypeName(a, b) {
    const bName = commandTypeName(b.commandType.id)
    const aName = commandTypeName(a.commandType.id)
    if (aName < bName) return -1
    if (aName > bName) return 1
    return 0
  }

  function sortListBy(event) {
    event.preventDefault()
    const sortBy = event.target.name
    switch (sortBy) {
      case 'commandType':
        let sortedCommands = Object.assign([], commands).sort(
          sortByCommandTypeName
        )
        if (sortings[sortBy] === 'desc') {
          sortedCommands = sortedCommands.reverse()
        }
        setSortings({
          ...sortings,
          [sortBy]: sortings[sortBy] === 'desc' ? 'asc' : 'desc',
        })
        setCommands(sortedCommands)
        break
      default:
        break
    }
  }

  const participate = (command) => {
    setToParticipateCommand(command)
    setShowParticipate(true)
  }

  const list = Object.keys(filters).length > 0 ? filteredCommands : commands
  console.log({ commandTypes })
  return (
    <div id='find-your-command'>
      {toParticipateCommand && (
        <ParticipateToCommand
          command={toParticipateCommand}
          show={showParticipate}
          onClose={() => setShowParticipate(false)}
        />
      )}
      <FinderFileters
        filters={filters}
        commandTypes={commandTypes}
        setFilters={setFilters}
      />
      <div className='table-wrapper'>
        {loading && (
          <div className='loading'>
            <LoadingSpinner size={70} />
          </div>
        )}
        <Table>
          <thead className='sticky-top'>
            <tr>
              <th style={{ textAlign: 'left' }}>Nombre comando</th>
              <th>
                <a name='commandType' href='#' onClick={sortListBy}>
                  Tipo de comando
                </a>
              </th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((command) => {
              const nextEventDate =
                command.nextEvent && new Date(command.nextEvent).getTime() > 0
                  ? new Date(command.nextEvent)
                  : null
              console.log({
                'command.nextEvent': command.nextEvent,
                nextEventDate,
              })
              const dateFormated = nextEventDate
                ? `${nextEventDate.getDate()}-${
                    nextEventDate.getMonth() + 1
                  }-${nextEventDate.getFullYear()}`
                : '-'
              const isFinished = nextEventDate && nextEventDate < new Date()
              return (
                <tr key={command.id}>
                  <td style={{ textAlign: 'left' }}>{command.name}</td>
                  <td>{command.commandType.name || ''}</td>
                  <td style={{ textAlign: 'center' }}>{dateFormated}</td>
                  <td>
                    <Button
                      onClick={() => participate(command)}
                      className='btn'
                    >
                      Únete
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
