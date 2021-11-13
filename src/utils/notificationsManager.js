import {
  NOTIFICATION_INTERACTED,
  NOTIFICATION_RECEIVED,
} from "../AppConstants/AnalyticsEventName";

const dbName = "notifications";
const version = 3;

const getIndexDB = () => {
  return (
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB
  );
};

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
};

const getEventRegisteredStoreSession = (
  tableName = "event_registered",
  callback
) => {
  let indb = getIndexDB();
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  }
  var db = null;
  var request = indb.open(dbName, version);
  request.onupgradeneeded = (event) => {
    // console.log("request.onupgradeneeded");
    db = event.target.result;
    createStores(event);
  };

  request.onsuccess = (event) => {
    // console.log("session start");
    let db = event.target.result;
    event.target.result.onversionchange = function (e) {
      if (e.newVersion === null) {
        // An attempt is made to delete the db
        e.target.close(); // Manually close our connection to the db
      }
    };
    let transcation = db.transaction([tableName], "readwrite");
    if (callback) {
      callback(event, request, transcation);
    }
  };
};

export const getAllNotifications = (tableName, cb) => {
  let indb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  let allData = null;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    var db = null;
    var request = indb.open(dbName, version);
    request.onupgradeneeded = (event) => {
      //abort the transcation if table doesn't exists
      // event.target.transaction.abort();
      db = event.target.result;
      createStores(event);
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      if (db.objectStoreNames.length > 0) {
        const txt = db.transaction(tableName, "readonly");
        const notificationStore = txt.objectStore(tableName).getAll();

        notificationStore.onsuccess = (event) => {
          // console.log("request.onsuccess");
          allData = event.target.result;
          request.result.close();
          cb(allData);
        };
        notificationStore.onerror = (event) => {
          console.log("error in getting notification from db", event);
          cb(null);
        };
      }
      request.result.close();
    };

    request.onerror = (event) => {
      // Do something with request.errorCode!
      console.log("Why didn't you allow my web app to use IndexedDB?!", event);
      cb(null);
    };
  }
};

export const addNewNotificationToIDB = (tableName, data, cb) => {
  let indb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    var db = null;
    var request = indb.open(dbName, version);

    request.onupgradeneeded = (event) => {
      // console.log("request.onupgradeneeded");
      db = event.target.result;
      createStores(event);
    };

    request.onsuccess = (event) => {
      // console.log("request.onsuccess");

      db = event.target.result;
      // console.log(db);
      event.target.result.onversionchange = function (e) {
        if (e.newVersion === null) {
          // An attempt is made to delete the db
          e.target.close(); // Manually close our connection to the db
        }
      };
      let tx = db.transaction([tableName], "readwrite");
      const store = tx.objectStore(tableName);
      store.add(data);
      request.result.close();
      cb(true);
    };

    request.onerror = (event) => {
      console.log("request.onerror");
      // Do something with request.errorCode!
      console.log("Why didn't you allow my web app to use IndexedDB?!", event);
      cb(false);
    };
  }
};

export const updateNotification = (newData, cb) => {
  let indb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
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

      const tx = db.transaction(["user_notification"], "readwrite");

      const store = tx.objectStore("user_notification");
      store.put(newData);
      request.result.close();
      cb(true);
    };

    request.onerror = (event) => {
      // Do something with request.errorCode!
      console.log("Why didn't you allow my web app to use IndexedDB?!", event);
      cb(null);
    };
  }
};

export const removeNotification = (id, cb) => {
  let indb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
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

      const tx = db.transaction(["user_notification"], "readwrite");

      const store = tx.objectStore("user_notification");
      store.delete(id);
      request.result.close();
      cb(true);
    };

    request.onerror = (event) => {
      // Do something with request.errorCode!
      console.log("Why didn't you allow my web app to use IndexedDB?!", event);
      cb(null);
    };
  }
};

export const getClickNotificationFromDB = (
  tableName = "clicked_notification",
  addGAWithUserInfo,
  cb
) => {
  let indb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  let allData = null;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    var db = null;
    var request = indb.open(dbName, version);

    request.onupgradeneeded = (event) => {
      event.target.transaction.abort();
    };

    request.onsuccess = (event) => {
      // console.log("request.onsuccess");
      db = event.target.result;
      event.target.result.onversionchange = function (e) {
        if (e.newVersion === null) {
          // An attempt is made to delete the db
          e.target.close(); // Manually close our connection to the db
        }
      };
      let txt = db.transaction([tableName], "readwrite");
      const notificationStore = txt.objectStore(tableName).getAll();
      notificationStore.onsuccess = (event) => {
        // console.log("request.onsuccess");
        allData = event.target.result;

        if (tableName === "clicked_notification") {
          allData.map((data) => {
            if (data.opened) {
              addGAWithUserInfo(NOTIFICATION_INTERACTED, {
                msg_id: data.id || data.title,
                title: data.title,
                topic: data.topic,
                mode: "BACKGROUND_NOTIFICATION",
              });
            }
            txt.objectStore(tableName).clear();
            // console.log("CLICKED_NOTIFICATION_TABLE", data);
          });
        }
        if (tableName === "new_notification") {
          allData.map((data) => {
            addGAWithUserInfo(NOTIFICATION_RECEIVED, {
              msg_id: data.id || data.title,
              title: data.title,
              topic: data.topic,
              mode: "BACKGROUND_NOTIFICATION",
            });
            txt.objectStore(tableName).clear();
          });
        }

        request.result.close();
        cb(allData);
      };
      notificationStore.onerror = (event) => {
        console.log("error in getting notification from db", event);
        request.result.close();
        cb(null);
      };
    };

    request.onerror = (event) => {
      console.log("request.onerror");
      // Do something with request.errorCode!
      console.log("Why didn't you allow my web app to use IndexedDB?!", event);
      request.result.close();
      cb(allData);
    };
  }
};

export const addToEventRegistered_IndexDB = (eventNames = []) => {
  let tableName = "event_registered";
  getEventRegisteredStoreSession(tableName, (event, request, transcation) => {
    const store = transcation.objectStore(tableName);
    //data => { id: eventId, status: true}
    eventNames.forEach((data) => {
      let addrequest = store.add(data);
      addrequest.onerror = function (event) {
        if (event.target.error.name === "ConstraintError") {
          event.preventDefault();
        }
        // console.log(event, '< -- onerror')
      };
      addrequest.onsuccess = function (event) {
        // console.log(addrequest, "< -- addded");
      };
    });
    request.result.close();
  });
};

export const checkIfEventIsRegistered_IndexDB = (eventId, cb) => {
  let tableName = "event_registered";
  getEventRegisteredStoreSession(tableName, (event, request, transcation) => {
    const store = transcation.objectStore(tableName);
    let getRequest = store.get(eventId);
    getRequest.onerror = function (event) {
      console.log("reading error", event.target.error);
      if (cb) {
        cb(false);
      }
    };
    getRequest.onsuccess = function (event) {
      if (event.target.result) {
        // console.log("reading onsuccess", event.target.result)
        if (cb) {
          cb(true);
        }
      } else {
        if (cb) {
          cb(false);
        }
      }
    };
    request.result.close();
  });
};

