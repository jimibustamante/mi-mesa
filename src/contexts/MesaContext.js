import React, { useReducer, useContext, createContext } from 'react'

const MesaContext = createContext()

export const MesaContextProvider = ({children}) => {
  const initialState = {
    mesaTypes: [],
    mesas: [],
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_MESA_TYPES':
        return { ...state, mesaTypes: action.payload }
      case 'SET_MESAS':
        return { ...state, mesas: action.payload }
      default: throw new Error('Unexpected action: ' + action.type)
    }
  }
  const contextValue = useReducer(reducer, initialState);

  return (
    <MesaContext.Provider value={contextValue}>
      {children}
    </MesaContext.Provider>
  )
}

export const useMesaContext = () => {
  const contextValue = useContext(MesaContext)
  return contextValue
}
