import React, { Fragment, useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import PageBanner from "../../components/PageBanner/PageBanner"
import ExitPopup from "../../components/ExitPopup"
import StickyCart from "./../../components/StickyCart"

// import { Strings } from "../../resources"
import becomePatientStrings from "./../../data/become_patient"
import "./become-a-patient.scss"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"
import { getStore, resetDistance, filterLocationBasedText } from "../../services/HomeService"
import { become_patient_data } from "../../data/become_patient_form"
import { Link } from "gatsby";
import { setPageTitle } from "./../../utils/page";

import USAMap from "react-usa-map";

export default function BecomeAPatient() {
  const isBrowser = () => typeof window !== "undefined"

  const allStates = [
    becomePatientStrings.california,
    becomePatientStrings.maryland,
    becomePatientStrings.massachusetts,
    becomePatientStrings.michigan,
    // becomePatientStrings.missouri,
    becomePatientStrings.pennsylvania,
  ]
  const [selectedState, setSelectedState] = useState(null)
  const [currentFormText, setCurrentFormText] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { tag } = getStore()

  const [storeData, setStoreData] = useState(null);

  const [stateName, setState] = useState(null);
  const [prevStateName, setPrevState] = useState(null);

  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);

  const exitPopupRef = useRef(null);
  const mapRef = useRef();


  const storeSelected = (store) => {
    setStoreData({ title_text: store.title_text, abbr: store.abbr, title_image: store.title_image });
  }

  useEffect(() => {
    if (tag) {
      setDataForm(tag)
      setSelectedState(tag)
    }
  }, [tag])

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(becomePatientStrings.title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const setDataForm = stateName => {
    let filteredData = become_patient_data.filter(data => {
      return data.state.toUpperCase() === stateName.toUpperCase()
    })
    if (filteredData.length > 0) {
      setCurrentFormText(filteredData[0])
    }
  }

  const onSelectState = event => {
    setDataForm(event.value)
    setSelectedState(event.value)
    // event.target.style.fill = "#71BF97";
    // mapRef.current.getElementsByClassName("CA")[0].style.fill = "#A2E3C2";
    // mapRef.current.getElementsByClassName("MD")[0].style.fill = "#A2E3C2";
    // mapRef.current.getElementsByClassName("MA")[0].style.fill = "#A2E3C2";
    // mapRef.current.getElementsByClassName("MI")[0].style.fill = "#A2E3C2";
    // mapRef.current.getElementsByClassName("MO")[0].style.fill = "#A2E3C2";
    // mapRef.current.getElementsByClassName("PA")[0].style.fill = "#A2E3C2";

    var statesPath = mapRef.current.getElementsByClassName("state");
    // console.log(statesPath)
    for(var i = 0; i < statesPath.length; i++){
      statesPath[i].style.fill = "#A2E3C2";
    }

    switch (event.value) {
      case becomePatientStrings.california:
        setState("CA");
        mapRef.current.getElementsByClassName("CA")[0].style.fill = "#71BF97";
        break;
      case becomePatientStrings.maryland:
        setState("MD");
        mapRef.current.getElementsByClassName("MD")[0].style.fill = "#71BF97";
        break;
      case becomePatientStrings.massachusetts:
        setState("MA");
        mapRef.current.getElementsByClassName("MA")[0].style.fill = "#71BF97";
        break;
      case becomePatientStrings.michigan:
        setState("MI");
        mapRef.current.getElementsByClassName("MI")[0].style.fill = "#71BF97";
        break;
      // case becomePatientStrings.missouri:
      //   setState("MO");
      //   mapRef.current.getElementsByClassName("MO")[0].style.fill = "#71BF97";
      //   break;
      case becomePatientStrings.pennsylvania:
        setState("PA");
        mapRef.current.getElementsByClassName("PA")[0].style.fill = "#71BF97";
        break;

      default:
        setState("null");
        break;
    }
  }

  const linkClicked = (linkAddr) => {
    setShowPrompt(!showPrompt);
    global.currentLink = linkAddr;

    setTimeout(() => {
      if (isBrowser() && global.currentLink.length > 0) {
        // window.location.href = global.currentLink;
        window.open(global.currentLink, '_blank');
        exitPopupRef.current.click();
      }
    }, 2000);
  }

  const popupClosed = () => {
    setShowPrompt(!showPrompt)
    global.currentLink = "";
  }

  const renderCAForm = () => {
    return (
      <div className={`form-container ${selectedState == null ? "hide" : ""}`}>
        <h3 className="h3-subheads-forza">{selectedState}</h3>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">1</p>
            </div>
          </div>
          <p className="body-text">
            {becomePatientStrings.register_ca}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {filterLocationBasedText(becomePatientStrings.form)}
              </button>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">2</p>
            </div>
          </div>
          <p className="body-text">
          {filterLocationBasedText(becomePatientStrings.recommendation_ca)}
            <span>
              <a className="link-button body-text" href={currentFormText.secondLink} target="_blank" rel="noreferrer noopener">
                {becomePatientStrings.approved}
              </a>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.apply)}
          <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.thirdLink)}
              >
                {becomePatientStrings.in_person}
              </button>
            </span>
            {becomePatientStrings.for_id}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
          {filterLocationBasedText(becomePatientStrings.pay_for_id)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">5</p>
            </div>
          </div>
          <p className="body-text">
          {`${becomePatientStrings.get_medical} ${becomePatientStrings.approved_disp}`} (<Link to={becomePatientStrings.contact_url} className="text-underline">{becomePatientStrings.thatsus}</Link>).
          </p>
        </div>
      </div>
    )
  }

  const renderMDForm = () => {
    return (
      <div className={`form-container ${selectedState == null ? "hide" : ""}`}>
        <h3 className="h3-subheads-forza">{selectedState}</h3>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">1</p>
            </div>
          </div>
          <p className="body-text">
          {becomePatientStrings.register_md}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {becomePatientStrings.here}
              </button>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">2</p>
            </div>
          </div>
          <p className="body-text">
          {filterLocationBasedText(becomePatientStrings.recommendation_ca)}
            <span>

              <a className="link-button body-text" href={currentFormText.secondLink} target="_blank" rel="noreferrer noopener">
                {filterLocationBasedText(becomePatientStrings.approved)}
              </a>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">{becomePatientStrings.pay_for_id}</p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {`${becomePatientStrings.visit_md}`} (<Link to={becomePatientStrings.contact_url} className="text-underline">{becomePatientStrings.thatsus}</Link>).
          </p>
        </div>
      </div>
    )
  }

  const renderMIForm = () => {
    return (
      <div className={`form-container ${selectedState == null ? "hide" : ""}`}>
        <h3 className="h3-subheads-forza">{selectedState}</h3>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">1</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.register)}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {becomePatientStrings.program}
              </button>
            </span>
            {` ${filterLocationBasedText(becomePatientStrings.more_info)} `}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.moreInfo)}
              >
                {becomePatientStrings.here}
              </button>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">2</p>
            </div>
          </div>
          <p className="body-text">
          {filterLocationBasedText(becomePatientStrings.get_proof)}
            <span>
              <a className="link-button body-text" href={currentFormText.secondLink} target="_blank" rel="noreferrer noopener">
                {filterLocationBasedText(becomePatientStrings.approved_mi)}
              </a>
            </span>
            {" "}{filterLocationBasedText(becomePatientStrings.primary_doctor)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">{filterLocationBasedText(becomePatientStrings.mi_cert)} </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.pay_for_id)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">5</p>
            </div>
          </div>
          <p className="body-text">
        {filterLocationBasedText(becomePatientStrings.mi_license)} (<Link to={becomePatientStrings.contact_url} className="text-underline">{becomePatientStrings.thatsus}</Link>).
        </p>
        </div>
      </div>
    )
  }

  const renderMOForm = () => {
    return (
      <div className={`form-container ${selectedState == null ? "hide" : ""}`}>
        <h3 className="h3-subheads-forza">{selectedState}</h3>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">1</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.mo_point_one)}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.qualifyLink)}
              >
                {becomePatientStrings.mo_point_one_link}
              </button>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">2</p>
            </div>
          </div>
          <p className="body-text">
            <span>
              <a className="link-button body-text" href={currentFormText.registerLink} target="_blank" rel="noreferrer noopener">
                {filterLocationBasedText(becomePatientStrings.mo_point_two_link)}
              </a>
            </span>
            {" "}{filterLocationBasedText(becomePatientStrings.mo_point_two)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">
            <span>
              <a className="link-button body-text" href={currentFormText.paymentLink} target="_blank" rel="noreferrer noopener">
                {filterLocationBasedText(becomePatientStrings.mo_point_three_link)}
              </a>
            </span>
            {" "}{filterLocationBasedText(becomePatientStrings.mo_point_three)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.mo_point_four)}
            <span>
              <a className="link-button body-text" href={currentFormText.contactLink} target="_blank" rel="noreferrer noopener">
                {"("}{filterLocationBasedText(becomePatientStrings.mo_point_four_link)}{"!)"}
              </a>
            </span>
          </p>
        </div>
      </div>
    )
  }

  const renderPAForm = () => {
    return (
      <div className={`form-container ${selectedState == null ? "hide" : ""}`}>
        <h3 className="h3-subheads-forza">{selectedState}</h3>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">1</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.register)}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {filterLocationBasedText(becomePatientStrings.program)}
              </button>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">2</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.get_proof)}
            <span>
              <a className="link-button body-text" href={currentFormText.secondLink} target="_blank" rel="noreferrer noopener">
                {filterLocationBasedText(becomePatientStrings.approved).replace('.', '')}
              </a>
            </span>
            {filterLocationBasedText(becomePatientStrings.from_doctor)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">{filterLocationBasedText(becomePatientStrings.pay_for_id)}</p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.get_medical)}
            <span>
              <a className="link-button body-text" href={currentFormText.thirdLink} target="_blank" rel="noreferrer noopener">
                { filterLocationBasedText(becomePatientStrings.approved_disp).replace('dispensary', 'provisioning center') }
              </a>
            </span>
            &nbsp;(<Link to={becomePatientStrings.contact_url} className="text-underline">{becomePatientStrings.thatsus}</Link>).
          </p>
        </div>
      </div>
    )
  }

  const renderMAForm = () => {
    return (
      <div className={`form-container ${selectedState == null ? "hide" : ""}`}>
        <h3 className="h3-subheads-forza">{selectedState}</h3>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">1</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.recommendation_ca)}
            <span>
              <a className="link-button body-text" href={currentFormText.firstLink} target="_blank" rel="noreferrer noopener">
                {filterLocationBasedText(becomePatientStrings.approved)}
              </a>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">2</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.register_email)}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.secondLink)}
              >
                {filterLocationBasedText(becomePatientStrings.electronically)}
              </button>
            </span>
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.need_pin)}
          <span>
            <button className="link-button body-text"
            onClick={() => linkClicked(currentFormText.thirdLink)}>
              {filterLocationBasedText(becomePatientStrings.registration)}</button></span></p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {filterLocationBasedText(becomePatientStrings.pay_for_id)}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">5</p>
            </div>
          </div>
          <p className="body-text">
          {`${filterLocationBasedText(becomePatientStrings.get_medical)} ${filterLocationBasedText(becomePatientStrings.approved_disp)}`}  (<Link to={becomePatientStrings.contact_url} className="text-underline">{filterLocationBasedText(becomePatientStrings.thatsus)}</Link>).
          </p>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    switch (selectedState) {
      case becomePatientStrings.california:
        return renderCAForm()
      case becomePatientStrings.maryland:
        return renderMDForm()
      case becomePatientStrings.massachusetts:
        return renderMAForm()
      case becomePatientStrings.michigan:
        return renderMIForm()
      // case becomePatientStrings.missouri:
      //   return renderMOForm()
      case becomePatientStrings.pennsylvania:
        return renderPAForm()
      default:
        return
    }
  }

  const onSelectMapState = stateName => {
    setDataForm(stateName)
    setSelectedState(stateName)
  }

  const mapHandler = (event) => {
    // mapRef.current.style.fill = "red";
    // var statesPath = mapRef.current.children[1].children[1].children;
    var statesPath = mapRef.current.getElementsByClassName("state");
    // console.log(statesPath)
    for(var i = 0; i < statesPath.length; i++){
      statesPath[i].style.fill = "#A2E3C2";
    }
    event.target.style.fill = "#71BF97";
    setState(event.target.dataset.name);

    switch (event.target.dataset.name) {
      case "CA":
        onSelectMapState("California");
        break;
      case "MD":
        onSelectMapState("Maryland");
        break;
      case "MA":
        onSelectMapState("Massachusetts");
        break;
      case "MI":
        onSelectMapState("Michigan");
        break;
      // case "MO":
      //   onSelectMapState("Missouri");
      //   break;
      case "PA":
        onSelectMapState("Pennsylvania");
        break;
      default:
        onSelectMapState("Pennsylvania");
        break;
    }
  };

  const getStateName = (stateCode) => {
    switch (stateCode) {
      case "CA":
        return becomePatientStrings.california;
      case "MD":
        return becomePatientStrings.maryland;
      case "MA":
        return becomePatientStrings.massachusetts;
      case "MI":
        return becomePatientStrings.michigan;
      // case "MO":
      //   return becomePatientStrings.missouri;
      case "PA":
        return becomePatientStrings.pennsylvania;
    }
  }

  const onMapHover = (e) => {
    if(e.target.dataset.name) {
      // e.target.style.fill = "#71BF97";

      setState(e.target.dataset.name);
      // setMouseX(e.pageX);
      // setMouseY(e.pageY);
    }
  }

  // const onMapLeave = (e) => {
  //   // if (e.target.dataset.name === prevStateName) {
  //   // } else {
  //   //   e.target.style.fill = "#A2E3C2";
  //   //   setPrevState(e.target.dataset.name);
  //   // }
  //   if(e.target.dataset.name) {
  //     setState(null);
  //     e.target.style.fill = "#A2E3C2";
  //   }
  // }

  const renderPage = () => {

    return (
      <div className={`become-a-patient-wrap page-container-layout ${tag ? "location-selected" : ""}`}>
        <PageBanner pageTitle={(filterLocationBasedText(becomePatientStrings.bpa_title).toUpperCase())} pageDesc1={(filterLocationBasedText(becomePatientStrings.bpa_desc))} internalLink="" internalLinkText="" pageDesc2="" />
        <StickyCart />

        <div className="patient-page-content">
          <div className="page-note">
            <p className="body-text">
              <span className="para-title">{filterLocationBasedText(becomePatientStrings.bpa_note_title)}</span>
              {filterLocationBasedText(becomePatientStrings.bpa_note)}
            </p>
          </div>
          <div className="dispensary-map-wrap">
            <Dropdown
              options={allStates}
              onChange={event => onSelectState(event)}
              value={selectedState}
              placeholder={filterLocationBasedText(becomePatientStrings.bpa_select_placeholder)}
              className="state-dropdown"
              controlClassName="dropdown-state-control"
              placeholderClassName="dropdown-state-placeholder"
              arrowClassName="dropdown-state-arrow"
              menuClassName="dropdown-state-menu"
            />
            <div className="map-wrap">
              {/* <div className="map-container" onMouseOver={onMapHover} onMouseOut={onMapLeave} > */}
              <div className="map-container" onMouseOver={onMapHover} ref={mapRef}>
              {/* <span onClick={mapHandler} className="map-tooltip" style={{top:mouseY - 40, left:mouseX}} data-name={stateName}>{getStateName(stateName)}</span> */}
                <span onClick={mapHandler} className={`map-tooltip ${stateName}`}  data-name={stateName}>{getStateName(stateName)}</span>
                <USAMap  onClick={mapHandler} title="" />
              </div>
            </div>
            {renderForm()}
          </div>
        </div>
        {showPrompt ? <ExitPopup exitPopupRef={exitPopupRef} onClose={() => popupClosed()} /> : null}
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
