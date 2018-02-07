import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Button/style.css';
import style from './style';
import Snackbar from 'preact-material-components/Snackbar';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import 'preact-material-components/Snackbar/style.css';
import 'preact-material-components/Dialog/style.css';

export default class Scanner extends Component {
	state = {
		count: 10,
		scanner: null,
		cameras: [],
		availableRooms: [{ id: 1, name: 'ConfRoom 1' },{ id: 2, name: 'ConfRoom 2' },
			{ id: 3, name: 'ConfRoom 3' }, { id: 4, name: 'ConfRoom 4' }],
		availableEvents: [{ id: 1, name: 'Entry' }, { id: 2, name: 'Exit' }],
		scannedResult: null,
		disableStartButton: true,
		isScanning: false,
		isDialogShown: false
	};

	setVCardDetails = (scannedResult) => {
		let Re1 = /^(version|fn|title|org):(.+)$/i;
		let Re2 = /^([^:;]+);([^:]+):(.+)$/;
		let ReKey = /item\d{1,2}\./;
		let fields = {};
		scannedResult.split(/\r\n|\r|\n/).forEach((line) => {
			let results, key;
			if (Re1.test(line)) {
				results = line.match(Re1);
				key = results[1].toLowerCase();
				fields[key] = results[2];
			} else if (Re2.test(line)) {
				results = line.match(Re2);
				key = results[1].replace(ReKey, '').toLowerCase();
	
				let meta = {};
				results[2].split(';')
					.map((p, i) => {
						let match = p.match(/([a-z]+)=(.*)/i);
						if (match) {
							return [match[1], match[2]];
						}
						return ['TYPE' + (i === 0 ? '' : i), p];
						
					})
					.forEach((p) => {
						meta[p[0]] = p[1];
					});
	
				if (!fields[key]) fields[key] = [];
	
				fields[key].push({
					meta,
					value: results[3].split(';')
				});
			}
		});
		this.setState({ scannedResult: fields });
	}

	openSettings = () => {
		this.dialog.MDComponent.show();
	};

	onConfirmScan = () => {
		let db = firebase.firestore();
		let eventName = this.getSelectedEvent();
		let confRoomName = this.getSelectedRoom();
		db.collection('usersInEvent').doc(this.state.scannedResult.fn).set({
			EventName: eventName,
			ConfRoom: confRoomName,
			Name: this.state.scannedResult.fn
		})
			.then((docRef) => {
				console.log('User Event Details Updated: ');
			})
			.catch((error) => {
				console.error('Error updating User Event Details ', error);
			});
		this.setState({ isDialogShown: false });
	}
	
	dialogRef = dialog => (this.dialog = dialog);

	firebaseInitialized = (content) =>  {
		// let db = firebase.firestore();
		// db.collection('users').add({
		// 	first: 'Ada',
		// 	last: 'Lovelace',
		// 	born: 1815
		// })
		// 	.then((docRef) => {
		// 		console.log('Document written with ID: ', docRef.id);
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error adding document: ', error);
		// 	});
	}

	componentDidMount() {
		window.addEventListener('firebaseInitialized', this.firebaseInitialized);
	}

	componentWillUnmount() {
		window.removeEventListener('firebaseInitialized', this.firebaseInitialized);
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
		this.bar.MDComponent.show({
			message: 'Hello Snack!'
		});
	}

	toggleScanner = () => {
		if (!this.state.scanner) {
			let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
			scanner.addListener('scan', (scannedResult) => {
				if (!this.state.isDialogShown) {
					this.setState({ isDialogShown: true });
					this.setVCardDetails(scannedResult);
					this.openSettings();
				}
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

	onEventChange = (e) => {
		this.setState({ selectedEventIndex: e.selectedIndex });
	}

	onConfRoomChange = (e) => {
		this.setState({ selectedRoomIndex: e.selectedIndex });
	}

	getSelectedRoom = (e) => {
		if (this.state.selectedRoomIndex >= 0) {
			return this.state.availableRooms[this.state.selectedRoomIndex].name;
		}
		return '';
	}

	getSelectedEvent = (e) => {
		if (this.state.selectedEventIndex >= 0) {
			return this.state.availableEvents[this.state.selectedEventIndex].name;
		}
		return '';
	}

	render({}, { time, count }) {
		let cleft = 0;
		let ctop = 0;
		let ctrans = 'translate('+cleft+'px, '+ctop+'px)';
		//var ctrans = 'scale(-1, 1)';
		const divStyle = {
			width: '100%',
			height: '50%',
			transform: ctrans
		  };
		return (
			<div class={style.profile}>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4">
							<Select hintText="Select"
								selectedIndex={this.state.selectedCameraIndex}
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
						<LayoutGrid.Cell cols="4">
							<Select hintText="Select Room"
								selectedIndex={this.state.selectedRoomIndex}
								onChange={this.onConfRoomChange} 
							>
								{
									this.state.availableRooms.map((room, index) => (
										<Select.Item>{ room.name }</Select.Item>
									))
								}
							</Select>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<Select hintText="Select Event"
								selectedIndex={this.state.selectedEventIndex}
								onChange={this.onEventChange}
							>
								{
									this.state.availableEvents.map((event, index) => (
										<Select.Item>{ event.name }</Select.Item>
									))
								}
							</Select>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12">
							<video id="preview" style={divStyle} />
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
				<Dialog ref={this.dialogRef}>
					<Dialog.Header>{this.state.scannedResult ? this.state.scannedResult.fn : null }</Dialog.Header>
					<Dialog.Body>
						<div>
							Conf Room: { this.getSelectedRoom() } <br />
							Event: { this.getSelectedEvent() } <br />
						</div>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept onClick={this.onConfirmScan}>okay</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
				<Snackbar ref={bar => {this.bar=bar;}} />
			</div>
		);
	}
}
