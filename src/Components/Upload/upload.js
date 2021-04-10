import React, { useEffect, useRef, useState } from 'react'
import XLSX from "xlsx";
import { SPEAKERS_COLLECTION, VIDEO_COLLECTION } from '../../AppConstants/CollectionConstants';
import firebase, { firestore } from '../../Firebase/firebase';
import SpeakerManager from '../../Managers/SpeakerManager';
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

const breakElement = '$';
const singleBatchWaitTime = 4000
const batchCount = 15;
var callCounter = 0;

const ActionValues = {
    AddVideo: 'AddVideo',
    UpdateVideo: 'UpdateVideo',
    AddSpeaker: 'AddSpeaker',
    UpdateSpeaker: 'UpdateSpeaker',
}

const PossibleActions = [ActionValues.AddVideo, ActionValues.UpdateVideo, ActionValues.AddSpeaker, ActionValues.UpdateSpeaker]

const possibleVideoUrls = 'https://player.vimeo.com/video/534402864';// ['https://player.vimeo.com/video/534402864', 'https://vimeo.com/475824300/7b5d3d90a4', 'https://vimeo.com/475824300/7b5d3d90a4']

export default function Upload() {
    const [selectedFile, selectFile] = useState(null)
    const [selectedAction, selectAction] = useState(0)
    const [inUse, setInUser] = useState(false)
    // const [videosArr, setVideosArr] = useState([])
    // const [speakersArr, setSpeakersArr] = useState([])

    const inputRef = useRef(null)

    useEffect(() => {

    }, [])

    // const getVideos = async () => {
    //     return new Promise(async(res, rej) => {
    //         try {
    //             let videos = [];
    //             const snapshot = await firestore.collection(VIDEO_COLLECTION).get()
    //             await snapshot.docs.map(doc => videos.push(doc.data()));
    //             exportVideosXLSX()
    //             // await setVideosArr(videos);
    //             res()
    //         } catch (error) {
    //             rej()
    //         }
    //     })
    // }


    // const getSpeakers = async () => {
    //     let speakers = [];
    //     const snapshot = await firestore.collection(SPEAKERS_COLLECTION).get()
    //     await snapshot.docs.map(doc => speakers.push(doc.data()));
    //     await setSpeakersArr(speakers);
    // }

    const exportVideosXLSX = async () => {
        let videosArr = [];
        const snapshot = await firestore.collection(VIDEO_COLLECTION).get()
        await snapshot.docs.map(doc => videosArr.push(doc.data()));
        let videoz = [["id", "title", "description", "speakers", "tags", "thumnailUrl", "videoUrl", "band"]]
        console.log(videosArr.length);
        videosArr.forEach((video) => {
            let speakers = "";
            video.speakers.forEach((speaker) => {
                speakers += speakers == "" ? speaker : breakElement + speaker;
            });

            let tags = "";
            video.tags.forEach((tag) => {
                tags += tags == "" ? tag : breakElement + tag;
            });
            let videoArray = [video.id, video.title, video.description, speakers, tags, video.thumnailUrl, video.videoUrl, video.band]
            videoz.push(videoArray)
        })
        const wb = XLSX.utils.book_new()
        const wsAll = XLSX.utils.aoa_to_sheet(videoz)

        XLSX.utils.book_append_sheet(wb, wsAll, "All Videos")
        XLSX.writeFile(wb, "export-allVideos.xlsx")

    }

    const exportSpeakersXLSX = async () => {
        let speakersArr = [];
        const snapshot = await firestore.collection(SPEAKERS_COLLECTION).get()
        await snapshot.docs.map(doc => speakersArr.push(doc.data()));

        let speakerz = [["id", "name", "designation", "photoURL", "profileLine", "social"]]
        speakersArr.forEach((speaker) => {
            let profileLine = "";
            speaker.profileLine.forEach((line) => {
                profileLine += profileLine == "" ? line : breakElement + line;
            });

            let social = "";
            Object.keys(speaker.social).forEach((ele) => {
                social += social == "" ? speaker.social[ele] : breakElement + speaker.social[ele];
            });

            let speakerArray = [speaker.id, speaker.name, speaker.designation, speaker.photoURL, profileLine, social]
            speakerz.push(speakerArray)
        })
        const wb = XLSX.utils.book_new()
        const wsAll = XLSX.utils.aoa_to_sheet(speakerz)

        XLSX.utils.book_append_sheet(wb, wsAll, "All Speakers")
        XLSX.writeFile(wb, "export-allSpeakers.xlsx")
    }

    const processAddVideos = async (object, callback) => {
        let processArray = []
        await asyncForEach(object, async (element) => {
            try {
                let tagArr = element.tags.split(breakElement)
                let processTagArr = tagArr.map(tt => tt.trim())

                let speakerArr = element.speakers.split(breakElement)
                let processedSpeakerArr = speakerArr.map(tt => tt.trim())
                const id = await VideoManager.addVideo(element.title, element.description, element.videoUrl, element.thumnailUrl, processedSpeakerArr, processTagArr, [], element.band)
                processArray.push(id)
            }
            catch (err) {
                console.log(err)
                processArray.push(err)
            }
        });
        console.log(processArray);
        await exportVideosXLSX();
        if (callback) { callback("All the videos have been added to the database.") }
    }

    const processUpdateVideos = async (object, callback) => {
        let processArray = []
        await asyncForEach(object, async (element) => {
            try {
                let tagArr = element.tags.split(breakElement)
                let processTagArr = tagArr.map(tt => tt.trim())

                let speakerArr = element.speakers.split(breakElement)
                let processedSpeakerArr = speakerArr.map(tt => tt.trim())
                const id = await VideoManager.completelyUpdateVideo(element.id, element.title, element.description, element.videoUrl, element.thumnailUrl, processedSpeakerArr, processTagArr, [], element.band)
                processArray.push(id)
            }
            catch (err) {
                console.log(err)
                processArray.push(err)
            }
        });
        console.log(processArray);
        await exportVideosXLSX();
        if (callback) { callback("The videos have been updated in the database.") }
    }

    const processAddSpeakers = async (object, callback) => {
        let processArray = []
        await asyncForEach(object, async (element) => {
            try {
                let arr = element.profileLine.split(breakElement)
                let processArr = arr.map(tt => tt.trim())
                const id = await SpeakerManager.makeSpeaker(element.name, element.designation, processArr, element.photoURL, {})
                processArray.push(id)
            }
            catch (err) {
                console.log(err)
                processArray.push(err)
            }
        });
        console.log(processArray);
        await exportSpeakersXLSX();
        if (callback) { callback("All the speakers have been added to the database.") }
    }

    const processUpdateSpeakers = async (object, callback) => {
        let processArray = []
        await asyncForEach(object, async (element) => {
            try {
                let arr = element.profileLine.split(breakElement)
                let processArr = arr.map(tt => tt.trim())

                const id = await SpeakerManager.completelyUpdateSpeaker(element.id, element.name, element.designation, processArr, element.photoURL, {})
                processArray.push(id)
            }
            catch (err) {
                console.log(err)
                processArray.push(err)
            }
        });
        console.log(processArray);
        await exportSpeakersXLSX();
        if (callback) { callback("The Speakers have been updated in the database.") }
    }

    const processData = (data) => {

        switch (selectedAction) {
            case 0:
                processAddVideos(data, handleCallback);
                break;
            case 1:
                processUpdateVideos(data, handleCallback);
                break;
            case 2:
                processAddSpeakers(data, handleCallback);
                break;
            case 3:
                processUpdateSpeakers(data, handleCallback);
                break;
        }

    }

    const handleCallback = (str) => {
        callCounter -= 1;
        if (callCounter === 0) {
            setInUser(false)
            selectFile(null)
            window.alert(JSON.stringify({
                icon: "success",
                title: str,
            }))
        }
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
                <select name="action" id="action" onChange={(event) => {
                    selectAction(event.target.options.selectedIndex);
                }}>
                    {
                        PossibleActions.map(action => (
                            <option value={action}>{action}</option>
                        ))
                    }
                </select>
                <br></br>
                <br></br>

                <button type="button" id="addUsers" onClick={(e) => takeAction(e)} disabled={inUse}>ProcessData</button>
                <br></br>
                <br></br>
                <br></br>
                <button type="button" id="addUsers" onClick={() => exportVideosXLSX()} disabled={inUse}>Download All Videos XLSX</button>
                <br></br>
                <br></br>
                <button type="button" id="addUsers" onClick={() => exportSpeakersXLSX()} disabled={inUse}>Download All Speakers XLSX</button>
            </form>
        </div>
    )
}
