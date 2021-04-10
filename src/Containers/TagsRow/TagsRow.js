import React, { useContext, useState } from 'react'
import { TAG_CLICKED } from '../../AppConstants/AnalyticsEventName'
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import "./TagsRow.css"

export default function TagsRow(props) {
    const { tags, onTagSelect, activeTag } = props
    const { user } = useContext(UserContext)
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext)


    return (
        <ul className="tabBox__list">
            {/* <li>Topics : </li> */}
            {
                tags.map(currTag =>
                    // <li><a className={activeTag.tag==currTag.tag?"tagDiv tagDivactive":"tagDiv"} onClick={()=>onTagSelect(currTag)}>{currTag.header}</a></li>
                    <li><a className={activeTag.tag == currTag.tag ? "active" : " "} onClick={() => {
                        addGAWithUserInfo(TAG_CLICKED, { tag: currTag.tag })
                        addCAWithUserInfo(`/${TAG_CLICKED}/${user.uid}_${currTag.tag}`, false, { tag: currTag.tag }, true)
                        onTagSelect(currTag)
                    }}>{currTag.header}</a></li>
                )
            }
        </ul>
    )
}
