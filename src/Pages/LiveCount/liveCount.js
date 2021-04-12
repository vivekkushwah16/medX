import React, { useState, useEffect } from 'react'
import Header from '../../Containers/Header/Header';
import { database } from '../../Firebase/firebase'
import './LiveCount.css'

const timeOffset = 1;

export default function LiveCount() {
    const [data, setData] = useState(null)
    const [stateWiseData, setStateWiseData] = useState(null)

    useEffect(() => {
        getData()
        setInterval(() => {
            getData();
        }, 180000)
    }, [])


    const getData = () => {
        let date_obj = new Date();
        let dateString = `${date_obj.getDate()}-${date_obj.getMonth() + 1}-${date_obj.getFullYear()}`
        console.log(dateString)
        database.ref(`/userStatus/${dateString}/`).once('value', (query) => {
            if (!query.exists()) {
                console.log("No Data")
            }
            const data = query.val()
            const currTime = new Date().getTime()
            let newData = {}
            let stateData = {}
            if (!data) {
                setData(null)
                return
            }
            Object.keys(data).forEach(key => {
                let _currData = data[key]
                let restTime = currTime - _currData.timestamp
                if (restTime < timeOffset * 60 * 1000) {
                    newData = {
                        ...newData,
                        [key]: data[key]
                    }
                    let userState = data[key].state
                    stateData = {
                        ...stateData,
                        [userState]: stateData.hasOwnProperty(userState) ? stateData[userState] + 1 : 1
                    }
                }
            })
            setStateWiseData(Object.keys(stateData).length > 0 ? stateData : null)
            setData(newData)
        }, err => console.log(err))
    }

    return (
        <div className="LiveCountContainer">
            <div className="eventBoxBg"></div>
            <Header />
            <div className="container">
                <div className="LiveCountContainer_header">
                    <span>
                        <h2>
                            Live Count: {data ? Object.keys(data).length : 0}
                        </h2>
                    (autoupdate in 3 min)
                    </span>
                    <button className="btn btn-secondary" onClick={(event) => {
                        if (event) { event.preventDefault() }
                        getData()
                    }} >Force Update</button>
                </div>
                <div className="LiveCountContainer_body">

                    <table id="customers">
                        <tr>
                            <th>State</th>
                            <th>Count</th>
                        </tr>
                        {
                            stateWiseData ?
                                Object.keys(stateWiseData).map(state => (
                                    <tr>
                                        <td>{state}</td>
                                        <td>{stateWiseData[state]}</td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td>No Data</td>
                                    <td>0</td>
                                </tr>
                        }
                    </table>

                </div>
            </div>
        </div>
    )
}
