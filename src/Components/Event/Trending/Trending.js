import React from 'react'
import TrendingItem from './Items/TrendingItem'

export default function Trending(props) {
    const { data, addAnalytics } = props
    return (
        <div id="tab3" class="eventBox__tabs-content active">
            {/* <div class="trendingBox"> */}
            <div class="maincardBox maincardBox--large maincardBox--mobile-visible">
                <div class="maincardBox__card-wrapper">
                    <div class="container" style={{ maxWidth: '65rem' }}>
                        {
                            data.map(item => (
                                <TrendingItem data={item} addAnalytics={addAnalytics} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}
