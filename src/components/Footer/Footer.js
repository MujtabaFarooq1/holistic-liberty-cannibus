import React, { useState } from "react";
import "../../styles/global.scss";
import "./Footer.scss";
import { Link, navigate } from "gatsby";
import LocationPicker from "../LocationPicker"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Strings } from "../../resources";
import {
  filterLocation,
  sendEmailApi,
  EMAIL_VALIDATION_REGEX,
  INSTAGRAM_HANDLE,
  FACEBOOK_HANDLE,
  TERMS_URL,
  PRIVACY_POLICY_URL,
  getStore
} from "../../services/HomeService";

const {abbr, name} = getStore();

export default function Footer() {

  const [errorMessage, setErrorMessage] = useState(null);
  /**
   * on submit of email
   * @param {} event
   */
  const submit = event => {
    event.preventDefault();
    if (emailText === Strings.thank_you) {
      return;
    }
    if (emailText.length === 0) {
      setErrorMessage(Strings.enter_email);
    } else {

      if (EMAIL_VALIDATION_REGEX.test(emailText)) {
        setErrorMessage(null);
        sendEmailApi(emailText);
        setEmailText(Strings.thank_you);
      } else {
        setEmailText("");
        setErrorMessage(Strings.invalid_email);
      }
    }
  }

  const [emailText, setEmailText] = useState("");
  const [isActive, setActive] = useState(false);
  const locationPickerClosed = () => {
    setActive(false)
  };

  const getShopLink = () => {
    global.menu = Strings.order_now
    let storeLocation = filterLocation(name)
    console.log(storeLocation)
    return storeLocation ? navigate(storeLocation.link) : setActive(true)
  }

  return (
    <>
      <LocationPicker
        isActiveLocation={isActive}
        onLocPickerClosed={() => locationPickerClosed()}
        goto={true}
      />
      <div className="footer" id="sitefooter">
        <div className="left-side">
          <Link
            to="/"
            className="logo-container"
            onClick={() => {
              global.menu = Strings.home
            }}
          >
            <img
              src={require("../../resources/images/footer/Liberty_Logo_Green.svg")}
              alt="logo"
            />
          </Link>
          <div className="menu">
            <span
              className="menu-item"
              onClick={() => getShopLink()}
            >
              <div>
                {abbr == "PA" ? Strings.order_nowPA : Strings.order_now}
              </div>
            </span>
            <Link
              className="menu-item"
              to="/about/"
              onClick={() => {
                global.menu = Strings.about_concentrates
              }}
            >
              <div>{Strings.about}</div>
            </Link>
            <Link
              className="menu-item"
              to="/become-a-patient/"
              onClick={() => {
                global.menu = Strings.become_a_patient
              }}
            >
              <div>{Strings.become_a_patient}</div>
            </Link>
            <Link
              className="menu-item"
              to="/learn/"
              onClick={() => {
                global.menu = Strings.learn
              }}
            >
              <div>{Strings.learn}</div>
            </Link>
            {name === "Springfield" ? (
              ""
            ) : (
              <Link
                className="menu-item"
                to="/rewards/"
                onClick={() => {
                  global.menu = Strings.rewards
                }}
              >
                <div>{Strings.rewards}</div>
              </Link>
            )}
            <Link
              className="menu-item"
              to="/contact-us/"
              onClick={() => {
                global.menu = Strings.contact_us
              }}
            >
              <div>{Strings.contact_us.toUpperCase()}</div>
            </Link>
            <Link
              className="menu-item"
              to="/blogs/news/"
              onClick={() => {
                global.menu = ""
              }}
            >
              <div>{Strings.blog}</div>
            </Link>
            <a
              className="menu-item"
              href="https://careers.jobscore.com/careers/holisticindustries/"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => {
                global.menu = ""
              }}
            >
              {Strings.career}
            </a>
          </div>
        </div>
        <div className="right-side">
          <form className="email-form" onSubmit={event => submit(event)}>
            <input
              disabled={emailText === Strings.thank_you ? true : false}
              className="email-input"
              placeholder={Strings.sign_up_updates}
              value={emailText}
              type="email"
              onChange={field => setEmailText(field.target.value)}
            />
            <button
              className="email-send"
              onClick={event => submit(event)}
              disabled={emailText === Strings.thank_you ? true : false}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </button>
          </form>
          <p className="validation-error">{errorMessage ? errorMessage : ""}</p>
          <div className="social-btn-container">
            <a
              href={INSTAGRAM_HANDLE}
              target="_blank"
              className="instagram"
            ></a>
            <a href={FACEBOOK_HANDLE} target="_blank" className="facebook"></a>
          </div>
          <div className="terms-privacy">
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              {Strings.privacy_policy}
            </a>
            <div></div>
            <a href={TERMS_URL} target="_blank" rel="noreferrer noopener">
              {Strings.terms_service}
            </a>
          </div>
          <div className="copyright">
            <p>{Strings.copyright}</p>
          </div>
          <div className="copyright">
            <p className="copyright-number">{Strings.copyright_number}</p>
          </div>
        </div>
      </div>
    </>
  )
}
