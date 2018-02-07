import { h, Component } from 'preact';
import { route } from 'preact-router';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
// import style from './style';

export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
		this.state = {
			darkThemeEnabled: false
		};
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);
	openSettings = () => this.dialog.MDComponent.show();
	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);
	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');
	goToScanner = this.linkTo('/scanner');
	goToSpeakers = this.linkTo('/speakers');
	goToNotifications = this.linkTo('/notifications');
	goToLogin = this.linkTo('/login');
	goToDashboard = this.linkTo('/dashboard');

	toggleDarkTheme = () => {
		this.setState(
			{
				darkThemeEnabled: !this.state.darkThemeEnabled
			},
			() => {
				if (this.state.darkThemeEnabled) {
					document.body.classList.add('mdc-theme--dark');
				}
				else {
					document.body.classList.remove('mdc-theme--dark');
				}
			}
		);
	}

	render() {
		return (
			<div>
				<Toolbar className="toolbar">
					<Toolbar.Row>
						<Toolbar.Section align-start>
							<Toolbar.Icon menu onClick={this.openDrawer}>
								menu
							</Toolbar.Icon>
							<Toolbar.Title>TiECON</Toolbar.Title>
						</Toolbar.Section>
						<Toolbar.Section align-end>
							<Toolbar.Icon onClick={this.goToNotifications}>notifications</Toolbar.Icon>
							<Toolbar.Icon onClick={this.openSettings}>settings</Toolbar.Icon>
						</Toolbar.Section>
					</Toolbar.Row>
				</Toolbar>
				<Drawer.TemporaryDrawer ref={this.drawerRef}>
					<Drawer.TemporaryDrawerContent>
						<List>
							<List.LinkItem onClick={this.goHome}>
								<List.ItemIcon>home</List.ItemIcon>
								Home
							</List.LinkItem>
							<List.LinkItem onClick={this.goToMyProfile}>
								<List.ItemIcon>account_circle</List.ItemIcon>
								Profile
							</List.LinkItem>
							<List.LinkItem onClick={this.goToScanner}>
								<List.ItemIcon>account_circle</List.ItemIcon>
								Scanner
							</List.LinkItem>
							<List.LinkItem>
								<List.ItemIcon>event</List.ItemIcon>
								Events
							</List.LinkItem>
							<List.LinkItem onClick={this.goToSpeakers}>
								<List.ItemIcon>perm_identity</List.ItemIcon>
								Speakers
							</List.LinkItem>
							<List.LinkItem onClick={this.goToNotifications}>
								<List.ItemIcon>notifications</List.ItemIcon>
								Notifications
							</List.LinkItem>
							<List.LinkItem onClick={this.goToLogin}>
								<List.ItemIcon>exit_to_app</List.ItemIcon>
								Login
							</List.LinkItem>
							<List.LinkItem onClick={this.goToDashboard}>
								<List.ItemIcon>dashboard</List.ItemIcon>
								Dashboard
							</List.LinkItem>
							<List.LinkItem>
								<List.ItemIcon>build</List.ItemIcon>
								Admin
							</List.LinkItem>
						</List>
					</Drawer.TemporaryDrawerContent>
				</Drawer.TemporaryDrawer>
				<Dialog ref={this.dialogRef}>
					<Dialog.Header>Settings</Dialog.Header>
					<Dialog.Body>
						<div>
							Enable dark theme <Switch onClick={this.toggleDarkTheme} />
						</div>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept>okay</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
