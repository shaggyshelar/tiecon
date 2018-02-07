import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Snackbar/style.css';

export default class Notifications extends Component {
	state = {
		usersList: []
	};

	firebaseInitialized = () =>  {
		const messaging = firebase.messaging();
		messaging.requestPermission()
			.then(() => {
				this.bar.MDComponent.show({
					message: 'Notification Permission Allowed'
				});
				messaging.getToken()
					.then((currentToken) => {
						if (currentToken) {
							this.bar.MDComponent.show({
								message: 'Token='+currentToken
							});
						} else {
							this.bar.MDComponent.show({
								message: 'No Instance ID token available. Request permission to generate one.'
							});
						}
					})
					.catch((err) => {
						this.bar.MDComponent.show({
							message: 'An error occurred while retrieving token'
						});
				  		//console.log('An error occurred while retrieving token. ', err);
					});
			})
			.catch((err) => {
				this.bar.MDComponent.show({
					message: 'Notification Permission Disabled'
				});
			});
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
		window.removeEventListener('firebaseInitialized', this.firebaseInitialized);
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
				<Snackbar ref={bar => {this.bar=bar;}} />
			</div>
		);
	}
}
