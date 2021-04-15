import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useParam } from 'react-router-dom'
import { POLL_COLLECTION, PROFILE_COLLECTION } from '../../AppConstants/CollectionConstants'
import Header from '../../Containers/Header/Header'
import { database, firestore } from '../../Firebase/firebase'
import './QnaPage.css'


function SamplePageLayout(props) {
    return (
        < div className="SamplePageContainer" >
            <div className="eventBoxBg"></div>
            <Header />
            <div className="container SamplePageContainer_body">
                {props.children}
            </div>
        </div >
    )
}

function QnaMainView(props) {
    return (
        <SamplePageLayout>
            <div className="LiveCountContainer_body">
                <table id="customers">
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                        <th>Question</th>
                        <th>Time</th>
                    </tr>
                    <tr>
                        <td>Shubham</td>
                        <td>Kkr</td>
                        <td>Kkr hai kaha bhai ??</td>
                        <td>12 march, 2021 5:00OM</td>
                    </tr>
                </table>

            </div>
        </SamplePageLayout>
    )
}

var userRecord = {}
var timelineIdRecord = {}

export default function QnaPage(props) {
    const [data, setData] = useState(null);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            let eventId = 'event-kmde59n5'
            let docrRef = firestore.collection("qna").where("eventId", "==", eventId)//.orderBy("timestamp")
            await docrRef.onSnapshot(async real => {
                if (real.empty) {
                    console.log("Not found")
                }
                let newData = []
                for (let i = real.docs.length - 1; i > -1; i--) {
                    let doc = real.docs[i]
                    let _userData = doc.data()
                    let _userRecord = await getUserData(_userData.userId);
                    if (userRecord) {
                        newData.push({ ..._userData, firstName: _userRecord.firstName, lastName: _userRecord.lastName, state: _userRecord.state })
                    } else {
                        newData.push(_userData)
                    }
                }

                setData(newData)
            })

        } catch (error) {
            console.log(error)
        }
    }

    const getUserData = async (uid) => {
        return new Promise(async (res, rej) => {
            try {
                if (userRecord.hasOwnProperty(uid)) {
                    res(userRecord[uid])
                }
                const ref = firestore.collection(PROFILE_COLLECTION).doc(uid)
                const doc = await ref.get()
                if (!doc.exists) {
                    let error = { code: '404', mesage: "userNotFound" }
                    throw (error)
                }
                let _data = doc.data()
                userRecord = {
                    ...userRecord,
                    [uid]: _data
                }
                res(_data)
            } catch (error) {
                rej(error)
            }

        })
    }

    return (
        <>
            <SamplePageLayout>
                <div className="LiveCountContainer_body">
                    <table id="customers">
                        <tr key={`Quesstion-header`}>
                            <th key={`Quesstion-name`}>Name</th>
                            <th key={`Quesstion-state`}>State</th>
                            {/* <th key={`Quesstion-state`}>Timeline Id</th> */}
                            <th key={`Quesstion-quesiton`}>Question</th>
                            <th key={`Quesstion-time`}>Time</th>
                        </tr>
                        {
                            data &&
                            data.map(d => (
                                <>
                                    <tr key={`question-${d.userId}`}>
                                        <td key={`question-${d.userId}-name`} >{d.firstName}{d.lastName ? ' ' + d.lastName : ''}</td>
                                        <td key={`question-${d.userId}-state`}>{d.state}</td>
                                        {/* <td key={`question-${d.userId}-question`}>{d.timelineId}</td> */}
                                        <td key={`question-${d.userId}-question`}>{d.question}</td>
                                        <td key={`question-${d.userId}-time`}>{new Date(d.date).toLocaleString()}</td>
                                    </tr>
                                </>
                            ))
                        }
                    </table>

                </div>
            </SamplePageLayout>
        </>
    )
}
