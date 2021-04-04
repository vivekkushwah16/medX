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
    let cuState = description.length > characterLimit ? possibleStates.showMore : possibleStates.hideReadMore
    const [moreState, setMoreState] = useState(cuState)
    if (description.length === 0) {
        return <br></br>
    }
    if (limit) {
        characterLimit = limit
    }

    return (
        <>
            {
                moreState === possibleStates.hideReadMore &&
                <p className={className}>{description}</p>
            }
            {
                moreState === possibleStates.showMore &&
                <p className={className}>{description.substr(0, characterLimit)}...&nbsp; <a href="#" onClick={(e) => { e.preventDefault(); setMoreState(possibleStates.showLess) }}>Show more</a></p>
            }
            {
                moreState === possibleStates.showLess &&
                <p className={className}>{description} 	&nbsp; <a href="#" onClick={(e) => { e.preventDefault(); setMoreState(possibleStates.showMore) }}>Show less</a></p>
            }
        </>
    )
}
