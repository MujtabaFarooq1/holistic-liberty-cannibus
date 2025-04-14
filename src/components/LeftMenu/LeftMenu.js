import React, { useContext, useState } from "react"
import "../../styles/global.scss"
import "./LeftMenu.scss"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Strings } from "../../resources"
import { Link, navigate } from "gatsby"
import LocationPicker from "../LocationPicker"
import { NavigationContext } from "../../context/NavigationContext"
import { INSTAGRAM_HANDLE, FACEBOOK_HANDLE } from "../../services/HomeService"
import { getStore, filterLocation } from "../../services/HomeService"

const {abbr, name, city} = getStore();

export default function LeftMenu(props) {
  const [leftMenu, setLeftMenu] = useContext(NavigationContext)
  var order_now_menu = Strings.order_now.toUpperCase();

  if (abbr == "PA") {
    order_now_menu = Strings.order_nowPA.toUpperCase();
  }
  const menuItems = [
    Strings.home.toUpperCase(),
    order_now_menu,
    Strings.about.toUpperCase(),
    Strings.become_a_patient.toUpperCase(),
    Strings.learn.toUpperCase(),
    Strings.rewards.toUpperCase(),
    Strings.contact_us.toUpperCase(),
  ]

  const renderSeparator = () => {
    return <div className="separator"></div>
  }

  /**
   * hamburger menu click, to load the selected page and hide side menu
   * @param {} menu
   */
  const menuTapped = menu => {
    global.menu = menu
    setLeftMenu({ hide: true, selected: menu })
  }
  const [isActive, setActive] = useState(false)
  const locationPickerClosed = () => {
    setActive(false)
  }

  const getShopLink = (menu) => {
    menuTapped(menu)
    let storeLocation = filterLocation(name)
    return storeLocation ? navigate(storeLocation.link) : setActive(true)
  }

  const getPath = menu => {
    switch (menu.toUpperCase()) {
      case Strings.home.toUpperCase():
        return "/"
      // case Strings.order_now.toUpperCase():
      //   return shopLink
      // case Strings.order_nowPA.toUpperCase():
      //   return shopLink
      case Strings.about.toUpperCase():
        return "/about/"
      case Strings.rewards.toUpperCase():
        return "/rewards/"
      case Strings.become_a_patient.toUpperCase():
        return "/become-a-patient/"
      case Strings.learn.toUpperCase():
        return "/learn/"
      case Strings.contact_us.toUpperCase():
        return "/contact-us/"
      default:
        return "/"
    }
  }

  const renderMenu = (menu, index) => {
    var dontShowRewards = false;
    let orderNow = false, activeOrderClass = false;
    if (name === "Springfield") {
      dontShowRewards = true;
    }

    if (dontShowRewards == true && menu == "REWARDS") {
      return (null);
    }
    if (
      menu === Strings.order_now.toUpperCase() ||
      menu === Strings.order_nowPA.toUpperCase()
    ) {
      orderNow = true;
      if(menu === global.menu) activeOrderClass = true;
    }
      return (
        <div key={index}>
          {orderNow ? (
            <span
              className={`menu-item ${activeOrderClass ? "active": ""}`}
              onClick={() => getShopLink(menu)}
            >
              <p>{menu}</p>
              <div className="menu-chevron">
                <FontAwesomeIcon icon={faChevronRight} size="sm" />
              </div>
            </span>
          ) : (
            <Link
              to={getPath(menu)}
              activeClassName="active"
              className="menu-item"
              onClick={() => menuTapped(menu)}
            >
              <p>{menu}</p>
              <div className="menu-chevron">
                <FontAwesomeIcon icon={faChevronRight} size="sm" />
              </div>
            </Link>
          )}

          {renderSeparator()}
        </div>
      )
  }

  return (
    <>
      <LocationPicker
        isActiveLocation={isActive}
        onLocPickerClosed={() => locationPickerClosed()}
        goto={true}
      />
      <div
        className={`left-bar-container ${leftMenu.hide ? "hide" : ""}`}
        onClick={() => menuTapped(global.menu)}
      >
        <div className="left-bar-sub-container">
          <div className="menu-list">
            {renderSeparator()}
            {menuItems.map((menu, index) => renderMenu(menu, index))}
          </div>
          <div className="bottom">
            <div className="social-btn-container">
              <a href={INSTAGRAM_HANDLE} target="_blank" className="instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20.194"
                  height="20.194"
                  viewBox="0 0 20.194 20.194"
                >
                  <path
                    d="M10.1,1.8a30.96,30.96,0,0,1,4.039.112,5.2,5.2,0,0,1,1.907.337A3.94,3.94,0,0,1,17.95,4.151a5.2,5.2,0,0,1,.337,1.907c0,1.01.112,1.346.112,4.039a30.959,30.959,0,0,1-.112,4.039,5.2,5.2,0,0,1-.337,1.907,3.94,3.94,0,0,1-1.907,1.907,5.2,5.2,0,0,1-1.907.337c-1.01,0-1.346.112-4.039.112a30.959,30.959,0,0,1-4.039-.112,5.2,5.2,0,0,1-1.907-.337,3.94,3.94,0,0,1-1.907-1.907,5.2,5.2,0,0,1-.337-1.907c0-1.01-.112-1.346-.112-4.039a30.96,30.96,0,0,1,.112-4.039,5.2,5.2,0,0,1,.337-1.907,4.029,4.029,0,0,1,.785-1.122,1.9,1.9,0,0,1,1.122-.785,5.2,5.2,0,0,1,1.907-.337A30.96,30.96,0,0,1,10.1,1.8m0-1.8A33.149,33.149,0,0,0,5.946.112,6.926,6.926,0,0,0,3.478.561a4.392,4.392,0,0,0-1.8,1.122,4.392,4.392,0,0,0-1.122,1.8A5.112,5.112,0,0,0,.112,5.946,33.149,33.149,0,0,0,0,10.1a33.149,33.149,0,0,0,.112,4.151,6.926,6.926,0,0,0,.449,2.468,4.392,4.392,0,0,0,1.122,1.8,4.392,4.392,0,0,0,1.8,1.122,6.926,6.926,0,0,0,2.468.449,33.148,33.148,0,0,0,4.151.112,33.148,33.148,0,0,0,4.151-.112,6.926,6.926,0,0,0,2.468-.449,4.707,4.707,0,0,0,2.917-2.917,6.926,6.926,0,0,0,.449-2.468c0-1.122.112-1.458.112-4.151a33.148,33.148,0,0,0-.112-4.151,6.926,6.926,0,0,0-.449-2.468,4.392,4.392,0,0,0-1.122-1.8,4.392,4.392,0,0,0-1.8-1.122A6.926,6.926,0,0,0,14.248.112,33.149,33.149,0,0,0,10.1,0m0,4.936A5.078,5.078,0,0,0,4.936,10.1,5.161,5.161,0,1,0,10.1,4.936m0,8.526A3.306,3.306,0,0,1,6.731,10.1,3.306,3.306,0,0,1,10.1,6.731,3.306,3.306,0,0,1,13.463,10.1,3.306,3.306,0,0,1,10.1,13.463m5.385-9.985a1.234,1.234,0,1,0,1.234,1.234,1.245,1.245,0,0,0-1.234-1.234"
                    fill="#71bf97"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
              <a href={FACEBOOK_HANDLE} target="_blank" className="facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8.356"
                  height="16"
                  viewBox="0 0 8.356 16"
                >
                  <path
                    d="M85.422,16V8.711h2.489l.356-2.844H85.422V4.089c0-.8.267-1.422,1.422-1.422h1.511V.089C88,.089,87.111,0,86.133,0a3.431,3.431,0,0,0-3.644,3.733V5.867H80V8.711h2.489V16Z"
                    transform="translate(-80)"
                    fill="#71bf97"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
