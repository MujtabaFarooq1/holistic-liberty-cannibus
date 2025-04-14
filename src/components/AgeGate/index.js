import React, { useState, useEffect } from "react"
import {
  getAgeStatus,
  setAgeStatus as setAgeStatusInStorage,
  removeAgeStatus,
} from "../../services/AgeService"
import "./age-gate.scss"
import { Strings } from "../../resources"
import HoverButton from "../UI/HoverButton"
import desktopLogo from "./../../resources/images/age-gate/LIBERTY_Wordmark_KO_Large.svg"
import mobileLogo from "./../../resources/images/age-gate/Liberty_Logo_White.svg"

export default function AgeGate() {
  const { data, error } = getAgeStatus()
  const [ageStatus, setAgeStatus] = useState("INIT")

  useEffect(() => {
    setAgeStatus(error ? false : data)
  })

  const setAgeGateStatus = status => {
    if (!status) {
      setAgeStatus(false)
      return removeAgeStatus()
    }

    setAgeStatus(status)
    setAgeStatusInStorage(status)
  }

  const renderAgeSelection = () => {
    return (
      <div className="age-gate-container">
        <div className="inner-content">
          {/*<!-- Upper content starts -->*/}
          <div className="upper-content">
            <img loading="lazy" className="desktop-logo" src={desktopLogo} alt="desktop-logo"/>
            <img loading="lazy" className="mobile-logo" src={mobileLogo} alt="mobile-logo"/>

            {/*<!-- Heading -->*/}
            <h3 className="heading">{Strings.are_you_21}</h3>

            {/*<!-- Buttons container starts -->*/}
            <div className="buttons-container">
              <HoverButton
                btnClassName="age-gate-btn"
                onClick={() => setAgeGateStatus("YES")}
              >
                {Strings.i_am_old_enough}
              </HoverButton>
              <HoverButton
                btnClassName="age-gate-btn"
                onClick={() => setAgeGateStatus("NO")}
              >
                {Strings.i_am_not}
              </HoverButton>
            </div>
            {/* Buttons container */}
          </div>
          {/* Upper content ends */}

          {/* Bottom content */}
          <div className="bottom-content">
            <p className="notice">
              {Strings.pennsylvania_and_maryland_notice}
              <br />
              <span className="dark">
                {Strings.agree_to}{" "}
                <a href="https://holisticindustries.com/privacy-policy">
                  {Strings.privacy_policy}
                </a>{" "}
                &{" "}
                <a href="https://holisticindustries.com/terms-of-service">
                  {Strings.terms_service}
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderWarning = () => {
    return (
      <span className="age-gate-container show-warning">
        <div className="inner-content">
          {/*<!-- Upper content starts -->*/}
          <div className="upper-content">
            <h1 className="big-heading">{Strings.sorry}</h1>

            {/*<!-- Heading -->*/}
            <h3 className="heading2">
              {Strings.you_must_be_over_age}{" "}
              {Strings.please_comeback_when_you_are}
            </h3>

            {/*<!-- Buttons container starts -->*/}
            <div className="buttons-container">
              <HoverButton
                btnClassName="age-gate-btn"
                onClick={() => setAgeGateStatus(false)}
              >
                {Strings.back}
              </HoverButton>
            </div>
            {/* Buttons container */}
          </div>
          {/* Upper content ends */}
        </div>
      </span>
    )
  }

  const renderAgeGate = () => {
    if (ageStatus === "INIT") return null
    else if (!ageStatus) return renderAgeSelection()
    else if (ageStatus === "NO") return renderWarning()
    else return null
  }

  return renderAgeGate()
}
