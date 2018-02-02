import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';

export default class Notifications extends Component {
	state = {
		usersList: []
	};

	firebaseInitialized = () =>  {
		// const messaging = firebase.messaging();
		// messaging.requestPermission()
		// 	.then(() => {
		// 		console.log('Notification permission granted.');
		// 		messaging.getToken()
		// 			.then((currentToken) => {
		// 				if (currentToken) {
		// 					console.log('currentToken', currentToken);
		// 				} else {
		// 					console.log('No Instance ID token available. Request permission to generate one.');
		// 					// Show permission UI.
		// 				}
		// 			})
		// 			.catch((err) => {
		// 		  		console.log('An error occurred while retrieving token. ', err);
		// 			});
		// 	})
		// 	.catch((err) => {
		// 		console.log('Unable to get permission to notify.', err);
		// 	});
	}

	componentDidMount() {
		if (window.firebaseInitialized) {
			this.firebaseInitialized();
		}
		else {
			window.addEventListener('firebaseInitialized', this.firebaseInitialized);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('firebaseInitialized', this.handleMouseClick);
	}

	render({}, { }) {
		return (
			<div>
				<List>
					{
						this.state.usersList.map((user, index) => (
							<List.Item>{user.first}</List.Item>
						))
					}
				</List>
			</div>
		);
	}
}
