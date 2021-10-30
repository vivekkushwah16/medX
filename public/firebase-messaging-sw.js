importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBjSPRUgzyQhITpWHb9FdzMMuLS45Zsd9s",
  authDomain: "cipla-impact.firebaseapp.com",
  databaseURL: "https://cipla-impact-default-rtdb.firebaseio.com",
  projectId: "cipla-impact",
  storageBucket: "cipla-impact.appspot.com",
  messagingSenderId: "1009487366735",
  appId: "1:1009487366735:web:1d55b85d23d818bcac383a",
  measurementId: "G-JJY7JWKTV3",
});

const messaging = firebase.messaging();

const dbName = "notifications";
const version = 3;
const notificationType_registration = 'registration'

messaging.onBackgroundMessage((payload) => {
  let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    // createIndexDb(payload);

    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Customize notification here

    // navigator.customNotification = payload;
    let payl = payload;

    const showNotification = () => {
      // payload.fcmOptions.click_action= "https://www.ciplamedx.com?topic=ankur1"
      const notificationTitle = payl.data.title;
      const notificationOptions = {
        body: payl.data.body,
        icon: payl.data.icon,
        image: payl.data.image,
        // actions: [
        //   {
        //     action: "https://www.google.com",
        //     title: "Accept",
        //     icon: payl.data.icon,
        //   },
        //   {
        //     action: "https://www.google.com",
        //     title: "Reject",
        //     icon: payl.data.icon,
        //   },
        // ],
      };

      // for getting all notificications
      // self.registration
      //   .getNotifications(notificationOptions)
      //   .then(function (notifications) {
      //     // do something with your notifications
      //     console.log("all notifications", notifications);
      //   });
      let data = {
        id: payload.data.msg_id,
        title: payload.data.title,
        body: payload.data.body,
        icon: payload.data.icon,
        link: payload.data.link,
        topic: payload.data.topic,
        date: new Date(),
        opened: false,
      };
      let newData = {
        id: payl.data.msg_id,
        title: payl.data.title,
        body: payl.data.body,
        link: payl.data.link,
        icon: payl.data.icon,
        topic: payl.data.topic,
        date: new Date(),
        opened: true,
      };
      addNotificationToIDB("new_notification", data, (res) => {
        console.log("updated new_notification-------------", res);
      });
      addNotificationToIDB("user_notification", data, (res) => {
        console.log("updated user_notification------------", res);
      });

      // self.addEventListener("notificationclick", function (event) {
      //   //---access data from event using event.notification.data---
      //   console.log("object", event);
      //   console.log("On notification click: ", event.notification.data);
      //   var url = payl.data.link;

      //   // onclick handle

      //   //---close the notification---
      //   event.notification.close();
      //   updateNotificationToIDB("clicked_notification", newData, (res) => {
      //     console.log("updated", res);
      //   });
      //   updateNotificationToIDB("user_notification", newData, (res) => {
      //     console.log("updated", res);
      //   });
      //   // after clicking the notification---
      //   event.waitUntil(clients.openWindow(url));
      // });

      self.addEventListener("notificationclick", function (event) {
        console.log("On notification click: ", event.notification.tag);
        updateNotificationToIDB("clicked_notification", newData, (res) => {
          console.log("updated", res);
        });
        updateNotificationToIDB("user_notification", newData, (res) => {
          console.log("updated", res);
        });
        event.notification.close();

        const urlToOpen = new URL(payl.data.link, self.location.origin).href;
        let newURL = urlToOpen.split("//")[1].split("/")[0];
        // This looks to see if the current is already open and
        // focuses if it is
        event.waitUntil(
          clients
            .matchAll({
              type: "window",
              includeUncontrolled: true,
            })
            .then(function (clientList) {
              console.log("clientList", clientList);
              let matchingClient = null;
              for (var i = 0; i < clientList.length; i++) {
                console.log("matchingClient", matchingClient);
                var client = clientList[i];
                console.log(
                  "client.url",
                  client.url.split("//")[1].split("/")[0]
                );
                if (
                  client.url.split("//")[1].split("/")[0] == newURL &&
                  "focused" in client
                ) {
                  matchingClient = client;
                  break;
                }
              }
              if (matchingClient) {
                matchingClient.url = urlToOpen;
                return matchingClient.focus();
              } else {
                return clients.openWindow(urlToOpen);
              }
            })
        );
      });

      return self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    }
    if (payload.type === notificationType_registration && payload.eventId) {
      checkIfEventIsRegistered_IndexDB(payload.eventId, (registered) => {
        if (!registered) {
          showNotification()
        }
      })
    } else {
      showNotification()
    }
  }
});

