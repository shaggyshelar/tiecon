import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';

export default class Speakers extends Component {
	state = {
		usersList: []
	};

	firebaseInitialized = () =>  {
		// let db = firebase.firestore();
		// db.collection('users').get().then((usersList) => {
		// 	let users = [];
		// 	usersList.forEach((doc) => {
		// 		users.push(doc.data());
		// 	});
		// 	this.setState({ usersList: users });
		// });

		// let timeStamp = new Date().getTime();
		// console.log('Time', timeStamp);
		// let db = firebase.firestore();
		// db.collection('conferenceRooms').doc( ''+timeStamp).set({
		// 	capacity: 10,
		// 	id: timeStamp,
		// 	Name: 'Conf Room'
		// })
		// 	.then((docRef) => {
		// 		console.log('User Event Details Updated: ');
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error updating User Event Details ', error);
		// 	});
	}

	componentDidMount() {
		if (window.firebaseInitialized) {
			this.firebaseInitialized();
		} else {
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
