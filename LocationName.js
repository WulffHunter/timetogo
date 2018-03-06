import React, { Component } from 'react';

class LocationName extends React.Component {
	constructor(props) {
		super(props);
		this.journeyPoint = props.journeyPoint;
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	render() {
		return (
			<label>
				{this.journeyPoint}:
				<input type="text" value={this.state.value} onChange={this.handleChange} />
			</label>
		);
	}
}

export default LocationName;