function addNotificationToIDB(tableName, data, cb) {
  let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;

  var db = null;
  var request = indb.open(dbName, version);

  request.onerror = (event) => {
    // Do something with request.errorCode!
    console.log("Why didn't you allow my web app to use IndexedDB?!", event);
  };

  request.onsuccess = (event) => {
    db = event.target.result;

    event.target.result.onversionchange = function (e) {
      if (e.newVersion === null) {
        // An attempt is made to delete the db
        e.target.close(); // Manually close our connection to the db
      }
    };

    const tx = db.transaction(tableName, "readwrite");

    const uNotifications = tx.objectStore(tableName);
    uNotifications.add(data);

    request.result.close();
  };

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    console.log("object", db);
    db.createObjectStore("user_notification", {
      keyPath: "id",
    });
    db.createObjectStore("new_notification", {
      keyPath: "id",
    });
    db.createObjectStore("clicked_notification", {
      keyPath: "id",
    });
  };
}

const updateNotificationToIDB = (tableName, newData, cb) => {
  let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    var db = null;
    var request = indb.open(dbName, version);

    request.onsuccess = (event) => {
      db = event.target.result;

      event.target.result.onversionchange = function (e) {
        if (e.newVersion === null) {
          // An attempt is made to delete the db
          e.target.close(); // Manually close our connection to the db
        }
      };

      const tx = db.transaction([tableName], "readwrite");

      const store = tx.objectStore(tableName);
      store.put(newData);
      request.result.close();
      cb(true);
    };

    request.onupgradeneeded = (event) => {
      event.target.transaction.abort();
    };

    request.onerror = (event) => {
      // Do something with request.errorCode!
      console.log("Why didn't you allow my web app to use IndexedDB?!", event);
      cb(null);
    };
  }
};

// const addNotificationToIDB = (tableName = "new_notification", newData, cb) => {
//   let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
//   if (!indb) {
//     console.log(
//       "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
//     );
//   } else {
//     var db = null;
//     var request = indb.open(dbName, version);
//     request.onsuccess = (event) => {
//       db = event.target.result;

//       event.target.result.onversionchange = function (e) {
//         if (e.newVersion === null) {
//           // An attempt is made to delete the db
//           e.target.close(); // Manually close our connection to the db
//         }
//       };

//       const tx = db.transaction([tableName], "readwrite");

//       const store = tx.objectStore(tableName);
//       store.put(newData);
//       request.result.close();
//       cb(true);
//     };

//     request.onupgradeneeded = (event) => {
//       event.target.transaction.abort();
//     };

//     request.onerror = (event) => {
//       // Do something with request.errorCode!
//       console.log("Why didn't you allow my web app to use IndexedDB?!", event);
//       cb(null);
//     };
//   }
// };


const getIndexDB = () => {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
}

const createStores = (event) => {
  let db = event.target.result;
  var oldVersion = event.oldVersion;
  var newVersion = event.newVersion;
  if (oldVersion < 2) {
    db.createObjectStore("user_notification", {
      keyPath: "id",
    });
    db.createObjectStore("new_notification", {
      keyPath: "id",
    });
    db.createObjectStore("clicked_notification", {
      keyPath: "id",
    });
  }
  if (oldVersion < 3) {
    let erStore = db.createObjectStore("event_registered", {
      keyPath: "id",
    });
    erStore.createIndex("id", "id", { unique: true });
  }
}

const getEventRegisteredStoreSession = (tableName = "event_registered", callback) => {
  let indb = getIndexDB()
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  }
  var db = null;
  var request = indb.open(dbName, version);
  request.onupgradeneeded = (event) => {
    console.log("request.onupgradeneeded");
    db = event.target.result;
    createStores(event)
  };

  request.onsuccess = (event) => {
    console.log("session start");
    let db = event.target.result;
    event.target.result.onversionchange = function (e) {
      if (e.newVersion === null) {
        // An attempt is made to delete the db
        e.target.close(); // Manually close our connection to the db
      }
    };
    let transcation = db.transaction([tableName], "readwrite");
    if (callback) {
      callback(event, request, transcation)
    }
  };
}


const checkIfEventIsRegistered_IndexDB = (eventId, cb) => {
  let tableName = 'event_registered'
  getEventRegisteredStoreSession(tableName, (event, request, transcation) => {
    const store = transcation.objectStore(tableName);
    let getRequest = store.get(eventId)
    getRequest.onerror = function (event) {
      console.log("reading error", event.target.error)
      if (cb) {
        cb(false)
      }
    };
    getRequest.onsuccess = function (event) {
      if (event.target.result) {
        // console.log("reading onsuccess", event.target.result)
        if (cb) {
          cb(true)
        }
      } else {
        if (cb) {
          cb(false)
        }
      }
    };
    request.result.close();
  })
}