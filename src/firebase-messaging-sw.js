importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-messaging.js');

let config = {
	apiKey: 'AIzaSyDM4bfZawYFEvNsYlNyNZLEfTPSPsbtUkQ',
	authDomain: 'tiecon-b3493.firebaseapp.com',
	databaseURL: 'https://tiecon-b3493.firebaseio.com',
	projectId: 'tiecon-b3493',
	storageBucket: 'tiecon-b3493.appspot.com',
	messagingSenderId: '489302991624'
};
firebase.initializeApp(config);

const messaging = firebase.messaging();