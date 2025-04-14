import React, { useState, useEffect } from "react"
import "./locations.scss"
import { globalHistory as history } from "@reach/router"
import { Strings } from "../../resources"
import locations from "../../data/location"
import { setStore as setStoreInStore } from "../../services/HomeService"
import { filterLocationBasedText, getStore } from "../../services/HomeService";

import HoverButton from "../../components/UI/HoverButton"

const states = [
  "california",
  "maryland",
  "massachusetts",
  "michigan",
  // "missouri",
  "pennsylvania",
]

const capitalize = (text) =>
  text
    .toLowerCase()
    .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
    .replace(/\s/g, "");

export default function Locations(props) {
  const { location } = history;
  const hash = location?.hash ? location?.hash?.replace("#", "") : "all" ;
  const {
    abbr,
  } = getStore();

  const { distance, onStoreSelection } = props
  const isBrowser = () => typeof window !== "undefined"

  const [emailText, setEmailText] = useState("")
  var uniqueTags = []
  const allLocations = locations.location_data
  let emptyQuery = "all";
  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  })
  const [storeData, setStoreData] = useState(null);



  const { filteredData, query } = state
  // if we have a fileredData in state and a non-emptyQuery then
  // searchQuery then `hasSearchResults` is true
  const hasSearchResults = filteredData && query !== emptyQuery
  // if we have a search query then return filtered data instead of all posts; else return allLocations
  const locationList = hasSearchResults ? filteredData : allLocations

  const handleData = (query) => {

    // console.log(query)

    // this is how we get all of our posts
    const locations = allLocations || []
    // return all filtered posts
    const filteredData = locations.filter(location => {
      // destructure data from post frontmatter
      const { tag } = location
      return (
        // standardize data with .toLowerCase()
        // return true if tag
        // contains the query string
        tag &&
        (tag.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase() === "all")
      )
    })

    // update state according to the latest query and results
    setState({
      query, // with current query string from the `Input` event
      filteredData, // with filtered data from locations.filter(location => (//filteredData)) above
    })
  }

  const handleButtonClick = event => {
    const query = event.target.value
    handleData(query);
  }

  useEffect(() => {
    const hashquery = hash !== "our-locations-tag" && states.includes(hash?.toLowerCase()) ? capitalize(hash) : "all";
    handleData(hashquery);
  }, [hash, states])

  const scrollWin = (e, x, y) => {
    // document.getElementById('filter-nav').scrollBy(x, y, 'smooth');
    e.target.parentElement.scrollBy(x, y, 'smooth');

    // var elem = document.getElementById('filter-nav');
    // var newScrollLeft = elem.scrollBy(x, y, 'smooth'), // scrolls
    //     width=elem.offsetWidth,
    //     scrollWidth=elem.scrollWidth;
    // var offset=100;
    // if (scrollWidth- newScrollLeft-width==offset) {
    //     alert('right end');
    // }
    // if (newScrollLeft === 0) {
    //     alert('left end');
    // }
  }

  const storeSelected = store => {
    if (isBrowser()) {
      window.location.reload();
      window.scrollTo(0, 0);
    }
    setStoreInStore(store)
    onStoreSelection(store)
    setStoreData({
      title_text: store.title_text,
      abbr: store.abbr,
      title_image: store.title_image,
    })
  }

  const navClassName = "all" === query || query === "" ? " btn-loc-nav active" : "" + " btn-loc-nav";

  const blank = "";

  return (
    <div className="locations-container">
        <h3 className="h3-subheads-forza" id="our-locations">{Strings.our_locations}</h3>

        <div className="filter-nav" id="filter-nav">
          <button
            className="tab-scroll-icon prev-tab"
            type="button"
            onClick={(e) => scrollWin(e,-100, 0)}
          >{blank}</button>
          <button
            className={navClassName}
            type="button"
            value="all"
            onClick={handleButtonClick}
          >
            {abbr === "MI" ? Strings.all_locations : Strings.all_dispensaries}
          </button>
          {allLocations.forEach((tagpost, key) => {
            var tagpostarray = tagpost.tag.split(",")
            if (
              uniqueTags.indexOf(tagpost.tag) === -1 &&
              !tagpost.tag.includes(",")
            ) {
              uniqueTags.push(tagpost.tag)
            }

            if (tagpost.tag.includes(",")) {
              uniqueTags = uniqueTags.concat(tagpostarray)
              uniqueTags = uniqueTags.filter(
                (val, index) => uniqueTags.indexOf(val) === index
              )
            }
          })}

          {uniqueTags.sort().map((value, index) => {

            const navClassName2 = value === query ? " btn-loc-nav active" : "" + " btn-loc-nav";
            return (
              <button
                key={index}
                className={navClassName2}
                type="button"
                value={value}
                onClick={handleButtonClick}
              >
                {value}
              </button>
            )
          })}
          <button
            className="tab-scroll-icon next-tab"
            type="button"
            onClick={(e) => scrollWin(e, 100, 0)}
          >{blank}</button>

        </div>

        <div className="filtered-locations">
          {locationList.map((data, index) => {
            let loc_status = "";
            if (data.location_status == "coming soon") {
              loc_status = "disabled";
            }
            return (
              <div className="location-content-wrap single-disp col-12 col-sm-6 col-md-4" key={index}>
                <a href={data.map_location} className="map-link">
                  <h5 className="h5-subheads-ciutadella">
                    <span className="icon icon-location-pin">
                        {/* <object type="image/svg+xml" data={locationPin} className="icon icon-location-pin">location pin</object> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="26.294" height="30.05" viewBox="0 0 26.294 30.05">
                          <rect width="26" height="26" transform="translate(0 0)" fill="none"/>
                          <path d="M12.566,17.83a5.282,5.282,0,0,0,5.341-5.242,5.441,5.441,0,0,0-5.341-5.43A5.282,5.282,0,0,0,7.225,12.4,5.574,5.574,0,0,0,12.566,17.83ZM3.6,3.6a12.832,12.832,0,0,1,17.929,0,12.269,12.269,0,0,1,0,17.6L12.566,30,3.6,21.2A12.614,12.614,0,0,1,3.6,3.6Z" transform="translate(1.044 0.05)" fill="#a2e3c2" fillRule="evenodd"/>
                          location pin
                        </svg>
                    </span>
                    {data.fullname || data.name}
                  </h5>
                </a>
                <div className="address-container body-ciutadella">
                  <p>{filterLocationBasedText(data.address_line1)}</p>
                  <p>{filterLocationBasedText(data.address_line2)}</p>
                  <p>
                    <a href={`tel:${data.phone}`}>{data.phone}</a>
                  </p>
                  <p>
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  </p>
                </div>
                <div className="to-base">
                  <div className="store_hour_container">
                    <h6 className="h6-subheads-ciutadella">
                      {Strings.store_hours}
                    </h6>
                    <div className="body-ciutadella">
                      <p>{data.weekday_time}</p>
                      <p>{data.weekend_time}</p>
                    </div>
                  </div>

                  <HoverButton
                    btnType="button"
                    btnClassName="make_my_button"
                    disabled={loc_status}
                    onClick={() => storeSelected(data)}
                    >
                      {filterLocationBasedText(Strings.make_my_store.toUpperCase())}
                  </HoverButton>
                </div>
              </div>
            )
          })}
        </div>
    </div>
  )
}
