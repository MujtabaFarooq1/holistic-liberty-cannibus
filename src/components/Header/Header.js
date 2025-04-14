import React, { useContext, useEffect, useState, useRef } from "react"
import "../../styles/global.scss"
import "./Header.scss"
import { NavigationContext } from "../../context/NavigationContext"
import { getStore, removeStore } from "../../services/HomeService"
import SearchForm from "../../components/SearchForm"
import LocationPicker from "../../components/LocationPicker"
import { Link } from "gatsby"
import { Strings } from "../../resources"
import ExitPopup from "../../components/ExitPopup"

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(parentref, searchiconref) {
  useEffect(() => {
    /**
     * hide searchbar if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        parentref.current &&
        !parentref.current.contains(event.target) &&
        parentref.current.classList.contains("search-bar-active")
      ) {
        searchiconref.current.click()
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [parentref])
}

export default function Header({ query }) {
  const isBrowser = () => typeof window !== "undefined"

  const [showPrompt, setShowPrompt] = useState(false)

  const linkClicked = (e, linkAddr) => {
    e.preventDefault()
    setShowPrompt(!showPrompt)
    global.currentLink = linkAddr

    setTimeout(() => {
      if (isBrowser() && global.currentLink.length > 0) {
        // window.location.href = global.currentLink;
        window.open(global.currentLink, "_blank")

        setShowPrompt(showPrompt)
        global.currentLink = ""
      }
    }, 3000)
  }

  const popupClosed = () => {
    setShowPrompt(!showPrompt)
    global.currentLink = ""
  }

  // We need to get reference to the search form element
  const searchIcon = useRef(null)
  const searchFormRef = useRef(null)
  useOutsideAlerter(searchFormRef, searchIcon)

  const [leftMenu, setLeftMenu] = useContext(NavigationContext)

  const {
    name,
    abbr,
    weekday_open,
    saturday_open,
    sunday_open,
    error,
  } = getStore()
  const [storeData, setStoreData] = useState(null)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  // const [visible, setVisible] = useState(true);
  const [isActive, setActive] = useState(false)

  // useEffect(() => {
  //   if (isBrowser()) {
  //     global.prevScrollpos = window.pageYOffset;
  //     window.addEventListener("scroll", handleScroll);
  //   }
  //   return () => {
  //     if (isBrowser()) {
  //       window.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [])

  useEffect(() => {
    setStoreData(
      error ? null : { name, abbr, weekday_open, saturday_open, sunday_open }
    )
    if (error) {
      removeStore()
    }

    if (query) {
      setActive(!isActive)
    }

    window.addEventListener("load", function () {
      if (isBrowser()) {
        document.querySelectorAll("a[target='_blank']").forEach(a => {
          a.addEventListener("click", e => {
            linkClicked(e, a.getAttribute("href"))
          })
        })
      }
    })
  }, [name, abbr, weekday_open, saturday_open, sunday_open, error])

  // const handleScroll = () => {
  //   if (isBrowser()) {
  //     let pageOffset = global.prevScrollpos;
  //     setVisible(pageOffset > window.pageYOffset);
  //     global.prevScrollpos = window.pageYOffset;
  //   }
  // };

  const searchHome = () => {
    // if (showLocationPicker) {
    //   return;
    // }
    setActive(!isActive)
  }

  const searchActive = isActive ? "search-bar-active" : ""

  const toggleLeftSidebar = () => {
    // if (showLocationPicker) {
    //   return;
    // }
    setLeftMenu({ hide: !leftMenu.hide, selected: leftMenu.selected })
  }

  const getOpenTime = () => {
    const sunday = "Sunday"
    const monday = "Monday"
    const tuesday = "Tuesday"
    const wednesday = "Wednesday"
    const thursday = "Thursday"
    const friday = "Friday"
    const saturday = "Saturday"
    var days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
    var d = new Date()
    var dayName = days[d.getDay()]
    if (storeData.name === "Easthampton") {
      return dayName === thursday || dayName === friday || dayName === saturday
        ? storeData.saturday_open
        : storeData.sunday_open
    } else if (dayName === saturday) {
      return storeData.saturday_open
    } else if (dayName === tuesday && storeData.name === "Detroit") {
      return "Closed"
    } else if (dayName === sunday) {
      return storeData.sunday_open
    } else {
      return storeData.weekday_open
    }
  }

  const storeNameClicked = () => {
    setStoreData(null)
    setShowLocationPicker(true)
  }

  const locationPickerClosed = () => {
    setShowLocationPicker(false)
    setStoreData(getStore())
  }

  const renderLocationPicker = () => {
    if (showLocationPicker) {
      if (isBrowser()) {
        document.body.style.overflow = "hidden"
      }
    } else {
      if (isBrowser()) {
        document.body.style.overflow = "scroll"
      }
    }
    return (
      <LocationPicker
        isActiveLocation={showLocationPicker}
        onLocPickerClosed={() => locationPickerClosed()}
      />
    )
  }

  const renderStore = () => {
    if (storeData !== null && storeData.name !== undefined) {
      return (
        <div className="store-address" onClick={() => storeNameClicked()}>
          <div className="icon-container">
            <img
              loading="lazy"
              src={require("../../resources/images/header/Location_Finder_Icon_KO.svg")}
              alt="locationFinder"
            />
          </div>
          <div className="addr-container">
            <p>
              <span className="link">{`${storeData.name}, ${storeData.abbr}`}</span>
              <span>{` >`}</span>
            </p>
            <p>{getOpenTime()}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="header-container">
      {/* <div className={`header ${visible ? "" : "hide" }`}> */}
      <div className="header">
        <div className="left-side">
          {leftMenu.hide ? (
            <div
              className="left-bar-toggle"
              onClick={() => toggleLeftSidebar()}
            ></div>
          ) : (
            <div className="close-toggle" onClick={() => toggleLeftSidebar()}>
              <span>Close</span>
            </div>
          )}

          {renderStore()}
        </div>
        <Link
          to="/"
          className="center-title"
          onClick={() => {
            global.menu = Strings.home
          }}
        >
          <img
            src={require("../../resources/images/header/header_logo.svg")}
            alt="header-logo"
          />
        </Link>
        <div className={`right-side ${searchActive}`} ref={searchFormRef}>
          <SearchForm initialQuery={query} />
          <div
            className="search-icon"
            onClick={searchHome}
            ref={searchIcon}
          ></div>
        </div>
        {renderLocationPicker()}
      </div>
      {storeData ? (
        <div className="location-mobile">{renderStore()}</div>
      ) : null}
      {showPrompt ? <ExitPopup onClose={() => popupClosed()} /> : null}
    </div>
  )
}
