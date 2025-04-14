import React, { useState, createContext } from "react"

// Create Context Object
export const NavigationContext = createContext()

// Create a provider for components to consume and subscribe to changes
export const NavigationContextProvider = props => {
  const [leftMenu, setLeftMenu] = useState({
    hide: true,
    selected: global.menu ? global.menu : "HOME",
  })

  return (
    <NavigationContext.Provider value={[leftMenu, setLeftMenu]}>
      {props.children}
    </NavigationContext.Provider>
  )
}
