import React, { useContext, useEffect, useState } from 'react'
import { POLL_STATES } from '../../AppConstants/PollStates'
import { PollQuestion, PollResult } from '../../Components/Poll'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { PollManager } from '../../Managers/PollManager'

export default function PollContainer(props) {
    const { id: eventId } = props
    const { user } = useContext(UserContext)
    const [pollAnswerredData, setPollAnswerredData] = useState({})
    const [pollData, setPollData] = useState(null)

    useEffect(() => {
        PollManager.attachPollListener(eventId, (data, err) => {
            if (err) {
                console.log(err)
                return
            }
            data.sort(function (a, b) { return a.index - b.index });
            setPollData(data)
            getAllPollAnsweredDataForCurrentUser(data)
        })
        return () => {
            PollManager.removePollListener()
        }
    }, [])

    const submitResponse = (pollId, option) => {
        return new Promise(async (res, rej) => {
            try {
                await PollManager.addResponse(eventId, pollId, user.uid, option)
                setPollAnswerredData({ ...pollAnswerredData, [pollId]: option })
                res()
            } catch (error) {
                rej(error)
            }
        })
    }

    const getAllPollAnsweredDataForCurrentUser = async (data) => {
        if (data.length > 0) {
            let _pollAnswerredData = {}
            for (let i = 0; i < data.length; i++) {
                let res = await checkIfAlreadyAnswered(data[i].id)
                _pollAnswerredData =
                {
                    ..._pollAnswerredData,
                    [data[i].id]: res
                }
            }
            setPollAnswerredData(_pollAnswerredData)
        }
    }

    const checkIfAlreadyAnswered = (pollId) => {
        return new Promise(async (res, rej) => {
            try {
                const pollIds = Object.keys(pollAnswerredData)
                if (pollIds.indexOf(pollId) !== -1) {
                    console.log(pollIds[pollId])
                    res(pollIds[pollId])
                }
                const result = await PollManager.getPollResponse(pollId, user.uid)
                if (result) {
                    res(result)
                } else {
                    res(null)
                }
            } catch (error) {
                rej(error)
            }
        })

    }


    let visiblePollData = null
    if (pollData) {
        visiblePollData = pollData.filter(item => item.state !== POLL_STATES.hide) //pass index also
    }
    return (
        <>
            <h2 className="communityBox__title mg-b10">Polls</h2>
            <hr></hr>
            {
                !pollData &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="/assets/images/loader.gif" alt="loading" style={{ maxWidth: '1.5rem' }} />
                </div>
            }
            {
                visiblePollData &&
                visiblePollData.map((pollItem, index) => (
                    <>
                        {
                            pollItem.state === POLL_STATES.showQuestion &&
                            <PollQuestion data={pollItem} handleSubmit={submitResponse} checkIfAlreadyAnswered={pollAnswerredData[pollItem.id]} index={index} />
                        }
                        {
                            pollItem.state === POLL_STATES.showResult &&
                            <PollResult data={pollItem} index={index} />
                        }
                    </>
                ))
            }
        </>
    )
}
