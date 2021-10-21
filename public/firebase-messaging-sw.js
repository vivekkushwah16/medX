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

messaging.onBackgroundMessage((payload) => {
  let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    const dbName = "notifications";
    const version = 2;
    createIndexDb(dbName, version, payload);
  }

  if (payload) {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Customize notification here

    // navigator.customNotification = payload;
    let payl = payload;
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

    self.addEventListener("notificationclick", function (event) {
      //---access data from event using event.notification.data---
      console.log("object", event);
      console.log("On notification click: ", event.notification.data);
      var url = payl.data.link;

      // onclick handle

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
      updateNotification(newData, (res) => {
        console.log("updated", res);
      });

      //---close the notification---
      event.notification.close();

      // after clicking the notification---
      event.waitUntil(clients.openWindow(url));
    });

    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  }
});

function createIndexDb(name, version, payload) {
  let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;

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

  var db = null;
  var request = indb.open(name, version);

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

    const tx = db.transaction("new_notification", "readwrite");

    const uNotifications = tx.objectStore("new_notification");
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
  };
}

const updateNotification = (newData, cb) => {
  let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
  if (!indb) {
    console.log(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
  } else {
    var db = null;
    var request = indb.open("notifications", 2);



    request.onsuccess = (event) => {
      db = event.target.result;

      event.target.result.onversionchange = function (e) {
        if (e.newVersion === null) {
          // An attempt is made to delete the db
          e.target.close(); // Manually close our connection to the db
        }
      };

      const tx = db.transaction(["new_notification"], "readwrite");

      const store = tx.objectStore("new_notification");
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
