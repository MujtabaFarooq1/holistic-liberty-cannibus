import React from "react"
import "./../styles/global.scss"
import AgeGate from "./AgeGate"

export default function Layout({ children }) {
  return (
    <div>
      {children} <AgeGate />
    </div>
  )
}
