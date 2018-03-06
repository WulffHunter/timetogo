import React, { Component } from 'react';
import JourneyStep from './JourneyStep';

class Journey extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showMore: false
		};

		this.journey = this.props.journey;
		var offset = new Date().getTimezoneOffset();
		var date = new Date(new Date(this.journey.arrivalDateTime).getTime() /*+ (offset * 60000)*/);
		this.hour = date.getHours();
		this.minute = date.getMinutes();

		this.toggleShow = this.toggleShow.bind(this);
		this.selectJourney = this.selectJourney.bind(this);
	}

	toggleShow() {
		var newState = !this.state.showMore;
		this.setState({showMore: newState});
	}

	selectJourney() {
		this.setState({showMore: true});
		this.props.selectJourney(this.journey, this.props.jid + 1);
	}

	render() {
	var steps = [];
	if (this.state.showMore) {
		for (var i = 0; i < this.journey.legs.length; i++) {
			steps.push(<JourneyStep key={i} step={this.journey.legs[i]}/>)
		}
	}

		return (
			<div className={"journey" + (this.props.selected ? " selected" : "")}>
				<div>Arrives at <em>{this.hour}:{(this.minute < 10 ? "0" : "") + this.minute}</em></div>
				<div>Journey Duration: <em>{this.journey.duration} minutes</em></div>
				<button className="selectjourney" onClick={this.selectJourney}>Select This Journey</button>
				<button className={"togglebutton " + (this.state.showMore ? "show" : "hide")} onClick={this.toggleShow}>{this.state.showMore ? "Hide Steps" : "Show Steps"}</button>
				<ol>
					{steps}
				</ol>
			</div>
		);
	}
}

export default Journey;
