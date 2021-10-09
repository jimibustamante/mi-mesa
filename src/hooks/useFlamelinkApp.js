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
    const content = await app.current.content.get({schemaKey})
    return content
  }

  const getSchema = async (schemaKey) => {
    if (!app.current) return
    const schema = await app.current.schemas.get(schemaKey)
    return schema
  }

  const getContentBy = async (schemaKey, field, value) => {
    if (!app.current) return
    const content = await app.current.content.getByField({schemaKey, field, value})
    if (!content) return []
    return Object.values(content)
  }
  
  const getMesaById = async (mesaId) => {
    const mesa = await app.current.content.getByField({schemaKey: 'mesa', field: 'id', value: mesaId})
    return mesa[mesaId]
  }

  const createRecord = async (schemaKey, data) => {
    if (!app.current) return
    const record = await app.current.content.add({schemaKey, data})
    return record
  }

  const updateRecord = async (schemaKey, entryId, data) => {
    if (!app.current) return
    const record = await app.current.content.update({schemaKey, entryId, data})
    return record
  }

  const getMesas = async () => {
    if (!app.current) return
    const mesas = await getContent('mesa')
    return mesas
  }

  const getOpenedMesas = async () => {
    const mesas = await app.current.content.getByField({schemaKey: 'mesa', field: 'open', value: true})
    return (mesas) ? Object.values(mesas) : []
  }

  const getTypes = async () => {
    if (!app.current) return
    let types = await getContent('tipoMesa')
    types = Object.values(types)
    return types
  }

  const getFolderFiles = async (folderName) => {
    if (!app.current) return
    const files = await app.current.storage.getFiles({folderName})
    return files
  } 

  const getFolders = async () => {
    if (!app.current) return
    const folders = await app.current.storage.getFolders({})
    return folders
  }

  const getFileUrl = async (fileId) => {
    if (!app.current) return
    const url = await app.current.storage.getURL({fileId})
    return url
  }

  const deleteMesa = async (mesaId) => {
    if (!app.current) return
    const mesa = await app.current.content.remove({schemaKey: 'mesa', entryId: mesaId})
    return mesa
  }

  const deleteParticipant = async (participanteId) => {
    if (!app.current) return
    const participante = await app.current.content.remove({schemaKey: 'participante', entryId: participanteId})
    return participante
  }

  const getCoordinators = async () => {
    if (!app.current) return
    const coordinadores = await getContent('coordinador')
    return coordinadores
  }

  const getCoordinator = async (userId) => {
    if (!app.current) return
    const coordinator = await app.current.content.getByField({schemaKey: 'coordinador', field: 'userId', value: userId})
    return coordinator
  }

  useEffect(() => {
    console.log({app: app.current, firebaseApp})
    if (app.current) return
    app.current = flamelink({
      firebaseApp,
      dbType: 'cf',
    })
    setFlamelinkLoaded(true)
    console.log({app: app.current})

  }, [app.current, flamelink])

  return {
    flamelinkApp: app.current,
    flamelinkLoaded,
    getContent,
    getContentBy,
    getMesaById,
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
    deleteParticipant,
    getCoordinator,
    getCoordinators,
  }
}

export default useFlameLinkApp
