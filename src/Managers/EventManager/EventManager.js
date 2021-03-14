import { EVENT_COLLECTION } from "../../AppConstants/CollectionConstants";
import firebase, { firestore } from "../../Firebase/firebase";
var uniqid = require('uniqid');

const EventManager = {
    addEvent: (title, description, videoUrl) => {
        return new Promise(async (res, rej) => {
            try {
                let eventId = uniqid('event-')
                await firestore.collection(EVENT_COLLECTION).doc(eventId).set({
                    title,
                    description,
                    videoUrl,
                    id: eventId,
                })
                res();
            } catch (error) {
                rej(error)
            }
        })
    },
    updateEvent: (title, description, videoId) => {

    },
    addEventTimeLine: () => {

    },
    updateEventTimeLine: () => {

    },
    addEventSpeaker: () => {

    },
    removeEventSpeaker: () => {

    }
}

export default EventManager;