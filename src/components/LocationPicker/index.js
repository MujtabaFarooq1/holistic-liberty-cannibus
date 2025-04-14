import React, { useState } from "react";
import "./location-picker.scss";
import { Strings } from "../../resources";
import ZipInput from "../UI/ZipInput";
import homeStrings from "../../data/home"
import { get } from "jquery";
import { setShortestDistance, setStore, getGoogleZipURL,
   DISPENSARY_LIST_URL, removeStore, resetDistance,
   filterLocation, name } from "../../services/HomeService";
import { location_data } from "../../data/location";
import {Link, navigate} from "gatsby";

export default function LocationPicker(props) {

  const {
    isActiveLocation,
    onLocPickerClosed,
    goto = false,
  } = props;
  const isBrowser = () => typeof window !== "undefined";

  const activeClass = isActiveLocation ? 'location-active' : '';

  const [searchText, setSearchText] = useState("");

  const onSubmitZip = (text) => {
    setSearchText(text);
  };

  const onChangeZipText = (text) => {
    setSearchText(text);
  };
  const [comingSoon, setComingSoon] = useState(false);

  const dispensarySelected = (dispensary) => {
//    console.log(dispensary);
    let origin = document.location.origin;
    let pathname = document.location.pathname;

    if (dispensary.location_status !== "coming soon") {
      if (isBrowser()) {
        if (pathname.includes('shop') || goto) {
          window.location.href = filterLocation(dispensary.name).link;
        } else {
          window.location.reload();
        }
      }
      setStore(dispensary);
      resetDistance();
    } else {
      setComingSoon(true);
    }

  }

  return (
    <>
      <div className={`blur-background ${activeClass}`} onClick={onLocPickerClosed}></div>
      <div className={`location-picker-container  ${activeClass}`}>
        <button className="close-btn" onClick={() => onLocPickerClosed()}><img loading="lazy" src={require("../../resources/images/Close_X.svg")} alt="close"/></button>
        <img loading="lazy" className="location-picker-img" src={require("../../resources/images/header/location-picker.svg")} alt="location-picker"/>
        <p className="loc-pick-ques h5-subheads-ciutadella">{Strings.location_picker_ques}</p>
        <p className="body-text">{Strings.location_picker_msg} <Link to="/contact-us/#our-locations-tag">{Strings.location_picker_msg_link}</Link></p>
        <div className="zip-box">
          <ZipInput
            key="zip-search"
            value={searchText}
            onChange={value => onChangeZipText(value)}
            onBlur={event => onChangeZipText(event.target.value)}
            onSubmit={value => onSubmitZip(value)}
            dispensarySelected={(data) => dispensarySelected(data)}
            placeholder={homeStrings.zip_placeholder}>
          </ZipInput>
        </div>
      </div>
    </>
  );
}

