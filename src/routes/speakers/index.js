import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';

export default class Speakers extends Component {
	state = {
		usersList: []
	};

	firebaseInitialized = (content) =>  {
		let db = firebase.firestore();
		db.collection('users').get().then((usersList) => {
			let users = [];
			usersList.forEach((doc) => {
				users.push(doc.data());
			});
			this.setState({ usersList: users });
		});
	}

	componentDidMount() {
		window.addEventListener('firebaseInitialized', this.firebaseInitialized);
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
