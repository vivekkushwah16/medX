import React, { useState } from 'react'

export default function TagsRow(props) {
    const { tags } = props
    return (
        <ul className="tabBox__list">
            <li>Topics : </li>
            {
                tags.map(tag => 
                    <li><a href="#">{tag.header}</a></li>
                )
            }
        </ul>
    )
}
