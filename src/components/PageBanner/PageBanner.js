import React from "react"
import { Link } from "gatsby"
import "../../styles/global.scss"
import "./PageBanner.scss"
// import * as NavigationActions from "../../redux/actions/NavigationActions";
import { Strings } from "../../resources"
// import { useDispatch } from "react-redux";

export default function PageBanner(param) {

  return (
    <div className="page-banner" >
        <div className="inner-content-wrap">
          <h1 className="page-title">{param.pageTitle}</h1>
          <h4 className="page-desc col-12 col-sm-12 col-md-12 col-xl-6">{param.pageDesc1} <Link to={param.internalLink}>{param.internalLinkText}</Link> {param.pageDesc2}</h4>
        </div>
    </div>
  );
}