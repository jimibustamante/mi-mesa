import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ReactComponent as CommandIcon } from '../../images/megafono_blue.svg'
import { ReactComponent as DeleteIcon } from '../../images/delete_blue.svg'
import { ReactComponent as EditIcon } from '../../images/edit_blue.svg'
import { useCommandContext } from '../../contexts/CommandContext'

const ActionButton = ({ onClick, icon, title }) => {
  const action = (e) => {
    e.preventDefault()
    onClick && onClick()
  }
  return (
    <a className='action-button' onClick={action} href='#' title={title || ''}>
      {icon}
    </a>
  )
}

export default function CommandItem({ command, deleteCommand }) {
  const history = useHistory()
  const [commandState] = useCommandContext()
  const { commandTypes } = commandState

  function commandTypeName(commandId) {
    let command = commandTypes.find((command) => command.id === commandId)
    return command ? command.name : ''
  }
  const commandType = commandTypeName(command.commandType.id)

  return (
    <div className='command-item'>
      <div className='body'>
        <CommandIcon />
        <Link
          className='title'
          title={command.name}
          to={`/comandos/${command.id}`}
        >
          {command.name}
        </Link>
        <div className='command-info'>
          <span className='text command-type'>{commandType}</span>
          {command.comuna && (
            <span title={command.comuna} className='text comuna'>
              Comuna: {command.comuna}
            </span>
          )}
          {command.theme && (
            <span title={command.theme} className='text theme'>
              Tema: {command.theme}
            </span>
          )}
          {command.cause && (
            <span title={command.cause} className='text cause'>
              Causa: {command.cause}
            </span>
          )}
        </div>
      </div>
      <div className='footer actions'>
        <ActionButton
          onClick={() => history.push(`/comandos/${command.id}`)}
          icon={<EditIcon className='edit' />}
          title='Editar'
        />
        <ActionButton
          onClick={deleteCommand}
          icon={<DeleteIcon className='delete' />}
          title='Eliminar'
        />
      </div>
    </div>
  )
}
