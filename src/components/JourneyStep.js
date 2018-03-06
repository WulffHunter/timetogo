import React, { Component } from 'react';

class JourneyStep extends Component {
	render() {

		return (
			<li className="journeystep">
				<div>
					<div>
						<em>{this.props.step.instruction.summary}</em>
					</div>
					<div>
						<div>Departing from {this.props.step.departurePoint.commonName}</div>
						<div>Arriving at {this.props.step.arrivalPoint.commonName}</div>
						<div><em>{this.props.step.duration} minutes</em></div>
					</div>
				</div>
			</li>
		);
	}
}

export default JourneyStep;
