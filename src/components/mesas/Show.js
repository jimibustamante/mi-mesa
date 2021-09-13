import { useEffect, useState, useCallback } from 'react'
import { useParams } from "react-router-dom"
import useFlameLinkApp from "../../hooks/useFlamelinkApp"
import { Container } from 'react-bootstrap'
import Participants from './Participants'

export default function Show() {
  const { mesaId } = useParams()
  const [mesa, setMesa] = useState(null)
  const { getContentBy, flamelinkApp } = useFlameLinkApp()
  
  const getMesa = useCallback(async () => {
    try {
      const mesa = await getContentBy('mesa', 'id', mesaId)
      console.log({mesa})
      setMesa(mesa)
    } catch (error) {
      console.error(error)
    }
  }, [getContentBy, mesaId])

  useEffect(() => {
    if (!mesaId) return
    getMesa()
  }, [mesaId])

  return (
    mesa ? (
      <Container id='show-mesa'>
        <h1>{mesa.name}</h1>
        <Participants mesa={mesa} />
      </Container>
    ) : (
      // TODO: Here should be a loading component
      ''
    )
  )
}
