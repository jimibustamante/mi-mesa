import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import File from '../../classes/file'

import { ReactComponent as DocsIcon } from '../../images/docs-icon-green.svg'
import { ReactComponent as PdfIcon } from '../../images/pdf-icon.svg'
import { ReactComponent as TxtIcon } from '../../images/txt-icon.svg'
import { ReactComponent as VideoIcon } from '../../images/video-icon.svg'

const DocItem = ({ file }) => {
  const getIcon = (contentType) => {
    if (contentType.includes('pdf')) return <PdfIcon />
    if (contentType.includes('text')) return <TxtIcon />
    if (contentType.includes('video')) return <VideoIcon />
    return <TxtIcon />
  }

  return (
    <div className='doc-item'>
      <a href={file.url} target='_blank' className='body'>
        {getIcon(file.contentType)}
        <span title={file.name}>{file.name}</span>
      </a>
    </div>
  )
}

export default function DocsList({ command, commandTypes }) {
  const [files, setFiles] = useState([])
  const { getFolderFiles, getFileUrl } = useFlameLinkApp()

  function commandTypeName(typeId) {
    if (!commandTypes) return ''
    return commandTypes.find((mt) => mt.id === typeId)?.name
  }

  const getFiles = async (command) => {
    const commandType = commandTypeName(command?.commandType?.id)
    const files = await getFolderFiles(commandType)

    const promises = Object.values(files).map((file) => {
      return new Promise(async (resolve, reject) => {
        try {
          const commandFile = new File(file)
          await commandFile.fetchUrl(getFileUrl(commandFile.id))
          resolve(commandFile)
        } catch (error) {
          reject(error)
        }
      })
    })
    await Promise.all(promises).then((files) => {
      setFiles(files)
    })
  }

  useEffect(() => {
    if (commandTypes && command) {
      getFiles(command)
    }
  }, [command, commandTypes])

  return (
    <section id='docs-list'>
      <Row md={12} className='docs-header'>
        <Col>
          <DocsIcon />
          <span className='docs-title'>Documentos</span>
        </Col>
      </Row>
      <div className='list'>
        {files.length > 0 &&
          files.map((file, index) => <DocItem key={index} file={file} />)}
      </div>
    </section>
  )
}
