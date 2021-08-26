import React, { useReducer, useContext, createContext } from 'react'

const UserContext = createContext()

export const UserContextProvider = ({children}) => {
  const initialState = {
    user: null,
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'AUTH_SIGNED_IN':
        return { ...state, user: action.payload }
      case 'AUTH_SIGNED_OUT':
        return { ...state, user: null }
      default: throw new Error('Unexpected action: ' + action.type)
    }
  }
  const contextValue = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const contextValue = useContext(UserContext)
  return contextValue
}
