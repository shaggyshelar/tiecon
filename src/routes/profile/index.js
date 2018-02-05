import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import linkState from 'linkstate';
// import qrCode from 'qr-code-and-vcard';

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
		var thisState = this;
	
		script.onload = function() {
			let  cardDetails= {
				version: '3.0',
				lastName: 'Shelar',
				middleName: 'D',
				firstName: 'Sagar',
				nameSuffix: 'JR',
				namePrefix: 'MR',
				nickname: 'sagar',
				gender: 'M',
				organization: 'Eternus Solutions',
				workPhone: '312-555-1212444',
				homePhone: '312-555-1313333',
				cellPhone: '312-555-1414111',
				pagerPhone: '312-555-1515222',
				homeFax: '312-555-1616',
				workFax: '312-555-1717',
				birthday: '20140112',
				anniversary: '20140112',
				title: 'Crash Test Dummy',
				role: 'Crash Testing',
				email: 'john.doe@testmail',
				workEmail: 'john.doe@workmail',
				url: 'http://johndoe',
				workUrl: 'http://acemecompany/johndoe',
				homeAddress: {
					label: 'Home Address',
					street: '123 Main Street',
					city: 'Chicago',
					stateProvince: 'IL',
					postalCode: '12345',
					countryRegion: 'United States of America'
				},
		
				workAddress: {
					label: 'Work Address',
					street: '123 Corporate Loop\nSuite 500',
					city: 'Los Angeles',
					stateProvince: 'CA',
					postalCode: '54321',
					countryRegion: 'California Republic'
				},
		
				source: 'http://sourceurl',
				note: 'dddddd',
				socialUrls: {
					facebook: 'johndoe',
					linkedIn: 'johndoe',
					twitter: 'johndoe',
					flickr: 'johndoe',
					skype: 'test_skype',
					custom: 'johndoe'
				}
			};
	
			let generatedQR = qrCode.createVCardQr(cardDetails, { typeNumber: 30, cellSize: 5 });
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
