import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import linkState from 'linkstate';

export default class Profile extends Component {
	state = {
		updateRequired: false
	};

	onAuthStateChanged = () =>  {
		this.setState({ updateRequired: true });
		linkState(this, 'email');
	};

	componentDidMount() {
		if (window.onAuthStateChanged) {
			this.onAuthStateChanged();
		}
		else {
			window.addEventListener('onAuthStateChanged', this.onAuthStateChanged);
		}
	}

	componentWillMount() {
		const script = document.createElement('script');
		script.src = '/assets/QrCode.js';
		script.async = true;
	
		script.onload = function() {
			let  cardDetails= {
				version: '3.0',
				lastName: 'Shelar',
				middleName: 'D',
				firstName: 'Sagar',
				gender: 'M',
				organization: 'Eternus Solutions',
				cellPhone: '312-555-1414111',
				birthday: '20140112',
				role: 'Crash Testing',
				email: 'john.doe@testmail',
				socialUrls: {
					linkedIn: 'johndoe',
					twitter: 'johndoe'
				}
			};
	
			let generatedQR = qrCode.createVCardQr(cardDetails, { typeNumber: 12, cellSize: 4 });
			document.getElementById('profileCardDetails').innerHTML = generatedQR;
		};
	
		document.body.appendChild(script);
	}

	componentWillUnmount() {
		window.removeEventListener('onAuthStateChanged', this.onAuthStateChanged);
	}

	onLogout = () => {
		firebase.auth().signOut();
	}

	renderDetails = () => {
		if (window.userDetails) {
			return (
				<div class={style.profile}>
					<h1>Profile: {window.userDetails.email}</h1>
					<p>This is the user profile for a user with id { window.userDetails.uid }.</p>
					<Button raised ripple onClick={this.onLogout}>Logout</Button>
				</div>
			);
		}

		return (<div> You are logged out.</div>);
	};

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				{ this.renderDetails() }
				<div id="profileCardDetails" />
			</div>
		);
	}
}
