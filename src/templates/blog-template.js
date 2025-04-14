import React, { Fragment, useEffect, useRef } from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import HomeLayout from "./../components/HomeLayout/HomeLayout"
import "../styles/blog-template.scss"
import { getStore, filterLocationBasedText } from "./../services/HomeService"

const BlogTemplate = ({ pageContext }) => {
  const {
    title_text,
  } = getStore()
  // Variable assignments
  const { data, next, prev } = pageContext
  const { title, description, content, date, banner_image } = data
  const bannerImage = require("./../resources/images/blog" + banner_image)
  const stickyLeftArrow = useRef(null);
  const stickyRightArrow = useRef(null);

  // Head Content
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        {/* <script src="https://jsappcdn.hikeorders.com/main/assets/js/hko-accessibility.min.js?orgId=yA5Z2ZpGNk02"></script> */}
      </Helmet>
    )
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }

    // var blogButton = document.getElementsByClassName("blog-btn")[0];
    // console.log(blogButton);
    // blogButton.addEventListener("mouseover", rippleEffect);

  });

  // const rippleEffect = (e) => {
  //   // e.preventDefault();
  //   var el = e.target; 
  //   e = e.touches ? e.touches[0] : e;

  //   var r = el.getBoundingClientRect(), d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 0.8;
  //   el.style.cssText = "--s: 0; --o: 1;";
  //   var x = el.offsetTop;
  //   el.style.cssText = "--t: 1; --o: 0; --d: " + d + "; --x:" + (e.clientX - r.left) + "; --y:" + (e.clientY - r.top) + ";";
  // }

  const handleScroll = () => {

    var stickyNav = [];
    stickyNav.push(stickyRightArrow.current, stickyLeftArrow.current)
    for (var i = 0; i < stickyNav.length; i++) {
      // console.log(window.scrollY);
      if(window.scrollY >= 400){
        stickyNav[i].classList.add("sticky");
        
        if (window.innerWidth < 688) {
          stickyNav[i].style.top = window.scrollY + "px";
        } else {
          stickyNav[i].style.top = (window.scrollY - 330) + "px";
        }
      } else {
        stickyNav[i].style.top = "100px";
        stickyNav[i].classList.remove("sticky");
      }
      if (window.scrollY > document.querySelector('body').offsetHeight-(window.innerHeight+280)) {
        stickyNav[i].style.top = "100px";
        document.getElementById('bottomNav').classList.add("showNav");
      } else {
        document.getElementById('bottomNav').classList.remove("showNav");
      }
    }
    

  };

  // Main page content
  const renderPage = () => {
    return (
      <div className={`single-blog-page page-container-layout ${title_text ? "location-selected" : ""}`}>
        <div className="inner-wrap-wide single-page-intro-wrap">
          <div
            className="single-page-intro"
            style={{ backgroundImage: `url(${bannerImage})` }}
          >
            <div className="single-post-meta">
              <Link to="/blogs/news" className="blog-page-link">
                BACK TO BLOG
              </Link>
              <time className="single-post-date">{date}</time>
            </div>

            <div className="intro-content">
              <h1 className="single-post-title">{filterLocationBasedText(title)}</h1>
              <p className="single-post-description">{filterLocationBasedText(description)}</p>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="inner-wrap">
            <div className="intro-content-mobile">
              <h1 className="single-post-title">{filterLocationBasedText(title)}</h1>
              <p className="single-post-description">{filterLocationBasedText(description)}</p>
            </div>

            <div
              className="blogpost"
              dangerouslySetInnerHTML={{ __html: filterLocationBasedText(content) }}
            />

            <div className=" single-post-nav inner-navigation-arrows">
            
              {prev ? (
                <p className="prev-post inner-navigation-arrow" ref={stickyLeftArrow}><Link to={prev.link}>
                  <span>Previous Post</span>
                </Link></p>
              ) : (
                <p className="prev-post inner-navigation-arrow inner-return-home" ref={stickyLeftArrow}><Link to="/">Return home</Link></p>
              )}
            
              {next ? (
                <p className="next-post inner-navigation-arrow" ref={stickyRightArrow}><Link to={next.link}>
                  <span>Next post</span>
                </Link></p>  
              ) : (
                <p className="next-post inner-navigation-arrow inner-return-home" ref={stickyRightArrow}><Link to="/">Return home</Link></p>
              )}
            </div>
          </div>


          <div className="inner-wrap-wide single-post-nav" id="bottomNav">
            <p className="prev-post">
              {prev ? (
                <Link to={prev.link}><span>Previous Post</span></Link>
              ) : (
                <Link to="/" className="return-home"><span>Return home</span></Link>
              )}
            </p>
            <p className="next-post">
              {next ? (
                <Link to={next.link}><span>Next post</span></Link>
              ) : (
                <Link to="/" className="return-home"><span>Return home</span></Link>
              )}
            </p>
          </div>
        </div>
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

export default BlogTemplate
