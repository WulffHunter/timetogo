import React, { Component } from 'react';
import JourneySelector from './components/JourneySelector';
import Timer from './components/Timer';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			journeyStart: undefined
		};

		this.onHasJourneyTime = this.onHasJourneyTime.bind(this);
	}

	onHasJourneyTime(timeToLeave) {
		this.setState({
			journeyStart: timeToLeave
		});
	}

	render() {
		return (
			<div>
				<div className="appname"><span className="title">TimeToGo!</span></div>
				<Timer departingTime={this.state.journeyStart}/>
				<JourneySelector onHasJourneyTime={this.onHasJourneyTime.bind(this)}/>
			</div>
		);
	}
}

export default App;