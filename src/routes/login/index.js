import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import linkState from 'linkstate';

export default class Login extends Component {
	state = {
		email: '',
		password: ''
	};

	firebaseInitialized = () =>  {
	}

	onLogin = () => {
		console.log('Username='+ this.state.email);
		console.log('Username='+ this.state.password);
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
		window.removeEventListener('firebaseInitialized', this.handleMouseClick);
	}

	render({}, { }) {
		return (
			<div>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12"><TextField type="text" autofocus fullwidth="true" onInput={linkState(this, 'email')} /></LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12"><TextField type="password" fullwidth="true" onInput={linkState(this, 'password')} /></LayoutGrid.Cell>
						<LayoutGrid.Cell cols="12"><Button raised className="mdc-theme--primary-bg" onClick={this.onLogin} >Login</Button></LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}
