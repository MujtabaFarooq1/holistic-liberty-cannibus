import React, { Fragment, useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import ExitPopup from "../../components/ExitPopup"
import { Strings } from "../../resources"
import "./become-a-patient.scss"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"
import ImageMapper from "react-image-mapper"
import { getStore } from "../../services/HomeService"
import { become_patient_data } from "../../data/become_patient_form"

import USAMap from "react-usa-map";

export default function Home() {
  const isBrowser = () => typeof window !== "undefined"
  const AREAS_MAP = {
    name: "my-map",
    areas: [
      {
        identifier: "cali",
        name: Strings.california,
        shape: "poly",
        coords: [
          11,
          124,
          67,
          141,
          54,
          195,
          117,
          287,
          122,
          301,
          113,
          311,
          111,
          327,
          113,
          329,
          69,
          327,
          71,
          314,
          56,
          299,
          26,
          275,
          25,
          263,
          15,
          236,
          20,
          230,
          12,
          219,
          12,
          213,
          18,
          219,
          16,
          207,
          26,
          207,
          14,
          201,
          11,
          206,
          7,
          192,
          3,
          182,
          5,
          168,
          0,
          152,
          8,
          143,
        ],
      },
      {
        identifier: "pens",
        name: Strings.pennsylvania,
        shape: "poly",
        coords: [
          627,
          163,
          632,
          152,
          635,
          155,
          691,
          147,
          696,
          144,
          703,
          152,
          707,
          152,
          704,
          164,
          711,
          176,
          705,
          185,
          701,
          187,
          632,
          200,
          626,
          160,
        ],
      },
      {
        identifier: "mass",
        name: Strings.massachusetts,
        shape: "poly",
        coords: [
          722,
          121,
          749,
          116,
          754,
          113,
          757,
          115,
          754,
          120,
          758,
          123,
          764,
          130,
          772,
          129,
          765,
          132,
          762,
          130,
          758,
          135,
          752,
          129,
          724,
          133,
        ],
      },
      {
        identifier: "mary",
        name: Strings.maryland,
        shape: "poly",
        coords: [
          650,
          199,
          699,
          189,
          707,
          211,
          715,
          211,
          713,
          217,
          709,
          218,
          707,
          216,
          706,
          213,
          702,
          213,
          704,
          209,
          701,
          206,
          699,
          202,
          699,
          197,
          699,
          189,
          690,
          198,
          693,
          209,
          691,
          212,
          697,
          218,
          687,
          213,
          689,
          205,
          671,
          195,
          662,
          197,
          659,
          197,
          650,
          205,
          650,
          200,
        ],
      },
      {
        identifier: "michi1",
        name: Strings.michigan,
        shape: "poly",
        coords: [
          483,
          86,
          488,
          83,
          493,
          82,
          501,
          75,
          504,
          71,
          508,
          68,
          507,
          70,
          505,
          72,
          502,
          76,
          505,
          83,
          511,
          79,
          518,
          86,
          529,
          86,
          533,
          83,
          538,
          80,
          543,
          80,
          548,
          78,
          549,
          82,
          559,
          83,
          563,
          87,
          557,
          87,
          555,
          90,
          552,
          88,
          546,
          87,
          542,
          90,
          535,
          91,
          533,
          95,
          531,
          93,
          528,
          95,
          526,
          93,
          520,
          106,
          517,
          105,
          516,
          98,
          513,
          97,
          507,
          93,
          501,
          93,
          491,
          90,
          486,
          89,
          483,
          87,
        ],
      },
      {
        identifier: "michi2",
        name: Strings.michigan,
        shape: "poly",
        coords: [
          541,
          172,
          562,
          169,
          566,
          170,
          583,
          167,
          588,
          154,
          593,
          156,
          595,
          155,
          598,
          154,
          593,
          146,
          592,
          145,
          586,
          126,
          582,
          129,
          575,
          135,
          573,
          123,
          576,
          111,
          573,
          105,
          575,
          103,
          565,
          99,
          558,
          97,
          555,
          97,
          556,
          102,
          551,
          105,
          549,
          116,
          543,
          114,
          541,
          118,
          539,
          130,
          540,
          134,
          539,
          138,
          541,
          142,
          545,
          152,
          543,
          166,
          541,
          171,
        ],
      },
    ],
  }

  const [scaledAreas, setScaledAreas] = useState([])
  const [hoveredArea, setHoveredArea] = useState(null)
  const allStates = [
    Strings.california,
    Strings.maryland,
    Strings.massachusetts,
    Strings.michigan,
    Strings.pennsylvania,
  ]
  const [selectedState, setSelectedState] = useState(null)
  const [currentFormText, setCurrentFormText] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { tag } = getStore()

  useEffect(() => {
    if (tag) {
      setDataForm(tag)
      setSelectedState(tag)
      setStateTooltip(tag)
    }
  }, [tag])

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{Strings.become_a_patient_title}</title>
      </Helmet>
    )
  }

  const setStateTooltip = stateName => {
    var id = ""
    switch (stateName.toUpperCase()) {
      case Strings.california.toUpperCase():
        id = "cali"
        break
      case Strings.pennsylvania.toUpperCase():
        id = "pens"
        break
      case Strings.maryland.toUpperCase():
        id = "mary"
        break
      case Strings.massachusetts.toUpperCase():
        id = "mass"
        break
      case Strings.michigan.toUpperCase():
        id = "michi2"
        break
      default:
        break
    }

    let temp = scaledAreas.filter(obj => {
      return obj.identifier === id
    })

    if (temp.length > 0) {
      setHoveredArea(temp[0])
    } else {
      var tempArr = AREAS_MAP.areas.filter(obj => {
        return obj.identifier === id
      })
      let selectedArea = computeCenter(tempArr[0])
      setHoveredArea(selectedArea)
    }
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
    setStateTooltip(event.value)
  }

  const enterArea = area => {
    let temp = scaledAreas.filter(obj => {
      return obj.identifier === area.identifier
    })
    var tempAreas = scaledAreas
    if (temp.length === 0) {
      tempAreas.push(area)
      setScaledAreas(tempAreas)
    }
    if (selectedState == null) {
      setHoveredArea(area)
    }
  }

  const leaveArea = area => {
    if (selectedState == null) {
      setHoveredArea(null)
    }
  }

  const getTipPosition = area => {
    if (isBrowser() && window.innerWidth <= 700) {
      return {
        top: `${area.center[1] - 30}px`,
        left: `${area.center[0] + window.innerWidth * 0.09}px`,
      }
    }
    return { top: `${area.center[1] - 30}px`, left: `${area.center[0]}px` }
  }

  const mapLoaded = () => {
    // console.log("map loaded")
    setScaledAreas([])
    setHoveredArea(null)
  }

  const scaleCoords = coords => {
    // calculate scale based on current 'width' and the original 'imgWidth'
    if (isBrowser()) {
      var scale = (window.innerWidth * 0.7) / 799
      return coords.map((coord, index) => {
        return coord * scale
      })
    }
  }

  const computeCenter = area => {
    if (!area) return [0, 0]

    var scaledCoords = scaleCoords(area.coords)
    // Calculate centroid
    var n = scaledCoords.length / 2

    var _scaledCoords$reduce = scaledCoords.reduce(
      (_ref, val, idx) => {
        var y = _ref.y
        var x = _ref.x

        return !(idx % 2) ? { y: y, x: x + val / n } : { y: y + val / n, x: x }
      },
      { y: 0, x: 0 }
    )

    var y = _scaledCoords$reduce.y
    var x = _scaledCoords$reduce.x

    return {
      center: [x, y],
      scaledCoords: scaledCoords,
      coords: area.coords,
      identifier: area.identifier,
      name: area.name,
      shape: area.shape,
    }
  }

  const linkClicked = (linkAddr) => {
    setShowPrompt(!showPrompt);
    global.currentLink = linkAddr;

    setTimeout(() => {
      if (isBrowser() && global.currentLink.length > 0) {
        window.location.href = global.currentLink;
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
            {Strings.register_ca}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {Strings.form}
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
          {Strings.recommendation_ca}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.secondLink)}
              >
                {Strings.approved}
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
            {Strings.apply}
          <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.thirdLink)}
              >
                {Strings.in_person}
              </button>
            </span>
            {Strings.for_id}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
          {Strings.pay_for_id}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">5</p>
            </div>
          </div>
          <p className="body-text">
          {`${Strings.get_medical} ${Strings.approved_disp} ${Strings.thatsus}`}
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
          {Strings.register_md}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {Strings.here}
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
          {Strings.recommendation_ca}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.secondLink)}
              >
                {Strings.approved}
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
          <p className="body-text">{Strings.pay_for_id}</p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {`${Strings.visit_md}${Strings.thatsus}`}
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
            {Strings.register}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {Strings.program}
              </button>
            </span>
            {` ${Strings.more_info} `}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.moreInfo)}
              >
                {Strings.here}
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
          {Strings.get_proof} 
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.secondLink)}
              >
                {Strings.approved_mi}
              </button>
            </span>
            {" "}{Strings.primary_doctor}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">{Strings.mi_cert} </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {Strings.pay_for_id}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">5</p>
            </div>
          </div>
          <p className="body-text">
        {Strings.mi_license} 
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
            {Strings.register}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {Strings.program}
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
            {Strings.get_proof}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.secondLink)}
              >
                {Strings.approved}
              </button>
            </span>
            {Strings.from_doctor}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">3</p>
            </div>
          </div>
          <p className="body-text">{Strings.pay_for_id}</p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {Strings.get_medical}
            <span>
              <button
                className="link-button body-text"
              >
                {Strings.approved_disp}
              </button>
            </span>
            {Strings.thatsus}
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
            {Strings.recommendation_ca}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.firstLink)}
              >
                {Strings.approved}
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
            {Strings.register_email}
            <span>
              <button
                className="link-button body-text"
                onClick={() => linkClicked(currentFormText.secondLink)}
              >
                {Strings.electronically}
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
            {Strings.need_pin}
          <span>
            <button className="link-button body-text" 
            onClick={() => linkClicked(currentFormText.thirdLink)}>
              {Strings.registration}</button></span></p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">4</p>
            </div>
          </div>
          <p className="body-text">
            {Strings.pay_for_id}
          </p>
        </div>
        <div className="point">
          <div>
            <div className="ellipse">
              <p className="pointers">5</p>
            </div>
          </div>
          <p className="body-text">
          {`${Strings.get_medical} ${Strings.approved_disp} ${Strings.thatsus}`}
          </p>
        </div>
      </div>
    )
  }

  const renderForm = () => {
    switch (selectedState) {
      case Strings.california:
        return renderCAForm()
      case Strings.maryland:
        return renderMDForm()
      case Strings.massachusetts:
        return renderMAForm()
      case Strings.michigan:
        return renderMIForm()
      case Strings.pennsylvania:
        return renderPAForm()
      default:
        return
    }
  }

  const mapHandler = (event) => {
    alert(event.target.dataset.name);
  };

  const statesCustomConfig = () => {
    // alert("aaaaaaaaaaaa");
    return {
      "NJ": {
        fill: "navy",
        // clickHandler: (event) => console.log('Custom handler for NJ', event.target.dataset)
      },
      "AK": {
        fill: "red",
        visibility: "hidden"
      }
    };
  };

  const renderPage = () => {
    return (
      <div className="become-a-patient-wrap page-container-layout">
        <div className="page-title-banner">
          <h1 className="page-title h1-forza">
            {Strings.bpa_title.toUpperCase()}
          </h1>
          <h4 className="page-desc body-text">{Strings.bpa_desc}</h4>
        </div>

        <div className="patient-page-content">
          <div className="page-note">
            <p className="body-text">
              <span className="para-title">{Strings.bpa_note_title}</span>
              {Strings.bpa_note}
            </p>
          </div>
          <div className="dispensary-map-wrap">
            <Dropdown
              options={allStates}
              onChange={event => onSelectState(event)}
              value={selectedState}
              placeholder={Strings.bpa_select_placeholder}
              className="state-dropdown"
              controlClassName="dropdown-state-control"
              placeholderClassName="dropdown-state-placeholder"
              arrowClassName="dropdown-state-arrow"
              menuClassName="dropdown-state-menu"
            />
            <div className="map-container">
              <USAMap customize={statesCustomConfig()} onClick={mapHandler} />
              <ImageMapper
                // src={require("../../resources/images/become-patient/US_Map.png")}
                src={require("../../resources/images/become-patient/US_Map.svg")}

                map={AREAS_MAP}
                // width={isBrowser() && window.innerWidth * 0.7}
                width={798}

                imgWidth={799}
                onLoad={() => mapLoaded()}
                onMouseEnter={area => enterArea(area)}
                onClick={area => enterArea(area)}
                onMouseLeave={area => leaveArea(area)}
                fillColor="transparent"
                strokeColor="transparent"
              />
              {hoveredArea && (
                <span
                  className="state-tooltip"
                  style={{ ...getTipPosition(hoveredArea) }}
                >
                  {hoveredArea && hoveredArea.name.toUpperCase()}
                </span>
              )}
            </div>
            {renderForm()}
          </div>
        </div>
        {showPrompt ? <ExitPopup onClose={() => popupClosed()} /> : null}
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
