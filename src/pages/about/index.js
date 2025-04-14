import React, { Fragment, useState, useEffect } from "react"
import { graphql, Link, navigate } from "gatsby"
import { Helmet } from "react-helmet"
import Dropdown from "react-dropdown"
import { GatsbyImage } from "gatsby-plugin-image"

import HomeLayout from "../../components/HomeLayout/HomeLayout"
// import { Strings } from "./../../resources";
import aboutStrings from "./../../data/about"
import { setPageTitle } from "./../../utils/page"
import Carousel from "react-multi-carousel"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import "react-multi-carousel/lib/styles.css"
import LocationPicker from "../../components/LocationPicker"
import StickyCart from "../../components/StickyCart"
import "./about.scss"

import stranelogoimg from "./../../resources/images/about/Logo_Strane.svg"
import garcialogoimg from "./../../resources/images/about/Logo_Garcia.svg"
import paxlogoimg from "./../../resources/images/about/Logo_PAX.svg"

import ZipInput from "../../components/UI/ZipInput"
import HoverButton from "../../components/UI/HoverButton"
import locations from "../../data/location";
import { location_data } from "../../data/location";
import { employee_testimonials } from "../../data/employeeTestimonials"
import { customer_testimonials } from "../../data/customerTestimonials"
import {
  setShortestDistance,
  getStore,
  setStore,
  resetDistance,
  filterLocation,
  getGoogleZipURL,
  DISPENSARY_LIST_URL,
  setStore as setStoreInStore,
  filterLocationBasedText,
  replaceCannabisToDispensary,
} from "../../services/HomeService"

