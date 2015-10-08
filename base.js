
$(document).on('ready',function(){
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab
	  if(target == "#tab-global-view"){
	  	loadRawData();
	  }
	  else if (target=="#tab-monthly-view"){
	  	loadRawData();
	  }
	  else if(target == "#tab-ticket-manager"){
	  	var iframe = $('iframe');
	  	if(iframe.attr('src') == ""){
		  	iframe.attr('src', function() {
	        return 'https://docs.google.com/spreadsheets/d/14-OdukK3LA9KNa0u-6T0Xl6qgQYmzoFSipIWV0UuEfA/edit?usp=sharing&single=true&gid=0&range=A1%3AE4&output=html';
	    	});
	  	}
	  }
	});
})