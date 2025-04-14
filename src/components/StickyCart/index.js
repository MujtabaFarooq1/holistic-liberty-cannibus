import React, { useState } from "react"
import { getStore, filterLocation } from "../../services/HomeService"
import { navigate } from "@reach/router"
import LocationPicker from "../../components/LocationPicker"
import "./cart.scss"

const StickyCart = () => {

  const {
    name,
  } = getStore()

  const [isActive, setActive] = useState(false)

  const libertyLocation = (e) => {
    e.preventDefault()
    if (name) {
      let storeLocation = filterLocation(name)
      storeLocation ? navigate(storeLocation.link) : setActive(true)
    } else {
      setActive(true)
    }
  }

  const locationPickerClosed = () => {
    setActive(false);
  }

  const locationActive = isActive ? "location-bar-active" : "location-bar-inactive"

  return (
    <>
      <div className={`cart-wrap ${locationActive}`}>
        <span className="cartIcon" id="cartIcon" tabIndex="0" onClick={libertyLocation}></span>
        <div className="shopLocationPopup">
          <LocationPicker isActiveLocation={isActive} onLocPickerClosed={() => locationPickerClosed()} goto={true} />
        </div>
      </div>
    </>
  )
}

export default StickyCart
