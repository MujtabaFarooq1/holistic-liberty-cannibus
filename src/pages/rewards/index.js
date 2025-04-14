import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import HomeLayout from "../../components/HomeLayout/HomeLayout"
// import { Strings } from "./../../resources";
import rewardsStrings from "./../../data/rewards"
import { setPageTitle } from "./../../utils/page"
import StickyCart from "./../../components/StickyCart"
import HoverButton from "../../components/UI/HoverButton"
import "./rewards.scss"
import libertyHeart from "./../../resources/images/rewards/LibertyHeart.svg"
import appleLogo from "./../../resources/images/rewards/AppleLogo.svg"
import googleLogo from "./../../resources/images/rewards/GooglePlayLogo.svg"
import videoPlaceholder from "./../../resources/images/rewards/VideoScreen.webp"
import rewardsVideo from "./../../resources/rewards/LibertyAppVideo.mp4"
import rewardsPDF from "./../../resources/rewards/Liberty_WalletApp_HowTo_Revise.pdf"

import { getStore, filterLocationBasedText } from "../../services/HomeService"
import CalculatorSlider from "../../components/CalculatorSlider"
const { name } = getStore()
const { tag } = getStore()

export function RewardsPage({ fluids }) {
  const redirectToHome = () => {
    if (name === "Springfield") {
      window.location.href = "/"
      return
    }
  }

  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{setPageTitle(rewardsStrings.rewards_title)}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  const renderPage = () => {
    return (
      <div
        className={`rewards-wrap page-content-wrap page-container-layout ${
          tag ? "location-selected" : ""
        }`}
      >
        <div className="page-content">
          {/* <div className="coming-soon-notification">
              <p>{filterLocationBasedText(rewardsStrings.comingSoonNotice)}</p>
            </div> */}
          <div className="rewards-intro-section ">
            <div className="inner-content-wrap row">
              <div className="left-section col-12 col-sm-12 col-md-6">
                <h1 className="page-title">
                  {filterLocationBasedText(rewardsStrings.rewardsBanner1)}
                  <span className="in-lime">
                    {" "}
                    {filterLocationBasedText(rewardsStrings.rewardsBanner2)}
                  </span>
                </h1>
                <h2 className="sub-tittle">
                  {name === "Easthampton"
                    ? filterLocationBasedText(
                        rewardsStrings.rewardsBanner3Easthampton
                      )
                    : filterLocationBasedText(rewardsStrings.rewardsBanner3)}
                </h2>
                {/* <h2  className="sub-tittle">{filterLocationBasedText(rewardsStrings.rewardsBanner4)}</h2> */}
              </div>
              <div className="right-section col-12 col-sm-12 col-md-6">
                <GatsbyImage
                  className="phones-image"
                  image={fluids.phones.image}
                  alt={filterLocationBasedText(rewardsStrings.rewardsImageAlt1)}
                />
              </div>
            </div>
          </div>

          {/* Calculator*/}
          <div className="slider__section">
            <CalculatorSlider />
          </div>

          {/* OLD CALCULATION CHART */}
          <div className="rewards-list-section">
            <div className="inner-content-wrap col-md-6">
              <h3 className="section-title">
                {filterLocationBasedText(rewardsStrings.rewardsListTitle)}
              </h3>
              <ul className="offer-list">
                <li>
                  <span className="offer">
                    {filterLocationBasedText(rewardsStrings.offer1)}
                  </span>
                  <span className="reward-text">
                    {filterLocationBasedText(rewardsStrings.rewardsText1)}
                  </span>
                </li>
                <li>
                  <span className="offer">
                    {filterLocationBasedText(rewardsStrings.offer2)}
                  </span>
                  <span className="reward-text">
                    {filterLocationBasedText(rewardsStrings.rewardsText2)}
                  </span>
                </li>
                <li>
                  <span className="offer">
                    {filterLocationBasedText(rewardsStrings.offer3)}
                  </span>
                  <span className="reward-text">
                    {filterLocationBasedText(rewardsStrings.rewardsText3)}
                  </span>
                </li>
                <li>
                  <span className="offer">
                    {filterLocationBasedText(rewardsStrings.offer4)}
                  </span>
                  <span className="reward-text">
                    {filterLocationBasedText(rewardsStrings.rewardsText4)}
                  </span>
                </li>
                <li>
                  <span className="offer">
                    {filterLocationBasedText(rewardsStrings.offer5)}
                  </span>
                  <span className="reward-text">
                    {filterLocationBasedText(rewardsStrings.rewardsText5)}
                  </span>
                </li>
                <li>
                  <span className="offer">
                    {filterLocationBasedText(rewardsStrings.offer6)}
                  </span>
                  <span className="reward-text">
                    {filterLocationBasedText(rewardsStrings.rewardsText6)}
                  </span>
                </li>
              </ul>
              <h3 className="offer-constrain">
                {filterLocationBasedText(rewardsStrings.offerConstraints1)}
              </h3>
              <h3 className="offer-constrain">
                {filterLocationBasedText(rewardsStrings.offerConstraints2)}
              </h3>
              <h3 className="offer-constrain">
                {filterLocationBasedText(rewardsStrings.offerConstraints3)}
              </h3>
              <h3 className="offer-constrain">
                {filterLocationBasedText(rewardsStrings.offerConstraints4)}
              </h3>
            </div>
            <div className="liberty-heart">
              <img loading="lazy" src={libertyHeart} alt="" />
            </div>
          </div>

          <div className="perks-section">
            <div className="perks-wrap">
              <div className="image-wrap">
                <GatsbyImage
                  className="bud-image"
                  image={fluids.flowerimage.image}
                  alt={filterLocationBasedText(rewardsStrings.rewardsImageAlt3)}
                />
              </div>

              <div className="text-content">
                <h3 className="perks-title">
                  {filterLocationBasedText(rewardsStrings.perksTitle)}
                </h3>
                <ul className="perks-list">
                  <li className="perks">
                    {filterLocationBasedText(rewardsStrings.perk1)}
                  </li>
                  <li className="perks">
                    {filterLocationBasedText(rewardsStrings.perk2)}
                  </li>
                  <li className="perks">
                    {filterLocationBasedText(rewardsStrings.perk3)}
                  </li>
                  <li className="perks">
                    {filterLocationBasedText(rewardsStrings.perk4)}
                  </li>
                </ul>
                {/* <p className="perk-foot-note">{filterLocationBasedText(rewardsStrings.perksFootNote)}</p> */}
              </div>
            </div>
          </div>

          <div className="wallet-section">
            <div className="wallet-wrap">
              <div className="text-content">
                <h3 className="wallet-title">
                  {filterLocationBasedText(rewardsStrings.walletTitle)}
                </h3>
                <ul className="feature-list">
                  <li className="wallet-fea">
                    <span className="feature-title">
                      {filterLocationBasedText(
                        rewardsStrings.walletFeatureTitle1
                      )}
                    </span>
                    {filterLocationBasedText(rewardsStrings.walletFeatureDesc1)}
                  </li>
                  <li className="wallet-fea">
                    <span className="feature-title">
                      {filterLocationBasedText(
                        rewardsStrings.walletFeatureTitle2
                      )}
                    </span>
                    {filterLocationBasedText(rewardsStrings.walletFeatureDesc2)}
                  </li>
                  {/* <li className="wallet-fea">
                        <span className="feature-title">{filterLocationBasedText(rewardsStrings.walletFeatureTitle3)}</span>
                        {filterLocationBasedText(rewardsStrings.walletFeatureDesc3)}
                      </li> */}
                  <li className="wallet-fea">
                    <span className="feature-title">
                      {filterLocationBasedText(
                        rewardsStrings.walletFeatureTitle4
                      )}
                    </span>
                    {filterLocationBasedText(rewardsStrings.walletFeatureDesc4)}
                  </li>
                  <li className="wallet-fea">
                    <span className="feature-title">
                      {filterLocationBasedText(
                        rewardsStrings.walletFeatureTitle5
                      )}
                    </span>
                    {filterLocationBasedText(rewardsStrings.walletFeatureDesc5)}
                  </li>
                </ul>
              </div>

              <div className="image-wrap">
                <GatsbyImage
                  className="wallet-image"
                  image={fluids.walletphoneimage.image}
                  alt={filterLocationBasedText(rewardsStrings.rewardsImageAlt5)}
                />
              </div>
            </div>
          </div>

          <div className="wallet-video-section">
            <div className="wallet-video-wrap">
              <h2 className="section-title wallet-title">
                {filterLocationBasedText(rewardsStrings.videoTitle)}
              </h2>
              <video
                controls
                poster={videoPlaceholder}
                className="wallet-video"
              >
                <source src={rewardsVideo} type="video/mp4" />
              </video>
            </div>

            <div className="wallet-pdf-wrap">
              <h2 className="section-title wallet-title">
                {filterLocationBasedText(rewardsStrings.PDFTitle)}
              </h2>
              <a href={rewardsPDF} download>
                <HoverButton btnClassName="btn btn-download-pdf">
                  {filterLocationBasedText(rewardsStrings.pdfDownloadButton)}
                </HoverButton>
              </a>
            </div>
          </div>
          <div className="footnote-wrap">
            <p className="reward-foot-note">
              {name === "Easthampton"
                ? filterLocationBasedText(
                    rewardsStrings.rewardFootNoteEasthampton
                  )
                : filterLocationBasedText(rewardsStrings.rewardFootNote)}
            </p>
          </div>
          <div className="app-store-section">
            <h2 className="section-title">
              {filterLocationBasedText(rewardsStrings.AppTitle)}
            </h2>

            <div className="btn-wrap">
              <a
                href={filterLocationBasedText(rewardsStrings.appStoreLink)}
                target="_blank"
                className="app-btn-link"
              >
                <HoverButton btnClassName="transparent-link-btn btn btn-app">
                  <img
                    loading="lazy"
                    src={appleLogo}
                    alt=""
                    className="icon apple-icon"
                  />

                  <span>
                    {filterLocationBasedText(rewardsStrings.appStoreButton)}
                  </span>
                </HoverButton>
              </a>
              <a
                href={filterLocationBasedText(rewardsStrings.playStoreLink)}
                target="_blank"
                className="app-btn-link"
              >
                <HoverButton btnClassName="transparent-link-btn btn btn-app">
                  <img
                    loading="lazy"
                    src={googleLogo}
                    alt=""
                    className="icon google-icon"
                  />
                  <span>
                    {filterLocationBasedText(rewardsStrings.playStoreButton)}
                  </span>
                </HoverButton>
              </a>
            </div>
            <div className="app-tm">
              <p className="tm">
                {filterLocationBasedText(rewardsStrings.androidTrademark)}
              </p>
              <p className="tm">
                {filterLocationBasedText(rewardsStrings.appleTrademark)}
              </p>
            </div>
          </div>

          <StickyCart />
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      {redirectToHome()}
      <HomeLayout>{renderPage()}</HomeLayout>
      {renderHelmet()}
    </Fragment>
  )
}

const Rewards = ({ data: { rewards } }) => (
  <RewardsPage
    fluids={rewards.edges.reduce(
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

export default Rewards

export const rewardsQuery = graphql`
  query Rewards {
    rewards: allFile(
      filter: {
        sourceInstanceName: { eq: "imgs" }
        relativeDirectory: { eq: "rewards" }
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
