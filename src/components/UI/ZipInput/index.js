import React, { useState } from "react";
import "./ZipInput.scss";
import { Strings } from "../../../resources";
import Autosuggest from 'react-autosuggest';
import {location_data} from "../../../data/location";
import HoverButton from "../HoverButton"
import {
  removeStore,
  getShortestDistanceAndStore,
  setShortestDistance,
  getGoogleZipURL,
  DISPENSARY_LIST_URL,
  filterLocationBasedText,
  Param_URL,
  SITE_ID,
  GOOGLE_KEY
} from "../../../services/HomeService";
import {navigate} from "gatsby";
import {get} from "jquery";



export default function ZipInput(props) {
  const {
    autoCapitalize,
    placeholder,
    // value,
    onChange,
    onBlur,
    errorMessage,
    touched,
    disabled,
    buttonTitle,
    containerClass,
    onSubmit,
    dispensarySelected
  } = props;

  const [highlightedSuggestion, setHighlightedSuggestion] = useState(null);

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (text) => {
  setNoSuggestions(false);
  let array = location_data
  let filterArray = []
  if ((text && text.toLowerCase()) || text == "") {
      const textLowerCase = text.toLowerCase()
      filterArray = array.filter((store) => {
          return store.name.toLowerCase().includes(textLowerCase) || store.city.toLowerCase().includes(textLowerCase) || store.state.toLowerCase().includes(textLowerCase) || store.postalCode.toLowerCase().startsWith(textLowerCase) 
      })
      if (filterArray && filterArray.length <= 0 && text.length > 3) {
          console.log('nearest store',encodeURI(text.toLowerCase()));
          setLoading(true);

          const googleAPIKey = get(`${Param_URL}${SITE_ID}`, function (response, status) {
            if (status === "success" && response.googleMapsKey) {
              // console.log(response.googleMapsKey);
              // return response.googleMapsKey;
              let GoogleKey = response.googleMapsKey;

              setLoading(true);
              fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURI(text.toLowerCase()) + "&sensor=true&key=" + GoogleKey)
              .then(res => res.json())
              .then(res => {
                  if (res.status === "OK") {
                      let lat = res.results[0].geometry.location.lat // You have obtained latitude coordinate!
                      let long = res.results[0].geometry.location.lng // You have obtained longitude coordinate!
                      var closest;
                      var minDif = 41;
                      var sorting = [], i = 0;

                      array.forEach((store, index) => {
                          let lat1 = lat * Math.PI / 180;
                          let lon1 = long * Math.PI / 180;
                          let lat2 = store.latitude * Math.PI / 180;
                          let lon2 = store.longitude * Math.PI / 180;
                          let R = 6371; // km
                          let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
                          let y = (lat2 - lat1);
                          var dif = Math.sqrt(x * x + y * y) * R;
                          if (dif <= minDif) {
                            closest = index;
                            minDif = dif;
                            filterArray.push(array[closest]);
                            filterArray[i++]["distance"] = minDif
                          }

                      });

                      filterArray.sort(function(a, b) { 
                        return a.distance - b.distance;
                      });
                      
                      if (filterArray.length <= 0) {
                        setNoSuggestions(true);
                        console.log('no result')
                      }

                  } else if (res.status === "ZERO_RESULTS") {
                    setNoSuggestions(true);
                      console.log('no result')
                  }
                setLoading(false);
              })

            }
          })
      }

      // console.log(filterArray);
      // if (filterArray === 0) {
      //   filterArray = location_data
      // }
      return filterArray;
  }
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.name}, ${suggestion.stateCode}`;
  // const matches = AutosuggestHighlightMatch(suggestionText, query);
  // const parts = AutosuggestHighlightParse(suggestionText, matches);
  let status_class = "";
  if (suggestion.location_status === "coming soon") {
    status_class = "loc-disabled";
    return (
      <span className={`suggestion-content ${status_class} ${highlightedSuggestion && highlightedSuggestion.name === suggestion.name ? "highlighted" : ""}`} >
        <span className="name">
          {suggestionText}<span className="arrow">{" >"}</span>
        </span>
      </span>
    );
  }
  return (
    <span className={`suggestion-content ${status_class} ${highlightedSuggestion && highlightedSuggestion.name === suggestion.name ? "highlighted" : ""}`} onClick={() => dispensarySelected(suggestion)}>
      <span className="name">
        {suggestionText}<span className="arrow">{" >"}</span>
      </span>
    </span>
  );
}

const onChangeText = (event, { newValue }) => {
  setValue(newValue);
  onChange(newValue);
};

// Autosuggest will call this function every time you need to update suggestions.
// You already implemented this logic above, so just use it.
const onSuggestionsFetchRequested = ({ value }) => {
  setSuggestions(getSuggestions(value));
};

// Autosuggest will call this function every time you need to clear suggestions.
const onSuggestionsClearRequested = () => {
  setSuggestions([]);
};

const [ value, setValue ] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [noSuggestions, setNoSuggestions] = useState(false);
const [loading, setLoading] = useState(false);
const [comingSoon, setComingSoon] = useState(false);



    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: placeholder,
      // value: "",
      value,
      onChange: onChangeText,
      onKeyPress: (event) => onEnterKeyPress(event, value)
    };

  const renderError = () => {
    if (errorMessage && touched)
      return <div className="input-error">{errorMessage}</div>

    return null
  }

  const suggestionSelected = (event) => {
    let selected = suggestions.filter(data => {
      return data.name === event.target.value
    })
    if (selected.length > 0) {
      dispensarySelected(selected[0]);
      setComingSoon(true);
    }
    
  }

  const suggestionHighlighted = (value) => {
    setHighlightedSuggestion(value.suggestion);
    // console.log('suggestionHighlighted', value);
  }


  const renderElement = () => {
    return (
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={(value) => suggestionSelected(value)}
        onSuggestionHighlighted = {(value) => suggestionHighlighted(value)}
        alwaysRenderSuggestions={true}
      />
      {
        noSuggestions ?
          (<div className="no-suggestions">
            {filterLocationBasedText(Strings.location_no_suggestion_msg)}
          </div>) : '' 
      }
      {
        loading ? <div className="no-suggestions">
            Loading...
          </div> : ''
      }
      {
        comingSoon ? <div className="coming-soon">
          We will soon add this store 
        </div> : ''
      }
      </>
    )
  }

  const onEnterKeyPress = (event, text) => {
    if (event.charCode === 13) {
      onSubmitZip(text);
    }
  }

    /**
   * onSubmitZip
   * @param {string} text
   * @description Handle Action of ZIP Code Submit
   */
  const onSubmitZip = (text) => {
    onSubmit(text);
    let isExisting = location_data.filter((loc, index) => {
      return loc.name === text;
    })
    if (isExisting.length > 0) {
      dispensarySelected(isExisting[0]);
      setComingSoon(true);
      return;
    }
    let isnum = /^\d+$/.test(text.trim());
    if (text.trim().length > 0 && isnum) {
      let isExisting = location_data.filter((loc, index) => {
        return (loc.postalCode === text);
      })
      if (isExisting.length > 0) {
        dispensarySelected(isExisting[0]);
        setComingSoon(true);
      } else {
        get(getGoogleZipURL(text.trim()), function (data, status) {
          if (status === "success" && data.results.length > 0) {
            let loc = data.results[0].geometry.location;
            //loc.lat loc.lng
            get(DISPENSARY_LIST_URL, function (dispensaries, status) {
              if (status === "success" && dispensaries.data && dispensaries.data.length > 0) {
                setShortestDistance(dispensaries.data, loc.lat, loc.lng);
                removeStore();
                let {dist, nearbyStore} = getShortestDistanceAndStore(dispensaries.data, loc.lat, loc.lng);
                if (nearbyStore != null) {
                  dispensarySelected(nearbyStore);
                  setComingSoon(true);
                } else {
                  navigate("/not-close/", {state:{distance: dist}});
                }
                
                // onLocationSelected()
              } else {
                alert(Strings.something_wrong)
              }
            })
          } else {
            alert(Strings.invalid_zip);
          }
        })
      }
    } else {
      alert(Strings.invalid_zip)
    }
    
  };

  return (
    <div
      className={
        containerClass ? `${containerClass} input-container` : "input-container"
      }
    >
      <div className={disabled ? "TextInput Disabled" : "TextInput"}>
        {renderElement()}
      </div>
      {renderError()}
      <HoverButton onClick={() => onSubmitZip(value)}>{buttonTitle ? buttonTitle : Strings.go}</HoverButton>
    </div>
  )
}
