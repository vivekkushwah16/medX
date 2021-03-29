import React, { useState, useEffect } from 'react'

export function PollResult(props) {
    const { index: currentIndex } = props
    const { question, options, index, totalResponse } = props.data
    options.sort(function (a, b) { return a.id - b.id });
    return (
        <div className="communityBox__question">
            <h3 className="communityBox__title">{`Q${currentIndex+1}. ${question}`}</h3>
            <ul className="communityBox__options">
                {
                    options.map(option => (
                        <li>
                            <div className="custom-slider">
                                <span className="custom-slider__text">{option.value}</span>
                                <div className="custom-slider__bar">
                                    <span className="custom-slider__mark">{`${totalResponse > 0 ? (option.response / totalResponse) * 100 : 0}%`}</span>
                                    <div className="custom-slider__bar-inner" style={{ width: `${totalResponse > 0 ? (option.response / totalResponse) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}


export function PollQuestion(props) {
    const { handleSubmit, checkIfAlreadyAnswered, index: currentIndex } = props
    const { question, options, index, id, eventId } = props.data
    options.sort(function (a, b) { return a.id - b.id });

    const [answer, setAnswer] = useState(checkIfAlreadyAnswered)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        if (checkIfAlreadyAnswered) {
            setAnswer(checkIfAlreadyAnswered)
        }
    }, [checkIfAlreadyAnswered])

    const handleSubmitButton = (e) => {
        e.preventDefault()

        if (!answer) {
            setShowError(false);
            return
        }
        console.log("want to submit answer to" + id + "," + eventId + "," + answer)
        handleSubmit(id, answer)
    }
    return (
        <div class="communityBox__question">
            <h3 class="communityBox__title">{`Q${currentIndex+1}. ${question}`}</h3>
            <form onSubmit={handleSubmitButton}>
                <ul class="communityBox__options">
                    {
                        options.map(option => (
                            <li key={`option-${option.id}`}>
                                <label key={`checkbox-${option.id}`} class="custom-checkbox3">{option.value}<input type="radio" name={option.id}
                                    checked={!answer ? false : option.id === answer.id}
                                    onChange={(e) => {
                                        setShowError(false)
                                        setAnswer(option)
                                    }}
                                    disabled={checkIfAlreadyAnswered === null ? false : true} />
                                    <span class="custom-checkbox3__icon icon-tick"></span>
                                </label>
                            </li>
                        ))
                    }

                </ul>
                {
                    showError &&
                    <>
                        <span style={{ color: 'red', marginBottom: '0.75rem' }}>* Please give some response first, to submit.</span><br></br>
                    </>
                }
                <button type="submit" class="btn btn-secondary mg-t5" disabled={checkIfAlreadyAnswered === null ? false : true}>{`${checkIfAlreadyAnswered === null ? 'Submit' : 'Answered'}`}</button>
            </form>
        </div >
    )
}
