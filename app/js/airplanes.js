export var geoLocation = function() {
	var message = document.getElementById("error");

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else { 
			message.innerHTML = "Geolocation is not supported by this browser.";
		}
	}

	function showPosition(position) {
		var coords = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};
		console.log(coords);
	}

	function showError(error) {
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
		
		return error.code;
	}
	getLocation();
}
