
$(function(){
	$('#redSlider').slider({
	 orientation:'vertical',
	 range: 'min',
	 value: '0',
	 stop: function( event, ui ) {
            $.get(
    			"/output/r/" + ui.value,
    			function(data) {
      				 $("#redLabel").html(ui.value);
    			}
			);
     	}
	});
});


$(function(){
	$('#greenSlider').slider({
	 orientation:'vertical',
	 range: 'min',
	 value: '0',
	 stop: function( event, ui ) {
            $.get(
    			"/output/g/" + ui.value,
    			function(data) {
      				 $("#greenLabel").html(ui.value);
    			}
			);
     	}
	});
});


$(function(){
	$('#blueSlider').slider({
	 orientation:'vertical',
	 range: 'min',
	 value: '0',
	 stop: function( event, ui ) {
            $.get(
    			"/output/b/" + ui.value,
    			function(data) {
      				 $("#blueLabel").html(ui.value);
    			}
			);
     	}
	});
});