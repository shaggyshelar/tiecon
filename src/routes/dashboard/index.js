import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';

export default class Dashboard extends Component {
	state = {
		usersList: []
	};

	firebaseInitialized = () =>  {
		let db = firebase.firestore();
		// db.collection('usersInEvent').where('EventName', '==', 'Entry')
		// 	.get()
		// 	.then((querySnapshot) => {
		// 		querySnapshot.forEach((doc) => {
		// 			// doc.data() is never undefined for query doc snapshots
		// 			console.log(doc.id, ' => ', doc.data());
		// 		});
		// 	})
		// 	.catch((error) => {
		// 		console.log('Error getting documents: ', error);
		// 	});
		db.collection('usersInEvent').where('EventName', '==', 'Entry')
			.onSnapshot((querySnapshot) => {
				let events = [];
				querySnapshot.forEach((doc) => {
					events.push(doc.data().Name);
					console.log('Doc, ', doc.data());
				});
				console.log('Current users with entry: ', events.join(', '));
			});
		// 	.catch((error) => {
		// 		console.log('Error getting documents: ', error);
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
			</div>
		);
	}
}
