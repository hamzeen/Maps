var map;
var infowindow;
var service;
var markers = [];

$(document).ready(function() {
  navigator.geolocation.getCurrentPosition(initialize);
  $("#get-nearby").focus();
});

function initialize(location) {
    var myLatlng = new google.maps
                    .LatLng(location.coords.latitude,location.coords.longitude);
    var mapOptions = {
        center: myLatlng,
        zoom: 15
    };

    map = new google.maps.Map(document.getElementById("maps"),mapOptions);
    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: "My place"
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent('I\'m Here!');
      infowindow.open(map, this);
    });
}

function performSearch(pName) {
    removeMarkers();
    var request = {bounds: map.getBounds(),name: pName};
    service.nearbySearch(request, handleSearchResults);
}

function handleSearchResults(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

      function removeMarkers() {
        for(i=1; i< markers.length; i++) {
          markers[i].setMap(null);
        }
      }
