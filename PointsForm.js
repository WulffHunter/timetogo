import React, { Component } from 'react';
import LocationInput from './LocationInput';

class PointsForm extends Component {
	constructor(props) {
		super(props);

		var currDate = new Date();

		this.state = {
			from: "",
			to: "",
			hour: currDate.getHours() - 1 + Math.ceil((currDate.getMinutes() + 15) / 60) + "",
			minute: ((currDate.getMinutes() + 15) % 60) + ""
		};

		this.timeouts = {};
		

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDisambiguation = this.handleDisambiguation.bind(this);
		this.setLocation = this.setLocation.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleSubmit(event) {
		if (this.state.from === "" || this.state.to === "") {
			this.props.getJourneyResponse({
					hasempty: true,
					fromempty: this.state.from === "",
					toempty: this.state.to === "",
					error: false,
					errorType: false
				});
		} else {
			this.props.searchStart();
			var hadError = false, errorType = "", disambigFlag = false;
			fetch('https://api.tfl.gov.uk/journey/journeyresults/'
				+ this.state.from + '/to/' + this.state.to
				+ '?timeIs=arriving&time=' + (this.state.hour < 10 ? '0' : '') + this.state.hour + (this.state.minute < 10 ? '0' : '') + this.state.minute)
			.then(function(response) {
				if (response.status === 300) {
					disambigFlag = true;
				}
				hadError = !response.ok;
				errorType = response.statusText;
				return response.json();
			})
			.catch(function(error) {
				if (error.message !== "disambiguating") {
					this.props.getJourneyResponse({
						error: true,
						errorType: error.message
					});
				}
			}.bind(this))
			.then(function(response) {
				if (disambigFlag) {
					this.handleDisambiguation(response);
					this.props.getJourneyResponse({
						disambiguating: true,
						error: false,
						errorType: errorType
					});
				} else {
					this.props.getJourneyResponse({
						error: hadError,
						errorType: errorType,
						data: response
					});
				}
			}.bind(this));
		}
		event.preventDefault();
	}

	handleDisambiguation(res) {
		console.log("I was called");
		console.log(res);
		var hadError = false, errorType = "";
		if (res.fromLocationDisambiguation.disambiguationOptions !== undefined) {
			this.setState({
				from: res.fromLocationDisambiguation.disambiguationOptions[0].parameterValue
			})
		}
		if (res.toLocationDisambiguation.disambiguationOptions !== undefined) {
			this.setState({
				to: res.toLocationDisambiguation.disambiguationOptions[0].parameterValue
			})
		}
		this.props.searchStart();
		fetch('https://api.tfl.gov.uk/journey/journeyresults/'
			+ this.state.from + '/to/' + this.state.to
			+ '?timeIs=arriving&time=' + (this.state.hour < 10 ? '0' : '') + this.state.hour + (this.state.minute < 10 ? '0' : '') + this.state.minute)
		.then(function(response) {
			console.log(response);
			hadError = !response.ok;
			errorType = response.statusText;
			return response.json();
		})
		.catch(function(error) {
			this.props.getJourneyResponse({
				error: true,
				errorType: error.message
			});
		}.bind(this))
		.then(function(response) {
			console.log("Disambig result")
			this.props.getJourneyResponse({
				error: hadError,
				errorType: errorType,
				data: response
			});
		}.bind(this));
	}

	setLocation(locType, lat, long) {
		this.setState({
			[locType]: lat + "," + long
		});
	}

	render() {

		var i;
		var hours = [], minutes = [];
		for (i = 0; i < 24; i++) {
			hours.push(<option value={i} key={i}>{i}</option>);
		}
		for (i = 0; i < 60; i++) {
			minutes.push(<option value={i} key={i}>{i}</option>);
		}

		return (
			<form onSubmit={this.handleSubmit}>
				<div>{this.duration}</div>
				<div className="arrivaltimeset">
					<label>
						Arrival Time:
						<select name="hour" value={this.state.hour} onChange={this.handleInputChange}>
							{hours}
						</select>
						:
						<select name="minute" value={this.state.minute} onChange={this.handleInputChange}>
							{minutes}
						</select>
					</label>
				</div>
				<div className="locationcontainer">
					<LocationInput point="from" setLocation={this.setLocation.bind(this)}/>
					<LocationInput point="to" setLocation={this.setLocation.bind(this)}/>
				</div>
				<div className="getjourneysbutton">
					<input type="submit" value={this.props.submitMsg}/>
				</div>
			</form>
		);
	}
}

export default PointsForm;