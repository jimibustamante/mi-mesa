import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import MesaFile from '../../classes/mesa_file'

import { ReactComponent as DocsIcon } from '../../images/docs-icon-green.svg'
import { ReactComponent as PdfIcon } from '../../images/pdf-icon.svg'
// import PdfIcon from '../../images/pdf-icon.svg' 
import { ReactComponent as TxtIcon } from '../../images/txt-icon.svg'
import { ReactComponent as VideoIcon } from '../../images/video-icon.svg'

const DocItem = ({ mesaFile }) => {
  const getIcon = (contentType) => {
    if (contentType.includes('pdf'))
      return <PdfIcon />
    if (contentType.includes('text'))
      return <TxtIcon />
    if (contentType.includes('video'))
      return <VideoIcon />
    return <TxtIcon />
  }

  return(
    <div className='doc-item'>
      <a href={mesaFile.url} target='_blank' className='body'>
        {getIcon(mesaFile.contentType)}
        <span title={mesaFile.name}>{mesaFile.name}</span>
      </a>
    </div>
  )

}

export default function DocsList({mesa, mesaTypes}) {
  const [mesaFiles, setMesaFiles] = useState([])
  const { getFolderFiles, getFileUrl } = useFlameLinkApp()

  function mesaTypeName(typeId) {
    if (!mesaTypes) return ''
    return mesaTypes.find(mt => mt.id === typeId)?.name
  }

  const getMesaFiles =  async (mesa) => {
    const mesaType = mesaTypeName(mesa?.mesaType?.id)
    const files = await getFolderFiles(mesaType)

    const promises = Object.values(files).map(file => {
      return new Promise(async (resolve, reject) => {
        try {
          const mesaFile = new MesaFile(file)
          await mesaFile.fetchUrl(getFileUrl(mesaFile.id))
          resolve(mesaFile)
        } catch (error) {
          reject(error)
        }
      })
    })
    await Promise.all(promises).then(files => {
      setMesaFiles(files)
    })
  }

  useEffect(() => {
    if (mesaTypes && mesa) {
      getMesaFiles(mesa)
    }
  }, [mesa, mesaTypes])
  
  return (
    <div id='docs-list'>
      <Row md={12} className='docs-header'>
        <Col>
          <DocsIcon />
          <span className='docs-title'>Documentos</span>
        </Col>
      </Row>
      <div className='list'>
        {mesaFiles.length > 0 && mesaFiles.map((mesaFile, index) => (
          <DocItem key={index} mesaFile={mesaFile} />
        ))}
      </div>
    </div>
  )
}
