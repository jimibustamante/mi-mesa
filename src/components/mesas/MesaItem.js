import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as TableIcon } from '../../images/table.svg'
import { ReactComponent as AddIcon } from '../../images/add.svg'
import { ReactComponent as DeleteIcon } from '../../images/delete.svg'
import { ReactComponent as EditIcon } from '../../images/edit.svg'
import { useMesaContext } from '../../contexts/MesaContext'

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

export default function MesaItem({mesa, onEdit, onDelete}) {
  const [mesaState] = useMesaContext()
  const { mesaTypes } = mesaState
  function mesaTypeName(mesaId) {
    let mesa = mesaTypes.find(mesa => mesa.id === mesaId)
    return mesa ? mesa.name : ''
  }
  const mesaType = mesaTypeName(mesa.mesaType.id)
  console.log({mesa, mesaType})
  const name = mesa.name || ''

  return (
    <div className='mesa-item'>
      <div className='body'>
        <TableIcon />
        <Link className='title' to={`/mesas/${mesa.id}`}>{mesa.name}</Link>
        <span className='text'>{mesaType}</span>
      </div>
      <div className='footer actions'>
        <ActionButton onClick={onEdit} icon={<EditIcon className='edit' />} title='Editar' />
        <ActionButton icon={<DeleteIcon className='delete' />} title='Eliminar' />
        <ActionButton icon={<AddIcon className='add' />} title='Agregar' />
      </div>
    </div>
  )
}