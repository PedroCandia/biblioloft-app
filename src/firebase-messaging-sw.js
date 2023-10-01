importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');
//importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// firebase.initializeApp({
//   'messagingSenderId': '877069930000'
// });
// const messaging = firebase.messaging();
 // Initialize the Firebase app in the service worker by passing the generated config
firebaseConfig = {
  apiKey: "AIzaSyBhMf7eD9gpfb7M-FSB7ReVBvymngmqQ1U",
  authDomain: "biblioloft-firebase.firebaseapp.com",
  projectId: "biblioloft-firebase",
  storageBucket: "biblioloft-firebase.appspot.com",
  messagingSenderId: "877069930000",
  appId: "1:877069930000:web:a0028661b55bfbd17c4495"
};

firebaseApp = firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
messaging = firebase.messaging();

// admin = require('firebase-admin');
// serviceKey = require('./path/to/serviceKey.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceKey),
//     databaseURL: 'https://{project}.firebaseio.com'
// });
// initializeApp = require('firebase-admin/app');
// messaging.onBackgroundMessage(function(payload) {
//   console.log("Received background message ", payload);

//    notificationTitle = payload.notification.title;
//    notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../firebase-messaging-sw.js')
//     .then(function(registration) {
//       console.log('Registration successful, scope is:', registration.scope);
//     }).catch(function(err) {
//       console.log('Service worker registration failed, error:', err);
//     });
// }
