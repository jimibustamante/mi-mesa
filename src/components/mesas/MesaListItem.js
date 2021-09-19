import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as TableIcon } from '../../images/table.svg'
import { ReactComponent as AddParticipantIcon } from '../../images/add-participant.svg'
import { ReactComponent as DocsIcon } from '../../images/docs-icon.svg'
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

export default function MesaItem({mesa, onEdit, deleteMesa}) {
  const [mesaState] = useMesaContext()
  const { mesaTypes } = mesaState
  function mesaTypeName(mesaId) {
    let mesa = mesaTypes.find(mesa => mesa.id === mesaId)
    return mesa ? mesa.name : ''
  }
  const mesaType = mesaTypeName(mesa.mesaType.id)
  console.log({mesa, mesaType})
  const name = mesa.name || ''

  console.log({mesa})
  return (
    <div className='mesa-item'>
      <div className='body'>
        <TableIcon />
        <Link className='title' title={mesa.name} to={`/mesas/${mesa.id}`}>{mesa.name}</Link>
        <div className='mesa-info'>
          <span className='text participants'>7 Partidcipantes</span>
          <span className='text mesa-type'>{mesaType}</span>
          {mesa.comuna && <span className='text comuna'>Comuna: {mesa.comuna}</span>}
          {mesa.theme && <span className='text theme'>Tema: {mesa.theme}</span>}
          {mesa.cause && <span className='text cause'>Causa: {mesa.cause}</span>}
        </div>
      </div>
      <div className='footer actions'>
        <ActionButton icon={<AddParticipantIcon className='add' />} title='Agregar' />
        <ActionButton icon={<DocsIcon className='docs' />} title='Ver material' />
        <ActionButton onClick={onEdit} icon={<EditIcon className='edit' />} title='Editar' />
        <ActionButton onClick={deleteMesa} icon={<DeleteIcon className='delete' />} title='Eliminar' />
      </div>
    </div>
  )
}
