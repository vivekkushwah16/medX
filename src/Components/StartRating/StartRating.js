import React, { useState } from 'react'
import StarRatings from 'react-star-ratings';

export default function StartRating(props) {
    const { initalRating, updateRating } = props;
    const [rating, setRating] = useState(initalRating);


    const updateRatingDb = (newRating) => {
        setRating(newRating)
        updateRating(newRating)
    }

    return (
        <StarRatings
            rating={rating}
            starRatedColor="#FFDF6D"
            starHoverColor="#FFED85"
            changeRating={(newRating, name) => updateRatingDb(newRating)}
            numberOfStars={5}
            name='rating'
            starDimension='1.25rem'
            starSpacing="2px"
        />
    )
}