export function AboutPage({fluids}) {
  const isBrowser = () => typeof window !== "undefined"
  const [selectedLocationOption, setLocationOption] = useState("")
  const [selectedLocation, setLocation] = useState(null)
  const [modalShow, setModalShow] = React.useState(false)
  const storeDataFromStorage = getStore()
  const {
    title_text,
    abbr,
    title_image,
    become_patient,
    name,
    error,
  } = getStore()
  const [isLocationActive, setLocationActive] = useState(false);
  const [storeData, setStoreData] = useState(null)
  const [searchText, setSearchText] = useState("")
  const allLocations = locations.location_data;

  const locationPickerClosed = () => {
    setLocationActive(false)
  }

  const getShopLink = () => {
    let storeLocation = filterLocation(name);
    return storeLocation ? navigate(storeLocation.link) : setLocationActive(true);
  }

  /**
   * If the Location is already set then set the Location
   */
  useEffect(() => {
    setStoreData(error ? null : storeDataFromStorage)
    if (name) {
      // console.log('Location is already set');
      let filteredLocation = allLocations.filter(locationItem => {
        return locationItem.name.toUpperCase() === name.toUpperCase()
      })
      if (filteredLocation.length > 0) {
        setLocation(filteredLocation[0])
        setLocationOption(filteredLocation[0].name.toUpperCase())
      }
    }
  }, [error, title_text, abbr, title_image, name, become_patient])

  const onLocationSelected = () => {
    if (isBrowser()) {
      window.location.reload()
    }
  }

  const onChangeZipText = text => {
    // console.log("text");
    setSearchText(text)
  }
  const [comingSoon, setComingSoon] = useState(false)

  const dispensarySelected = dispensary => {
    if (dispensary.location_status !== "coming soon") {
      setStore(dispensary)
      setStoreData(dispensary)
      if (isBrowser()) {
        window.location.reload()
      }
      resetDistance()
    } else {
      setComingSoon(true)
    }
  }

  /**
   * onAgreeLocationTerms
   * @description On Agree Location Terms Set the Location in Store
   */
  const onAgreeLocationTerms = () => {
    if (selectedLocationOption === "") return false
    let filteredLocation = allLocations.filter(locationItem => {
      return locationItem.name.toUpperCase() === selectedLocationOption
    })
    if (filteredLocation.length > 0) {
      setModalShow(false)

      if (filteredLocation[0].location_status !== "coming soon") {
        setLocation(filteredLocation[0])
        setStoreInStore(filteredLocation[0])
        setComingSoon(false)

        if (isBrowser()) {
          window.location.reload()
        }
      } else {
        setComingSoon(true)
      }
    }
  }

  /**
   * onCancelLocationTerms
   * @description On Cancel Location Terms Cancel the PopUp
   */
  const onCancelLocationTerms = () => {
    setModalShow(false)
  }

  /**
   * MyVerticallyCenteredModal
   * @param {object} modalProps
   * @description Show the Vertically Centered Modal Upon Location Change
   */
  const MyVerticallyCenteredModal = modalProps => {
    return (
      <Modal
        {...modalProps}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        contentClassName="about-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>{filterLocationBasedText(aboutStrings.aboutModalTitle)}</h4>
          <p>{filterLocationBasedText(aboutStrings.aboutModalSubTitle)}</p>
          <Button onClick={() => onAgreeLocationTerms()}>
            {filterLocationBasedText(aboutStrings.aboutModalContinueButtonText)}
          </Button>
          <Button onClick={() => onCancelLocationTerms()}>
            {filterLocationBasedText(aboutStrings.aboutModalCancelButtonText)}
          </Button>
        </Modal.Body>
      </Modal>
    )
  }

  const responsiveComment = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(aboutStrings.about_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  /**
   * getEmployeeTestimonials
   * @description Get Employee Testimonials
   */
  const getEmployeeTestimonials = () => {
    if (selectedLocation && selectedLocation.name) {
      let filteredData = employee_testimonials.filter(testimonial => {
        return (
          testimonial.location.toUpperCase() ===
          selectedLocation.name.toUpperCase()
        )
      })
      return filteredData
    } else {
      const shuffledTestimonials = employee_testimonials.sort(
        () => 0.5 - Math.random()
      )
      let selectedTestimonials = shuffledTestimonials.slice(0, 4)
      return selectedTestimonials
    }
  }

  /**
   * getTestimonials
   * @description Get the Testimonials Details based upon Location
   */
  const getTestimonials = () => {
    if (selectedLocation && selectedLocation.name) {
      let filteredData = customer_testimonials.filter(testimonial => {
        return (
          testimonial.location.toUpperCase() ===
          selectedLocation.name.toUpperCase()
        )
      })
      const shuffledTestimonials = filteredData.sort(() => 0.5 - Math.random())
      let selectedTestimonials = shuffledTestimonials.slice(0, 1)
      return selectedTestimonials
    } else {
      const shuffledTestimonials = customer_testimonials.sort(
        () => 0.5 - Math.random()
      )
      let selectedTestimonials = shuffledTestimonials.slice(0, 4)
      return selectedTestimonials
    }
  }

  /**
   * selectStoreLocation
   * @param {object} event
   * @description Show Confirmation PopUp of Location Change
   */
  const selectStoreLocation = event => {
    event.preventDefault()
    setModalShow(true)
    return false
  }

  /**
   * handleLocationChange
   * @param {object} event
   * @description Upon Location Change in Select Dropdown Change the Testimonials and Store Data
   */
  const handleLocationChange = event => {
    let filteredLocation = allLocations.filter(locationItem => {
      return locationItem.name.toUpperCase() === event.value
    })
    if (filteredLocation.length > 0) {
      setLocationOption(event.value)
      setLocation(filteredLocation[0])
    }
  }

  /**
   * getLocationDropDown
   * @description Get Location DropDown Options
   */
  const getLocationDropDown = () => {
    let locationOptions = []
    allLocations.forEach((locationItem, locationIndex) => {
      let status_class = ""
      if (locationItem.location_status === "coming soon") {
        status_class = "loc-disabled"
      }
      const lItem = {
        value: locationItem.name.toUpperCase(),
        label: locationItem.name + ", " + locationItem.abbr,
        className: status_class,
      }
      locationOptions.push(lItem)
    })
    return locationOptions
  }

  /**
   * locationSection
   * @description Show Location Selection, Store Details
   */
  const locationSection = () => {
    return (
      <div className="locations-section">
        <div className="left-text-section">
          <div className="left-text-width">
            <h3>
              {filterLocationBasedText(aboutStrings.aboutBudSectionTitle)}
            </h3>
            <p>
              {filterLocationBasedText(aboutStrings.aboutBudSectionDescription)}
            </p>
            <h5>
              {filterLocationBasedText(
                aboutStrings.aboutBudSectionLocationTitle
              )}
            </h5>
            {selectedLocation && (
              <p className="condense-text">
                {filterLocationBasedText(
                  aboutStrings.aboutBudSectionLocationDescription
                )}
              </p>
            )}
            {selectedLocation === null && (
              <p className="condense-text">
                {filterLocationBasedText(
                  aboutStrings.aboutBudSectionLocationDescription2
                )}
              </p>
            )}
          </div>

          {selectedLocation && (
            <form className="location-form">
              <Dropdown
                options={getLocationDropDown()}
                onChange={event => handleLocationChange(event)}
                value={selectedLocationOption}
                placeholder={filterLocationBasedText(
                  aboutStrings.aboutStoreSelectionOption
                )}
                className="location-select"
                controlClassName="dropdown-state-control"
                placeholderClassName="dropdown-state-placeholder"
                arrowClassName="dropdown-state-arrow"
                menuClassName="dropdown-state-menu"
              />
              <HoverButton
                btnType="submit"
                btnId="btn-set-location"
                btnName="btn-set-location"
                btnClassName="lime-btn"
                onClick={event => selectStoreLocation(event)}
              >
                {filterLocationBasedText(
                  aboutStrings.aboutStoreSelectionButtonTitle
                )}
              </HoverButton>
            </form>
          )}
          {comingSoon ? (
            <div className="coming-soon">We will soon add this store</div>
          ) : (
            ""
          )}
          {selectedLocation === null && (
            <ZipInput
              key="zip-search"
              value={searchText}
              onChange={value => onChangeZipText(value)}
              onBlur={event => onChangeZipText(event.target.value)}
              onSubmit={value => onChangeZipText(value)}
              dispensarySelected={data => dispensarySelected(data)}
            ></ZipInput>
          )}
        </div>

        {selectedLocation && (
          <div className="right-text-section">
            <h5>
              {filterLocationBasedText(
                aboutStrings.aboutStoreSelectionViewSectionTitle
              )}
            </h5>
            <div className="store-addres">
              <strong>
                {replaceCannabisToDispensary(
                  aboutStrings.aboutStoreSelectionViewTitle
                )}{" "}
                {filterLocationBasedText(selectedLocation.name)}
              </strong>
              <p>{filterLocationBasedText(selectedLocation.address_line1)}</p>
              <p>{filterLocationBasedText(selectedLocation.address_line2)}</p>
              <p>{filterLocationBasedText(selectedLocation.phone)}</p>
              <p>{filterLocationBasedText(selectedLocation.email)}</p>
            </div>
            <div className="store-timing">
              <strong>
                {filterLocationBasedText(
                  aboutStrings.aboutStoreSelectionViewHoursTitle
                )}
              </strong>
              <p>{filterLocationBasedText(selectedLocation.weekday_time)}</p>
              <p>{filterLocationBasedText(selectedLocation.weekend_time)}</p>
            </div>
          </div>
        )}

        {selectedLocation === null && (
          <div className="right-text-section">
            <h5>
              {filterLocationBasedText(
                aboutStrings.aboutUserNotSelectedLocation
              )}
            </h5>
          </div>
        )}

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    )
  }

  var carouselOption = getTestimonials().length === 1 ? false : true

  const renderPage = () => {
    var carouselOptionEmployees =
      getEmployeeTestimonials().length === 1 ? false : true

    return (
      <>
        <LocationPicker
          isActiveLocation={isLocationActive}
          onLocPickerClosed={() => locationPickerClosed()}
          goto={true}
        />
        <div className="about-content page-container-layout">
          <div className="about-banner">
            <div className="title-container">
              <h1>
                {filterLocationBasedText(
                  aboutStrings.aboutpage_banner_title
                ).toUpperCase()}
              </h1>
              <p className="sub-title">
                {filterLocationBasedText(
                  aboutStrings.aboutpage_banner_subtitle
                )}
              </p>
            </div>
          </div>
          <div className="aboutpage-container">
            <div className="cannabis-intro-section">
              <div className="text-section">
                <h3>
                  {filterLocationBasedText(aboutStrings.aboutShopSectionTitle)}
                </h3>
                <p>
                  {filterLocationBasedText(
                    aboutStrings.aboutShopSectionDescription
                  )}
                </p>
                {/* <a href={getShopLink()}> */}
                <HoverButton
                  btnClassName="lime-link-btn"
                  onClick={() => getShopLink()}
                >
                  {filterLocationBasedText(aboutStrings.aboutShopLinkTitle)}
                </HoverButton>
                {/* </a> */}
              </div>
              <div className="image-right">
                <GatsbyImage
                  image={fluids.isolatedbud.image}
                  alt={filterLocationBasedText(aboutStrings.aboutImg1)}
                />
              </div>
            </div>
            <div className="cannabis-brands-section">
              <div className="text-section">
                <h3>
                  {filterLocationBasedText(aboutStrings.aboutGrowSectionTitle)}
                </h3>
                <p>
                  {filterLocationBasedText(
                    aboutStrings.aboutGrowSectionDescription
                  )}
                </p>
                <p>
                  {filterLocationBasedText(
                    aboutStrings.aboutGrowSectionDescription1
                  )}{" "}
                  <a
                    href={aboutStrings.aboutGrowSectionDescriptionLink}
                    target="_blank"
                  >
                    {filterLocationBasedText(
                      aboutStrings.aboutGrowSectionDescriptionCompany
                    )}
                  </a>
                  .{" "}
                  {filterLocationBasedText(
                    aboutStrings.aboutGrowSectionDescription2
                  )}
                </p>
              </div>
              <div className="logos-right">
                <div className="brand-logo">
                  <Link
                    to="https://www.thisisstrane.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {/* GatsbyImage doesn't support svg */}
                    {/* <GatsbyImage
                    image={fluids.logo_strane.image}
                    alt={filterLocationBasedText(aboutStrings.aboutImg1)}
                  /> */}
                    <img
                      src={stranelogoimg}
                      alt={filterLocationBasedText(aboutStrings.aboutImg2)}
                    />
                  </Link>
                </div>
                <div className="brand-logo">
                  <Link
                    to="https://www.dodropsedibles.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <GatsbyImage
                      className="dodropslogo"
                      image={fluids.logo_dodrops11.image}
                      alt={filterLocationBasedText(aboutStrings.aboutImg3)}
                    />
                  </Link>
                </div>
                <div className="brand-logo">
                  <Link
                    to="https://garciahandpicked.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img
                      src={garcialogoimg}
                      alt={filterLocationBasedText(aboutStrings.aboutImg4)}
                    />
                  </Link>
                </div>
                <div className="brand-logo">
                  <Link
                    to="https://www.pax.com/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img
                      src={paxlogoimg}
                      alt={filterLocationBasedText(aboutStrings.aboutImg5)}
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="liberty-cares-section">
              <div className="text-section">
                <h4>
                  {filterLocationBasedText(
                    aboutStrings.aboutCaresSectionTitle
                  ).replace(
                    /Liberty Medical Marijuana Cares/g,
                    "Liberty Cares"
                  )}
                </h4>
                <p>
                  {filterLocationBasedText(
                    aboutStrings.aboutCaresSectionDescription
                  ).replace(
                    /Liberty Medical Marijuana Cares/g,
                    "Liberty Cares"
                  )}
                </p>
                <a href={aboutStrings.aboutCaresLinkUrl} target="_blank">
                  <HoverButton btnClassName="transparent-link-btn">
                    {filterLocationBasedText(aboutStrings.aboutCaresLinkTitle)}
                  </HoverButton>
                </a>
              </div>
              <div className="image-right">
                <GatsbyImage
                  className="desktop-img"
                  image={fluids.staffphoto_desktop.image}
                  alt={filterLocationBasedText(aboutStrings.aboutImg7)}
                />
                <GatsbyImage
                  className="mobile-img"
                  image={fluids.staffphoto_mobile.image}
                  alt={filterLocationBasedText(aboutStrings.aboutImg7)}
                />
              </div>
            </div>
            {getEmployeeTestimonials().length ? (
              <div className="employee-section">
                <GatsbyImage
                  className="upper-quote-img"
                  image={fluids.quote.image}
                  alt="quotes"
                />
                <div className="employee-reviews-carousel">
                  <Carousel
                    responsive={responsiveComment}
                    infinite={carouselOptionEmployees}
                    showDots={carouselOptionEmployees}
                    arrows={false}
                    renderDotsOutside={true}
                  >
                    {getEmployeeTestimonials().map((data, index) => {
                      return (
                        <div className="review-text" key={index}>
                          <h5>{filterLocationBasedText(data.text)}</h5>
                          <p>{`- ${data.by}`}</p>
                          <a
                            href={aboutStrings.aboutGrowLinkURL}
                            target="_blank"
                          >
                            <HoverButton btnClassName="lime-link-btn">
                              {filterLocationBasedText(
                                aboutStrings.aboutGrowLinkText
                              )}
                            </HoverButton>
                          </a>
                        </div>
                      )
                    })}
                  </Carousel>
                </div>
              </div>
            ) : <></>}
            <hr />
            {locationSection()}
            {MyVerticallyCenteredModal()}
            {getTestimonials().length > 0 && (
              <div className="testimonials-section">
                <div className="testimonials-carousel">
                  <Carousel
                    responsive={responsiveComment}
                    infinite={carouselOption}
                    showDots={carouselOption}
                    arrows={false}
                    renderDotsOutside={true}
                  >
                    {getTestimonials().map((data, index) => {
                      return (
                        <div className="review-text" key={index}>
                          <h5>{filterLocationBasedText(data.text)}</h5>
                          <p>{`- ${filterLocationBasedText(data.by)}`}</p>
                        </div>
                      )
                    })}
                  </Carousel>
                </div>
                <GatsbyImage
                  className="lower-quote-img"
                  image={fluids.quote.image}
                  alt="bottom-quotes"
                />
              </div>
            )}

            {name == "Van Nuys" ||
            name == "San Francisco" ||
            name === "Springfield" ? (
              ""
            ) : (
              <div className="liberty-rewards-section">
                <div className="image-left">
                  <GatsbyImage
                    className="desktop-img"
                    image={fluids.rewards_desktop.image}
                    alt={filterLocationBasedText(aboutStrings.aboutImg8)}
                  />
                  <GatsbyImage
                    className="mobile-img"
                    image={fluids.rewards_mobile.image}
                    alt={filterLocationBasedText(aboutStrings.aboutImg9)}
                  />
                </div>
                <div className="text-section">
                  <h4>
                    {filterLocationBasedText(
                      aboutStrings.aboutRewardsSectionTitle
                    )}
                  </h4>
                  <p>
                    {filterLocationBasedText(
                      aboutStrings.aboutRewardsSectionDescription
                    )}
                  </p>
                  <a href={aboutStrings.aboutRewardsLinkUrl}>
                    <HoverButton btnClassName="transparent-link-btn">
                      {filterLocationBasedText(
                        aboutStrings.aboutRewardsLinkTitle
                      )}
                    </HoverButton>
                  </a>
                </div>
              </div>
            )}
          </div>
          <StickyCart />
        </div>
      </>
    )
  }

  return (
    <Fragment>
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}

const About = ({ data: { about } }) => (
  <AboutPage
    fluids={about.edges.reduce(
      (o, edge) => ({
        ...o,
        [edge.node.name.toLowerCase()]: {
          path: edge.node.relativePath,
          image: edge.node.childImageSharp?.gatsbyImageData || {},
          name: edge.node.name,
        },
      }),
      {}
    )}
  />
)

export default About

export const aboutQuery = graphql`
  query About {
    about: allFile(
      filter: {
        sourceInstanceName: { eq: "imgs" }
        relativeDirectory: { eq: "about" }
      }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            gatsbyImageData(layout: FIXED)
          }
          name
        }
      }
    }
  }
`
