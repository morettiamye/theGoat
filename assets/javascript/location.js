var HERE_API_ID = 'fVtzRsdecK4wdwxwvSmV';
var HERE_APP_CODE = 'MncMVESMhCKZzuCVGwOepw';
var platform;
var map;
var city;
var zip;
var state;

$(document).ready(function () {
    city = localStorage.getItem("city");
    state = localStorage.getItem("state");
    zip = localStorage.getItem("zip");

    InitHereApi();
    
    var address = `${city} ${zip} ${state}`;
    // Create the parameters for the geocoding request:
    var geocodingParams = {
        searchText: address
    };
    // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();
    geocoder.geocode(geocodingParams, onResult, function (e) {
        alert(e);
    });
});
function InitHereApi() {
    //Step 1: initialize communication with the platform
    platform = new H.service.Platform({
        app_id: HERE_API_ID,
        app_code: HERE_APP_CODE,
        useHTTPS: true
    });

     //Step 2: initialize a map - this map is centered over California
     var mapDiv = document.getElementById('map');
     InitMap(mapDiv);
}
function InitMap(mapDiv) {
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
    });
    map = new H.Map(mapDiv,
        defaultLayers.normal.map, {
            center: { lat: 37.376, lng: -122.034 },
            zoom: 15,
            pixelRatio: pixelRatio
        });
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
}
$('#add').click(function () {
    var address = $('#address').val().trim();
    addresses.push(address);
    updateAddressList();
    // Create the parameters for the geocoding request:
    var geocodingParams = {
        searchText: address
    };
    // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();
    geocoder.geocode(geocodingParams, onResult, function (e) {
        alert(e);
    });
});
// Define a callback function to process the geocoding response:
function onResult(result) {
    var locations = result.Response.View[0].Result,
        position,
        marker;
    // Add a marker for each location found
    for (i = 0; i < locations.length; i++) {
        position = {
            lat: locations[i].Location.DisplayPosition.Latitude,
            lng: locations[i].Location.DisplayPosition.Longitude
        };
        marker = new H.map.Marker(position);
        map.addObject(marker);
    }
    var location = locations[0].Location;
    map.setCenter({ lat: location.NavigationPosition[0].Latitude, lng: location.NavigationPosition[0].Longitude });
    map.setZoom(14);
}
function updateAddressList() {
    $('#addressList').empty();
    addresses.forEach(function (address) {
        $('#addressList').append($('<li>').text(address));
    });
}