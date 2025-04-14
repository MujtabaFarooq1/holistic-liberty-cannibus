import React from "react"
// import Img from 'gatsby-image'
export default function TestTemplate({ pageContext: { data } }) {
  return (
    <div style={{ width: 960, margin: "4rem auto" }}>
      <h2>Abilities</h2>
      <h1>{data.author}</h1>
      <ul>{JSON.stringify(data)}</ul>
    </div>
  )
}
