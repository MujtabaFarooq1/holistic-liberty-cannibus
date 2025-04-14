import React, { Fragment, useState } from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"


import { Strings } from "../../../resources"
import { setPageTitle } from "../../../utils/page"
import HomeLayout from "../../../components/HomeLayout/HomeLayout"
import PageIntro from "../../../components/PageIntro"
import StickyCart from "../../../components/StickyCart"
import blogs from "../../../data/blogs"
import "./blog.scss"
import pageintroimg from "./../../../resources/images/blog/6.0_HeaderBackground_DESKTOP.webp"
import { getStore, filterLocationBasedText } from "../../../services/HomeService"

export function BlogPage({ fluids }) {
  // Variable assignments
  const {
    title_text,
  } = getStore()

  const blank = "";
  var uniqueTags = []
  const allPosts = blogs.blog_data
  const emptyQuery = "all"

  // Created states
  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  })

  // Add head content
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(Strings.blog_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const scrollWin = (e, x, y) => {
    e.target.parentElement.scrollBy(x, y, 'smooth');
  }

  // Button on click event
  const handleButtonClick = event => {
    const query = event.target.value
    // console.log(query)

    // this is how we get all of our posts
    const posts = allPosts || []
    // return all filtered posts
    const filteredData = posts.filter(post => {
      // destructure data from post
      const { tag } = post
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
      filteredData, // with filtered data from posts.filter(post => (//filteredData)) above
    })
  }

  const { filteredData, query } = state
  // if we have a fileredData in state and a non-emptyQuery then
  // searchQuery then `hasSearchResults` is true
  const hasSearchResults = filteredData && query !== emptyQuery
  // if we have a search query then return filtered data instead of all posts; else return allPosts
  const posts = hasSearchResults ? filteredData : allPosts

  // Main page content
  const renderPage = () => {
    return (
      <div className={`blog-page page-container-layout ${title_text ? "location-selected" : ""}`}>
        <PageIntro
          title="The Grow"
          description="Cannabis insights and musings"
          background={pageintroimg}
        />

        <StickyCart />
        <div className="blog-listing">
          <div className="inner-wrap">
            {/* Filter navigation added here */}
            <div className="filter-nav">
              <button
                className="tab-scroll-icon prev-tab"
                type="button"
                onClick={(e) => scrollWin(e,-100, 0)}
              >{blank}</button>

              <button
                className={"all" === query || query === "" ? " active" : ""}
                type="button"
                value="all"
                onClick={handleButtonClick}
              >
                All Posts
              </button>
              {allPosts.forEach((tagpost, key) => {
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

              {uniqueTags.map((value, index) => {
                return (
                  <button
                    className={value === query ? " active" : ""}
                    type="button"
                    key={index}
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

            {/* Filtered Content */}
            <div className="filtered-posts">
              {posts.map((data, key) => {
                return (
                  <Link key={key} className={`post-item clearfix ${data.date==='DEC 31, 2019' || data.date==='DEC 02, 2019' ? 'img-position-change' : ''}`} to={data.link}>
                    <GatsbyImage image={fluids[data.featured_media_name]?.image} alt={filterLocationBasedText(data.title)} />
                    <div className="post-content-wrap">
                      <h2 className="post-title">{filterLocationBasedText(data.title)}</h2>
                      <p className="post-description">{filterLocationBasedText(data.excerpt)}</p>
                      <time className="post-date">{filterLocationBasedText(data.date)}</time>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Layout Added Here
  return (
    <Fragment>
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}

const Blog = ({ data: { blog } }) => (
  <BlogPage
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

export default Blog

export const blogQuery = graphql`
  query Blog {
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
