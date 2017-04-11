// instance vars
var mapObject; var geocoder; var directionsRenderer; var options;

function calculateRoute(from, to) {
  var directionsService = new google.maps.DirectionsService(); // init directions
  // updateMap(options.center.lat(), options.center.lng());

  var directionsRequest = {
    origin: from,
    destination: to,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  }; // make edirections request to resolve the path

  directionsService
    .route(directionsRequest, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        if(directionsRenderer) {
          directionsRenderer.setMap(null);
        }
        directionsRenderer = new google.maps.DirectionsRenderer({
          map: mapObject, directions: response
        });
      } else {
        $("#error").append("<p>"+status+"</p>");
      }
    }
  );
}

/*function updateMap(plat, plng) {
  mapObject.setCenter({lat : plat,lng : plng});
}*/

$(document).ready(function() {
  $("body").css('display', 'none');
  $("body").fadeIn(1500);

  geocoder = new google.maps.Geocoder();

  if (navigator.geolocation) { // check if browser supports
    navigator.geolocation.getCurrentPosition(function (position) { // load current pos

      geocoder.geocode({
        "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $("#input-origin").val(results[0].formatted_address);
          $("#input-destination").focus();
        } else {
          $("#error").append("<p>"+status+"</p>");
        }
      });

      // configure map properties ad init
      options = {
        zoom: 12,
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      mapObject = new google.maps.Map(document.getElementById("map"), options);
      setTimeout(function(){
        var json = '{ "position": "initial", "overflow": "visible" }';
        $("#map").css(JSON.parse(json));
      }, 2000);

      // attach click listener to the map
      google.maps.event.addListener(mapObject, 'click', function(event) {
        geocoder.geocode({'latLng': event.latLng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              $("#input-destination").val(results[0].formatted_address);
              $("#input-destination").focus();
              calculateRoute($("#input-origin").val(), $("#destination").val());
            }
          }
        });
      });

    });
  } // end of browser support

  $("#find-route").submit(function(event) { // on click submit
    event.preventDefault();
    calculateRoute($("#input-origin").val(), $("#input-destination").val()); // request to render the path
  });
});


(function() {
  // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
  if (!String.prototype.trim) {
    (function() {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }

  [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
    // in case the input is already filled..
    if( inputEl.value.trim() !== '' ) {
      classie.add( inputEl.parentNode, 'input--filled' );
    }

    // events:
    inputEl.addEventListener( 'focus', onInputFocus );
    inputEl.addEventListener( 'blur', onInputBlur );
    $("#input-origin").focus();
  } );

  function onInputFocus( ev ) {
    classie.add( ev.target.parentNode, 'input--filled' );
    console.log('ehre!');
  }

  function onInputBlur( ev ) {
    if( ev.target.value.trim() === '' ) {
      classie.remove( ev.target.parentNode, 'input--filled' );
    }
  }
})();
