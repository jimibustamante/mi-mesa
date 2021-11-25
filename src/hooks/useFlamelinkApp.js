import { useEffect, useRef, useState } from 'react'
import firebaseApp from '../lib/firebaseApp'

import flamelink from 'flamelink/app'
import 'flamelink/storage'
import 'flamelink/navigation'
import 'flamelink/users'
import 'flamelink/content'

const useFlameLinkApp = () => {
  const [flamelinkLoaded, setFlamelinkLoaded] = useState(false)
  const app = useRef(null)

  const getContent = async (schemaKey) => {
    if (!app.current) return
    const content = await app.current.content.get({ schemaKey })
    return content
  }

  const getSchema = async (schemaKey) => {
    if (!app.current) return
    const schema = await app.current.schemas.get(schemaKey)
    return schema
  }

  const getContentBy = async (schemaKey, field, value) => {
    if (!app.current) return
    const content = await app.current.content.getByField({
      schemaKey,
      field,
      value,
    })
    if (!content) return []
    return Object.values(content)
  }

  const getMesaById = async (mesaId) => {
    const mesa = await app.current.content.getByField({
      schemaKey: 'mesa',
      field: 'id',
      value: mesaId,
    })
    return mesa[mesaId]
  }

  const getCommandById = async (commandId) => {
    const command = await app.current.content.getByField({
      schemaKey: 'command',
      field: 'id',
      value: commandId,
    })
    return command[commandId]
  }

  const createRecord = async (schemaKey, data) => {
    if (!app.current) return
    const record = await app.current.content.add({ schemaKey, data })
    return record
  }

  const updateRecord = async (schemaKey, entryId, data) => {
    if (!app.current) return
    const record = await app.current.content.update({
      schemaKey,
      entryId,
      data,
    })
    return record
  }

  const getMesas = async () => {
    if (!app.current) return
    const mesas = await getContent('mesa')
    return mesas
  }

  const getOpenedMesas = async () => {
    if (!app.current) return
    try {
      const openMesas = await app.current.content.getByField({
        schemaKey: 'mesa',
        field: 'open',
        value: true,
        fields: [
          'id',
          'name',
          'open',
          'theme',
          'cause',
          'comuna',
          'coordinator',
          'mesaType',
          'calendarId',
          'nextEvent',
        ],
        populate: [
          {
            field: 'coordinator',
            fields: ['id', 'email'],
          },
          {
            field: 'mesaType',
            fields: ['id', 'name'],
          },
        ],
      })
      return openMesas ? Object.values(openMesas) : []
    } catch (error) {
      console.error({ error })
      return error.message || error
    }
  }

  const getTypes = async () => {
    if (!app.current) return
    let types = await getContent('tipoMesa')
    types = Object.values(types)
    return types
  }

  const getFolderFiles = async (folderName) => {
    if (!app.current) return
    const files = await app.current.storage.getFiles({ folderName })
    return files
  }

  const getFolders = async () => {
    if (!app.current) return
    const folders = await app.current.storage.getFolders({})
    return folders
  }

  const getFileUrl = async (fileId) => {
    if (!app.current) return
    const url = await app.current.storage.getURL({ fileId })
    return url
  }

  const deleteMesa = async (mesaId) => {
    if (!app.current) return
    const mesa = await app.current.content.remove({
      schemaKey: 'mesa',
      entryId: mesaId,
    })
    return mesa
  }

  const deleteCommand = async (commandId) => {
    if (!app.current) return
    const mesa = await app.current.content.remove({
      schemaKey: 'command',
      entryId: commandId,
    })
    return mesa
  }

  const deleteParticipant = async (participanteId) => {
    if (!app.current) return
    const participante = await app.current.content.remove({
      schemaKey: 'participante',
      entryId: participanteId,
    })
    return participante
  }

  const deleteCommandParticipant = async (participanteId) => {
    if (!app.current) return
    const participante = await app.current.content.remove({
      schemaKey: 'commandParticipant',
      entryId: participanteId,
    })
    return participante
  }

  const getCoordinators = async () => {
    if (!app.current) return
    const coordinadores = await getContent('coordinador')
    return coordinadores
  }

  const getCoordinator = async (userId) => {
    if (!app.current) return
    const coordinator = await app.current.content.getByField({
      schemaKey: 'coordinador',
      field: 'userId',
      value: userId,
    })
    return coordinator
  }

  const getCommandTypes = async () => {
    if (!app.current) return
    let commandTypes = await getContent('commandType')
    commandTypes = Object.values(commandTypes)
    return commandTypes
  }

  useEffect(() => {
    if (app.current) return
    app.current = flamelink({
      firebaseApp,
      dbType: 'cf',
    })
    setFlamelinkLoaded(true)
  }, [app.current, flamelink])

  return {
    flamelinkApp: app.current,
    flamelinkLoaded,
    getContent,
    getContentBy,
    getMesaById,
    getCommandById,
    createRecord,
    updateRecord,
    getSchema,
    getTypes,
    getMesas,
    getOpenedMesas,
    getFolderFiles,
    getFolders,
    getFileUrl,
    deleteMesa,
    deleteCommand,
    deleteParticipant,
    deleteCommandParticipant,
    getCoordinator,
    getCoordinators,
    getCommandTypes,
  }
}

export default useFlameLinkApp
