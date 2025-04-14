import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { Strings } from "./../resources"
import { setPageTitle } from "./../utils/page"
import HomeLayout from "./../components/HomeLayout/HomeLayout"
import PopularPages from "./../components/PopularPages"
import "./404.scss"
import { getStore, filterLocationBasedText } from "./../services/HomeService"

export default function NotFoundPage() {
  const {
    title_text,
  } = getStore()
  // Head Content
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(Strings.page_not_found_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  // Main Page Content
  const renderPage = () => {
    return (
      <div className={`not-found-page page-container-layout ${title_text ? "location-selected" : ""}`}>
        <div className="inner-wrap-wide">
          <h2 className="nfp-title">
            {filterLocationBasedText(Strings.not_found_page_subheading)}{" "}
            <span className="nfp-query">{filterLocationBasedText(Strings.not_found_page_heading)}</span>
          </h2>
          <h3 className="not-finding">{filterLocationBasedText(Strings.result_not_found_title)}</h3>
          <p className="not-finding-description">
            {filterLocationBasedText(Strings.result_not_found_description)}
          </p>
        </div>
        <PopularPages />
      </div>
    )
  }

  // Layout Added here
  return (
    <Fragment>
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}
