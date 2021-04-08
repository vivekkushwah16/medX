import React, { useRef, useState } from 'react'
import XLSX from "xlsx";
import VideoManager from '../../Managers/VideoManager';

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
        const last = chunked_arr[chunked_arr.length - 1];
        if (!last || last.length === size) {
            chunked_arr.push([array[i]]);
        } else {
            last.push(array[i]);
        }
    }
    return chunked_arr;
}

async function getJsonFromExcel(selectedFile, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var data = event.target.result;
        var workbook = XLSX.read(data, {
            type: "binary"
        });
        workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[sheet]
            );
            callback(rowObject);
        });
    };
    fileReader.readAsBinaryString(selectedFile);
}

const singleBatchWaitTime = 4000
const batchCount = 15;
var callCounter = 0;

const ActionValues = {
    AddVideo: 'AddVideo'
}

const PossibleActions = [ActionValues.AddVideo]

const possibleVideoUrls = 'https://player.vimeo.com/video/534402864';// ['https://player.vimeo.com/video/534402864', 'https://vimeo.com/475824300/7b5d3d90a4', 'https://vimeo.com/475824300/7b5d3d90a4']

export default function Upload() {
    const [selectedFile, selectFile] = useState(null)
    const [inUse, setInUser] = useState(false)

    const inputRef = useRef(null)


    const processFakeCloudCall = async (object, callback) => {
        let processArray = []
        await asyncForEach(object, async (element) => {
            try {
                let tagArr = element.tags.split(',')
                let process = tagArr.map(tt => tt.trim())
                let url = possibleVideoUrls//possibleVideoUrls[Math.round(Math.random() * possibleVideoUrls.length)]
                console.log(element)
                console.log(url)
                const id = await VideoManager.addVideo(element.title, element.description, url, element.thumnailUrl, [], process, [], element.band)
                processArray.push(id)
            }
            catch (err) {
                console.log(err)
                processArray.push(err)
            }
        });
        console.log(processArray);
        if (callback) { callback() }
    }

    const processData = (data) => {
        processFakeCloudCall(data, () => {
            callCounter -= 1;
            if (callCounter === 0) {
                setInUser(false)
                selectFile(null)
                window.alert(JSON.stringify({
                    icon: "success",
                    title: "All the users has been added to the database.",
                }))
            }
        })
    }

    const takeAction = (event) => {
        if (event) { event.preventDefault() }
        if (selectedFile && !inUse) {
            setInUser(true)
            getJsonFromExcel(selectedFile, (excelData) => {
                callCounter = 0;
                if (excelData.length < batchCount) {
                    callCounter += 1;
                    processData(excelData);
                } else {
                    const newArray = chunk(excelData, batchCount);
                    var timer = singleBatchWaitTime;

                    newArray.forEach(array => {
                        callCounter += 1;
                        console.log(array.length, timer * (callCounter) / 1000, callCounter, timer);
                        setTimeout(() => {
                            processData(array);
                        }, timer * (callCounter));
                    });

                }
            })

        } else {
            console.log("wait for another task to get complete!!");
        }
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <form >
                <input type="file" id="fileUpload" accept=".xls,.xlsx"
                    onChange={(event) => {
                        selectFile(event.target.files[0])
                    }}
                    ref={inputRef} />
                <br></br>
                <br></br>

                <label for="action">Choose a Action:</label>
                <select name="action" id="action">
                    {
                        PossibleActions.map(action => (
                            <option value={action}>{action}</option>
                        ))
                    }
                </select>
                <br></br>
                <br></br>

                <button type="button" id="addUsers" onClick={(e) => takeAction(e)} disabled={inUse}>ProcessData</button>
            </form>
        </div>
    )
}
