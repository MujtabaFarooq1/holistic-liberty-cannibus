import React, { Fragment, useState, useEffect, useRef } from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"
import HomeLayout from "../components/HomeLayout/HomeLayout"
// import { Strings } from "./../resources"
import homeStrings from "../data/home"
import "./home.scss"
import ZipInput from "../components/UI/ZipInput"
import HoverButton from "../components/UI/HoverButton"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { setPageTitle } from "./../utils/page"
import blogs from "../data/blogs"
import { location_data } from "../data/location"
import { testimonial_data } from "../data/testimonials"
import { Link, navigate } from "gatsby"
import PopularPages from "./../components/PopularPages"
import StickyCart from "./../components/StickyCart"
import {
  replaceCannabisToDispensary,
  filterLocation,
} from "../services/HomeService"

import {
  getStore,
  setStore,
  getNearbyDistance,
  resetDistance,
  setShortestDistance,
  INSTAGRAM_URL,
  DISPENSARY_LIST_URL,
  INSTAGRAM_API_URL,
  SITE_ID,
  filterLocationBasedText,
  INSTAGRAM_HANDLE,
  getShortestDistanceAndStore,
} from "../services/HomeService"
import { get } from "jquery"

export function HomePage({ homeImages, quoteImage, blogImages }) {
  const isBrowser = () => typeof window !== "undefined"
  const imageCarousel = useRef()
  const allPosts = blogs.blog_data
  const firstPost = blogs.blog_data ? blogs.blog_data[0] : null
  const secondPost = blogs.blog_data ? blogs.blog_data[1] : null
  const [searchText, setSearchText] = useState("")
  const [instagramData, setInstagramData] = useState(null)
  const [testimonialsList, setTestimonialsList] = useState([])
  const {
    title_text,
    abbr,
    title_image,
    become_patient,
    name,
    error,
  } = getStore()
  const nearestDistance = getNearbyDistance()
  const [storeData, setStoreData] = useState(null)
  const [isPodCenter, setIsPodCenter] = useState(false)
  const [isDeviceCenter, setIsDeviceCenter] = useState(false)
  const [isFlowerCenter, setIsFlowerCenter] = useState(false)
  const [isDropCenter, setIsDropCenter] = useState(false)
  const [isDiamondCenter, setIsDiamondCenter] = useState(false)
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 689 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 688, min: 0 },
      items: 1,
    },
  }

  const responsivePA = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 689 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 688, min: 0 },
      items: 1,
    },
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

  const fetchData = () => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let isExisting = location_data.filter((loc, index) => {
          return (
            loc.latitude === position.coords.latitude ||
            loc.longitude === position.coords.longitude
          )
        })
        if (isExisting.length > 0) {
          setStore(isExisting[0])
          setStoreData(isExisting[0])
        } else {
          get(DISPENSARY_LIST_URL, function (dispensaries, status) {
            if (
              status === "success" &&
              dispensaries.data &&
              dispensaries.data.length > 0
            ) {
              setShortestDistance(
                dispensaries.data,
                position.coords.latitude,
                position.coords.longitude
              )
              let { dist, nearbyStore } = getShortestDistanceAndStore(
                dispensaries.data,
                position.coords.latitude,
                position.coords.longitude
              )
              if (nearbyStore != null) {
                setStore(nearbyStore)
                setStoreData(nearbyStore)
              } else {
                navigate("/not-close/", { state: { distance: dist } })
              }
              // setShowNotCLose(true)
            } else {
              alert(homeStrings.something_wrong)
            }
          })
        }
      },
      function (error) {
        // setShowNotCLose(false);
      }
    )
  }

  const fetchInstagramFeed = async () => {
    get(`${INSTAGRAM_API_URL}${SITE_ID}`, function (response, status) {
      if (status === "success" && response.instagramAccessToken) {
        get(`${INSTAGRAM_URL}${response.instagramAccessToken}`, function (
          feed,
          status
        ) {
          if (status === "success" && feed.data && feed.data.length > 0) {
            setInstagramData(feed.data)
          }
        })
      }
    })
  }

  useEffect(() => {
    if (storeData && storeData.name) {
      if (
        storeData.name.toUpperCase() === "CRANBERRY TOWNSHIP" ||
        storeData.name.toUpperCase() === "SAN FRANCISCO" ||
        storeData.name.toUpperCase() === "VAN NUYS"
      ) {
        const shuffledTestimonials = testimonial_data.sort(
          () => 0.5 - Math.random()
        )
        let selectedTestimonials = shuffledTestimonials.slice(0, 4)
        setTestimonialsList(selectedTestimonials)
      } else if (storeData.name.toUpperCase() === "SPRINGFIELD") {
        let filteredDataSF = testimonial_data.filter(testimonial => {
          return (
            testimonial.location.toUpperCase() === "SOMERVILLE" ||
            testimonial.location.toUpperCase() === "EASTHAMPTON"
          )
        })
        const springfieldShuffledTestimonials = filteredDataSF.sort(
          () => 0.5 - Math.random()
        )
        let selectedSpringfieldTestimonials = springfieldShuffledTestimonials.slice(
          0,
          4
        )
        setTestimonialsList(selectedSpringfieldTestimonials)
      } else {
        let filteredData = testimonial_data.filter(testimonial => {
          return (
            testimonial.location.toUpperCase() === storeData.name.toUpperCase()
          )
        })
        setTestimonialsList(filteredData)
      }
    } else {
      const shuffledTestimonials = testimonial_data.sort(
        () => 0.5 - Math.random()
      )
      let selectedTestimonials = shuffledTestimonials.slice(0, 4)
      setTestimonialsList(selectedTestimonials)
    }
  }, [storeData])

  useEffect(() => {
    if (
      imageCarousel != null &&
      imageCarousel.current != null &&
      imageCarousel.current.state.slidesToShow > 0
    ) {
      if (abbr === "PA") {
        if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDiamondCenter(true)
        } else {
          setIsPodCenter(true)
        }
      } else {
        if (imageCarousel.current.state.slidesToShow === 5) {
          setIsFlowerCenter(true)
        } else if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDiamondCenter(true)
        } else {
          setIsPodCenter(true)
        }
      }
    }
  }, [imageCarousel, abbr])

  useEffect(() => {
    fetchInstagramFeed()
    if (title_text === null || title_text === undefined) {
      if (nearestDistance.error) {
        fetchData()
      } else {
        // navigate("not-close/")
        // setShowNotCLose(true);
      }
    } else {
      // setShowNotCLose(false);
      setStoreData(
        error ? null : { title_text, abbr, title_image, name, become_patient }
      )
    }
  }, [error, title_text, abbr, title_image, name, become_patient])

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(homeStrings.home_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const renderTestimonials = () => {
    var carouselOption = testimonialsList.length === 1 ? false : true
    if (!testimonialsList.length) return <></>
    return (
      <div className="review-section">
        <img
          loading="lazy"
          src={require("../resources/images/about/Quote.webp")}
          alt="Quote"
        />
        {/* <GatsbyImage className="upper-quote-img" image={quoteImage} alt="Quote" /> */}
        <div className="reviews-carousel">
          <Carousel
            responsive={responsiveComment}
            infinite={carouselOption}
            autoPlay={carouselOption}
            autoPlaySpeed={20000}
            showDots={carouselOption}
            renderDotsOutside={true}
            arrows={false}
            containerClass="reviews-carousel-container"
            dotListClass="reviews-carousel-dotList"
          >
            {testimonialsList.map((data, index) => {
              return (
                <div className="review-text" key={index}>
                  <h5>{data.text}</h5>
                  <p>{`- ${data.by}`}</p>
                </div>
              )
            })}
          </Carousel>
        </div>
      </div>
    )
  }

  const getBgImagePath = () => {
    if (storeData && storeData.title_image) {
      return `url(/images${storeData.title_image})`
    } else {
      return "url(/images/home-title.webp)"
    }
  }

  const renderStoreTitle = () => {
    let storeLocation = filterLocation(name)
    if (!storeLocation) return
    let shop_link = storeLocation.link
    return (
      <div
        className="home-page-title"
        style={{ backgroundImage: getBgImagePath() }}
      >
        <div className="store-title-container">
          <h1 className="page-title h1-forza">
            {replaceCannabisToDispensary(
              storeData && storeData.title_text
                ? storeData.title_text.toUpperCase()
                : homeStrings.home_headtitle.toUpperCase()
            )}
          </h1>
          <Link to={shop_link}>
            <HoverButton btnClassName="shop-button">
              {homeStrings.shop_now}
            </HoverButton>
          </Link>
        </div>
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div
        className="home-page-title"
        style={{ backgroundImage: getBgImagePath() }}
      >
        <div className="title-container">
          <h1 className="page-title h1-forza">
            {homeStrings.home_headtitle.toUpperCase()}
          </h1>
          <img
            src={require("../resources/images/home/logo.png")}
            align="right"
            alt="logo"
          />
        </div>
        <div className="search-zip-container">
          <div className="search-box">
            <p>
              {homeStrings.dispensary_near_you1}{" "}
              <Link to="/contact-us/#our-locations-tag">
                {homeStrings.dispensary_near_you_link}
              </Link>{" "}
              {homeStrings.dispensary_near_you2}
            </p>
            <p>{homeStrings.enter_zip}</p>
            <ZipInput
              key="zip-search"
              value={searchText}
              onChange={value => onChangeZipText(value)}
              onBlur={event => onChangeZipText(event.target.value)}
              onSubmit={value => onSubmitZip(value)}
              dispensarySelected={data => dispensarySelected(data)}
              placeholder={homeStrings.zip_placeholder}
            ></ZipInput>
          </div>
        </div>
      </div>
    )
  }

  const onSubmitZip = text => {
    setSearchText(text)
  }

  const onChangeZipText = text => {
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

  const extractContent = s => {
    if (isBrowser()) {
      var span = document.createElement("span")
      span.innerHTML = s
      return span.textContent || span.innerText
    } else {
      return ""
    }
  }

  const renderFirstBlog = () => {
    return (
      <div className="product-blog">
        <div className="prod-blog-text">
          <h6>{`${filterLocationBasedText(
            homeStrings.blog
          )} | ${filterLocationBasedText(firstPost.tag)}`}</h6>
          <div className="prod-sub-text">
            <h1>{filterLocationBasedText(firstPost.title)}</h1>
            <h3>{filterLocationBasedText(firstPost.description)}</h3>
            <p>
              {filterLocationBasedText(
                extractContent(firstPost.content).substring(0, 145)
              )}
              <span>...</span>
            </p>
            <span>{homeStrings.read_more}</span>
          </div>
        </div>
        <div className="prod-blog-image">
          <GatsbyImage
            className="prod-blog-image__contain"
            image={blogImages[firstPost.featured_media_name]?.image}
            alt={firstPost.title}
          />
        </div>
      </div>
    )
  }

  const renderBlogs = () => {
    return (
      <div className="blog-section">
        <Link to={firstPost.link} className="blog-row-1 home-blog">
          {renderFirstBlog()}
          {/*renderOverlay()*/}
          {/*renderHoverNext(firstPost.link)*/}
        </Link>
        <Link to={secondPost.link} className="blog-row-2 home-blog">
          <div className="well-blog-image">
            {/* <img
              src={require("../resources/images/blog" +
                secondPost.featured_media)}
              alt={filterLocationBasedText(secondPost.title)}
              title={filterLocationBasedText(secondPost.title)}
            /> */}
            <GatsbyImage
              image={blogImages[secondPost.featured_media_name]?.image}
              alt={secondPost.title}
            />
            <h6>{`${homeStrings.blog} | ${secondPost.tag}`}</h6>
          </div>
          <div className="well-blog">
            <h2>{filterLocationBasedText(secondPost.title)}</h2>
            <h3>{filterLocationBasedText(secondPost.description)}</h3>
            <span>{homeStrings.read_more}</span>
          </div>
          {/*renderOverlay()*/}
          {/*renderHoverNext(secondPost.link)*/}
        </Link>
      </div>
    )
  }

  const renderOverlay = () => {
    return <div className="overlay"></div>
  }

  const renderHoverNext = link => {
    return (
      <div className="middle">
        <Link to={link}>
          <img
            src={require("../resources/images/home/NextBlogHover.svg")}
            alt="next blog"
          />
        </Link>
      </div>
    )
  }

  const renderBecomePatientTitle = () => {
    var subText = homeStrings.join_community

    if (storeData && storeData.become_patient) {
      subText = storeData.become_patient
    }
    return <p className="subtitle">{filterLocationBasedText(subText)}</p>
  }

  const renderBlogCarousel = () => {
    var arrBlogs = allPosts
    if (allPosts.length > 4) {
      arrBlogs = allPosts.slice(0, 4)
    }
    return (
      <Carousel
        responsive={responsiveComment}
        infinite={true}
        showDots={true}
        arrows={false}
        dotListClass="custom-dot-list-style"
      >
        {arrBlogs.map((data, index) => {
          return (
            <div className="blog-carousel-item" key={index}>
              <div className="blog-container">
                <div className="well-blog-image">
                  <img
                    src={require("../resources/images/blog" +
                      data.featured_media)}
                    alt={filterLocationBasedText(data.title)}
                    title={filterLocationBasedText(data.title)}
                  />
                  <h6>{`${homeStrings.blog} | ${data.tag}`}</h6>
                </div>
                <div className="well-blog">
                  <h2>{filterLocationBasedText(data.title).toUpperCase()}</h2>
                  <h3>{filterLocationBasedText(data.description)}</h3>
                  <Link to={data.link}>{homeStrings.read_more}</Link>
                </div>
              </div>
              {renderOverlay()}
              {renderHoverNext(data.link)}
            </div>
          )
        })}
      </Carousel>
    )
  }

  const productHovered = event => {
    if (imageCarousel.current) {
      let imgWindowSize = imageCarousel.current.state.itemWidth
      let posX = event.clientX

      if (imageCarousel.current.state.slidesToShow === 5) {
        if (posX > imgWindowSize * 2 && posX <= imgWindowSize * 3) {
          return true
        } else {
          return false
        }
      } else if (imageCarousel.current.state.slidesToShow === 3) {
        if (posX > imgWindowSize && posX <= imgWindowSize * 2) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
    return false
  }

  const podClicked = () => {
    if (isPodCenter || imageCarousel.current.state.slidesToShow === 1) {
      if (isBrowser()) {
        window.location.href = "/shop/?dtche%5Bcategory%5D=vaporizers"
      }
    } else {
      if (imageCarousel.current.state.slidesToShow === 5) {
        imageCarousel.current.goToSlide(3, { skipBeforeChange: true })
      } else {
        imageCarousel.current.goToSlide(4, { skipBeforeChange: true })
      }
    }
  }

  const diamondClicked = () => {
    if (isDiamondCenter || imageCarousel.current.state.slidesToShow === 1) {
      if (isBrowser()) {
        window.location.href = "/shop/?dtche%5Bcategory%5D=concentrates"
      }
    } else {
      if (imageCarousel.current.state.slidesToShow === 5) {
        imageCarousel.current.goToSlide(4, { skipBeforeChange: true })
      } else {
        imageCarousel.current.goToSlide(5, { skipBeforeChange: true })
      }
    }
  }

  const flowerClicked = () => {
    if (isFlowerCenter || imageCarousel.current.state.slidesToShow === 1) {
      if (isBrowser()) {
        window.location.href = "/shop/?dtche%5Bcategory%5D=flower"
      }
    } else {
      if (imageCarousel.current.state.slidesToShow === 5) {
        imageCarousel.current.goToSlide(5, { skipBeforeChange: true })
      } else {
        imageCarousel.current.goToSlide(6, { skipBeforeChange: true })
      }
    }
  }

  const deviceClicked = () => {
    if (isDeviceCenter || imageCarousel.current.state.slidesToShow === 1) {
      if (isBrowser()) {
        window.location.href = "/shop/?dtche%5Bcategory%5D=accessories"
      }
    } else {
      if (imageCarousel.current.state.slidesToShow === 5) {
        imageCarousel.current.goToSlide(6, { skipBeforeChange: true })
      } else {
        imageCarousel.current.goToSlide(7, { skipBeforeChange: true })
      }
    }
  }

  const dropClicked = () => {
    if (isDropCenter || imageCarousel.current.state.slidesToShow === 1) {
      if (isBrowser()) {
        window.location.href = "/shop/?dtche%5Bcategory%5D=edibles"
      }
    } else {
      if (imageCarousel.current.state.slidesToShow === 5) {
        imageCarousel.current.goToSlide(7, { skipBeforeChange: true })
      } else {
        imageCarousel.current.goToSlide(8, { skipBeforeChange: true })
      }
    }
  }

  const renderInstagramImages = () => {
    var feedData = instagramData
    var counter = 0
    var limit = 5
    if (instagramData && instagramData.length > 0) {
      // if (instagramData.length > 5) {
      //   feedData = instagramData.slice(0, 5);
      // }
      return (
        <div className="instagram-images">
          {feedData.map((feed, index) => {
            // console.log(feed);
            if (feed.media_type === "IMAGE" && counter < limit) {
              counter++
              return (
                <a
                  href={feed.permalink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="insta-feed"
                  key={index}
                >
                  <img
                    loading="lazy"
                    className="insta-image"
                    src={feed.media_url}
                    alt={feed.caption}
                    key={index}
                  />
                  <div className="middle">
                    <img
                      src={require("../resources/images/home/NextBlogHover.svg")}
                      alt={feed.caption}
                    />
                  </div>
                </a>
              )
            }
          })}
        </div>
      )
    }
  }

  const renderCarouselHover = (title, subTitle) => {
    return (
      <div className="middle">
        <div className="text">
          <p className="title">
            {filterLocationBasedText(title).toUpperCase()}
          </p>
          <p className="sub-title">{filterLocationBasedText(subTitle)}</p>
        </div>
      </div>
    )
  }

  const imageCarouselChange = currentSlide => {
    setIsDeviceCenter(false)
    setIsDropCenter(false)
    setIsPodCenter(false)
    setIsDiamondCenter(false)
    setIsFlowerCenter(false)
    if (abbr === "PA") {
      setCenterCarouselImagePA(currentSlide)
    } else {
      setCenterCarouselImage(currentSlide)
    }
  }

  const setCenterCarouselImagePA = currentSlide => {
    if (
      imageCarousel === null ||
      imageCarousel.current === null ||
      imageCarousel.current.state === null
    ) {
      return
    }
    switch (currentSlide % 4) {
      case 0:
        if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDiamondCenter(true)
        } else {
          setIsFlowerCenter(true)
        }
        break
      case 1:
        if (imageCarousel.current.state.slidesToShow === 3) {
          setIsFlowerCenter(true)
        } else {
          setIsDeviceCenter(true)
        }
        break
      case 2:
        if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDeviceCenter(true)
        } else {
          setIsPodCenter(true)
        }
        break
      case 3:
        if (imageCarousel.current.state.slidesToShow === 3) {
          setIsPodCenter(true)
        } else {
          setIsDiamondCenter(true)
        }
        break
    }
  }

  const setCenterCarouselImage = currentSlide => {
    if (
      imageCarousel === null ||
      imageCarousel.current === null ||
      imageCarousel.current.state === null
    ) {
      return
    }
    switch (currentSlide % 5) {
      case 0:
        if (imageCarousel.current.state.slidesToShow === 5) {
          setIsFlowerCenter(true)
        } else if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDiamondCenter(true)
        } else {
          setIsDeviceCenter(true)
        }
        break
      case 1:
        if (imageCarousel.current.state.slidesToShow === 5) {
          setIsDeviceCenter(true)
        } else if (imageCarousel.current.state.slidesToShow === 3) {
          setIsFlowerCenter(true)
        } else {
          setIsDropCenter(true)
        }
        break
      case 2:
        if (imageCarousel.current.state.slidesToShow === 5) {
          setIsDropCenter(true)
        } else if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDeviceCenter(true)
        } else {
          setIsPodCenter(true)
        }
        break
      case 3:
        if (imageCarousel.current.state.slidesToShow === 5) {
          setIsPodCenter(true)
        } else if (imageCarousel.current.state.slidesToShow === 3) {
          setIsDropCenter(true)
        } else {
          setIsDiamondCenter(true)
        }
        break
      case 4:
        if (imageCarousel.current.state.slidesToShow === 5) {
          setIsDiamondCenter(true)
        } else if (imageCarousel.current.state.slidesToShow === 3) {
          setIsPodCenter(true)
        } else {
          setIsFlowerCenter(true)
        }
        break
    }
  }

  const renderPage = () => {
    let carousel_item_container_PA =
      abbr === "PA" ? "carousel-item-container-PA" : ""
    // console.log(abbr, carousel_item_container_PA);
    return (
      <div
        className={`home-page page-container-layout ${
          storeData && storeData.title_text ? "location-selected" : ""
        } ${carousel_item_container_PA}`}
      >
        {storeData && storeData.title_text ? renderStoreTitle() : renderTitle()}
        <div className="home-page-container">
          <div className={`carousel-container`}>
            <Carousel
              ref={imageCarousel}
              responsive={abbr === "PA" ? responsivePA : responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={6000}
              containerClass={`carousel-item-container carousel-item-container-${abbr} ${carousel_item_container_PA}`}
              afterChange={(previousSlide, { currentSlide, onMove }) => {
                imageCarouselChange(currentSlide)
              }}
            >
              <div
                className={`carousel-image-container ${
                  isPodCenter ? "center-item" : "not-center"
                }`}
                onClick={podClicked}
              >
                <div className="img-content">
                  <GatsbyImage image={homeImages.stranepod.image} alt="Pods" />
                </div>
                {renderOverlay()}
                {renderCarouselHover(homeStrings.oils, homeStrings.about_oils)}
              </div>
              <div
                className={`carousel-image-container ${
                  isDiamondCenter ? "center-item" : "not-center"
                }`}
                onClick={diamondClicked}
              >
                <div className="img-content">
                  <GatsbyImage
                    image={homeImages.stranediamonds.image}
                    alt="Diamonds"
                  />
                </div>
                {renderOverlay()}
                {renderCarouselHover(
                  homeStrings.concentrates,
                  homeStrings.about_concentrates
                )}
              </div>
              <div
                className={`carousel-image-container ${
                  isFlowerCenter ? "center-item" : "not-center"
                }`}
                onClick={flowerClicked}
              >
                <div className="img-content">
                  <GatsbyImage image={homeImages.flower.image} alt="Flower" />
                </div>
                {renderOverlay()}
                {renderCarouselHover(
                  homeStrings.flower,
                  homeStrings.about_flower
                )}
              </div>
              <div
                className={`carousel-image-container ${
                  isDeviceCenter ? "center-item" : "not-center"
                }`}
                onClick={deviceClicked}
              >
                <div className="img-content">
                  <GatsbyImage
                    image={homeImages.paxdevice.image}
                    alt="Device"
                  />
                </div>
                {renderOverlay()}
                {renderCarouselHover(
                  homeStrings.devices,
                  homeStrings.about_devices
                )}
              </div>
              {abbr === "PA" ? null : (
                <div
                  className={`carousel-image-container ${
                    isDropCenter ? "center-item" : "not-center"
                  }`}
                  onClick={dropClicked}
                >
                  <div className="img-content">
                    <GatsbyImage image={homeImages.dodrops.image} alt="Drops" />
                  </div>
                  {renderOverlay()}
                  {renderCarouselHover(
                    homeStrings.edibles,
                    homeStrings.about_edibles
                  )}
                </div>
              )}
            </Carousel>
            <div className="about-content">
              <h5>
                {name === "Somerville"
                  ? homeStrings.somerville_about_content_title
                  : filterLocationBasedText(homeStrings.about_content_title)}
              </h5>
              {abbr === "PA" ? (
                <p>
                  {filterLocationBasedText(
                    homeStrings.about_content_message.replace(/edibles, /gi, "")
                  )}
                </p>
              ) : (
                <>
                  {name === "Somerville" ? (
                    <a
                      href={homeStrings.somerville_about_btnLink}
                      target={"_blank"}
                    >
                      <HoverButton btnClassName="lime-link-btn btn anim-btn">
                        {homeStrings.somerville_about_btnLable}
                      </HoverButton>
                    </a>
                  ) : (
                    <p>
                      {filterLocationBasedText(
                        homeStrings.about_content_message
                      )}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <PopularPages location={name} />
          <StickyCart />
          {renderTestimonials()}
          {renderBlogs()}
          <div className="blog-carousel">{renderBlogCarousel()}</div>
          {renderInstagramImages()}
          <div className="social-handle">
            {instagramData && instagramData.length > 0 ? (
              <h5>
                <a
                  href={INSTAGRAM_HANDLE}
                  target="_blank"
                  rel="noreferrer noopener"
                >{`@${instagramData[0].username}`}</a>
              </h5>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  const storeSelected = store => {
    if (isBrowser()) {
      window.scrollTo(0, 0)
    }
    setStoreData({
      title_text: store.title_text,
      abbr: store.abbr,
      title_image: store.title_image,
    })
  }

  return (
    <Fragment>
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}

const Home = ({ data: { home, quote, blog } }) => (
  <HomePage
    homeImages={home.edges.reduce(
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
    quoteImage={quote.childImageSharp.gatsbyImageData}
    blogImages={blog.edges.reduce(
      (o, edge) => ({
        ...o,
        [edge.node.name]: {
          path: edge.node.relativePath,
          image: edge.node.childImageSharp?.gatsbyImageData || {},
          name: edge.node.name,
        },
      }),
      {}
    )}
  />
)

export default Home

export const homeQuery = graphql`
  query Home {
    quote: file(relativePath: { eq: "about/Quote.webp" }) {
      childImageSharp {
        gatsbyImageData
      }
    }
    blog: allFile(
      filter: {
        sourceInstanceName: { eq: "imgs" }
        relativeDirectory: { eq: "blog" }
      }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            gatsbyImageData
          }
          name
        }
      }
    }
    home: allFile(
      filter: {
        sourceInstanceName: { eq: "imgs" }
        relativeDirectory: { eq: "home" }
      }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            gatsbyImageData
          }
          name
        }
      }
    }
  }
`
