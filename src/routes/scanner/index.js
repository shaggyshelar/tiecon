import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Button/style.css';
import style from './style';
import Snackbar from 'preact-material-components/Snackbar';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import 'preact-material-components/Snackbar/style.css';

export default class Scanner extends Component {
	state = {
		count: 10,
		scanner: null,
		cameras: [],
		selectedCameraIndex: 0,
		disableStartButton: true,
		isScanning: false
	};

	firebaseInitialized = (content) =>  {
		console.log('firebase', firebase);
		let db = firebase.firestore();
		console.warn('db', db);
		db.collection('users').add({
			first: 'Ada',
			last: 'Lovelace',
			born: 1815
		})
			.then((docRef) => {
				console.log('Document written with ID: ', docRef.id);
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	}

	// gets called when this route is navigated to
	componentDidMount() {
		window.addEventListener('firebaseInitialized', this.firebaseInitialized);
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		window.removeEventListener('firebaseInitialized', this.handleMouseClick);
	}

	componentWillMount() {
		const script = document.createElement('script');
		script.src = '/assets/instascan.min.js';
		script.async = true;
		let thisState = this;
	
		script.onload = function() {
			Instascan.Camera.getCameras().then((cameras) => {
				if (cameras.length > 0) {
					thisState.setState({ cameras });
				}
				else {
					alert('no camera');
				}
			}).catch((e) => {
				console.error(e);
			});
		};
	
		document.body.appendChild(script);
	}

	showSnack = (content) => {
		console.log('Contexnt', content);
		this.bar.MDComponent.show({
			message: 'Hello Snack!'
		});
	}

	toggleScanner = () => {
		if (!this.state.scanner) {
			let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
			scanner.addListener('scan', (content) => {
				this.showSnack(content);
			});
			this.setState({ scanner });
		}
		if (!this.state.isScanning) {
			this.state.scanner.start(this.state.cameras[this.state.selectedCameraIndex]);
			this.setState({ isScanning: true });
			this.bar.MDComponent.show({
				message: 'Starting scanning...'
			});
		} else {
			this.state.scanner.stop();
			this.setState({ isScanning: false });
			this.bar.MDComponent.show({
				message: 'Stopped scanning...'
			});
		}
	};

	onSelectChange = (e) => {
		this.setState({ disableStartButton: false, selectedCameraIndex: e.selectedIndex });
	}

	render({}, { time, count }) {
		return (
			<div class={style.profile}>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4">
							<Select hintText="Select"
								selectedIndex={this.state.chosenIndex}
								onChange={this.onSelectChange}
							>
								{
									this.state.cameras.map((camera, index) => (
										<Select.Item>Camera { index }</Select.Item>
									))
								}
							</Select>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="1">
							<Button raised ripple onClick={this.toggleScanner} disabled={this.state.disableStartButton}>
								{
									this.state.isScanning ? 'Stop Scanner' : 'Start Scanner'
								}
							</Button>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="1" />
						<LayoutGrid.Cell cols="10">
							<video id="preview" />
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="1" />
					</LayoutGrid.Inner>
				</LayoutGrid>
				<Snackbar ref={bar => {this.bar=bar;}} />
			</div>
		);
	}
}
