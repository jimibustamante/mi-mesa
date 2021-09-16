import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useFlameLinkApp from '../../hooks/useFlamelinkApp'
import { Table } from 'react-bootstrap'
import MesaFile from '../../classes/mesa_file'
import { useMesaContext } from '../../contexts/MesaContext'
import { Container } from 'react-bootstrap'
import Participants from './Participants'

export default function Show() {
  const { mesaId } = useParams()
  const [mesaFiles, setMesaFiles] = useState([])
  const [mesaState, dispatch] = useMesaContext()
  const { mesaTypes } = mesaState
  const [mesa, setMesa] = useState(null)
  const { getContentBy, flamelinkApp, getFolderFiles, getFileUrl, getTypes } = useFlameLinkApp()

  function mesaTypeName(typeId) {
    if (!mesaTypes) return ''
    return mesaTypes.find(mt => mt.id === typeId)?.name
  }

  const getMesaFiles =  async (mesa) => {
    const mesaType = mesaTypeName(mesa.mesaType.id)
    console.log(mesaType)
    const files = await getFolderFiles(mesaType)
    let _mesaFiles = []
    Object.values(files).forEach((file) => {
      getFileUrl(file.id).then((url) => {
        let mesaFile = new MesaFile(file)
        mesaFile.url = url
        _mesaFiles.push(mesaFile)
        setMesaFiles(_mesaFiles)
      })
    })
  }

  const getMesa = useCallback(async () => {
    try {
      const mesa = await getContentBy('mesa', 'id', mesaId)
      getMesaFiles(mesa)
      console.log({mesa})
      setMesa(mesa)
    } catch (error) {
      console.error(error)
    }
  }, [getContentBy, mesaId])

  useEffect(() => {
    if (mesaTypes.length === 0) {
      getTypes().then((types) => {
        console.log('Fetching TYPES')
        dispatch({ type: 'SET_MESA_TYPES', payload: types })
      })
    }
  }, [mesaTypes, dispatch])

  useEffect(() => {
    if (!mesaId) return
    if (mesaTypes.length > 0)
      getMesa()
  }, [mesaId, mesaTypes])

  console.log({mesaFiles})
  return (
    mesa ? (
      <Container id='show-mesa'>
        <h1>{mesa.name}</h1>
        <Participants mesa={mesa} />

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesaFiles.map(mesaFile => (
              <tr key={mesaFile.id}>
                <td>{mesaFile.name}</td>
                <td>{mesaFile.type}</td>
                <td>
                  <a href={mesaFile.url} target='_blank' title='Abrir archivo'>
                    Abrir
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      </Container>
    ) : (
      // TODO: Here should be a loading component
      ''
    )
  )
}
