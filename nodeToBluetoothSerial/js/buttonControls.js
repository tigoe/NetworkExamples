function setup() {
	fwdButton.addEventListener('click', sendButton, false);
	backButton.addEventListener('click', sendButton, false);
	urButton.addEventListener('click', sendButton, false);
	rButton.addEventListener('click', sendButton, false);
	ulButton.addEventListener('click', sendButton, false);
	lButton.addEventListener('click', sendButton, false);
	stopButton.addEventListener('click', sendButton, false);
	endButton.addEventListener('click', sendButton, false);
}
		
function sendButton(event) {
	$.get("/data/"+ this.value);
}
