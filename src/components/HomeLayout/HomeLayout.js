import React , {useState} from "react"
import "../../styles/global.scss"
import "./HomeLayout.scss"
import Header from "./../Header/Header"
import Footer from "./../Footer/Footer"
import LeftMenu from "../LeftMenu/LeftMenu"
import { NavigationContextProvider } from "../../context/NavigationContext"
import { filterLocation, setStore as setStoreInStore } from "../../services/HomeService"
import AgeGate from "./../AgeGate"
import { Helmet } from "react-helmet";
import queryString from 'query-string'

const isBrowser = () => typeof window !== "undefined"


const storeSelected = store => {
  // if (isBrowser()) {
  //   window.scrollTo(0, 0);
  // }
  setStoreInStore(store);
}

export default function HomeLayout({ children, query }) {
  if (isBrowser()) {
    const parsed = queryString.parse(document.location.search);
    const urlLocation = parsed.loc;

    let origin = document.location.origin;
    let pathname = document.location.pathname;

    pathname = pathname.includes('shop') ? '/shop/' : pathname;

    let pageURL = origin + pathname;

    // console.log(urlLocation)

    if (urlLocation) {
      let storeLocation = filterLocation(urlLocation)
      // console.log(storeLocation)
      if (storeLocation) {
        storeSelected(storeLocation)
      }

      if (pathname.includes('shop')) {
        pageURL = origin + storeLocation.link;
      }

      window.location.replace(pageURL)
    }
  }
  return (
    <>
    <Helmet>
      {/* {
        typeof window !== 'undefined' ?
        document.location.origin === "https://libertycannabis.com" ?
       <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MXCMV2K');
          `}
        </script>
        : null
        : null
       } */}
    </Helmet>
    <NavigationContextProvider>
      <Header query={query} />
      <div className="page-container-wrap">
      {/* {
        typeof window !== 'undefined' ?
        document.location.origin === "https://libertycannabis.com" ?
            <noscript>
            {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MXCMV2K" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
             </noscript>
        : null
        : null
      } */}
      <LeftMenu />
      {children}
      </div>
      <Footer />
      <AgeGate />
    </NavigationContextProvider>
    </>
  )
}
