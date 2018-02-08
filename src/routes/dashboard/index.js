import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import _ from 'lodash';
import { Bar, Doughnut } from 'react-chartjs-2';

export default class Dashboard extends Component {
	state = {
		eventDetails: [],
		usersInEvents: [],
		confRooms: [],
		barChartData: {
			labels: ["NGO", "AI", "Technology", "Startup", "Business"],
			datasets: [{
				label: "Present Users",
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: [2, 10, 5, 20, 30],
			}]
		},
		doughnutChartData: {
			labels: [
				'NGO',
				'AI',
				'Technology'
			],
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
