importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js");
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
  // let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
  // if (!indb) {
    // console.log(
      // "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    // );
  // } else {
    // var db;
    // var request = indb.open("notifications", 1);

    // const tx = db.transaction("user_notification","readwrite")
    // tx.objectStore("user_notification")
    // const 

    // request.onerror = (event) => {
      // Do something with request.errorCode!
      // console.log("Why didn't you allow my web app to use IndexedDB?!", event);
    // };

    // request.onsuccess = (event) => {
      // db = event.target.result;
    // };

    // request.onupgradeneeded = (rvent) => {
      // let data = {
        // id: "1",
        // title: "hi"
      // }
    //  const user_Notifications = db.createObjectStore("user_notification",{keyPath: "id"})
    // };
  // }

  // console.log("object",self)
  // let notificationArray = JSON.parse(localStorage.getItem("notifications"))
  //   ? JSON.parse(localStorage.getItem("notifications"))
  //   : [];
  // let data = {
  //   id: payload.from,
  //   title: payload.notification.title,
  //   body: payload.notification.body,
  //   // link: payload.notification.click_action,
  //   date: new Date().toISOString,
  //   opened: false,
  // };
  // notificationArray.unshift(data);
  // localStorage.setItem("notifications", JSON.stringify(notificationArray));
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here

  navigator.customNotification = payload;
  let payl = payload;
  // payload.fcmOptions.click_action= "https://www.ciplamedx.com?topic=ankur1"
  const notificationTitle = payl.notification.title;
  const notificationOptions = {
    body: payl.notification.body,
    icon: "/logo512.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.addEventListener("notificationclick", function (event) {
    //---access data from event using event.notification.data---
    console.log("object", event);
    console.log("On notification click: ", event.notification.data);
    var url = payl.data.link;

    //---close the notification---
    event.notification.close();

    //---open the app and navigate to breaking.html
    // after clicking the notification---
    event.waitUntil(clients.openWindow(url));
  });
});
