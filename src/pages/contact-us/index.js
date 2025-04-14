import React, { Fragment, useState, useRef } from "react";

import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import PageBanner from "../../components/PageBanner/PageBanner"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"

// import { Strings } from "../../resources";
import contactStrings from "./../../data/contact"
import { setPageTitle } from "../../utils/page"

import Locations from "../../components/Locations";
import StickyCart from "./../../components/StickyCart"
import HoverButton from "../../components/UI/HoverButton"


import usaStates from "../../data/usa_states"


import downArrow from "../../resources/images/DownArrow.svg";

import "./contact-us.scss";

import { 
  SITE_ID,
  EMAIL_API_URL, 
  EMAIL_VALIDATION_REGEX, 
  filterLocationBasedText,
  getStore
} from "../../services/HomeService";

const { tag } = getStore()


//import 'bootstrap/dist/css/bootstrap.css';


export default function ContactUs() {
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(contactStrings.contact_us)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const [storeData, setStoreData] = useState(null);

  const storeSelected = (store) => {
    setStoreData({ title_text: store.title_text, abbr: store.abbr, title_image: store.title_image });
  }

  const sendEmail = async (e) => {
    e.preventDefault();
    var name = userName;
    var email = userEmail;
    var phone = userPhone;
    var state = selectedState;
    var message = userMessage;

    var isValid = true; 

    if (name === null || name.length < 1) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserName.current.style.borderColor = '#FF000A';
      inputUserName.current.style.color = '#FF000A';

      isValid = false;
    } else {
      refErrorMessage.current.style.display = 'block';
      inputUserName.current.style.borderColor = '#183029';
      inputUserName.current.style.color = '#183029';

      isValid = true;
    }

    if (phone === null || phone.length > 10) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserPhone.current.style.borderColor = '#FF000A';
      inputUserPhone.current.style.color = '#FF000A';

      isValid = false;
    } else {
      refErrorMessage.current.style.display = 'block';
      inputUserPhone.current.style.borderColor = '#183029';
      inputUserPhone.current.style.color = '#183029';

      isValid = true;
    }

    if (inputUserMessage.current.value === null || inputUserMessage.current.value.length < 1) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserMessage.current.style.borderColor = '#FF000A';
      inputUserMessage.current.style.color = '#FF000A';

      isValid = false;
    } else {
      refErrorMessage.current.style.display = 'block';
      inputUserMessage.current.style.borderColor = '#183029';
      inputUserMessage.current.style.color = '#183029';

      isValid = true;
    }


    if (state === null) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserState.current.firstChild.style.borderColor = '#FF000A';
      inputUserState.current.firstChild.style.color = '#FF000A';

      isValid = false;
    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserState.current.firstChild.style.borderColor = '#183029';
      inputUserState.current.firstChild.style.color = '#183029';

      isValid = true;
    }


    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserEmail.current.style.borderColor = '#FF000A';
      inputUserEmail.current.style.color = '#FF000A';

      isValid = false;
    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserEmail.current.style.borderColor = '#183029';
      inputUserEmail.current.style.color = '#183029';

      isValid = true;
    }


    if (isValid === true) {
      // alert("success");
      refErrorMessage.current.style.color = 'transparent';

      const response = await fetch(EMAIL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              siteGuid: SITE_ID,
              name : name,
              email : email, 
              phone : phone,
              state : state,
              message : message,
          })
      });

      const result = await response.json();
      // console.log(result);
      // console.log(response.ok);

      if (result.id !== 0) {
        contactFormRef.current.style.display = "none";
        resultSectionRef.current.style.display = "block";
      } else {
        contactFormRef.current.style.display = "block";
        resultSectionRef.current.style.display = "none";
      }     

    } else {
      // alert("fail");
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
    }

  }

  const inputUserName = useRef(null);
  const inputUserEmail = useRef(null);
  const inputUserPhone = useRef(null);
  const inputUserState = useRef(null);
  const inputUserMessage = useRef(null);

  const contactFormRef = useRef(null);
  const resultSectionRef = useRef(null);
  const refErrorMessage = useRef(null);

  const [userName, setUserName] = useState(null)
  const onNameChange = event => {

    var name = event.target;
    if (name.value.length < 1) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserName.current.style.borderColor = '#FF000A';
      inputUserName.current.style.color = '#FF000A';
    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserName.current.style.borderColor = '#183029';
      inputUserName.current.style.color = '#183029';
    }

    setUserName(name.value)

  }

  const [userEmail, setUserEmail] = useState(null)
  const onEmailChange = event => {
    var email = event.target;

    if (!EMAIL_VALIDATION_REGEX.test(email.value)) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserEmail.current.style.borderColor = '#FF000A';
      inputUserEmail.current.style.color = '#FF000A';
    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserEmail.current.style.borderColor = '#183029';
      inputUserEmail.current.style.color = '#183029';
    }

    setUserEmail(email.value);
  }

  const [userPhone, setUserPhone] = useState(null)
  const onPhoneChange = event => {
    var phone = event.target;
    if (phone.value.length > 10) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserPhone.current.style.borderColor = '#FF000A';
      inputUserPhone.current.style.color = '#FF000A';
    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserPhone.current.style.borderColor = '#183029';
      inputUserPhone.current.style.color = '#183029';
    }
    setUserPhone(phone.value);
  }

  const [selectedState, setSelectedState] = useState(null)
  const onSelectState = event => {

    if (event.value === null) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserState.current.firstChild.style.borderColor = '#FF000A';
      inputUserState.current.firstChild.style.color = '#FF000A';

    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserState.current.firstChild.style.borderColor = '#183029';
      inputUserState.current.firstChild.style.color = '#183029';
    }

    setSelectedState(event.value);
  }

  const [userMessage, setUserMessage] = useState(null)
  const onMessageChange = event => {
    var message = event.target;
    if (message.value.length < 1) {
      refErrorMessage.current.style.display = 'block';
      refErrorMessage.current.style.color = '#FF000A';
      inputUserMessage.current.style.borderColor = '#FF000A';
      inputUserMessage.current.style.color = '#FF000A';
    } else {
      refErrorMessage.current.style.display = 'none';
      inputUserMessage.current.style.borderColor = '#183029';
      inputUserMessage.current.style.color = '#183029';
    }

    setUserMessage(message.value);
  }



  const renderPage = () => {
    // const allStates = [
    //   contactStrings.california,
    //   contactStrings.maryland,
    //   contactStrings.massachusetts,
    //   contactStrings.michigan,
    //   contactStrings.pennsylvania,
    // ];    

    return (
      <div className={`contact-us-wrap page-content-wrap page-container-layout ${tag ? "location-selected" : ""}`}>
        <PageBanner pageTitle={filterLocationBasedText(contactStrings.contact_us)} pageDesc1={filterLocationBasedText(contactStrings.contact_us_desc1)} internalLink="/learn?tab=general" internalLinkText={filterLocationBasedText(contactStrings.contact_us_desc_faq_link)} pageDesc2={filterLocationBasedText(contactStrings.contact_us_desc2)} />
        <StickyCart />
        <div className="page-content">
          <div className="inner-content-wrap">

            <div className="btn-row row">
              <div className="single-btn col-md-6">
                <Link to="#contact-us-form-tag">
                  <button id="btn-email" className="btn btn-big btn-orange">
                    <div className="btn-text col-10 col-sm-8 col-md-10">
                      <p className="btn-value">{filterLocationBasedText(contactStrings.contact_big_btn1.toUpperCase())}</p>
                      <p className="btn-desc">{filterLocationBasedText(contactStrings.contact_big_btn1_desc)}</p>
                    </div>
                    <div className="btn-animation col-sm-4 col-md-2">
                      <img loading="lazy" className="down-arrow" src={downArrow} alt="down arrow" />
                    </div>
                  </button>
                </Link>
              </div>
              <div className="single-btn col-md-6">
                <Link to="#our-locations-tag">
                  <button id="btn-call" className="btn btn-big btn-red">
                    <div className="btn-text col-10 col-sm-8 col-md-10">
                      <p className="btn-value">{filterLocationBasedText(contactStrings.contact_big_btn2.toUpperCase())}</p>
                      <p className="btn-desc">{filterLocationBasedText(contactStrings.contact_big_btn2_desc)}</p>
                    </div>
                    <div className="btn-animation col-sm-4 col-md-2">
                      <img loading="lazy" className="down-arrow" src={downArrow} alt="down arrow" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
            {/* Dispensaries location section start */}
            <div id="our-locations-tag"></div>
            <Locations distance={100} onStoreSelection={(data) => storeSelected(data)} />
            {/* Dispensaries location section ends */}
            <div id="contact-us-form-tag"></div>
            <hr className="section-separator" ></hr>
            <div className="contact-form-wrap" id="contact-us-form" ref={contactFormRef}>
              <h2 className="sub-heading">{filterLocationBasedText(contactStrings.contact_email_form_title)}</h2>
              <form className="contact-form" method="POST">
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <input 
                      type="text" 
                      className="form-control user-name" 
                      id="user-name" 
                      ref={inputUserName}
                      placeholder="Name (first, last)" 
                      onChange={event => onNameChange(event)}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    <input 
                      type="text" 
                      className="form-control email-id" 
                      id="email-id" 
                      ref={inputUserEmail}
                      placeholder="Email"
                      onChange={event => onEmailChange(event)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <input 
                      type="number" 
                      maxLength="10"  
                      className="form-control user-phone" 
                      id="user-phone" 
                      ref={inputUserPhone}
                      name="user-phone" 
                      placeholder="Phone number (optional)" 
                      onChange={event => onPhoneChange(event)}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6" ref={inputUserState}>
                    <Dropdown
                      options={usaStates}
                      onChange={event => onSelectState(event)}
                      value={selectedState}
                      placeholder={contactStrings.bpa_select_placeholder}
                      className="form-control user-state"
                      id="user-state"
                      controlClassName="dropdown-state-control"
                      placeholderClassName="dropdown-state-placeholder"
                      arrowClassName="dropdown-state-arrow"
                      menuClassName="dropdown-state-menu"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-12">
                    <textarea 
                      className="form-control email-message" 
                      id="email-message" 
                      ref={inputUserMessage}
                      name="email-message" 
                      onChange={event => onMessageChange(event)}
                      placeholder="Message">
                    </textarea>
                  </div>
                  <div>
                    <p id="validation-message" ref={refErrorMessage}>{filterLocationBasedText(contactStrings.validationError)}</p>
                  </div>
                </div>
                <div className="form-row">
                  <HoverButton 
                    btnType="submit" 
                    btnId="btn-send-email"
                    btnName="btn-send-email"
                    btnClassName="btn btn-send-email col-md-4"
                    onClick={sendEmail}
                  >
                    {contactStrings.contact_email_btn_val}
                  </HoverButton>
                  {/* <PulsButton></PulsButton>
                  <PulsButton></PulsButton>
                  <PulsButton></PulsButton> */}

                </div>
              </form>
            </div>
            <div id="result-section" ref={resultSectionRef}>
              <h2 className="thanks-msg">{filterLocationBasedText(contactStrings.contact_email_thanks_title)}</h2>
              <p className="thanks-msg-text">{filterLocationBasedText(contactStrings.contact_email_thanks_message)}</p>
            </div>
          </div>
          
        </div>

      </div>
    )
  }

  return (
    <Fragment>
        <HomeLayout>{renderPage()}</HomeLayout>
        {renderHelmet()}
    </Fragment>
  )
}


