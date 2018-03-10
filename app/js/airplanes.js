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
					// document.getElementById("success").innerHTML = this.responseText;

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
		var flights = response.acList;
		var ul=document.createElement('ul');

		flights.sort(compare);
		// window.lastResponse = flights;

		flights.forEach( function( flight ){
			// debugger;
			var orientation;
			var altitude = flight.Alt;
			var fcn = flight.Icao;
			var fId = flight.Id;
			var manufacturer = flight.Man;
			var manufacturerLogo = getPlaneLogo(manufacturer, fId);
			var manufacturerModel = flight.Mdl;
			var FlightTo = flight.To;
			var FlightFrom = flight.From;
			var li = document.createElement('li');
			li.setAttribute("id", fId);

			if( flight.Trak <= 180 ){
				orientation = "E";
			} else {
				orientation = "W";
			}

			li.innerHTML="<a href=''>Orientation: "+ orientation +"Altitude : "+ altitude +" Flight code number: "+ fcn +"</a>";
			ul.appendChild(li);
			document.getElementById('success').appendChild(ul);
			document.getElementById(fId).dataset.mnf = manufacturer;
			document.getElementById(fId).dataset.mnfModel = manufacturerModel;
			document.getElementById(fId).dataset.flightTo = FlightTo;
			document.getElementById(fId).dataset.flightFrom = FlightFrom;
			
		});
	}

	function compare(a, b) {
		if (a.Alt > b.Alt){
			return -1;
		}

		if (a.Alt < b.Alt){
			return 1;
		}

		return 0;
	}

	function getPlaneLogo (name, fId){
		var req = new XMLHttpRequest();

		req.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE) {
				if (this.status == 200) {
					var logoUrlTmp =(JSON.parse(this.responseText));

					if( logoUrlTmp[0] == undefined) {
						setDataForPlaneLogo("logo not found", fId);
						return false;
					}
					logoUrlTmp = logoUrlTmp[0].logo;
					setDataForPlaneLogo(logoUrlTmp, fId);
				}
				else if (this.status == 400) {
					alert('There was an error 400');
				}
				else {
					alert('something else other than 200 was returned');
				}
			}
		};
		req.open("GET", "https://autocomplete.clearbit.com/v1/companies/suggest?query=:" + name + "", true);
		req.send();
	}
	function setDataForPlaneLogo(manufLogo, fId){
		document.getElementById(fId).dataset.logo = manufLogo;
	}
	getLocation();
}
