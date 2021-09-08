import { useEffect, useRef } from 'react';
import firebaseApp from '../lib/firebaseApp'

import flamelink from 'flamelink/app'
import 'flamelink/storage'
import 'flamelink/navigation'
import 'flamelink/users'
import 'flamelink/content'

const useFlameLinkApp = () => {
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

  const createRecord = async (schemaKey, data) => {
    if (!app.current) return
    // console.log({schemaKey, data})
    const record = await app.current.content.add({schemaKey, data})
    return record
  }

  const getMesas = async () => {
    if (!app.current) return
    const mesas = await getContent('mesa')
    return mesas
  }

  const getTypes = async () => {
    if (!app.current) return
    let types = await getContent('tipoMesa')
    types = Object.values(types)
    return types
  }

  useEffect(() => {
    if (app.current) return
    app.current = flamelink({
      firebaseApp,
      dbType: 'cf',
    })
  }, [app.current, flamelink])

  return {
    flamelinkApp: app.current,
    getContent,
    createRecord,
    getSchema,
    getTypes,
    getMesas,
  }
}

export default useFlameLinkApp
