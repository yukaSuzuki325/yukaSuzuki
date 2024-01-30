var streets = L.tileLayer(
  'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=QSXp2dr5QTfe0499gvor',
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
);

var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }
);
var basemaps = {
  Streets: streets,
  Satellite: satellite,
};

var map = L.map('map', {
  layers: [streets],
}).setView([54.5, -4], 6);

var layerControl = L.control.layers(basemaps).addTo(map);

//Easy Buttons

L.easyButton('fa-info', function (btn, map) {
  var countryCode = $('#countrySelect').val();

  $.ajax({
    url: './php/getCountryInfo.php',
    type: 'GET',
    data: { countryCode: countryCode },
    dataType: 'json',
    success: function (result) {
      if (result && result['data'] && result['data'][0]) {
        $('#txtContinent').html(result['data'][0]['continentName']);
        $('#txtCapital').html(result['data'][0]['capital']);
        $('#txtCurrencyCode').html(result['data'][0]['currencyCode']);
        $('#txtPopulation').html(result['data'][0]['population']);
        $('#txtArea').html(result['data'][0]['areaInSqKm']);

        // Show the modal
        $('#infoModal').modal('show');
      } else {
        console.error('Invalid data structure received:', result);
      }
    },
    error: function (jqXHR, textStatus, error) {
      alert(jqXHR.textStatus);
    },
  });
}).addTo(map);

// Function to update the Wikipedia modal and show it
function updateWikiModal(summary, wikiUrl) {
  $('#txtSummary').text(summary); // Update the summary text
  $('#txtWiki').html(
    '<a href="https://' + wikiUrl + '" target="_blank">Wikipedia Link</a>'
  ); // Update the Wikipedia URL text
  $('#wikiModal').modal('show'); // Show the modal
}

// Wikipedia easyButton click event
L.easyButton('fa-brands fa-wikipedia-w', function (btn, map) {
  var countryName = $('#countrySelect option:selected').text();

  $.ajax({
    url: './php/getWikiPage.php',
    type: 'GET',
    dataType: 'json',
    data: { countryName: countryName },
    success: function (result) {
      if (result.status.code === '200' && result.data) {
        updateWikiModal(result.data.summary, result.data.wikipediaUrl); // Call the function to update and show the modal
      } else {
        console.error(
          'Error fetching Wikipedia data:',
          result.status.description
        );
      }
    },
    error: function (jqXHR, textStatus, error) {
      alert('AJAX error:', textStatus, error);
    },
  });
}).addTo(map);

L.easyButton('fa-cloud-sun', function (btn, map) {
  $('#weatherModal').modal('show');
}).addTo(map);

L.easyButton('fa-sterling-sign', function (btn, map) {
  $('#currencyModal').modal('show');
}).addTo(map);

L.easyButton('fa-clock', function (btn, map) {
  $('#timeZoneModal').modal('show');
}).addTo(map);

//Populate country options in select element
$.ajax({
  url: './php/getCountryOptions.php',
  type: 'GET',
  dataType: 'json',
  success: function (result) {
    var select = $('#countrySelect');
    $.each(result, function (index, country) {
      select.append($('<option>').val(country.iso_a2).text(country.name));
    });
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.log('AJAX error:', textStatus, errorThrown);
  },
});

//Add country border on change
var countryBorderLayer;

$('#countrySelect').on('change', function () {
  // Get the selected country code
  var countryCode = $(this).val();

  // Clear the existing country border layer if it exists
  if (countryBorderLayer) {
    map.removeLayer(countryBorderLayer);
  }

  // Get the new country's border data
  $.ajax({
    url: './php/getCountryBorders.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function (data) {
      countryBorderLayer = L.geoJSON(data, {
        style: {
          color: '#FF7F50',
          weight: 2,
          opacity: 1,
        },
      }).addTo(map);

      map.fitBounds(countryBorderLayer.getBounds());
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(textStatus);
    },
  });
});
