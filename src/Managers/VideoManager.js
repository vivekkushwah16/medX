import {
  EVENT_COLLECTION,
  LIKES_COLLECTION,
  VIDEO_COLLECTION,
  MEDIAMETADATA_COLLECTION,
} from "../AppConstants/CollectionConstants";
import { videoSortFilter } from "../AppConstants/Filter";
import { LikeType, MediaType } from "../AppConstants/TypeConstant";
import firebase, { firestore } from "../Firebase/firebase";
var uniqid = require("uniqid");

// videoTimestamp = [{time:'', title:''}]
//speakers = ['speakersId1',]
const VideoManager = {
  addVideo: (
    title,
    description,
    videoUrl,
    thumnailUrl,
    speakers = [],
    tags = [],
    videoTimestamp = [],
    band
  ) => {
    return new Promise(async (res, rej) => {
      try {
        let eventId = uniqid("video-");
        let smallTag = tags.map((t) => t.toLowerCase());
        await firestore.collection(VIDEO_COLLECTION).doc(eventId).set({
          title,
          description,
          thumnailUrl,
          videoUrl,
          likes: 0,
          views: 0,
          videoTimestamp: videoTimestamp,
          id: eventId,
          tags: smallTag,
          speakers: speakers,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          band: band,
        });
        res(eventId);
      } catch (error) {
        rej(error);
      }
    });
  },
  updateVideoTimeline: (videoId, videoTimestamp = {}) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No videoID Found",
            };
            throw err;
          }
          let oldData = doc.data();
          // console.log(oldData.videoTimestamp)
          var arrayz = [];
          if (oldData.videoTimestamp) arrayz = oldData.videoTimestamp;

          arrayz.push(videoTimestamp);
          transcation.update(docRef, {
            videoTimestamp: videoTimestamp ? arrayz : oldData.videoTimestamp,
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  completelyUpdateVideo: (
    videoId,
    title = null,
    description = null,
    videoUrl = null,
    thumnailUrl = null,
    speakers = [],
    tags = [],
    videoTimestamp = [],
    band = null
  ) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No videoID Found",
            };
            throw err;
          }
          let oldData = doc.data();
          transcation.update(docRef, {
            title: title ? title : oldData.title,
            description: description ? description : oldData.description,
            videoUrl: videoUrl ? videoUrl : oldData.videoUrl,
            speakers: speakers ? speakers : oldData.speakers,
            tags: tags ? tags : oldData.tags,
            thumnailUrl: thumnailUrl ? thumnailUrl : oldData.thumnailUrl,
            band: band ? band : oldData.band,
            videoTimestamp: videoTimestamp
              ? videoTimestamp
              : oldData.videoTimestamp,
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },

  updateVideo: (videoId, title = null, description = null, videoUrl = null) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No videoID Found",
            };
            throw err;
          }
          let oldData = doc.data();
          transcation.update(docRef, {
            title: title ? title : oldData.title,
            description: description ? description : oldData.description,
            videoUrl: videoUrl ? videoUrl : oldData.videoUrl,
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  addVideoSpeaker: (videoId, speakerId) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No videoID Found",
            };
            throw err;
          }
          transcation.update(docRef, {
            speakers: firebase.firestore.FieldValue.arrayUnion(speakerId),
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  removeVideoSpeaker: (videoId, speakerId) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No videoID Found",
            };
            throw err;
          }
          transcation.update(docRef, {
            speakers: firebase.firestore.FieldValue.arrayRemove(speakerId),
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  addLike: (videoId, userId) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        const LikeRef = firestore
          .collection(LIKES_COLLECTION)
          .doc(`${userId}+${videoId}`);
        let id = uniqid("like-");
        const like = await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          let likeDoc = await transcation.get(LikeRef);
          if (likeDoc.exists) {
            let err = {
              code: "AlreadyLiked",
              message: "This Time has ALready Been Liked",
            };
            throw err;
          }
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No EventId Found",
            };
            throw err;
          }
          transcation.set(LikeRef, {
            id: id,
            targetId: videoId,
            type: LikeType.VIDEO_LIKE,
            user: userId,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().getTime(),
          });
          transcation.update(docRef, {
            likes: firebase.firestore.FieldValue.increment(1),
          });

          return doc.data().likes ? doc.data().likes + 1 : 1;
        });
        res(like);
      } catch (error) {
        rej(error);
      }
    });
  },
  removeLike: (videoId, userId) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        const LikeRef = firestore
          .collection(LIKES_COLLECTION)
          .doc(`${userId}+${videoId}`);
        const count = await firestore.runTransaction(async (transcation) => {
          let likeDoc = await transcation.get(LikeRef);
          if (!likeDoc.exists) {
            let err = {
              code: "NoSuchLikeFound",
              message: "NoSuchLikeFound",
            };
            throw err;
          }
          let videoDoc = await transcation.get(LikeRef);
          let mainDoc = await transcation.get(docRef);
          transcation.delete(LikeRef);
          transcation.update(docRef, {
            likes: firebase.firestore.FieldValue.increment(-1),
          });
          // console.log(mainDoc.data())
          return mainDoc.data().likes ? mainDoc.data().likes - 1 : 0;
        });
        res(count);
      } catch (error) {
        rej(error);
      }
    });
  },
  addView: (videoId) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        const views = await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No Video with ID Found",
            };
            throw err;
          }
          transcation.update(docRef, {
            views: firebase.firestore.FieldValue.increment(1),
          });
          return doc.data().views + 1;
        });
        res(views);
      } catch (error) {
        rej(error);
      }
    });
  },
  addTag: (videoId, tag) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(ref);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No EventId Found",
            };
            throw err;
          }
          transcation.update(ref, {
            tags: firebase.firestore.FieldValue.arrayUnion(tag.toLowerCase()),
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  removeTag: (videoId, tag) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(EVENT_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(ref);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No EventId Found",
            };
            throw err;
          }
          transcation.update(ref, {
            tags: firebase.firestore.FieldValue.arrayRemove(tag.toLowerCase()),
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  updateVideoTimestamp: (videoId, videoTimestamp) => {
    return new Promise(async (res, rej) => {
      try {
        const docRef = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(docRef);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No videoID Found",
            };
            throw err;
          }
          transcation.update(docRef, {
            videoTimestamp: videoTimestamp,
          });
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  getVideoWithTag: (
    tag = [],
    limit = 75,
    docRefToStartFrom = null,
    filter = videoSortFilter.date,
    filterWithViews = false
  ) => {
    return new Promise(async (res, rej) => {
      try {
        let docRef = firestore.collection(VIDEO_COLLECTION);
        const lowerCasedTag = tag.map((t) => t.toLowerCase());
        console.log("xxxxxxxx", lowerCasedTag)
        if (lowerCasedTag.length > 0) {
          docRef = docRef.where("tags", "array-contains-any", lowerCasedTag).orderBy("timestamp");
          //.orderBy('tags');
        } else {
          console.log(filter)
          switch (filter) {
            case videoSortFilter.date:
              docRef = docRef.orderBy("timestamp");
              break;
            case videoSortFilter.AtoZ:
              docRef = docRef.orderBy("name", "asc");
              break;
            case videoSortFilter.ZtoA:
              docRef = docRef.orderBy("name", "desc");
              break;
            default:
              docRef = docRef.orderBy("timestamp");
          }
        }
        if (filterWithViews) {
          docRef = docRef.orderBy("views", "desc")
        }

        if (docRefToStartFrom !== null)
          docRef = docRef.startAfter(docRefToStartFrom);

        docRef = docRef.limit(limit);
        const query = await docRef.get();
        // console.log(query)

        if (query.empty) {
          res([]);
        }
        let _data = [];
        query.docs.forEach((doc) => {
          _data.push(doc.data());
        });
        res(_data);
      } catch (error) {
        rej(error);
      }
    });
  },
  getVideoWithId: (videoId) => {
    return new Promise(async (res, rej) => {
      try {
        const ref = firestore.collection(VIDEO_COLLECTION).doc(videoId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(ref);
          if (!doc.exists) {
            let err = {
              code: "NotValidId",
              message: "No VideoId Found",
            };
            throw err;
          }
          res(doc.data());
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },
  setVideoLastKnownTimestamp: (
    videoId,
    userId,
    lastKnownTimestamp,
    duration
  ) => {
    return new Promise(async (res, rej) => {
      try {
        let docId = `${videoId}_${userId}`;
        const ref = firestore.collection(MEDIAMETADATA_COLLECTION).doc(docId);
        await firestore.runTransaction(async (transcation) => {
          let doc = await transcation.get(ref);
          let _data = {
            videoId: videoId,
            userId: userId,
            type: MediaType.VIDEO_MEDIA,
            lastKnownTimestamp: lastKnownTimestamp,
            duration: duration,
          };

          if (!doc.exists) {
            transcation.set(ref, _data);
          } else {
            transcation.update(ref, _data);
          }
          res(doc.data());
        });
        res();
      } catch (error) {
        rej(error);
      }
    });
  },

  getLatestVideos: ({ limit }) => {
    return new Promise(async (res, rej) => {
      try {
        let docRef = firestore.collection(VIDEO_COLLECTION).orderBy("timestamp", "desc")
        if (limit)
          docRef = docRef.limit(limit);

        const query = await docRef.get();
        // console.log(query)

        if (query.empty) {
          res([]);
        }
        let _data = [];
        query.docs.forEach((doc) => {
          _data.push(doc.data());
        });
        res(_data);
      } catch (error) {
        rej(error);
      }
    });
  },
  getTrendingVideos: ({ limit }) => {
    return new Promise(async (res, rej) => {
      try {
        let docRef = firestore.collection(VIDEO_COLLECTION).orderBy("views", "desc")
        if (limit)
          docRef = docRef.limit(limit);

        const query = await docRef.get();
        // console.log(query)

        if (query.empty) {
          res([]);
        }
        let _data = [];
        query.docs.forEach((doc) => {
          _data.push(doc.data());
        });
        res(_data);
      } catch (error) {
        rej(error);
      }
    });
  },
  getBasicRecommendedVideos: (intersetedTags = [], tagsToFetch = 3, limit = 10) => {
    return new Promise(async (res, rej) => {
      try {
        let mainTags = intersetedTags
        if (intersetedTags.length > 3) {
          mainTags = getRandomElementFromArray(mainTags, tagsToFetch)
        }
        let _data = [];
        for (let i = 0; i < mainTags.length; i++) {
          let a = await VideoManager.getVideoWithTag([mainTags[i]], Math.floor(limit / mainTags.length), null, null, true);
          _data = [..._data, ...a]
        }

        res(_data);
      } catch (error) {
        rej(error);
      }
    });
  }

};

function getRandomElementFromArray(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default VideoManager;
