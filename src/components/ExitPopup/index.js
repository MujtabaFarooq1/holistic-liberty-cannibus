import React from "react"
import "./ExitPopup.scss"
import { Strings } from "../../resources"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
const ExitPopup = props => {
  return (
    <div className="exit-popup-box" >
      <div className="box">
        <span className="close-icon" ref={props.exitPopupRef} onClick={props.onClose}>
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </span>
        <div className="text-container">
          <h4 className="h3-subheads-forza">
            {Strings.heads_up.toUpperCase()}
          </h4>
          <p className="body-text">
            {Strings.exit_msg}
            <span className="link">{Strings.exit_link}</span>
            {Strings.exit_msg2}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExitPopup
