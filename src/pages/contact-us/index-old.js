import React, { Fragment } from "react";

// import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import HomeLayout from "../../components/HomeLayout/HomeLayout"
import PageBanner from "../../components/PageBanner/PageBanner"

import { Strings } from "../../resources";

// import 'bootstrap/dist/css/bootstrap.css';
import "./contact-us.scss";

import downArrow from "../../resources/images/DownArrow.svg";
import locationPin from "../../resources/images/Location_Finder_Icon_Teal.svg";


export default function ContactUs() {
  const renderHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{Strings.contact_us}</title>
      </Helmet>
    )
  }

  const tabClicked = (e, tabSelected) => {
    // e.preventDefault();
    // alert('Sorting by: ' + tabSelected);
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    tabSelected = tabSelected.replace(" ", "");
    document.getElementById(tabSelected).style.display = "block";

    e.currentTarget.className += " active";
  }




  const RenderStateTabs = props => {
    const states = [
      { id: 1, stateName: "All Dispensaries", isActive:"active"},
      { id: 2, stateName: "California", isActive:""},
      { id: 3, stateName: "Maryland", isActive:""},
      { id: 4, stateName: "Massachusetts", isActive:""},
      { id: 5, stateName: "Michigan", isActive:""},
      { id: 6, stateName: "Pennsylvania", isActive:""},
    ];
    return (
      states.map(item => (
        <button key={item.id} className={"tablinks " + item.isActive} onClick={(e) => tabClicked(e, item.stateName)} >{item.stateName}</button>
      ))
    );
  };
  const RenderSingleDispensary = (dispensaries) => {

    const allDispensary = {
      Aliquippa: {
        name: "Aliquippa",
        address_line1: "2320 Sheffield Road",
        address_line2: "Aliquippa, PA 15001",
        contact_no: "724-203-3029",
        email: "Aliquippa@LibertyDispensaryPA.com",
        store_hours: [
          "Monday - Friday 11 AM - 7 PM",
          "Saturday & Sunday 10 AM - 5 PM"
        ],
      },
      Bensalem: {
        name: "Bensalem",
        address_line1: "4201 Neshaminy Boulevard",
        address_line2: "Bensalem, PA 19020",
        contact_no: "267-778-9222",
        email: "Bensalem@LibertyDispensaryPA.com",
        store_hours: [
          "Monday - Saturday 10 AM - 7 PM",
          "Sunday 10 AM - 5 PM"
        ],
      },
      Detroit: {
        name: "Detroit",
        address_line1: "2540 Rosa Parks Blvd",
        address_line2: "Detroit, MI 48216",
        contact_no: "313-450-1400",
        email: "Detroit@LibertyCannabis.com",
        store_hours: [
          "Monday - Saturday 11 AM - 7 PM",
          "Sunday 12 AM - 6 PM"
        ],
      },
      Easthampton: {
        name: "Easthampton",
        address_line1: "155 Northampton St.",
        address_line2: "Easthampton, MA 01024",
        contact_no: "413-893-9839",
        email: "Easthampton@LibertyCannabis.com",
        store_hours: [
          "Monday - Saturday 10 AM - 8 PM",
          "Sunday 11 AM - 5 PM"
        ],
      },
      Gardena: {
        name: "Gardena",
        address_line1: "1115 W 190th St",
        address_line2: "Gardena, CA 90248",
        contact_no: "310-821-4420",
        email: "Beach@LibertyCannabis.com",
        store_hours: ["Monday - Sunday 10 AM - 8 PM"],
      },
      Norristown: {
        name: "Norristown",
        address_line1: "2030 W. Main Street, Unit #11",
        address_line2: "Norristown, PA 19403-6003",
        contact_no: "484-612-4520",
        email: "Norristown@LibertyDispensaryPA.com",
        store_hours: [
          "Monday - Saturday 10 AM - 7 PM",
          "Sunday 10 AM - 5 PM"
        ],
      },
      Philadelphia: {
        name: "Philadelphia",
        address_line1: "8900 Krewstown Road",
        address_line2: "Philadelphia, PA 19115-4517",
        contact_no: "267-686-2824",
        email: "Philadelphia@LibertyDispensaryPA.com",
        store_hours: [
          "Monday - Saturday 10 AM - 7 PM",
          "Sunday 10 AM - 5 PM"
        ],
      },
      Rockville: {
        name: "Rockville",
        address_line1: "12001 Nebel St",
        address_line2: "Rockville, MD 20852",
        contact_no: "301-603-2747",
        email: "",
        store_hours: [
          "Monday - Saturday 10 AM - 7 PM",
          "Sunday 11 AM - 5 PM"
        ],
      },
      Somerville: {
        name: "Somerville",
        address_line1: "304 Somerville Ave",
        address_line2: "Somerville, MA 02143",
        contact_no: "857-997-8207",
        email: "InfoSomerville@LibertyCannabis.com",
        store_hours: [
          "Monday - Saturday 10 AM - 8 PM",
          "Sunday 11 AM - 5 PM"
        ],
      }

    };

    const RenderContent = (singleDisp) => {
      const singleDispContent = allDispensary[singleDisp];

      return (
        <div className="single-disp col-6 col-sm-6 col-md-4">
          <div className="disp-title">
            <img loading="lazy" src={locationPin} alt="Location Pin" />
            <h5>{singleDispContent.name}</h5>
          </div>
          <div className="disp-address">
            <p>{singleDispContent.address_line1}</p>
            <p>{singleDispContent.address_line2}</p>
            <p>{singleDispContent.contact_no}</p>
            <p>{singleDispContent.email}</p>
          </div>
          <div className="disp-hours">
            <h6>Store hours:</h6>
            {singleDispContent.store_hours.map(hour => (
              <p>
                {hour}
              </p>
            ))}
          </div>

          <button name="btn-my-store" className="btn btn-my-store">Make this my store</button>
        </div>
      );
    };

    // console.log(dispensaries);
    // console.log(allDispensary['Aliquippa']);



    return (
      <div className="dispensary-wrap col-md-12">
        {/* {dispensaries.map(item => (
          // <div className="single-disp col-md-4">
            RenderContent(item.dispensary)
          // </div>
        ))} */}
      </div>
    );

  };
  const RenderStateTabContent = props => {

    const states = [
      { id: 1, stateName: "AllDispensaries",
        subDispensaries: [
          { id: 1.1, dispensary: "Aliquippa" },
          { id: 1.2, dispensary: "AnnArbor" },
          { id: 1.3, dispensary: "Bensalem" },
          { id: 1.4, dispensary: "Detroit" },
          { id: 1.5, dispensary: "Easthampton" },
          { id: 1.6, dispensary: "Gardena" },
          { id: 1.7, dispensary: "Norristown" },
          { id: 1.8, dispensary: "Philadelphia" },
          { id: 1.9, dispensary: "Rockville" },
          { id: 1.10, dispensary: "Somerville" },
      ] },
      { id: 2, stateName: "California", subDispensaries: [
        { id: 2.1, dispensary: "Gardena"},
      ] },
      { id: 3, stateName: "Maryland", subDispensaries: [
        { id: 3.1, dispensary: "Rockville"},
      ] },
      { id: 4, stateName: "Massachusetts", subDispensaries: [
        { id: 4.1, dispensary: "Easthampton"},
        { id: 4.2, dispensary: "Somerville"},
      ] },
      { id: 5, stateName: "Michigan", subDispensaries: [
        { id: 5.1, dispensary: "AnnArbor"},
        { id: 5.2, dispensary: "Detroit"},
      ] },
      { id: 6, stateName: "Pennsylvania", subDispensaries: [
        { id: 6.1, dispensary: "Aliquippa"},
        { id: 6.2, dispensary: "Bensalem"},
        { id: 6.3, dispensary: "Norristown"},
        { id: 6.4, dispensary: "Philadelphia"},
      ] },
    ];
    return (
        states.map(item => (
          <div id={item.stateName} key={item.id} className="tabContent">
            {/* <h3>{item.stateName}</h3> */}
              {RenderSingleDispensary(item.subDispensaries)}
          </div>
        ))
    );
  };

  const statesTab = () => {


    return (
      <div className="tab-wrap">
        <div className="tab">
          {RenderStateTabs()}
        </div>
        {RenderStateTabContent()}
          {/* {defClicked()} */}
          {/* {() => (document.getElementById("AllDispensaries").style.display = "block")} */}
          {/* {tabClicked("", "AllDispensaries")} */}
      </div>
    )
  }


  const renderPage = () => {

    return (
      <div className="contact-us-wrap page-content-wrap">
        <PageBanner pageTitle="Contact Us" pageDesc="Questions about the dispensary experience? Check out our FAQs for fast answers to common questions. Otherwise, feel free to contact us directly." />

        <div className="page-content">
          <div className="inner-content-wrap">
            <div className="btn-row row">
              <div className="single-btn col-md-6">
                <button id="btn-email" className="btn btn-big btn-orange">
                  <div className="btn-text col-10 col-sm-8 col-md-8">
                    <p className="btn-value">Send us an email</p>
                    <p className="btn-desc">For general questions, please complete the form below and we will get back to you soon.</p>
                  </div>
                  <div className="btn-animation col-sm-4 col-md-4">
                    <img loading="lazy" className="down-arrow" src={downArrow} alt="down arrow" />
                  </div>
                </button>
              </div>
              <div className="single-btn col-md-6">
                <button id="btn-call" className="btn btn-big btn-red">
                  <div className="btn-text col-10 col-sm-8 col-md-8">
                    <p className="btn-value">CALL YOUR DISPENSARY</p>
                    <p className="btn-desc">For product inquiries or questions about your local dispensary, please contact the store directly.</p>
                  </div>
                  <div className="btn-animation col-sm-4 col-md-4">
                    <img loading="lazy" className="down-arrow" src={downArrow} alt="down arrow" />

                  </div>
                </button>
              </div>
            </div>
            {/* Dispensaries location section start */}
            <div className="dispensary-section">
              <h3 className="sub-heading">Our Locations</h3>
              <div className="states-tab-wrap">
                {statesTab()}
              </div>
            </div>
            {/* Dispensaries location section ends */}
            <hr className="section-separator"></hr>
            <div className="contact-form-wrap">
              <h2 className="sub-heading">Send us a message and we’ll get back to you soon!</h2>
              <form className="contact-form" method="POST">
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <input type="text" className="form-control user-name" placeholder="Name (first, last)" />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    <input type="text" className="form-control email-id" placeholder="Email" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <input type="text" className="form-control user-phone" name="user-phone" placeholder="Phone number (optional)" />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6">
                    <select className="form-control user-state" name="user-state">
                      <option value="Select" disabled selected>Select your state</option>
                      <option value="California">California</option>
                      <option value="Maryland">Maryland</option>
                      <option value="Massachusetts">Massachusetts</option>
                      <option value="Michigan">Michigan</option>
                      <option value="Pennsylvania">Pennsylvania</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-12">
                    <textarea className="form-control email-message" name="email-message" placeholder="Message"></textarea>
                  </div>
                </div>
                <div className="form-row">
                  <button type="submit" name="btn-send-email" className="btn btn-send-email col-md-4">Send</button>
                </div>
              </form>
            </div>
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


