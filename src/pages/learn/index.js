import React, { Fragment, useContext, useState, useEffect } from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import HomeLayout from "../../components/HomeLayout/HomeLayout";
// import { Strings } from "./../../resources";
import learnStrings from "./../../data/learn"
import { setPageTitle, convertArrayToObject } from "./../../utils/page";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Accordion from "react-bootstrap/Accordion";
import StickyCart from "../../components/StickyCart";
import AccordionContext from "react-bootstrap/AccordionContext";
import parse from 'html-react-parser';
// import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { faChevronDown, faChevronUp, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./learn.scss";

import queryString from 'query-string';
import LinkPopulate from "../../components/LinkPopulate";
import HoverButton from "../../components/UI/HoverButton";
import LocationPicker from "../../components/LocationPicker";
import locations from "../../data/location";
import locationFAQs from "../../data/locationFAQs";
import generalFAQs from "../../data/generalFAQs";
import rewardsFAQs from "../../data/rewardsFAQs";
import newPatientFAQs from "../../data/newPatientFAQs";
import { getStore, filterLocationBasedText } from "../../services/HomeService";


export default function LearnPage({ location }) {

  const isBrowser = () => typeof window !== "undefined"
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setLocation] = useState(null);
  const [isLocationEnabled, setLocationEnable] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isShowSearch, setShowSearch] = useState(false);
  const storeDataFromStorage = getStore();
  const {
    title_text,
    abbr,
    title_image,
    become_patient,
    name,
    error,
  } = getStore();
  const [storeData, setStoreData] = useState(null);
  const allLocations = locations.location_data;
  const allGeneralFAQs = generalFAQs.faq_data;
  const allNewPatientFAQs = newPatientFAQs.faq_data;
  const allRewardsFAQs = rewardsFAQs.faq_data;

  const [key, setKey] = useState('know-before');

  /* Handle URL Params and adjust Tab accordingly */
  const queriedTheme = queryString.parse(location.search);
  const { tab } = queriedTheme;
  // const [urlTab, setUrlTab] = useState(tab);
  useEffect(() => {
    if (tab === 'general') {
      setKey('general');
    } else if (tab === 'new-patients') {
      setKey('new-patients');
    } else if (tab === 'discounts') {
      setKey('discounts');
    } else if (tab === 'know-before') {
      setKey('know-before');
    }
  }, [tab]);
  /* URL Handle Ends */

  /**
   * If the Location is already set then set the Location
   */
  useEffect(() => {
    setStoreData(
      error ? null : storeDataFromStorage
    )
    if (name) {
      // console.log('Location is already set');
      let filteredLocation = allLocations.filter(locationItem => {
        return locationItem.name.toUpperCase() === name.toUpperCase();
      });
      if (filteredLocation.length > 0) {
        setLocation(filteredLocation[0]);
        setLocationEnable(true);
      } else {
        setLocationEnable(false);
      }
    }
  }, [error, title_text, abbr, title_image, name, become_patient])

  const showLocationSelectPicker = () => {
    setStoreData(null);
    setShowLocationPicker(true);
  }

  const locationPickerClosed = () => {
    setShowLocationPicker(false);
    setStoreData(getStore());
  }

  const renderLocationPicker = () => {
    if (showLocationPicker) {
      if (isBrowser()) {
        document.body.style.overflow = 'hidden';
      }
      
    } else {
      if (isBrowser()) {
        document.body.style.overflow = 'scroll';
      }
    }
    return (
      <LocationPicker isActiveLocation={showLocationPicker} onLocPickerClosed={() => locationPickerClosed()}/>
    );
  }

  // const locationSelected = () => {
  //   if(isBrowser()) {
  //     window.location.reload();
  //   }
  //   setShowLocationPicker(false);
  // }


  const getLocationSpecificFAQs = () => {
    let currentLocationFAQs = [];
    if (!storeDataFromStorage.error) {
      const allLocationFAQs = locationFAQs.faq_data;
      const faqsByLocation = convertArrayToObject(allLocationFAQs, 'location');
      // console.log(faqsByLocation);
      // console.log(storeDataFromStorage);
      if(faqsByLocation[storeDataFromStorage.name]){
        currentLocationFAQs = faqsByLocation[storeDataFromStorage.name];
      }
    }
    return currentLocationFAQs;
  }

  const getSearchedSpecificFAQs = () => {
    // let currentLocationFAQs = [];
    // const newSearchKeyword = searchKeyword.toLowerCase();
    const allLocationFAQs = locationFAQs.faq_data;

    const filteredData = allLocationFAQs.filter(faqItem => {
      const { name, description, location } = faqItem;
      const searchLocationTag = !storeDataFromStorage.error && selectedLocation ? selectedLocation.name : '';
      if (searchLocationTag !== '') {
        // console.log('inside location');
        // console.log(tag.toLowerCase());
        // console.log(location.toLowerCase());
        // console.log('&&&&');
        // console.log(searchLocationTag.toLowerCase());
        return (
          name &&
          ((name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          description.toLowerCase().includes(searchKeyword.toLowerCase()))
          && (location.toLowerCase() === searchLocationTag.toLowerCase()))
        );
      } else {
        return (
          name &&
          (name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          description.toLowerCase().includes(searchKeyword.toLowerCase()))
        );
      }
    });

    // console.log(filteredData);
    return filteredData;
  }

  /**
   * openGeneralFAQs
   * @description Open General FAQs Tab
   */
  const openGeneralFAQs = () => {
    setKey('general');
  }

  /**
   * becomePatientFAQs
   * @description Become a Patient FAQs
   */
  const becomePatientFAQs = () => {
    setKey('new-patients');
  }

  const ContextAwareToggle = ({ children, eventKey, callback }) => {
    const currentEventKey = useContext(AccordionContext);
    // const decoratedOnClick = useAccordionToggle(
    //   eventKey,
    //   () => callback && callback(eventKey),
    // );
    const isCurrentEventKey = currentEventKey === eventKey;
    return (
      <FontAwesomeIcon icon={isCurrentEventKey ? faChevronUp : faChevronDown } size="xs" />
    );
  }

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(learnStrings.learn_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const handleSearchInput = (event) => {
    const searchInput = event.target.value;
    setSearchKeyword(searchInput);
    if (searchInput === '' || searchInput === null) {
      setShowSearch(false);
    }
  }

  const handleSearchInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      // console.log('do validate');
      setKey('know-before');
      if (searchKeyword !== '') {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
      event.preventDefault();
    }
  }

  const searchInputBox = () => {
    return (<div className="search-input-div">
              <div className="searchform">
                <input type="text" name="search-keywords" placeholder="Search our LEARN section using keywords" value={searchKeyword}
                onChange={(event) => handleSearchInput(event)}
                onKeyDown={(event) => handleSearchInputKeyDown(event)} />
              </div>
            </div>);
  }

  /**
   * showNoLocationItems
   * @description Show this Section when no location is set
   */
  const showNoLocationItems = () => {
    return (<>
              <h2>{filterLocationBasedText(learnStrings.learnKnowBeforeYoGoTitle)}</h2>
              <div className="no-location-select">
                <p><strong>Requirements vary by location. If you would like information specific to your local dispensary, please <span role="link" tabIndex="0" onClick={() => showLocationSelectPicker()}>enter your zip code</span>.</strong></p>
                <p>Check out our <span role="link" tabIndex="0" className="generalFAQLink" onClick={() => openGeneralFAQs()}>general FAQs</span> for answers to our most common questions.</p>
              </div>
            </>);
  }

  const showSearchSection = () => {
    const resultItems = getSearchedSpecificFAQs();
    return (<div className="search-results-content">
              <div className="results-header">
                <h5>Showing results for</h5>
                <p>{searchKeyword}</p>
              </div>
              {resultItems.length > 0 && showSearchedLocationItems(resultItems)}
              {resultItems.length === 0 && showNoSearchLocationItems()}
            </div>);
  }

  const showNoSearchLocationItems = () => {
    return (<div className="no-result-content">
              <strong>We couldn't find any results for {searchKeyword}. Try a different search, browse the site, or contact your dispensary.</strong>
            </div>);
  }

  const showSearchedLocationItems = (resultItems) => {
    return (resultItems.length > 0 && <div className="results-list">
              {resultItems.map((faqItem, faqIndex) => {
                const faqDescription = <LinkPopulate description={faqItem.description} />
                  return (
                    <div className="result-item" key={+faqIndex+1}>
                      <h5>{faqItem.name}</h5>
                      {faqDescription}
                    </div>);
              })}
            </div>);
  }

  const showLocationSpecificFAQs = () => {
    const locationFAQItems = getLocationSpecificFAQs();
    let locationFAQDetails = (
      <>
      <div className="location-select">
        <div className="location-details-box">
            <h4>{learnStrings.learnAboutLiberty} {(abbr === 'PA') ? "Dispensary" : "Cannabis" } {selectedLocation.city}.</h4>
            <p>Not in {selectedLocation.city}? <span role="link" tabIndex="0" onClick={() => showLocationSelectPicker()}>Change location</span></p>
        </div>
      </div>
      <div className="location-select">
        <div className="location-details-box">
            <h4>{learnStrings.learnNoFaqFound} {selectedLocation.city}.</h4>
        </div>
      </div>
      </>
    );

      if(locationFAQItems.length > 0){
        locationFAQDetails = (
          <div className="location-select">
            <div className="location-details-box">
                <h4>{learnStrings.learnAboutLiberty} {(abbr === 'PA') ? "Dispensary" : "Cannabis" } {selectedLocation.city}.</h4>
                <p>Not in {selectedLocation.city}? <span role="link" tabIndex="0" onClick={() => showLocationSelectPicker()}>Change location</span></p>
            </div>
            <Accordion className="learn-accordion">
              {locationFAQItems.map((faqItem, faqIndex) => {
                const faqDescription = <LinkPopulate description={faqItem.description} showBecomePatient={() => becomePatientFAQs()} />
                  return (
                    <Card id={`${faqItem.abbr}${faqItem.id}`} key={faqIndex}>
                      <Accordion.Toggle as={Card.Header} eventKey={+faqIndex+1}>
                        <p>{faqItem.name}</p>
                        <div className="accordion-arrow">
                          <ContextAwareToggle eventKey={+faqIndex+1}>Click me!</ContextAwareToggle>
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={+faqIndex+1}>
                        <Card.Body>{faqDescription}</Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  )
              })}
            </Accordion>
          </div>
        );
      }
    return locationFAQDetails;
  }

  const scrollWin = (x, y) => {
    var myElement = document.querySelector('.learn-tab-nav');
    myElement.scrollBy(x, y);
  }

  var discountDescription;
  if (abbr === "MA") {
    discountDescription = filterLocationBasedText(learnStrings.learnMADiscountDescription);
  } else if (abbr === "MD") {
    discountDescription = filterLocationBasedText(learnStrings.learnMDDiscountDescription);
  } else {
    discountDescription = filterLocationBasedText(learnStrings.learnDiscountDescription);
  }

  var discountTabTitle = "Discounts";

  const renderPage = () => {
    // console.log('Final Clicked after Form' + isShowSearch);
    return (
      <div className="learn-content page-container-layout">
        <div className="learn-banner">
          <div className="title-container">
            <h1>{filterLocationBasedText(learnStrings.learn_title).toUpperCase()}</h1>
            <p className="sub-title">{filterLocationBasedText(learnStrings.learnBannerDescription)}</p>
            <p className="sub-title">Still stuck? <a href={filterLocationBasedText(learnStrings.learnShootEmailUrl)}>Shoot us an email</a> or give us a call!</p>
          </div>
        </div>

        {renderLocationPicker()}
        <div className="page-container">
          <button 
            className="tab-scroll-icon prev-tab" 
            type="button" 
            onClick={() => scrollWin(-100, 0)}
          >&nbsp;</button>
          <button 
              className="tab-scroll-icon next-tab" 
              type="button" 
              onClick={() => scrollWin(100, 0)}
            >&nbsp;</button>
          <Tabs
          defaultActiveKey="know-before"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          id="uncontrolled-tab-example" className="learn-tab-nav">

            {/* Know Before You Go Section Starts */}
            <Tab eventKey="know-before" title="Know before you go">
              {/* Search Input Box */}
              {searchInputBox()}
              <div className="tab-pane-content">
                {/* Show Normal Content here */}
                {!isShowSearch && <div className="non-search-content">
                  {/* If Location is not set then show section to set location */}
                  {!isLocationEnabled && showNoLocationItems()}

                  {/* If Location is set then show location specific FAQs */}
                  {isLocationEnabled && showLocationSpecificFAQs()}
                </div>}
                {/* Show Search Section Data Here if User Tried for Search */}
                {isShowSearch && showSearchSection()}
              </div>
            </Tab>
            {/* Know Before You Go Section Ends */}

            {/* For New Patient Section Starts */}
            <Tab eventKey="new-patients" title="For new patients">
              {/* Search Input Box */}
              {searchInputBox()}
              <div className="tab-pane-content">
                <h2>{filterLocationBasedText(learnStrings.learnForNewPatientTitle)}</h2>
                <Accordion className="learn-accordion">
                {allNewPatientFAQs.length > 0 && allNewPatientFAQs.map((faqItem, faqIndex) => {
                  const faqDescription = (abbr==="PA" && faqItem.descriptionPA) ? <LinkPopulate description={filterLocationBasedText(faqItem.descriptionPA)} /> : <LinkPopulate description={filterLocationBasedText(faqItem.description)} />
                    if (faqItem.id !== 2 || abbr === "PA" || abbr==="MD" ) {
                        return (
                          <Card key={faqIndex}>
                            <Accordion.Toggle as={Card.Header} eventKey={+faqIndex+1}>
                              <p>{filterLocationBasedText(faqItem.name)}</p>
                              <div className="accordion-arrow">
                                <ContextAwareToggle eventKey={+faqIndex+1}>Click me!</ContextAwareToggle>
                              </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={+faqIndex+1}>
                              <Card.Body>{faqDescription}</Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        )
                    }
                  })}
                </Accordion>
              </div>
            </Tab>
            {/* For New Patient Section Ends */}

            {/* Rewards and wallet Tab Starts */}
            <Tab eventKey='rewards-wallet' title={filterLocationBasedText(learnStrings.learnRewardsTabTitle)}>
              {/* Search Input Box */}
              {searchInputBox()}
              <div className="tab-pane-content">
                {/* <h2>{filterLocationBasedText(learnStrings.learnRewardsTabTitle)}</h2> */}
                <Accordion className="learn-accordion">
                {allRewardsFAQs.length > 0 && allRewardsFAQs.map((faqItem, index) => {
                  const faqDescription = filterLocationBasedText(faqItem.description).replace(/Medical Marijuana/g, 'Medical marijuana')
                  return (
                    <Card key={index}>
                      <Accordion.Toggle as={Card.Header} eventKey={+index+1}>
                        <p>{filterLocationBasedText(faqItem.name)}</p>
                        <div className="accordion-arrow">
                          <ContextAwareToggle eventKey={+index+1}>Click me!</ContextAwareToggle>
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={+index+1}>
                        <Card.Body>{parse(faqDescription)}</Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  )
                })}
                </Accordion>

                {(name === "Van Nuys" || name === "San Francisco") ? "" :
                  <div className="discounts-list">
                    <div className="discount-item">
                      <h2>{filterLocationBasedText(learnStrings.learnRewardsTitle)}</h2>
                      <LinkPopulate description={filterLocationBasedText(learnStrings.learnRewardsDescription)} />
                      <Link className="btn-link" to={learnStrings.learnRewardsButtonUrl}>
                        <HoverButton btnClassName="lime-link-btn">{filterLocationBasedText(learnStrings.learnRewardsButtonTitle)}</HoverButton>
                      </Link>
                    </div>
                  </div>
                }
              </div>
            </Tab>
            {/* Rewards and wallet Tab Ends */}

            {/* Discounts and Rewards Tab Section Starts */}
            {(name === "Springfield") ? "" : 
              <Tab eventKey="discounts" title={discountTabTitle}>
                {/* Search Input Box */}
                {searchInputBox()}
                <div className="tab-pane-content">
                  <div className="discounts-list">
                    <div className="discount-item">
                      <h2>{filterLocationBasedText(learnStrings.learnDiscountTitle)}</h2>
                      <LinkPopulate description={discountDescription} />
                      <Link className="btn-link" to={learnStrings.learnDiscountButtonUrl}>
                        <HoverButton btnClassName="lime-link-btn">{filterLocationBasedText(learnStrings.learnDiscountButtonTitle)}</HoverButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </Tab>
            }
            {/* Discounts and Rewards Tab Section Ends */}

            {/* General Tab Section Starts */}
            <Tab eventKey="general" title="General">
              {/* Search Input Box */}
              {searchInputBox()}
              <div className="tab-pane-content">
                <h2>{filterLocationBasedText(learnStrings.learnGeneralFAQsTitle)}</h2>
                <Accordion className="learn-accordion">
                  {allGeneralFAQs.length > 0 && allGeneralFAQs.map((faqItem, faqIndex) => {
                    const faqDescription = (abbr==="PA" && faqItem.descriptionPA) ? <LinkPopulate description={filterLocationBasedText(faqItem.descriptionPA).replace(/Medical Marijuana/g, 'Medical marijuana')} /> : <LinkPopulate description={filterLocationBasedText(faqItem.description).replace(/Medical Marijuana/g, 'Medical marijuana')} />
                    // const faqDescription = <LinkPopulate description={filterLocationBasedText(faqItem.description).replace(/Medical Marijuana/g, 'Medical marijuana')} />

                        return (
                          <Card key={faqIndex}>
                            <Accordion.Toggle as={Card.Header} eventKey={+faqIndex+1}>
                              <p>{filterLocationBasedText(faqItem.name)}</p>
                              <div className="accordion-arrow">
                                <ContextAwareToggle eventKey={+faqIndex+1}>Click me!</ContextAwareToggle>
                              </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={+faqIndex+1}>
                              <Card.Body>{faqDescription}</Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        )
                  })}
                </Accordion>
              </div>
            </Tab>
            {/* General Tab Section Ends */}

          </Tabs>
          <Link className="more-questions" to="/contact-us">
            <h4>{filterLocationBasedText(learnStrings.learnMoreQuestionsTitle)}</h4>
            <p>{filterLocationBasedText(learnStrings.learnMoreQuestionsDescription)} <FontAwesomeIcon icon={faArrowRight} size="xs" /></p>
          </Link>
        </div>
        <StickyCart />
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
