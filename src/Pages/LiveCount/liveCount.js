import React, { useState } from 'react'
import { database } from '../../Firebase/firebase'

const timeOffset = 1;

export default function LiveCount() {
    const [data, setData] = useState(null)

    const getData = () => {
        let date_obj = new Date();
        let dateString = `${date_obj.getDate()}-${date_obj.getMonth() + 1}-${date_obj.getFullYear()}`
        console.log(dateString)
        database.ref(`/userStatus/11-4-2021/`).once('value', (query) => {
            if (!query.exists()) {
                console.log("No Data")
            }
            const data = query.val()
            const currTime = new Date().getTime()
            let newData = {}
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
                }
            })
            setData(newData)
        }, err => console.log(err))
    }

    return (
        <div>
            <div>
                Live Count: {data && Object.keys(data).length}
            </div>
            <button onClick={(event) => {
                if (event) { event.preventDefault() }
                getData()
            }} >Refresh</button>
        </div>
    )
}
