/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var operation = "A"; //"A"=Adding; "E"=Editing 
var selected_index = -1;  //Index of the selected list item 
var tbClients = localStorage.getItem("tbClients"); //Retrieve the stored data 
tbClients = JSON.parse(tbClients); //Converts string to object 
if(tbClients == null) //If there is no data, initialize an empty array 
	tbClients = []; 
List();
var positiongps;

var map;
var markers=[];
var markerGroup;

$("#divcustomersform").hide();

//localStorage.setItem("tbClients", JSON.stringify([])); 

console.log('initdb ok list');

var app = {
    // Application Constructor
    initialize: function() {

        this.bindEvents();	
			
		app.resizeMap();
		
		//var map = L.map('map-canvas').setView([45.423, -75.679], 13);
		map = L.map('map-canvas').setView([-17.112700, -63.232997], 13);
		
		markerGroup = L.layerGroup().addTo(map);
		//this works, but is online: Mineros -17.112700, -63.232997
		/*
		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18
		}).addTo(map);
		*/
		
		//TODO build something to fall back to web if not found.
		L.tileLayer('img/OSMdroidZIP/{z}/{x}/{y}.png', {
			maxZoom: 17
		}).addTo(map);


		//L.marker([-17.112700, -63.232997]).addTo(map).bindPopup("<b>MINERO</b><br /> :) ").openPopup();
		refreshMapMarkers();


		var popup = L.popup();

		function onMapClick(e) {

			var position = e.latlng.toString(); // LatLng(-17.12102, -63.22761)			

			popup
				.setLatLng(e.latlng)
				//.setContent("You clicked thex map at " +position)
				.setContent("<button type='button' onclick=\"addcustomer('" + position + "' );\">Agregar Cliente</button>")
				.openOn(map);
		}

		map.on('click', onMapClick);
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	resizeMap: function() {
		 $("#map-canvas").height(Math.max(100,$(window).height()-90));// TODO set 
	}	
};

function refreshMapMarkers() {
	markers = [];
	markerGroup.clearLayers();
	/*for(var i = 0; i < this.mapMarkers.length; i++){
	    map.removeLayer(this.mapMarkers[i]);
	}*/

	for (var i in tbClients) { 
		var cli = JSON.parse(tbClients[i]); 
		var posarray = cli.Gps.split(";");
		//L.marker([posarray[0], posarray[1]]).addTo(map).bindPopup("<b>" + cli.Name + "</b> <br />  "  + cli.Phone + "<br />  "  + cli.Email);
		var LamMarker = new L.marker([posarray[0], posarray[1]]);
		LamMarker.bindPopup("<b>" + cli.Name + "</b> <br />  "  + cli.Phone + "<br />  "  + cli.Email);
		LamMarker.dbindex = i;
		markers.push(LamMarker);
		LamMarker.addTo(markerGroup);
		//map.addLayer(markers[i]);
	}
}

function addcustomer( position  ) { // LatLng(-17.12102, -63.22761)	

	//alert( position );
	position = position.replace("LatLng(","");
	position = position.replace(")","");
	//position = position.replace(", ",";");
	positiongps = position.replace(", ",";");

	$("#divmap").hide();
	$("#divcustomerslist").hide();
	$("#divcustomersform").show();
	
}

$(window).resize(function() {
	app.resizeMap();
});


function Add(){ 
	var client = JSON.stringify({ 
		ID : $("#txtID").val(), 
		Name : $("#txtName").val(), 
		Phone : $("#txtPhone").val(), 
		Email : $("#txtEmail").val(), 
		Gps : positiongps 
	}); 
	tbClients.push(client); 
	localStorage.setItem("tbClients", JSON.stringify(tbClients)); 
	alert("CLIENTE AGREGADO."); 
	$("#txtID").val('');
	$("#txtName").val('');
	$("#txtPhone").val('');
	$("#txtEmail").val('');

	$("#divmap").show();
	$("#divcustomerslist").show();
	$("#divcustomersform").hide();

	List();
	refreshMapMarkers();
	map.closePopup();
	return true; 
}

function Cancel(){
	
	$("#txtID").val('');
	$("#txtName").val('');
	$("#txtPhone").val('');
	$("#txtEmail").val('');

	$("#divmap").show();
	$("#divcustomerslist").show();
	$("#divcustomersform").hide();

	List();
	refreshMapMarkers();
	map.closePopup();
	return true; 
}


function Edit(){ 
	tbClients[selected_index] = JSON.stringify({ 
	ID : $("#txtID").val(), 
	Name : $("#txtName").val(), 
	Phone : $("#txtPhone").val(), 
	Email : $("#txtEmail").val() });//Alter the selected item on the table 
	localStorage.setItem("tbClients", JSON.stringify(tbClients)); 
	alert("The data was edited.") 
	operation = "A"; //Return to default value return true; 
} 

function Delete(index){ 
	tbClients.splice(index, 1); 
	localStorage.setItem("tbClients", JSON.stringify(tbClients)); 
	alert("Cliente borrado."); 
	List();
	refreshMapMarkers();
} 

function GotoMap(index){ 
	//alert("GOTO MAP: " + index); 
	var finded = false;
	for (i = 0; i < markers.length && !finded; ++i) {
		if ( markers[i].dbindex == index ) {
			finded = true;
			markers[i].openPopup();
		}
	}
} 


function List(){	
	$("#tblListbody").empty();	

	for(var i in tbClients){ 
		var cli = JSON.parse(tbClients[i]); 
		var isodd = "";
		if(i % 2 == 0)
		{
		  isodd = "class='alt'";
		}
		//$("#tblListbody").append("<tr " + isodd + " >"+ "	<td><img src='img/edit.png' alt='Edit"+i+"' class='btnEdit'/><img src='img/delete.png' alt='Delete"+i+"' class='btnDelete'/><img src='img/marker.png' alt='Marker"+i+"' class='btnMarker'/></td>" + "	<td>"+cli.Name+"</td>" + "	<td>"+cli.Phone+"</td>" + "	<td>"+cli.Email+"</td>" + "</tr>"); 
		$("#tblListbody").append("<tr " + isodd + " >"+ " <td><img src='img/delete.png' onclick='Delete("+i+")' class='btnDelete'/></td>" + "	<td> <a href=# onclick='GotoMap("+i+")' > "+cli.Name+"</a></td>" + "	<td>"+cli.Phone+"</td>" + "	<td>"+cli.Email+"</td>" + "</tr>"); 
	}
}

//Read more: http://mrbool.com/creating-a-crud-form-with-html5-local-storage-and-json/26719#ixzz4kjshaLSf