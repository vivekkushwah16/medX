import React, { useState } from 'react'
import './SearchBar.css'
import SearchIcon from './SearchIcon.svg'

const SearchBar = React.memo((props) => {
    const [text, setText] = useState(props.initalSearchKeyword ? props.initalSearchKeyword : "")
    const { doSearch } = props

    return (
        <div className="search-container">
            <form>
                <input
                    type="text"
                    placeholder="Search.."
                    name="search"
                    value={text}
                    onChange={(event) => {
                        setText(event.target.value)
                    }}
                />
                <button type="submit" onClick={(event) => {
                    event.preventDefault()
                    doSearch(text)
                }}>
                    <img src={SearchIcon} alt="SearchIcon" />
                </button>
            </form>
        </div>
    )
})

export default SearchBar