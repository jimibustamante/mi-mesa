import React, { useEffect, useState } from 'react'
import firebaseApp from '../lib/firebaseApp'

import flamelink from 'flamelink/app'
import 'flamelink/storage'
import 'flamelink/navigation'
import 'flamelink/users'
import 'flamelink/content'
/**
 * @description CmsContent component aims to render the content of the navbar elements received from the CMS.
*/

export default function CmsContent() {
  const [content, setContent] = useState(null)

  const getContent = async () => {
    const flamelinkApp = flamelink({
      firebaseApp,
      dbType: 'cf',
    })
    const content = await flamelinkApp.content.get({schemaKey: 'home'})
    // const mesas = await flamelinkApp.content.get({schemaKey: 'mesa'})
    setContent(Object.values(content)[0])
  }

  useEffect(() => {
    getContent()
  }, [])

  return (
    <div className='container'>
      {content && (
        <>
          <h1>{content.title}</h1>
          <p style={{color: content.textColor}}>
            {content.text}
          </p>
        </>
      )}
    </div>
  )
}
