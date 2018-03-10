export var geoLocation = function() {
	var message = document.getElementById("error");

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(handleGeoLocationSuccess, handleGeoLocationError);
		} else { 
			message.innerHTML = "Geolocation is not supported by this browser.";
		}
	}

	function handleGeoLocationSuccess(position) {
		var coords = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};

		getFlightsData( coords );
	}

	function handleGeoLocationError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				message.innerHTML = "User denied the request for Geolocation."
				break;
			case error.POSITION_UNAVAILABLE:
				message.innerHTML = "Location information is unavailable."
				break;
			case error.TIMEOUT:
				message.innerHTML = "The request to get user location timed out."
				break;
			case error.UNKNOWN_ERROR:
				message.innerHTML = "An unknown error occurred."
				break;
		}
	}

	function getFlightsData(coordinates) {
		/*
			this function should retrieve realtime data from adsbexchange.com, but they do not allow CORS, and it would take some time to make backend script to access their data 
			so i have downloaded example of their response and i am using it as if i actualy got it from them
		*/
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE) {
				if (this.status == 200) {
					document.getElementById("success").innerHTML = this.responseText;

					handleFlightData( JSON.parse(this.responseText) );
				}
				else if (this.status == 400) {
					alert('There was an error 400');
				}
				else {
					alert('something else other than 200 was returned');
				}
			}
		};

		/* Bellow is what it would look like if they allowed CORS */
		// req.open("GET", "http://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + coordinates.latitude+ "&lng=" + coordinates.longitude+"&fDstL=0&fDstU=100", true);
		req.open("GET", "/public/json/AircraftList.json?lat=" + coordinates.latitude+ "&lng=" + coordinates.longitude+"&fDstL=0&fDstU=100", true);
		req.send();
	}

	/*
		Main functionality start here
	*/
	function handleFlightData( response ){
		debugger;
	}

	getLocation();
}
