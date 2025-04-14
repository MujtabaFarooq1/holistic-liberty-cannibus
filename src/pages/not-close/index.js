import React, { Fragment, useState } from "react"
import { Helmet } from "react-helmet"
import { setPageTitle } from "./../../utils/page"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import "./not-close.scss"
import { Strings } from "../../resources"
import EmailInput from "../../components/UI/EmailInput"
import { setStore as setStoreInStore, 
  sendEmailApi, 
  EMAIL_VALIDATION_REGEX, 
  getStore
} from "../../services/HomeService"
import PopularPages from "../../components/PopularPages"
import { navigate, Link } from "gatsby";
import Locations from "../../components/Locations";

export default function NotClose({ location }) {
  // const { distance, onStoreSelection, onBackSelection } = props
  const {tag} = getStore();
  const [emailText, setEmailText] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const storeSelected = store => {
    setStoreInStore(store)
    navigate("/");
    // onStoreSelection(store)
  }

  const submitEmail = () => {
    if (emailText.length === 0) {
      setErrorMessage(Strings.enter_email);
    } else {
      if (EMAIL_VALIDATION_REGEX.test(emailText)) {
        setErrorMessage(null);
        sendEmailApi(emailText);
        setShowConfirmation(true);
      } else {
        setEmailText("");
        setErrorMessage(Strings.invalid_email);
      }
    }
  }

  //
  const renderPage = () => {
    return (
      <div className={`home-page page-container-layout ${tag ? "location-selected" : ""}`}>
        <div className="not-close-container ">
          <div className="not-close-page-banner">
            <div className="page-title-container">
              <h1 className="page-title h1-forza">{Strings.not_close_msg}</h1>
              <p className="body-text">
                {`${Strings.not_close_detail1} ${location.state && location.state.distance ? Math.ceil(location.state.distance * 0.000621) : "100"} ${Strings.not_close_detail2}`}
              </p>
              {showConfirmation ?
                <div className="email-confirmation">
                  {Strings.email_confirmation}
                </div> :
                <EmailInput
                  containerClass="email-input"
                  key="email"
                  placeholder={Strings.enter_email}
                  value={emailText}
                  onChange={event => setEmailText(event.target.value)}
                  onBlur={event => setEmailText(event.target.value)}
                  buttonTitle={Strings.stay_touch.toUpperCase()}
                  onSubmit={() => submitEmail()}
                  errorMessage={errorMessage}
                ></EmailInput>
              }
              {/* <div className="home-page-link" onClick={()=> navigate("/")}>
                {Strings.back_to_home}
              </div> */}
              <Link className="home-page-link" to="/">{Strings.back_to_home}</Link>

            </div>
          </div>

          {/* <div className="section-separator"></div> */}
          {/* Dispensaries location section start */}
          <div className="page-content-wrap">
            <div className="page-content">
              <div className="inner-content-wrap">
                <Locations distance={100} onStoreSelection={(data) => storeSelected(data)} />
              </div>
            </div>
          </div>
          {/* Dispensaries location section ends */}

          <PopularPages />
        </div>
      </div>
    )
  }

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(Strings.home_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  return (
    <Fragment>
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}