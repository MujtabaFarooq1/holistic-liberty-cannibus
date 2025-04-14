import {useState } from "react";
import { setItem, getItem, removeItem } from "../utils/storage";
import {location_data} from "../data/location";
import { getDistance } from 'geolib';
import { get } from "jquery";
const STORE_KEY = "liberty_cannibus_store";
const DISTANCE_KEY = "liberty_cannabis_distance";

const BASE_URL = "https://contact-form.holisticindustries.com/api/"

export const PRIVACY_POLICY_URL = "https://holisticindustries.com/privacy-policy";
export const TERMS_URL = "https://holisticindustries.com/terms-of-service";
export const INSTAGRAM_HANDLE = "https://www.instagram.com/libertycannabis/";
export const FACEBOOK_HANDLE = "https://www.facebook.com/LibertyDispensary";
export const GOOGLE_KEY = "AIzaSyCOjzbeKTYBtuEXclADrWvcAepXtQ2XtYM";
export const SITE_ID = "89e258d1-3fc5-4c4b-bc18-45393eb63dbf";
export const INSTAGRAM_API_URL =  BASE_URL + "site-param/";
export const EMAIL_API_URL =  BASE_URL + "site-contact";
export const DISPENSARY_LIST_URL =  BASE_URL + "core-location/list?filter=" + encodeURIComponent(JSON.stringify([['type', '=', 'Dispensary']]));
export const INSTAGRAM_URL = "https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=";
export const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const Param_URL =  BASE_URL + "site-param/";

export function getStore() {
  let { data, error } = getItem(STORE_KEY)

  if (error) {
    return { error: true }
  }

  return parseStoreData(data)
}

/*
 * Parse store data
 * data Object
 *
 * returns Object {error, name, abbr, weekday}
 */
function parseStoreData(data) {
  try {
    const {
      name,
      title_text,
      abbr,
      title_image,
      weekday_open,
      saturday_open,
      sunday_open,
      become_patient,
      tag,
      city,
      dutchieEmbedUrl
    } = JSON.parse(data)
    return {
      name,
      title_text,
      abbr,
      title_image,
      weekday_open,
      saturday_open,
      sunday_open,
      become_patient,
      tag,
      city,
      dutchieEmbedUrl,
      error: false,
    }
  } catch (error) {
    return { error: true }
  }
}

export function setStore(store) {
  let { error } = setItem(STORE_KEY, JSON.stringify(store))

  return { error }
}

export function removeStore() {
  removeItem(STORE_KEY)
  return true
}

export function getNearbyDistance() {
  let { data, error } = getItem(DISTANCE_KEY)

  if (error) {
    return { error: true }
  }

  return data;
}

export function setDistance(distance) {
  let { error } = setItem(DISTANCE_KEY, distance)

  return { error }
}

export function resetDistance() {
  removeItem(DISTANCE_KEY)
  return true
}

export function setShortestDistance(dispensaries, lat, lng) {
  let filteredDispensaries = dispensaries.filter(disp => {
    return (disp.latitude != null && disp.longitude != null)
  });
  let distancesInMeters = filteredDispensaries.map((obj, index) => {
    return getDistance(
      { latitude: lat, longitude: lng },
      { latitude: obj.latitude, longitude: obj.longitude }
    );
  });
  distancesInMeters.sort();
  setDistance(distancesInMeters[0]);
}

export function getShortestDistanceAndStore(dispensaries, lat, lng) {
  let filteredDispensaries = dispensaries.filter(disp => {
    return (disp.latitude != null && disp.longitude != null)
  });
  var smallestDistance = getDistance(
    { latitude: lat, longitude: lng },
    { latitude: filteredDispensaries[0].latitude, longitude: filteredDispensaries[0].longitude }
  )
  var nearestLocation = null;
    if (smallestDistance*0.000621 <= 50 ) {
      nearestLocation = filteredDispensaries[0]
    }
  filteredDispensaries.forEach(obj => {
    let distance = getDistance(
      { latitude: lat, longitude: lng },
      { latitude: obj.latitude, longitude: obj.longitude }
    )
    if (distance < smallestDistance) {
      smallestDistance = distance;
      if (distance*0.000621 <= 50) {
        nearestLocation = obj;
      }
    }
  });
  if (nearestLocation != null) {
    let findLocation = location_data.filter(store => {
      return (store.postalCode === nearestLocation.postalCode)
    })
    if (findLocation.length > 0) {
      nearestLocation = findLocation[0];
    } else {
      nearestLocation = null;
    }
  }

  let resultObj = {dist: smallestDistance, nearbyStore: nearestLocation};
  
  return resultObj;
}

