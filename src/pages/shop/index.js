import React, { Fragment, useRef, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { setPageTitle } from "./../../utils/page"
import { Strings } from "./../../resources"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import { getStore } from "../../services/HomeService"
import {
  filterLocation,
  setStore as setStoreInStore,
} from "../../services/HomeService"
import PopularPages from "../../components/PopularPages"
import locations from "./../../data/location"
import LocationPicker from "../../components/LocationPicker"
import { withPrefix } from "gatsby"

import "./shop.scss"
import HoverButton from "../../components/UI/HoverButton"

const janeDispensaries = [
  "Philadelphia",
  "Rockville",
  "Norristown",
  "Cranberry Township",
  "Bensalem",
  "Aliquippa",
  "Maggie's - Baltimore",
  "San Francisco",
  "Oxon Hill",
  "Madison Heights",
  "Beach Center",
  "Easthampton",
  "Detroit",
  "Somerville",
  "Springfield",
  "Pittsburgh",
  // "Van Nuys",
]

const coLocatedStores = ["Madison Heights", "Easthampton", "Detroit"]

export default function ShopPage({ pageContext }) {
  const { pageCity } = pageContext

  if (pageCity) {
    let storeLocation = filterLocation(pageCity)
    if (storeLocation) {
      setStoreInStore(storeLocation)
    }
  }
  const allLocations = locations.location_data

  const { title_text, city, dutchieEmbedUrl } = getStore()

  const instance = useRef(null)

  const [isLocationActive, setLocationActive] = useState(false)
  const [jane, setJane] = useState(false)
  const [menu, setMenu] = useState("REC")
  const [showMenu, setShowMenu] = useState(false)

  const locationPickerClosed = () => {
    setLocationActive(false)
  }

  useEffect(() => {
    const script = document.createElement("script")

    const { abbr, name, error, dutchieEmbedUrl } = getStore()

    var flag = 0

    // fetch(`https://holistic-industries-contact-form-dev.azurewebsites.net/api/core-location/list?filter=%5B%5B%22type%22%2C%22%3D%22%2C%22Dispensary%22%5D%5D`)
    //   .then(response => response.json())
    //   .then(resultData => {

    allLocations.forEach((dispensary, key) => {
      // console.log(title_text, name, title_text);

      if (
        (dispensary.name === name || dispensary.city === name) &&
        dispensary.stateCode === abbr
      ) {
        coLocatedStores.includes(name) && menu === "REC"
          ? (script.src = dispensary.dutchieEmbedUrlREC)
          : (script.src = dispensary.dutchieEmbedUrl)
        if (instance.current) instance.current.innerHTML = ""
      } else if (!error) {
        navigator.geolocation.getCurrentPosition(function (position) {
          if (
            distance(
              position.coords.latitude,
              position.coords.longitude,
              dispensary.latitude,
              dispensary.longitude,
              "K"
            ) <= 0.1
          ) {
            script.src = dispensary.dutchieEmbedUrl
          } else {
            script.src =
              "https://dutchie.com/api/v2/embedded-menu/6v9wqPMPJA64Ldwpb.js"
            flag = 1
          }
        })
      } else {
        script.src =
          "https://dutchie.com/api/v2/embedded-menu/6v9wqPMPJA64Ldwpb.js"
        flag = 1
      }
    })
    // });

    if (flag === 1) {
      setLocationActive(true)
    }

    // Created script tag here
    script.async = true
    if (janeDispensaries.includes(name)) {
      script.id = "jane-frame-script"
      coLocatedStores.includes(name) && setShowMenu(true)
      setJane(true)
    } else {
      script.id = "dutchie--embed__script"
      setJane(false)
    }

    // Appended script tag to instance
    if (dutchieEmbedUrl !== "") {
      instance.current.appendChild(script)
    }
  }, [allLocations, menu])

  const distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = (Math.PI * lat1) / 180
    var radlat2 = (Math.PI * lat2) / 180
    var theta = lon1 - lon2
    var radtheta = (Math.PI * theta) / 180
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === "K") {
      dist = dist * 1.609344
    }
    if (unit === "N") {
      dist = dist * 0.8684
    }
    return dist
  }

  // Head Content
  const renderHelmet = () => {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{setPageTitle(Strings.shop_title)}</title>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-19065596-3"
          ></script>
          {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
        </Helmet>
        <Helmet>
          {typeof window !== "undefined" &&
          jane &&
          document.location.origin === "https://libertycannabis.com" ? (
            <script src={withPrefix("script.js")} type="text/javascript" />
          ) : null}
        </Helmet>
      </>
    )
  }

  // Main Page Content
  const renderPage = () => {
    return (
      <>
        {/* Script tag will append to below div */}
        <LocationPicker
          isActiveLocation={isLocationActive}
          onLocPickerClosed={() => locationPickerClosed()}
        />
        {showMenu && (
          <div className="menu-container">
            <div className="menu-container__header">
              <h1>Please Choose Your Menu:</h1>
            </div>
            <div className="btn-wrapper">
              <div className="menu-container__btn">
                <HoverButton
                  btnClassName={`menu-btn ${menu === "REC" && "active"}`}
                  onClick={() => setMenu("REC")}
                >
                  Recreational
                </HoverButton>
                {menu === "REC" && <p>Currently Viewing</p>}
              </div>
              <div className="menu-container__btn">
                <HoverButton
                  btnClassName={`menu-btn ${menu === "MED" && "active"}`}
                  onClick={() => setMenu("MED")}
                >
                  Medical
                </HoverButton>
                {menu === "MED" && <p>Currently Viewing</p>}
              </div>
            </div>
          </div>
        )}
        {/* <div className={`shop-page page-container-layout ${title_text ? "location-selected" : ""}`} ref={instance} /> */}

        {dutchieEmbedUrl == "" ? (
          <div className="vanshop-comingsoon page-container-layout">
            <div className="inner-wrap-wide">
              <h2 className="sr-title">
                Online Shopping for {city} is
                <span className="sr-not-found-query sr-query">COMING SOON</span>
              </h2>
              {city === "Columbia" ? (
                <div className="description">
                  {/* <div className='images-wrapper'>
                        <div className='img-wrap'>
                          <img loading="lazy" src={storefront} alt={Strings.img1_alt} className='store-image' />
                        </div>
                        <div className='img-wrap'>
                          <img loading="lazy" src={hallway} alt={Strings.img2_alt} className='store-image half-img' />
                        </div>
                      </div> */}
                  <div className="text-content">
                    <p>{Strings.location_desc1}</p>
                    <p>{Strings.location_desc2}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <PopularPages />
          </div>
        ) : (
          <div
            className={`shop-page page-container-layout ${
              title_text ? "location-selected" : ""
            }`}
            ref={instance}
          ></div>
        )}
      </>
    )
  }

  // Layout Added Here
  return (
    <Fragment>
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}
