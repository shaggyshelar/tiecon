import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Select/style.css';
import style from './style';
// import instascan from 'instascan';

export default class Scanner extends Component {
	state = {
		count: 10,
		scanner: {},
		cameras: []
	};

	// gets called when this route is navigated to
	componentDidMount() {
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	}

	componentWillMount() {
		const script = document.createElement("script");
		//script.src = "https://rawgit.com/schmich/instascan-builds/master/instascan.min.js";
		script.src = "/assets/instascan.min.js";
		script.async = true;
		let thisState = this;
	
		script.onload = function() {
			Instascan.Camera.getCameras().then(function (cameras) {
				if (cameras.length > 0) {
					thisState.setState({ cameras });
				} else {
					alert('no camera');
				}
			}).catch(function (e) {
			console.error(e);
			});
		};
	
		document.body.appendChild(script);
	}

	startScanner = () => {
		let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
		scanner.addListener('scan', (content) => {
			console.log(content);
		});
		this.setState({ scanner });
	};

	onSelectChange = (e) => {
		console.log('Index', e.selectedIndex);
		console.log('this.state.scanner', this.state.scanner);
		this.state.scanner.start(this.state.cameras[0]);
	}

	render({}, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Scanner: </h1>
				<p> Please select camera.
				<Select hintText="Select an option"
					selectedIndex={this.state.chosenIndex}
					onChange={this.onSelectChange}
				>
					<Select.Item>opt1</Select.Item>
					<Select.Item>opt2</Select.Item>
					<Select.Item>opt3</Select.Item>
					<Select.Item>opt4</Select.Item>
				</Select>
				</p>
				<p><video id="preview" /></p>
				<p>
					<Button raised ripple onClick={this.startScanner}>Start Scanner</Button>
				</p>
			</div>
		);
	}
}