export function sendEmailApi(email) {
  fetch(EMAIL_API_URL, {
    method: 'POST',
    body: JSON.stringify({
      siteGuid: SITE_ID,
      email: email
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function replaceCannabisToDispensary(text) {
  const { abbr } = getStore();
  if (abbr) {
   
    if (abbr.toUpperCase() === "PA") {
      var Obj = { 
        cannabis: "dispensary", 
        Cannabis: "Dispensary", 
        CANNABIS: "DISPENSARY" 
      }; 

      return text.replace(/cannabis|Cannabis|CANNABIS/g, function(matched){
          return Obj[matched]; 
      }); 
      // var regExPA = new RegExp("cannabis", "g");
      // return text.replaceAll(regExPA, "medical marijuana");
    } else if (abbr.toUpperCase() === "MI") {
      // var regExMI = new RegExp("dispensary", "ig");
      // return text.replaceAll(regExMI, "provisioning center");

      var Obj2 = { 
        dispensary: "provisioning center", 
        Dispensary: "Provisioning Center", 
        DISPENSARY: "PROVISIONING CENTER" 
      }; 

      return text.replace(/dispensary|Dispensary|DISPENSARY/g, function(matched){
        return Obj2[matched]; 
      });
    }
    return text;
  }
  return text;
}

export function filterLocationBasedText(text) {
  const { abbr } = getStore();
  if (abbr) {
   
    if (abbr.toUpperCase() === "PA") {
      var Obj = { 
        cannabis: "medical marijuana", 
        Cannabis: "Medical Marijuana", 
        CANNABIS: "MEDICAL MARIJUANA" 
      }; 

      return text.replace(/cannabis|Cannabis|CANNABIS/g, function(matched){
          return Obj[matched]; 
      }); 
      // var regExPA = new RegExp("cannabis", "g");
      // return text.replaceAll(regExPA, "medical marijuana");
    } else if (abbr.toUpperCase() === "MI") {
      // var regExMI = new RegExp("dispensary", "ig");
      // return text.replaceAll(regExMI, "provisioning center");

      var Obj2 = { 
        dispensary: "provisioning center", 
        Dispensary: "Provisioning Center", 
        DISPENSARY: "PROVISIONING CENTER",
        dispensaries: "provisioning centers", 
        Dispensaries: "Provisioning Centers", 
        DISPENSARIES: "PROVISIONING CENTERS",
      }; 

      return text.replace(/dispensary|Dispensary|DISPENSARY|dispensaries|Dispensaries|DISPENSARIES/g, function(matched){
        return Obj2[matched]; 
      });
    }
    return text;
  }
  return text;
}

export function getGoogleZipURL(zipcode) {
  let GoogleKey = '';

  const apiResponse = get(`${Param_URL}${SITE_ID}`, function (response, status) {

    if (status === "success" && response.googleMapsKey) {
      // console.log(response.googleMapsKey);
      // return response.googleMapsKey;
      GoogleKey = response.googleMapsKey;
      return "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&sensor=true&key=" + GoogleKey;
    }
  });
  // console.log("URL: ");
  // console.log(apiResponse);
  // GoogleKey = 'AIzaSyCOjzbeKTYBtuEXclADrWvcAepXtQ2XtYM';
  return "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&sensor=true&key=" + GOOGLE_KEY;
}

export function filterLocation(name) {
  
  let location = location_data.filter(function (store) { // filter first for non-friends
    return store.name === name // returns a new array
  });


  return location[0];
}
