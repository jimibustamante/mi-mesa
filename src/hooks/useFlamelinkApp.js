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
  }
}

export default useFlameLinkApp
