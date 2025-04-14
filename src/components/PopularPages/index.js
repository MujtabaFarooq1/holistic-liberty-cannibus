import React from "react"
import { Link } from "gatsby"
import { Strings } from "./../../resources"
import { getStore, filterLocationBasedText } from "../../services/HomeService";
import "../../styles/global.scss"
import "./PopularPages.scss"

export default function PopularPages({location}) {

  const {
    name,
    become_patient,
  } = getStore();
  // console.log(name);
  // console.log(location);

  const renderBecomePatientTitle = () => {
    var subText = Strings.join_community

    if (become_patient) {
      subText = become_patient
    }

    if (name === "San Francisco") {
      subText = "Join the Cali cannabis community";
    }

    return <p className="ppc-description">{filterLocationBasedText(subText)}</p>
  }
  var widthClass = "three-cols";
  if (location == "Van Nuys" || location == "San Francisco" || location === "Springfield") {
    widthClass = "Col-width";
  }

  return (
    <div className="popular-pages-component">
      <div className="inner-wrap-wide">
        <div className="ppc-grid">
          <Link to="/become-a-patient/" className={`ppc-item ppc-become-patient ${widthClass}`}
            onClick={() => {
              global.menu = Strings.become_a_patient
            }}
          >
            <div className="ppc-content-wrap clearfix">
              <h3 className="ppc-title">{filterLocationBasedText(Strings.become_a_patient)}</h3>
              <span className="ppc-arrow"><img
                src={require("./../../resources/images/dark-green-rightarrow.svg")}
                alt="next"
              /></span>
            </div>
            {renderBecomePatientTitle()}
          </Link>

          {(location == "Van Nuys" || location == "San Francisco" || location === "Springfield") ? "" :
            <Link to="/rewards/" className="ppc-item ppc-rewards"
              onClick={() => {
                global.menu = Strings.rewards
              }}
            >
              <div className="ppc-content-wrap clearfix">
                <h3 className="ppc-title">{filterLocationBasedText(Strings.earn_rewards)}</h3>
                <span className="ppc-arrow"><img
                  src={require("./../../resources/images/dark-green-rightarrow.svg")}
                  alt="next"
                /></span>
              </div>
              <p className="ppc-description">{filterLocationBasedText(Strings.dream)}</p>
            </Link>
          }


          <Link to="/learn/" className={`ppc-item ppc-know-before-go ${widthClass}`}
            onClick={() => {
              global.menu = Strings.learn
            }}
          >
            <div className="ppc-content-wrap clearfix">
              <h3 className="ppc-title">{filterLocationBasedText(Strings.know_before)}</h3>
              <span className="ppc-arrow"><img
                src={require("./../../resources/images/dark-green-rightarrow.svg")}
                alt="next"
              /></span>
            </div>
            <p className="ppc-description">{filterLocationBasedText(Strings.faqs)}</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
