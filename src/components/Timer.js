import React, { Component } from 'react';
import Clock from './Clock';

class Timer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			started: false,
			distance: 0
		}

		this.hours = 0;
		this.minutes = 0;
		this.seconds = 0;
		this.distance = 0;

		this.timerListener = this.timerListener.bind(this);
		this.timerTick = this.timerTick.bind(this);
	}

	timerTick() {
		if (this.leavingAt !== undefined) {
			var distance = this.leavingAt - (new Date().getTime());
			this.setState({
				distance: distance
			});
			if (distance > 0) {
				this.hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
			} else {
				clearInterval(this.ticker);
			}
		} else {
			clearInterval(this.ticker);
			this.setState({
				started: false
			});
		}
	}

	timerListener(departingTime) {
		if (departingTime !== undefined) {
			this.setState({
				started: true,
				distance: 0
			});
			//Padding of 15 extra minutes
			var offset = new Date().getTimezoneOffset();
			this.leavingAt = (new Date(departingTime).getTime()) /*+ (offset * 60000)*/ - (1000 * 60 * 10);

			clearInterval(this.ticker);

			this.timerTick();
			this.ticker = setInterval(this.timerTick, 1000);
		} else {
			clearInterval(this.ticker);
		}
	}

	componentWillReceiveProps(props) {
		clearInterval(this.ticker);
		this.timerListener(props.departingTime);
	}

	render() {
		var h = this.hours;
		var m = this.minutes;
		var s = this.seconds;

		var widget = <div>
			<div className="clock">Current Time: <Clock/></div>
			<div className="timersubtitle">Please select a journey</div>
		</div>;
		if (this.state.started && this.state.distance !== 0) {
			if (this.state.distance <= 0 || h > 22) {
				widget = <div className="clock">Leave now!</div>
			} else if (h === 0 && m <=15){
				widget = <div>
					<div className="clock">Leaving in {m}m {s}s</div>
					<div className="timersubtitle">Get your stuff ready! You're leaving in {m} minute{m !== 1 ? "s" : ""}!</div>
				</div>
			} else {
				widget = <div className="clock">Leaving in {h > 0 ? h + "h " : ""}{m}m {s}s</div>
			}
		}

		return (
			<div className="timer">
				<div>
					{widget}
				</div>
			</div>
		);
	}
}

export default Timer;