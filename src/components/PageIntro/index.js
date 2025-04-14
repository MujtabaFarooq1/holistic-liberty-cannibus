import React from "react"
import "../../styles/global.scss"
import "./PageIntro.scss"
import { filterLocationBasedText } from "../../services/HomeService";

export default function PageIntro({ title, description, background }) {
  return (
    <div
      className="page-intro"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="inner-wrap-wide">
        <h1 className="pi-title">{filterLocationBasedText(title)}</h1>
        <p className="pi-description">{filterLocationBasedText(description)}</p>
      </div>
    </div>
  )
}
