var threshold = 2.0;		// threshold for temperature change, in degrees C

function setup() {
	// setup will be called when the HTML page body loads
	
	// add event listeners for all inputs:
	setPoint.addEventListener('change', updateDisplay, false);
	// set an interval timer to start the temperature change:
	setInterval(changeTemperature, 2000);
}

function updateDisplay() {
	// update the labels from the input and output values
	setPointLabel.innerHTML = setPoint.value;
	tempLabel.innerHTML = temperature.value;
	// change the temperature optimal range based on the setPoint:
	temperature.optimum = setPoint.value;
	temperature.high = temperature.optimum + threshold;
	temperature.low = temperature.optimum - threshold;
	
	// update the system status based on the temperature optimum:
	if (temperature.value >= temperature.high) {
		// system should be cooling
		statusLabel.innerHTML = "cooling";
	} else if (temperature.value <= temperature.low) {
		// system should be heating
		statusLabel.innerHTML = "heating";
	} else {
		// system should be off
		statusLabel.innerHTML = "off";
	}
}

function changeTemperature() {
	// temperature changes based on system status and outside conditions
	switch (statusLabel.innerHTML) {
		case 'cooling':		// temperature should be going down
			temperature.value -= Math.random();	// subtract a number between 0 and 1
			break;
		case 'heating': 		// temperature should be going up
			temperature.value += Math.random();	// add a number between 0 and 1
			break;
		case 'off':				// temperature could go either way
			temperature.value += 2*Math.random() - 1; // add a number between -1 and 1
			break;
	}
	// update the display when the temperature changes:
	updateDisplay();
}