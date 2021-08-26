import React, { useReducer, useContext, createContext } from 'react'

const NavigationContext = createContext()

export const NavigationContextProvider = ({children}) => {
  const initialState = {
    flamelinkApp: null,
    navigation: null,
    items: [],
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_NAVIGATION':
        return { ...state, navigation: action.payload, items: action.payload.menu.items ||  action.payload.items || [] }
      default: throw new Error('Unexpected action: ' + action.type)
    }
  }
  const contextValue = useReducer(reducer, initialState);
  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigationContext = () => {
  const contextValue = useContext(NavigationContext)
  return contextValue
}
