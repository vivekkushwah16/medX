// importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js");
// firebase.initializeApp({
//   apiKey: "AIzaSyBjSPRUgzyQhITpWHb9FdzMMuLS45Zsd9s",
//   authDomain: "cipla-impact.firebaseapp.com",
//   databaseURL: "https://cipla-impact-default-rtdb.firebaseio.com",
//   projectId: "cipla-impact",
//   storageBucket: "cipla-impact.appspot.com",
//   messagingSenderId: "1009487366735",
//   appId: "1:1009487366735:web:1d55b85d23d818bcac383a",
//   measurementId: "G-JJY7JWKTV3",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   // In the following line, you should include the prefixes of implementations you want to test.
// // let indb = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;
// // if (!indb) {
// //   console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
// // } else {
// //   var db;
// //   var request = window.indexedDB.open("notifications", 1);
// //   request.onerror = function(event) {
// //     // Do something with request.errorCode!
// //     console.log("Why didn't you allow my web app to use IndexedDB?!",event);
// //   };
// //   request.onsuccess = function(event) {
// //     db = event.target.result;
// //   };
// // }

//   // console.log("object",self)
//   // let notificationArray = JSON.parse(localStorage.getItem("notifications"))
//   //   ? JSON.parse(localStorage.getItem("notifications"))
//   //   : [];
//   // let data = {
//   //   id: payload.from,
//   //   title: payload.notification.title,
//   //   body: payload.notification.body,
//   //   // link: payload.notification.click_action,
//   //   date: new Date().toISOString,
//   //   opened: false,
//   // };
//   // notificationArray.unshift(data);
//   // localStorage.setItem("notifications", JSON.stringify(notificationArray));
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/logo192.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
