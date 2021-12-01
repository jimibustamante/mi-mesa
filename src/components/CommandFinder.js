import React, { useEffect, useState } from 'react'
import { ReactComponent as SearchIcon } from '../images/search-icon.svg'
import useFlameLinkApp from '../hooks/useFlamelinkApp'
import { Table } from 'react-bootstrap'
import { useCommandContext } from '../contexts/CommandContext'
import ParticipateToCommand from './participants/ParticipateToCommand'
import { VscLoading as LoadingSpinner } from 'react-icons/vsc'

import { ReactComponent as WhatsappIcon } from '../images/whatsapp-icon.svg'
import { ReactComponent as TelegramIcon } from '../images/telegram-icon.svg'
import { ReactComponent as InstagramIcon } from '../images/instagram-icon.svg'
import { ReactComponent as LinkIcon } from '../images/link-icon.svg'

const CommandRow = ({ command }) => {
  const { whatsappLink, telegramLink, instagramLink, otherLink } = command
  return (
    <tr key={command.id}>
      <td style={{ textAlign: 'left' }}>{command.name}</td>
      <td>{command.commandType.name || ''}</td>
      <td>
        <div className='actions-wrapper'>
          {whatsappLink && (
            <a className='action-link' href={whatsappLink} target='_blank'>
              <WhatsappIcon className='action-icon' />
            </a>
          )}
          {telegramLink && (
            <a className='action-link' href={telegramLink} target='_blank'>
              <TelegramIcon className='action-icon' />
            </a>
          )}
          {instagramLink && (
            <a className='action-link' href={instagramLink} target='_blank'>
              <InstagramIcon className='action-icon' />
            </a>
          )}
          {otherLink && (
            <a className='action-link' href={otherLink} target='_blank'>
              <LinkIcon className='action-icon' />
            </a>
          )}
        </div>
      </td>
    </tr>
  )
}

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

export default function CommandFinder() {
  const { flamelinkLoaded, getCommands, getCommandTypes } = useFlameLinkApp()
  const [loading, setLoading] = useState(true)
  const [commands, setCommands] = useState([])
  const [filteredCommands, setFilteredCommands] = useState([])
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
      setFilteredCommands(filterCommands())
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
      case 'name':
        let sortedCommandsByName = Object.assign([], commands).sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
        if (sortings[sortBy] === 'desc') {
          sortedCommandsByName = sortedCommandsByName.reverse()
        }
        setSortings({
          ...sortings,
          [sortBy]: sortings[sortBy] === 'desc' ? 'asc' : 'desc',
        })
        setCommands(sortedCommandsByName)
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
              <th style={{ textAlign: 'left' }}>
                <a name='name' href='#' onClick={sortListBy}>
                  Nombre comando
                </a>
              </th>
              <th>
                <a name='commandType' href='#' onClick={sortListBy}>
                  Tipo de comando
                </a>
              </th>
              <th>Únete</th>
            </tr>
          </thead>
          <tbody>
            {list.map((command) => {
              return <CommandRow key={command.id} command={command} />
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
