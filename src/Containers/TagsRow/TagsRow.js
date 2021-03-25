import React, { useState } from 'react'
import "./TagsRow.css"

export default function TagsRow(props) {
    const { tags, onTagSelect, activeTag } = props
    return (
        <ul className="tabBox__list">
            <li>Topics : </li>
            {
                tags.map(currTag => 
                    <li><a className={activeTag==currTag.tag?"tagDiv tagDivactive":"tagDiv"} onClick={()=>onTagSelect(currTag.tag)}>{currTag.header}</a></li>
                )
            }
        </ul>
    )
}
