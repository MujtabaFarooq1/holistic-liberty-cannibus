import React, { Fragment } from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import { Strings } from "./../../resources"
import { setPageTitle } from "./../../utils/page"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import "./search.scss"
import PopularPages from "../../components/PopularPages"
import blogs from "./../../data/blogs"
import testimonials from "./../../data/testimonials"
import customerTestimonials from "./../../data/customerTestimonials"
import employeeTestimonials from "./../../data/employeeTestimonials"
import pages from "./../../data/pages"
import locations from "./../../data/location"
import locationsfaq from "./../../data/locationFAQs"
import newpatientfaq from "./../../data/newPatientFAQs"
import generalfaq from "./../../data/generalFAQs"
import { getStore, filterLocationBasedText } from "../../services/HomeService"
import aboutStrings from "./../../data/about"
import learnStrings from "./../../data/learn"
import contactStrings from "./../../data/contact"
import rewardsStrings from "./../../data/rewards"
import becomePatientStrings from "./../../data/become_patient"
import homeStrings from "./../../data/home"

export function SearchPage({ data, location, fluids }) {
  const { title_text, name } = getStore()

  let libertyLocationName = name ? name : ""
  // All variable assignment done here
  const homeBlogs = blogs.blog_data
    ? [].concat(blogs.blog_data[0], blogs.blog_data[0])
    : null

  const allTestimonials = testimonials.testimonial_data || []
  const allPosts = blogs.blog_data || []
  const allPages = pages || []
  const allLocations = locations.location_data || []
  const allAboutTestimonials = [].concat(customerTestimonials.customer_testimonials, employeeTestimonials.employee_testimonials);
  const allFAQs = [].concat(locationsfaq.faq_data, newpatientfaq.faq_data, generalfaq.faq_data);

  let filteredPosts = []
  let filteredTestimonials = []
  let filteredPages = []
  let filteredLocations = []
  let filteredAboutTestimonials = []
  let filteredFAQs = []
  let filteredHomeBlogs = []

  // let aboutData = aboutStrings[0]
  let aboutPageFlag = 0
  let learnPageFlag = 0
  let rewardsPageFlag = 0
  let contactPageFlag = 0
  let becomePatientPageFlag = 0
  let homePageFlag = 0

  // Take  query from url
  const params = new URLSearchParams(location?.search?.slice(1))
  const q = params.get("q") || ""

  for (var homekey in homeStrings) {
    if (
      filterLocationBasedText(homeStrings[homekey])
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      homePageFlag = 1
      break
    }
  }

  for (var aboutkey in aboutStrings) {
    if (
      filterLocationBasedText(aboutStrings[aboutkey])
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      aboutPageFlag = 1
      break
    }
  }

  for (var learnkey in learnStrings) {
    if (
      filterLocationBasedText(learnStrings[learnkey])
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      learnPageFlag = 1
      break
    }
  }

  for (var rewardskey in rewardsStrings) {
    if (
      filterLocationBasedText(rewardsStrings[rewardskey])
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      rewardsPageFlag = 1
      break
    }
  }

  for (var contactkey in contactStrings) {
    if (
      filterLocationBasedText(contactStrings[contactkey])
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      contactPageFlag = 1
      break
    }
  }

  for (var becomePatientkey in becomePatientStrings) {
    if (
      filterLocationBasedText(becomePatientStrings[becomePatientkey])
        .toLowerCase()
        .includes(q.toLowerCase())
    ) {
      becomePatientPageFlag = 1
      break
    }
  }

  //Filter all posts that matches to query/params
  filteredPosts = allPosts.filter(post => {
    const { description, title, tag, content } = post
    return (
      filterLocationBasedText(content)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(description)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(title).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(tag).toLowerCase().includes(q.toLowerCase())
    )
  })

  filteredHomeBlogs = homeBlogs.filter(blog => {
    const { description, title, tag, content } = blog
    return (
      filterLocationBasedText(content)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(description)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(title).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(tag).toLowerCase().includes(q.toLowerCase())
    )
  })

  //Filter all testimonials that matches to query/params
  filteredTestimonials = allTestimonials.filter(testimonial => {
    const { text, by, location } = testimonial
    if (libertyLocationName) {
      return (
        filterLocationBasedText(location)
          .toLowerCase()
          .includes(libertyLocationName.toLowerCase()) &&
        (filterLocationBasedText(text)
          .toLowerCase()
          .includes(q.toLowerCase()) ||
          filterLocationBasedText(by).toLowerCase().includes(q.toLowerCase()) ||
          filterLocationBasedText(location)
            .toLowerCase()
            .includes(q.toLowerCase()))
      )
    } else {
      filterLocationBasedText(text).toLowerCase().includes(q.toLowerCase()) ||
        filterLocationBasedText(by).toLowerCase().includes(q.toLowerCase()) ||
        filterLocationBasedText(location)
          .toLowerCase()
          .includes(q.toLowerCase())
    }
  })

  //Filter all locations that matches to query/params
  filteredLocations = allLocations.filter(location => {
    const {
      name,
      address_line1,
      address_line2,
      phone,
      email,
      abbr,
      tag,
      postalCode,
    } = location
    return (
      filterLocationBasedText(name).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(address_line1)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(address_line2)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(phone).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(email).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(abbr).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(tag).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(postalCode)
        .toLowerCase()
        .includes(q.toLowerCase())
    )
  })

  //Filter all pages that matches to query/params
  filteredPages = allPages.filter(page => {
    const { title, description, content } = page
    return (
      filterLocationBasedText(title).toLowerCase().includes(q.toLowerCase()) ||
      filterLocationBasedText(description)
        .toLowerCase()
        .includes(q.toLowerCase()) ||
      filterLocationBasedText(content).toLowerCase().includes(q.toLowerCase())
    )
  })

  //Filter all faq that matches to query/params
  filteredFAQs = allFAQs.filter(faq => {
    const { name, description, abbr, tag, location } = faq
    if (libertyLocationName) {
      return (
        (location.toLowerCase().includes(libertyLocationName.toLowerCase()) ||
          location.toLowerCase().includes("general") ||
          location.toLowerCase().includes("fornewpatient")) &&
        (filterLocationBasedText(name)
          .toLowerCase()
          .includes(q.toLowerCase()) ||
          filterLocationBasedText(description)
            .toLowerCase()
            .includes(q.toLowerCase()) ||
          filterLocationBasedText(abbr)
            .toLowerCase()
            .includes(q.toLowerCase()) ||
          filterLocationBasedText(tag).toLowerCase().includes(q.toLowerCase()))
      )
    } else {
      return (
        (location.toLowerCase().includes("general") ||
          location.toLowerCase().includes("fornewpatient")) &&
        (filterLocationBasedText(name)
          .toLowerCase()
          .includes(q.toLowerCase()) ||
          filterLocationBasedText(description)
            .toLowerCase()
            .includes(q.toLowerCase()) ||
          filterLocationBasedText(abbr)
            .toLowerCase()
            .includes(q.toLowerCase()) ||
          filterLocationBasedText(tag).toLowerCase().includes(q.toLowerCase()))
      )
    }
  })

  //Filter all about testimonials that matches to query/params
  filteredAboutTestimonials = allAboutTestimonials.filter(testimonial => {
    const { text, by, location } = testimonial
    return (
      filterLocationBasedText(location)
        .toLowerCase()
        .includes(libertyLocationName.toLowerCase()) &&
      (filterLocationBasedText(text).toLowerCase().includes(q.toLowerCase()) ||
        filterLocationBasedText(by).toLowerCase().includes(q.toLowerCase()) ||
        filterLocationBasedText(location)
          .toLowerCase()
          .includes(q.toLowerCase()))
    )
  })

  // Add head content here
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(Strings.search_title)}</title>
      </Helmet>
    )
  }

  // Main page content
  const renderPage = () => {
    return (
      <div
        className={`search-result page-container-layout ${
          title_text ? "location-selected" : ""
        }`}
      >
        <div className="inner-wrap-wide">
          {/* Result Heading */}
          {homePageFlag ||
          aboutPageFlag ||
          learnPageFlag ||
          rewardsPageFlag ||
          contactPageFlag ||
          becomePatientPageFlag ||
          filteredAboutTestimonials.length ||
          filteredFAQs.length ||
          filteredLocations.length ||
          filteredPosts.length ||
          filteredTestimonials.length ? (
            <h2 className="sr-title">
              Showing results for <span className="sr-query">{q}</span>
            </h2>
          ) : (
            ""
          )}

          {homePageFlag === 1 ||
          filteredTestimonials.length ||
          filteredHomeBlogs.length ? (
            <Link className="search-subheading" to={homeStrings.link}>
              {filterLocationBasedText(homeStrings.title)}
            </Link>
          ) : (
            ""
          )}

          {homePageFlag === 1 || filteredHomeBlogs.length ? (
            <div className="search-content-wrap">
              <h2 className="search-item-title">
                <Link
                  className="search-item-link clearfix"
                  to={homeStrings.link}
                >
                  {filterLocationBasedText(homeStrings.title)}
                </Link>
              </h2>
              <p className="search-item-description">
                {filterLocationBasedText(
                  homeStrings.description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 300)
                )}
              </p>
            </div>
          ) : (
            ""
          )}

          {filteredTestimonials.length
            ? filteredTestimonials.map((item, key) => {
                return (
                  <div className="search-content-wrap" key={key}>
                    <h2 className="search-item-title">
                      {filterLocationBasedText(item.by)}
                    </h2>
                    <p className="search-item-description">
                      {filterLocationBasedText(
                        item.text.replace(/(<([^>]+)>)/gi, "").substring(0, 300)
                      )}
                    </p>
                  </div>
                )
              })
            : ""}

          {aboutPageFlag === 1 || filteredAboutTestimonials.length ? (
            <Link className="search-subheading" to={aboutStrings.link}>
              {filterLocationBasedText(aboutStrings.title)}
            </Link>
          ) : (
            ""
          )}

          {aboutPageFlag === 1 ? (
            <div className="search-content-wrap">
              <h2 className="search-item-title">
                <Link
                  className="search-item-link clearfix"
                  to={aboutStrings.link}
                >
                  {filterLocationBasedText(aboutStrings.title)}
                </Link>
              </h2>
              <p className="search-item-description">
                {filterLocationBasedText(
                  aboutStrings.description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 300)
                )}
              </p>
            </div>
          ) : (
            ""
          )}

          {filteredAboutTestimonials.length
            ? filteredAboutTestimonials.map((item, key) => {
                return (
                  <div className="search-content-wrap" key={key}>
                    <h2 className="search-item-title">
                      {filterLocationBasedText(item.by)}
                    </h2>
                    <p className="search-item-description">
                      {filterLocationBasedText(
                        item.text.replace(/(<([^>]+)>)/gi, "").substring(0, 300)
                      )}
                    </p>
                  </div>
                )
              })
            : ""}

          {becomePatientPageFlag === 1 ? (
            <Link className="search-subheading" to={becomePatientStrings.link}>
              {filterLocationBasedText(becomePatientStrings.title)}
            </Link>
          ) : (
            ""
          )}

          {becomePatientPageFlag === 1 ? (
            <div className="search-content-wrap">
              <h2 className="search-item-title">
                <Link
                  className="search-item-link clearfix"
                  to={becomePatientStrings.link}
                >
                  {filterLocationBasedText(becomePatientStrings.title)}
                </Link>
              </h2>
              <p className="search-item-description">
                {filterLocationBasedText(
                  becomePatientStrings.description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 300)
                )}
              </p>
            </div>
          ) : (
            ""
          )}

          {learnPageFlag === 1 || filteredFAQs.length ? (
            <Link className="search-subheading" to={learnStrings.link}>
              {filterLocationBasedText(learnStrings.title)}
            </Link>
          ) : (
            ""
          )}

          {learnPageFlag === 1 ? (
            <div className="search-content-wrap">
              <h2 className="search-item-title">
                <Link
                  className="search-item-link clearfix"
                  to={learnStrings.link}
                >
                  {filterLocationBasedText(learnStrings.title)}
                </Link>
              </h2>
              <p className="search-item-description">
                {filterLocationBasedText(
                  learnStrings.description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 300)
                )}
              </p>
            </div>
          ) : (
            ""
          )}

          {filteredFAQs.length
            ? filteredFAQs.map((item, key) => {
                return (
                  <div className="search-content-wrap" key={key}>
                    <h2 className="search-item-title">
                      {filterLocationBasedText(item.name)}
                    </h2>
                    <p className="search-item-description">
                      {filterLocationBasedText(
                        item.description
                          .replace(/(<([^>]+)>)/gi, "")
                          .substring(0, 300)
                      )}
                    </p>
                  </div>
                )
              })
            : ""}

          {rewardsPageFlag === 1 ? (
            <div>
              <Link className="search-subheading" to={rewardsStrings.link}>
                {filterLocationBasedText(rewardsStrings.title)}
              </Link>
              <div className="search-content-wrap">
                <h2 className="search-item-title">
                  <Link
                    className="search-item-link clearfix"
                    to={rewardsStrings.link}
                  >
                    {filterLocationBasedText(rewardsStrings.title)}
                  </Link>
                </h2>
                <p className="search-item-description">
                  {filterLocationBasedText(
                    rewardsStrings.description
                      .replace(/(<([^>]+)>)/gi, "")
                      .substring(0, 300)
                  )}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}

          {contactPageFlag === 1 || filteredLocations.length ? (
            <Link className="search-subheading" to={contactStrings.link}>
              {filterLocationBasedText(contactStrings.title)}
            </Link>
          ) : (
            ""
          )}

          {contactPageFlag === 1 ? (
            <div className="search-content-wrap">
              <h2 className="search-item-title">
                <Link
                  className="search-item-link clearfix"
                  to={contactStrings.link}
                >
                  {filterLocationBasedText(contactStrings.title)}
                </Link>
              </h2>
              <p className="search-item-description">
                {filterLocationBasedText(
                  contactStrings.description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 300)
                )}
              </p>
            </div>
          ) : (
            ""
          )}

          {filteredLocations.length
            ? filteredLocations.map((item, key) => {
                return (
                  <div className="search-content-wrap" key={key}>
                    <h2 className="search-item-title">
                      {filterLocationBasedText(item.name)}
                    </h2>
                    <p className="search-item-description">
                      {item.address_line1}, {item.address_line2}, Phone:
                      {item.phone}, Email:{item.email}
                    </p>
                  </div>
                )
              })
            : ""}

          {/* Results for filtered posts */}
          {filteredPosts.length ? (
            <Link className="search-subheading" to="/blog/">
              Blog
            </Link>
          ) : (
            ""
          )}

          {filteredPosts.length
            ? filteredPosts.map((item, key) => {
                return (
                  <div
                    className="search-content-wrap search-blog-post"
                    key={key}
                  >
                    <h2 className="search-item-title">
                      <Link
                        key={key}
                        className="search-item-link clearfix"
                        to={item.link}
                      >
                        {filterLocationBasedText(item.title)}
                      </Link>
                    </h2>
                    <p className="search-item-description">
                      {item.featured_media && (
                        <GatsbyImage
                          image={fluids[item.featured_media_name]?.image}
                          alt={item.title}
                        />
                      )}

                      <span>
                        {filterLocationBasedText(
                          item.content
                            .replace(/(<([^>]+)>)/gi, "")
                            .substring(0, 300)
                        )}
                      </span>
                    </p>
                  </div>
                )
              })
            : ""}

          {/* Not found for what your are looking for text */}
          {homePageFlag ||
          aboutPageFlag ||
          learnPageFlag ||
          rewardsPageFlag ||
          contactPageFlag ||
          becomePatientPageFlag ||
          filteredAboutTestimonials.length ||
          filteredFAQs.length ||
          filteredLocations.length ||
          filteredPosts.length ||
          filteredTestimonials.length ? (
            <>
              <h3 className="not-finding">
                {filterLocationBasedText(Strings.result_not_found_title)}
              </h3>
              <p className="not-finding-description">
                {filterLocationBasedText(Strings.result_not_found_description)}
              </p>
            </>
          ) : (
            ""
          )}

          {/* Search page not found Started here */}
          {!homePageFlag &&
          !aboutPageFlag &&
          !learnPageFlag &&
          !rewardsPageFlag &&
          !contactPageFlag &&
          !becomePatientPageFlag &&
          !filteredAboutTestimonials.length &&
          !filteredPosts.length &&
          !filteredFAQs.length &&
          !filteredPosts.length &&
          !filteredTestimonials.length &&
          !filteredPages.length ? (
            <>
              <h2 className="sr-title">
                No results for{" "}
                <span className="sr-not-found-query sr-query">{`${q}`}</span>
              </h2>
              <p className="sr-not-found-description">
                We couldn’t find any results for{" "}
                <span className="sr-not-found-query">{`${q}`}</span>.{" "}
                {filterLocationBasedText(Strings.result_not_found_description)}
              </p>
            </>
          ) : (
            ""
          )}
        </div>

        {/* Common popular pages component */}
        <PopularPages />
      </div>
    )
  }

  // Layout Added Here
  return (
    <Fragment>
      <HomeLayout query={q}>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}

const Search = ({ data: { blog } }) => (
  <SearchPage
    fluids={blog.edges.reduce(
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

export default Search

export const searchQuery = graphql`
  query Search {
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
  }
`
