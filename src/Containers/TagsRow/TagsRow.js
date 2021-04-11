import React, { useContext, useState, useRef, useMemo, useEffect } from 'react'
import { TAG_CLICKED } from '../../AppConstants/AnalyticsEventName'
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import "./TagsRow.css"

export default function TagsRow(props) {
    const { tags, onTagSelect, activeTag, stickyOnScroll } = props
    const { user } = useContext(UserContext)
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext)
    const navBar = useRef(null)
    const [sticky, setSticky] = useState(false)

    const handleScroll = () => {
        try {
            if (yOffset > 0) {
                // console.log(window.pageYOffset >= yOffset, yOffset)
                if (window.pageYOffset >= yOffset) {
                    setSticky(true)
                } else {
                    setSticky(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const calculateYoffset = () => {
        console.log('navBar', navBar.current, stickyOnScroll)
        if (stickyOnScroll) {
            if (navBar.current) {
                window.addEventListener('scroll', handleScroll);
                console.log(navBar.current.offsetTop)
                return navBar.current.offsetTop < 0 ? window.innerHeight + navBar.current.offsetTop + 100 : navBar.current.offsetTop;
            }
        }
        return null
    }
    const yOffset = useMemo(() => calculateYoffset(), [navBar.current]);

    useEffect(() => {
        return () => {
            if (yOffset) {
                window.removeEventListener('scroll', handleScroll);
            }
        }
    }, [])

    const checkForActiveTag = (tag) => {
        if (activeTag.multipleTags) {
            return activeTag.currentTag === tag
        } else {
            return activeTag.tag == tag
        }
    }

    return (
        <ul ref={navBar} className={`tabBox__list ${sticky ? 'tabBox__list_sticky' : ''}`}>
            {/* <li>Topics : </li> */}
            {
                tags.map(currTag =>
                    // <li><a className={activeTag.tag==currTag.tag?"tagDiv tagDivactive":"tagDiv"} onClick={()=>onTagSelect(currTag)}>{currTag.header}</a></li>
                    <li><a className={checkForActiveTag(currTag.tag) ? "active" : " "} onClick={() => {
                        addGAWithUserInfo(TAG_CLICKED, { tag: currTag.tag })
                        addCAWithUserInfo(`/${TAG_CLICKED}/${user.uid}_${currTag.tag}`, false, { tag: currTag.tag }, true)
                        onTagSelect(currTag)
                    }}>{currTag.header}</a></li>
                )
            }
        </ul>
    )
}
