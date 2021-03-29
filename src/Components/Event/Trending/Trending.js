import React from 'react'
import TrendingItem from './Items/TrendingItem'

export default function Trending(props) {
    const { data } = props
    return (
        <div id="tab3" class="eventBox__tabs-content active">
            <div class="trendingBox">
                {
                    data.map(item => (
                        <TrendingItem data={item} />
                    ))
                }
            </div>
        </div>
    )
}
