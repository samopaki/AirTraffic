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

		flights.sort(compare);
		// window.lastResponse = flights;

		flights.forEach( function( flight ){
			var orientation = "";

			if( flight.Trak <= 180 ){
				orientation = "E";
			} else {
				orientation = "W";
			}

			var tr = document.createElement('TR'),
				tdO = document.createElement('TD'),
				tdA = document.createElement('TD'),
				tdFN = document.createElement('TD'),
				tdDetails = document.createElement('TD'),
				imgOrie = createImg(orientation),
				txtA = document.createTextNode(flight.Alt),
				txtFN = document.createTextNode(flight.Icao),
				detailsButton = createButton();
				
			tr.setAttribute("id", flight.Id);
			getPlaneData(flight.Man, flight.Id); //getting plane data from https://clearbit.com/logo for logo image
			tdO.appendChild(imgOrie);
			tr.appendChild(tdO);
			tdA.appendChild(txtA);
			tr.appendChild(tdA);
			tdFN.appendChild(txtFN);
			tr.appendChild(tdFN);
			tdDetails.appendChild(detailsButton);
			tr.appendChild(tdDetails);
			document.getElementById('data').appendChild(tr);
			tr.dataset.mnf = flight.Man;
			tr.dataset.mnfModel = flight.Mdl;
			tr.dataset.flightTo = flight.To;
			tr.dataset.flightFrom = flight.From;
			
		});
	}
	function createImg(orientation) {
		var x = document.createElement("IMG");
		x.setAttribute("src", "../app/img/Airplane-Left-Red-icon.png");
		x.setAttribute("width", "100");
		x.setAttribute("height", "100");
		if(orientation === "E"){
			x.setAttribute("alt", "Right");
			x.setAttribute("class", "rotateImg");
			document.body.appendChild(x);
			return x;
		}
		x.setAttribute("alt", "Left");
		return x;
	}

	function createButton() {
		var x = document.createElement("BUTTON");
		var t = document.createTextNode("Open details");
		x.appendChild(t);
		return x;
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

	function getPlaneData (name, fId){
		var req = new XMLHttpRequest();

		req.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE) {
				if (this.status == 200) {
					var logoUrlTmp =(JSON.parse(this.responseText));

					if( logoUrlTmp[0] == undefined) {
						setLogoData("logo not found", fId);
						return false;
					}
					logoUrlTmp = logoUrlTmp[0].logo;
					setLogoData(logoUrlTmp, fId);
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
	function setLogoData(manufLogo, fId){
		document.getElementById(fId).dataset.logo = manufLogo;
	}
	getLocation();
}
