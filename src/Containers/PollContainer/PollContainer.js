import React from 'react'

export default function PollContainer() {
    return (
        <>
            <h2 className="communityBox__title mg-b10">Polls</h2>
            <hr></hr>
            <div className="communityBox__question">
                <h3 className="communityBox__title">Q1. HOW TO DESIGN A VIRTUAL EVENT?</h3>
                <ul className="communityBox__options">
                    <li>
                        <div className="custom-slider">
                            <span className="custom-slider__text">By Understanding Users.</span>
                            <div className="custom-slider__bar">
                                <span className="custom-slider__mark">70%</span>
                                <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="custom-slider">
                            <span className="custom-slider__text">By Understanding Users.</span>
                            <div className="custom-slider__bar">
                                <span className="custom-slider__mark">70%</span>
                                <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="custom-slider">
                            <span className="custom-slider__text">By Understanding Users.</span>
                            <div className="custom-slider__bar">
                                <span className="custom-slider__mark">70%</span>
                                <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="custom-slider">
                            <span className="custom-slider__text">By Understanding Users.</span>
                            <div className="custom-slider__bar">
                                <span className="custom-slider__mark">70%</span>
                                <div className="custom-slider__bar-inner" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        </>
    )
}
