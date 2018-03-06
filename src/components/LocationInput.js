import React, { Component } from 'react';

class LocationInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			message: "Please enter " + (this.props.point === "from" ? "a departure" : "an arrival") + " point",
			options: [],
			showOptions: true
		};
		
		this.handleInputChange = this.handleInputChange.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.toggleShowOptions = this.toggleShowOptions.bind(this);
	}

	handleInputChange(event) {
		//Cancels any timeouts for previous entries
		clearTimeout(this.timeout);

		var newVal = event.target.value;

		this.setState({
			value: newVal
		});
		//Once the user has stopped typing, search for a matching location
		this.timeout = setTimeout(function() {
			if (newVal.length > 1) {
				this.setState({
					message: "Searching...",
					selected: undefined
				});
				fetch('https://api.tfl.gov.uk/Place/Search?name=' + newVal)
				.then(function(response) {
					return response.json();
				})
				.catch(function(error) {
					this.setState({
						message: "There appears to have been an error. Error: " + error.message,
						options: []
					});
				}.bind(this))
				.then(function(response) {
					var message = "There appears to have been an error.";
					var options = [];
					if (Array.isArray(response)) {
						if (response.length < 1) {
							message = "No locations matched your search";
						} else {
							message = response.length + " locations matched your search";
							options = response;
						}
					}
					this.setState({
						showOptions: true,
						message: message,
						options: options
					});
				}.bind(this));
			} else {
				this.setState({
					message: "Please enter " + (this.props.point === "from" ? "a departure" : "an arrival") + " point"
				});
			}
		}.bind(this), 1000);
	}

	setLocation(lat, long, key) {
		this.setState({
			selected: key + 1
		});
		this.props.setLocation(this.props.point, lat, long);
	}

	toggleShowOptions() {
		var newShow = !this.state.showOptions;
		this.setState({
			showOptions: newShow
		});
	}

	render() {
		var options = [];

		options = this.state.options.map((place, index) =>
			<div key={index}>
				<button
					className={"locationoption" + (this.state.selected === index + 1 ? " selected" : "")}
					onClick={() => this.setLocation(place.lat, place.lon, index)}
				>
					<div>Common Name: <em>{place.commonName}</em></div>
					<div>Location Type: <em>{place.placeType}</em></div>
				</button>
			</div>
		);

		return (
			<div className="locationinput">
				<label>
					{this.props.point.charAt(0).toUpperCase() + this.props.point.slice(1)}:
					<input type="text" value={this.state.value} onChange={this.handleInputChange} />
				</label>
				<p>{this.state.message}</p>
				<button className={"togglebutton " + (this.state.showOptions ? "show" : "hide")} onClick={this.toggleShowOptions}>
					{this.state.showOptions ? "Hide Location Options" : "Show Location Options"}
				</button>
				{this.state.showOptions ? options : <span></span>}
			</div>
		);
	}
}

export default LocationInput;
