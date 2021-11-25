import React, { useReducer, useContext, createContext } from 'react'

const CommandContext = createContext()

export const CommandContextProvider = ({ children }) => {
  const initialState = {
    commandTypes: [],
    myCommands: [],
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_COMMAND_TYPES':
        return { ...state, commandTypes: action.payload }
      case 'SET_MY_COMMANDS':
        return { ...state, myCommands: action.payload }
      default:
        throw new Error('Unexpected action: ' + action.type)
    }
  }
  const contextValue = useReducer(reducer, initialState)

  return (
    <CommandContext.Provider value={contextValue}>
      {children}
    </CommandContext.Provider>
  )
}

export const useCommandContext = () => {
  const contextValue = useContext(CommandContext)
  return contextValue
}
