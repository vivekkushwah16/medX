import React, { useState } from 'react'

const possibleStates = {
    hideReadMore: 0,
    showMore: 1,
    showLess: 2
}

let characterLimit = 200;
//className description Limit
export default function ReadMore(props) {
    const { description, className, limit } = props
    if(limit){
        characterLimit = limit
    }
    const [moreState, setMoreState] = useState(description.length > characterLimit ? possibleStates.showMore : possibleStates.hideReadMore)

    return (
        <>
            {
                moreState === possibleStates.hideReadMore &&
                <p className={className}>{description}</p>
            }
            {
                moreState === possibleStates.showMore &&
                <p className={className}>{description.substr(0, characterLimit)}...&nbsp; <a href="#" onClick={(e) => { e.preventDefault(); setMoreState(possibleStates.showLess) }}>showMore</a></p>
            }
            {
                moreState === possibleStates.showLess &&
                <p className={className}>{description} 	&nbsp; <a href="#" onClick={(e) => { e.preventDefault(); setMoreState(possibleStates.showMore) }}>showLess</a></p>
            }
        </>
    )
}
