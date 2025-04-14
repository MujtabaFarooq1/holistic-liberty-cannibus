import React, { Fragment } from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../../components/Layout"
import { Strings } from "../../resources"
import "./test.scss"

export default function TestPage() {
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{Strings.test_title}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const renderPage = () => {
    return (
      <div className="test">
        {Strings.hello_from} {Strings.test_title}{" "}
        <Link className="global-pink" to="/">
          {Strings.go_to} {Strings.home_title}
        </Link>
      </div>
    )
  }

  return (
    <Fragment>
      <Layout>{renderPage()}</Layout>
      {renderHelmet()}
    </Fragment>
  )
}
