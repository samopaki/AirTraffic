export function loadModal(){
	// Modal button
	var openModal = document.getElementsByClassName('open-modal'),
		modal = document.getElementById('modal-demo'),
		closeModal = document.getElementsByClassName('close-modal')[0],
		logoEl = document.getElementById('logo'),
		mnfEl = document.getElementById('mnf'),
		modelEl = document.getElementById('model'),
		toEl = document.getElementById('to'),
		FlightfromEl = document.getElementById('Flightfrom');

	function toggle(e) {
		var data = e.srcElement.parentElement.parentElement,
			logoURL = data.getAttribute('data-logo'),
			mnf = data.getAttribute('data-mnf'),
			model = data.getAttribute('data-mnf-model'),
			to = data.getAttribute('data-flight-to'),
			Flightfrom = data.getAttribute('data-flight-from');

		if(logoURL !== ""){
			logoEl.src = logoURL;
		} else {
			logoEl.removeAttribute("src");
		}

		mnfEl.innerHTML = mnf;
		modelEl.innerHTML = model;
		toEl.innerHTML = to;
		FlightfromEl.innerHTML = Flightfrom;
		modal.classList.toggle('visible');
		modal.classList.toggle('hidden');
	};

	// Open modal event listener
	for (var i = 0; i < openModal.length; i++) {
		openModal[i].addEventListener('click', toggle, false);
	}

	// Close modal event listener
	closeModal.addEventListener('click', function(){
		modal.classList.remove('visible');
		modal.classList.toggle('hidden');
	});
}