import React, { useState, useRef } from "react"
import { navigate } from "@reach/router"
import "../../styles/global.scss"
import "./SearchForm.scss"

const SearchForm = ({ initialQuery = "" }) => {
  // Create a piece of state, and initialize it to initialQuery
  // query will hold the current value of the state,
  // and setQuery will let us change it
  const [query, setQuery] = useState(initialQuery)

  // We need to get reference to the search input element
  const inputEl = useRef(null)

  // On input change use the current value of the input field (e.target.value)
  // to update the state's query value
  const handleChange = e => {
    setQuery(e.target.value)
  }

  // When the form is submitted navigate to /search
  // with a query q paramenter equal to the value within the input search
  const handleSubmit = e => {
    e.preventDefault()
    // `inputEl.current` points to the mounted search input element
    const q = inputEl.current.value
    navigate(`/search?q=${q}`)
  }

  const activeClass = query ? "active" : ""
  return (
    <>
      <form
        role="search"
        id="search-form"
        className={`search-form ${activeClass}`}
        onSubmit={handleSubmit}
      >
        <input
          ref={inputEl}
          id="search-input"
          type="search"
          value={query ? query : ""}
          placeholder="What are you looking for?"
          autoComplete="off"
          onChange={handleChange}
        />
        <button type="submit" className="search-submit">
          <span>Go</span>
        </button>
      </form>
    </>
  )
}
export default SearchForm