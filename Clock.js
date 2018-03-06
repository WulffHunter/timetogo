import React, { Component } from 'react';

class Clock extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date()
		};

		this.getCurrentTime = this.getCurrentTime.bind(this);
	}

	getCurrentTime() {
		this.setState({
			date: new Date()
		});
	}

	componentDidMount(props) {
		this.getCurrentTime();
		this.ticker = setInterval(this.getCurrentTime, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.ticker);
	}

	render() {
		var h = this.state.date.getHours();
		var m = this.state.date.getMinutes();
		var s = this.state.date.getSeconds();

		return (
			<span className="clock">
					{h}:{(m < 10 ? "0" : "") + m}:{(s < 10 ? "0" : "") + s}
			</span>
		);
	}
}

export default Clock;