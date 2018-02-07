import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import _ from 'lodash';

export default class Dashboard extends Component {
	state = {
		eventDetails: [],
		usersInEvents: []
	};

	parseEventDetails = (events) =>  {
		let parseEventDetails = [];
		events.forEach((doc) => {
			let confRoom = _.find(parseEventDetails, { confRoomName: doc.ConfRoom });
			if (confRoom) {
				confRoom.users.push(doc);
			} else {
				parseEventDetails.push({ confRoomName: doc.ConfRoom, users: [doc] });
			}
		});
		this.setState({ 'eventDetails': parseEventDetails });
	}

	firebaseInitialized = () =>  {
		let db = firebase.firestore();
		db.collection('usersInEvent').where('EventName', '==', 'Entry')
			.onSnapshot((querySnapshot) => {
				let events = [];
				querySnapshot.forEach((doc) => {
					events.push(doc.data());
				});
				this.parseEventDetails(events);
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
				{
					this.state.eventDetails.map((eventDetail, index) => (
						<Card>
							<Card.Primary>
								<Card.Title><h1>{ eventDetail.confRoomName}</h1></Card.Title>
								<Card.Subtitle>Total Attendies: { eventDetail.users.length }</Card.Subtitle>
							</Card.Primary>
							<Card.Media className='card-media'>
								{
									eventDetail.users.map((user, index) => (
										<div> {user.Name} </div>
									))
								}
							</Card.Media>
							{/* <Card.Actions>
								<Card.Action>OKAY</Card.Action>
							</Card.Actions> */}
						</Card>
					))
				}
			</div>
		);
	}
}
