var Norkart = {}; //simple NS

$(document).ready(function() {
	 //starter kartmotoren og putter det i div med id="map". Husk å endre "customer" til din egen ID for å unngå vannmerker. Kontakt Norkart AS (norkart.no) for å få din ID.
    Norkart.map = new WebatlasMap('map', {customer: 'WA_JS_V3_Coursework'});
    //endrer senterpunkt til koordinatene og setter zoomnivå til 5
    Norkart.map.setView(new L.LatLng(64.0, 11.0), 4);
	
	var marker = false;
    function addMarker(markerdata) {
    	//fjern gammel markør
    	Norkart.map.removeLayer(marker);

	    //lag en ny markør og legg til kartet
	    marker = L.marker([markerdata.Latitude, markerdata.Longitude]).addTo(Norkart.map);
	    Norkart.map.setView([markerdata.Latitude, markerdata.Longitude],6);

	    var string;
	    for (var k in markerdata) {
	    	string += k + "  :  " + markerdata[k];
	    }

	    //Knytt en popup til markøren ved klikk.
	    marker.bindPopup(string);
	    //åpne popupen
	    marker.openPopup();
    };

    $( "#addr" ).autocomplete({
    	minLength: 3,
      	source: function( request, response ) {
	        var term = request.term;
	        /**
	        *	Token må endres til kunde/tjenestespesifikk token. Den får du ved å kontakte Norkart AS (norkart.no)
	        */
	        var url = "http://www.webatlas.no/WAAPI-AddressSearch/simpleLookup?format=json&query="+term;
	        $.ajax({
	          	url: url,
	          	type: 'GET',
	          	dataType: 'json',
	          	beforeSend: function (xhr) {
		           xhr.setRequestHeader('X-WAAPI-TOKEN', '575589FB-8546-4AFD-A499-A50CB85345E3');
		        },
	          	success: function( data ) {
		        	console.log(data);
		        	var jqueryData = [];
		        	for(var k in data.Items) {
		        		var addr = data.Items[k];
		        		console.log("1");
		        		console.log(addr);
		        		
						if(addr.Latitude === 0 && addr.Longitude === 0) {
							addr.lbl = addr.Name + " i " + addr.MunicipalityName;
						} else {
							addr.lbl = addr.Name + " " + addr.HouseNumber + " | " + addr.Zip + " " + addr.MunicipalityName;
						}

		        		jqueryData.push({
		        			label: addr.lbl,
		        			data: addr
		        		});
		        	};
		        	console.log(jqueryData);

		          	response( jqueryData );
		      	},
		        error: function(err) { 
		        	$("#log").html("error | " + JSON.stringify(err)); 
		    	}
	        });
    	},
      focus: function( event, ui ) {
        var markerdata = ui.item.data;

 		if(markerdata.Latitude !== 0 && markerdata.Longitude !== 0) {
 			var str = markerdata.Name + " " +  markerdata.HouseNumber;
 			addMarker(markerdata);
 		} else {
 			var str = markerdata.Name;
 		}
		
		$( "#addr" ).val(str);

        return false;
      },
      select: function( event, ui ) {
        $( "#addr" ).val( ui.item.data.Name + " " +  ui.item.data.HouseNumber);

        $( "#log" ).html(JSON.stringify(ui.item.data));
 		var markerdata = ui.item.data;
 		if(markerdata.Latitude !== 0 && markerdata.Longitude !== 0) {
 			addMarker(markerdata);	
	 		//zoom in close on select
	 		Norkart.map.setView([markerdata.Latitude, markerdata.Longitude],17);
 		}


        return false;
      }
    })

	
});
