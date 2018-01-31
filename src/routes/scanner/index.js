import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';

export default class Scanner extends Component {
	state = {
		count: 10
	};

	// gets called when this route is navigated to
	componentDidMount() {
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	}

	startScanner = () => {
		console.log('Scanner Called');
	};

	render({}, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Scanner: </h1>
				<p>Please select camera.</p>

				<p>
					<Button raised ripple onClick={this.startScanner}>Start Scanner</Button>
				</p>
			</div>
		);
	}
}
