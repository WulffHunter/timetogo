import React, { Component } from 'react';
import PointsForm from './PointsForm';
import Journey from './Journey';

class JourneySelector extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: "Let's go!",
			submitMsg: "Get Journeys!"
		}
		this.message = "Let's go!";

		this.getJourneyResponse = this.getJourneyResponse.bind(this);
		this.selectJourney = this.selectJourney.bind(this);
		this.searchStart = this.searchStart.bind(this);
	}

	getJourneyResponse(response) {
		if (response.hasempty !== undefined) {
			if (response.fromempty) {
				this.setState({
					message:"Please enter a departing location",
					journeys: undefined,
					selected: undefined
				});
			} else {
				this.setState({
					message:"Please enter an arrival location",
					journeys: undefined,
					selected: undefined
				});
			}
		} else if (response.error === false && response.disambiguating === undefined &&
			response.data !== undefined && response.data.journeys !== undefined) {
			this.setState({
				message: response.data.journeys.length + " possible journeys found",
				submitMsg: "Get Journeys!",
				journeys: response.data.journeys,
				selected: undefined
			});
		} else if (response.disambiguating) {
			this.setState({
				message:"Searching...",
				submitMsg: "Get Journeys!",
				journeys: undefined,
				selected: undefined
			});
		} else {
			this.setState({
				message:"Oops! Looks like there's a problem with the servers. Error: " + response.errorType,
				submitMsg: "Try Again!",
				journeys: undefined,
				selected: undefined
			});
		}
	}

	selectJourney(journey, key) {
		this.setState({
			selected: key
		});
		this.props.onHasJourneyTime(journey.startDateTime);
	}

	searchStart() {
		this.setState({
			message:"Looking for journeys...",
			journeys: undefined,
			selected: undefined
		});
	}

	render() {
		var journeys = [];
		if (this.state.journeys !== undefined) {
			for (var i = 0; i < this.state.journeys.length; i++) {
				journeys.push(
					<Journey
						journey={this.state.journeys[i]}
						selectJourney={this.selectJourney}
						selected={this.state.selected === i + 1}
						key={i}
						jid={i}
					/>
				)
			}
		}

		return (
			<div className="journeyselector">
				<h1 className="selectormessage">{this.state.message}</h1>
				<PointsForm
					searchStart={this.searchStart.bind(this)}
					getJourneyResponse={this.getJourneyResponse.bind(this)}
					submitMsg={this.state.submitMsg}
				/>
				<div className="journeylist">
					{ journeys }
				</div>
			</div>
		);
	}
}

export default JourneySelector;