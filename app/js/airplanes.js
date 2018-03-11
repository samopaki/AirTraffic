import {loadModal} from './modal'
export var startApp = function() {
	var message = document.getElementById("error"),
		content = document.getElementById('content');

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

		message.classList.add("hidden");

		getFlightsData( coords );

		setInterval( function(){
			getFlightsData( coords )
		}, 60000);
	}

	function handleGeoLocationError(error) {
		content.classList.add("hidden");
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
					loadModal();
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
		var flights = response.acList,
			numberOfFlights = flights.length,
			isLast = false;

		document.getElementById('data').innerHTML = "";

		flights.sort(compare);
		// window.lastResponse = flights;

		flights.forEach( function( flight, index ){
			var orientation = "",
				noInfo = "No information in database";

			if( flight.Trak <= 180 ){
				orientation = "E";
			} else {
				orientation = "W";
			}

			var rowTpl = [
				'<tr id="' + flight.Id + '',
						'" data-mnf="' + (flight.Man == undefined ? noInfo : flight.Man) + '',
						'" data-mnf-model="' + (flight.Mdl == undefined ? noInfo : flight.Mdl) + '',
						'" data-flight-to="' + (flight.To == undefined ? noInfo : flight.To) + '',
						'" data-flight-from="' + (flight.From == undefined ? noInfo : flight.From) + '">',
					'<td>',
						'<img src="../app/img/Airplane-Left-Red-icon.png" width="100" height="100" ',
						'' + (orientation === "E" ? 'alt="Right" class="rotateImg"' : 'alt="Left" >') + '',
					'</td>',
					'<td>' + flight.Alt + '</td>',
					'<td>' + flight.Icao + '</td>',
					'<td>',
						'<button class="open-modal" class="triger-modal" data-triger="modal-demo">Open details</button>',
					'</td>',
				'</tr>'
			].join('');

			document.getElementById('data').insertAdjacentHTML( 'beforeend', rowTpl );

			if( numberOfFlights === index+1 ){
				isLast = true;
			}

			getPlaneData(flight.Man, flight.Id, isLast); //getting plane data from https://clearbit.com/logo for logo image
		});
	}

	function checkHash(){
		var hash = window.location.hash.substr(1);

		if(hash != ''){
			var isThere = document.getElementById(''+hash+'');

			if(isThere){
				var detailsBtn = isThere.querySelector('button');
				detailsBtn.click();
			}
		}
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

	function getPlaneData (name, fId, isLast){
		var req = new XMLHttpRequest();

		req.onreadystatechange = function() {
			if (this.readyState == XMLHttpRequest.DONE) {
				if (this.status == 200) {
					var logoUrlTmp =(JSON.parse(this.responseText));

					if( logoUrlTmp[0] == undefined) {
						setLogoData("", fId);
						return false;
					}

					logoUrlTmp = logoUrlTmp[0].logo;
					setLogoData(logoUrlTmp, fId, isLast);
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
	function setLogoData(manufLogo, fId, isLast){
		document.getElementById(fId).dataset.logo = manufLogo;

		if(isLast){
			checkHash();
			content.classList.remove("hidden");
		}
	}
	getLocation();
}

