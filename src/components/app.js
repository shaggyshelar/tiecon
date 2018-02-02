import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import Scanner from '../routes/scanner';
import Speakers from '../routes/speakers';
import Notifications from '../routes/notifications';
import Login from '../routes/login';

// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	componentDidMount() {
		const firebaseScript = document.createElement('script');
		firebaseScript.src = '/assets/firebase.js';
		firebaseScript.async = true;
		firebaseScript.onload = function() {
			const firestoreScript = document.createElement('script');
			firestoreScript.src = '/assets/firebase-firestore.js';
			firestoreScript.async = true;
			firestoreScript.onload = function() {
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
				messaging.requestPermission()
					.then(() => {
						messaging.getToken()
							.then((currentToken) => {
								if (currentToken) {
									let db = firebase.firestore();
									let cityRef = db.collection('tokens').doc(currentToken);
									let setWithMerge = cityRef.set({
										id: currentToken,
										userId: ''
									}, { merge: true });
								} else {
									console.log('No Instance ID token available. Request permission to generate one.');
									// Show permission UI.
								}
							})
							.catch((err) => {
				  		console.log('An error occurred while retrieving token. ', err);
							});
					})
					.catch((err) => {
						console.log('Unable to get permission to notify.', err);
					});
				messaging.onMessage((payload) => {
					alert('message received');
				});
				window.firebaseInitialized = true;
				window.dispatchEvent(new Event('firebaseInitialized'));
			};
			document.body.appendChild(firestoreScript);
		};
		document.body.appendChild(firebaseScript);
	}

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Scanner path="/scanner" />
					<Speakers path="/speakers" />
					<Notifications path="/notifications" />
					<Login path="/login" />
				</Router>
			</div>
		);
	}
}
