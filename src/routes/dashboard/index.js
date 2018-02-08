import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import _ from 'lodash';
import { Bar, Doughnut } from 'react-chartjs-2';

const availableTags = ['NGO', 'AI', 'Technology', 'Startup', 'Business'];

export default class Dashboard extends Component {
	state = {
		eventDetails: [],
		usersInEvents: [],
		confRooms: [],
		barChartData: {
			labels: availableTags,
			datasets: [{
				label: 'Present Users',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: [2, 10, 5, 20, 30]
			}]
		},
		doughnutChartData: {
			labels: availableTags,
			datasets: [{
				data: [15, 20, 15],
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56'
				],
				hoverBackgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56'
				]
			}]
		}
	};

	getTagsCount = (tags) =>  {
		let result = _.map(availableTags, (service) => {
			let length = _.reject(tags, (el) => (el.indexOf(service) < 0)).length;
			return { id: service, count: length };
		});
		return result;
	}

	parseEventDetails = (events) =>  {
		let eventDetails = [];
		events.forEach((doc) => {
			let confRoom = _.find(eventDetails, { confRoomName: doc.ConfRoom.Name });
			if (confRoom) {
				let mergedTags = [];
				_.forEach(confRoom.tags, (tag) => {
					mergedTags.push(tag);
				});
				_.forEach(doc.Tags, (tag) => {
					mergedTags.push(tag);
				});
				confRoom.tags = mergedTags;
				confRoom.TagsCount = this.getTagsCount(confRoom.tags);
				confRoom.users.push(doc);
			} else {
				let newConfDetails = { confRoomName: doc.ConfRoom.Name, users: [doc], tags: doc.Tags };
				newConfDetails.TagsCount = this.getTagsCount(doc.Tags);
				eventDetails.push(newConfDetails);
			}
		});
		console.log('eventDetails', eventDetails);
		this.setState({ eventDetails });
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
		db.collection('conferenceRooms')
			.onSnapshot((querySnapshot) => {
				let confRooms = [];
				querySnapshot.forEach((doc) => {
					confRooms.push(doc.data());
				});
				this.setState({ confRooms });
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

				<Bar
					data={this.state.barChartData}
					width={100}
					height={50}
					options={{
						maintainAspectRatio: true,
						title: {
							display: true,
							text: 'Attendance',
							fontSize: 25
						}
					}}
				/>
				<Doughnut data={this.state.doughnutChartData} width={100} height={50} />
			</div>
		);
	}
}
