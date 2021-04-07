import React, { useState } from 'react'
import "./TagsRow.css"

export default function TagsRow(props) {
    const { tags, onTagSelect, activeTag } = props
    return (
        <ul className="tabBox__list">
            {/* <li>Topics : </li> */}
            {
                tags.map(currTag => 
                    // <li><a className={activeTag.tag==currTag.tag?"tagDiv tagDivactive":"tagDiv"} onClick={()=>onTagSelect(currTag)}>{currTag.header}</a></li>
                    <li><a className={activeTag.tag==currTag.tag?"active":" "} onClick={()=>onTagSelect(currTag)}>{currTag.header}</a></li>
                )
            }
        </ul>
    )
}
