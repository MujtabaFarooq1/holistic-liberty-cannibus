import React, { useState } from "react";
import { Link } from "gatsby";
import { Strings } from "../../resources";
import links from "../../data/links";
import reactStringReplace from "react-string-replace";
import {
    setStore as setStoreInStore,
    getStore,
    removeStore,
} from "../../services/HomeService";
import allLocations from "../../data/location";
import { navigate } from "@reach/router"


export default function LinkPopulate(props) {
    let newText = props.description;
    let replacedText;


    const [storeData, setStoreData] = useState(null);

    const isBrowser = () => typeof window !== "undefined"

    const storeSelected = (e, store, link) => {
        e.preventDefault();

        if (isBrowser()) {
          window.scrollTo(0, 0);
        }
        setStoreInStore(store)
        // onStoreSelection(store)
        setStoreData({
          title_text: store.title_text,
          abbr: store.abbr,
          title_image: store.title_image,
        })

        navigate(link)
    }

    // this is how we get all of our posts
    const locations = allLocations || []
    // return all filtered posts

    const faqClick = (hashLink) => {
        var faqid = parseInt(hashLink.slice(-2)) + 1;
        var actualid =  (hashLink.slice(0, 3) + faqid).slice(1);

        var link = document.getElementById(actualid);
        link.children[0].click()
    }


    replacedText = reactStringReplace(newText, /#(\w+)/g, (match, i) => {

        if (links[match].type === 'tab') {
            return (<span className="anchorLink" key={match + i} onClick={() => props.showBecomePatient()} >{links[match].text}</span>);
        } else if(links[match].type === 'nav') {
            return (<Link key={match + i} to={`${links[match].link}`}>{links[match].text}</Link>);
        } else if(links[match].type === 'link') {
            return (<a key={match + i} href={`${links[match].link}`} target="_blank" rel="noopener noreferrer">{links[match].text}</a>);
        } else if(links[match].type === 'break') {
            return (<br key={match + i} />);
        } else if(links[match].type === 'locationnav') {
            const filteredStore = locations.location_data.filter(location => {
              // destructure data from post frontmatter
              const { name } = location
              return (
                // standardize data with .toLowerCase()
                // return true if tag
                // contains the query string
                name &&
                (name.toLowerCase().includes(links[match].location.toLowerCase()))
              )
            });

            return (<Link key={match + i} to={`${links[match].link}`} onClick={(e) => storeSelected(e, filteredStore[0], links[match].link)}>{links[match].text}</Link>);
        } else if(links[match].type === 'navdropdownclick') {
            return (<Link key={match + i} to={`${links[match].link}`} onClick={() => faqClick(links[match].link)}>{links[match].text}</Link>);
        }
    });
    return (<p>{replacedText}</p>);
}
