
var threshold = 2.0;			// temperature change threshold, in deg. C

// when page is ready, run this to bind UI listeners, etc.
function bindEvents() {
	// bind this function to the setPoint slider's change:
	setPoint.addEventListener('change',  updateSetPoint, false);
	updateDisplay();
}


// open a connection to the serial server:
var socket = io.connect('http://localhost:8080');

 // when you get a serialdata event, do this:
socket.on('serialEvent', function (data) {
	// set the stuff inside the element's HTML tags to
	// whatever the 'value' property of the received data is:
	temperature.value = data.temp;
	setPoint.value = data.setPoint;
	updateDisplay();
});
	
		
var updateSetPoint = function() {
	updateDisplay();
	socket.emit('socketEvent', { "setPoint" : setPoint.value });
};


function updateDisplay() {
	setPointVal.innerHTML = setPoint.value + '&deg;C';
	temperature.high = setPoint.value + threshold;
	temperature.low = setPoint.value - threshold;
	temperature.optimum = setPoint.value;	
	
		// update the temperature text label:
	tempVal.innerHTML = temperature.value + '&deg;C';
	
	// depending on the new temperature, 
	// change the state of the system.
	// if the difference is past the threshold:		
	if (Math.abs(temperature.value - setPoint.value) > threshold) {
		// if temp > setPoint, cool off:
		if (temperature.value > setPoint.value) {
			state.innerHTML = 'cooling';
		} else {
			// if temp < setPoint, heat up:
			state.innerHTML = 'warming';	
		}
	// if within threshold, turn system off:
	} else {
		state.innerHTML = 'off';		
	}
}
