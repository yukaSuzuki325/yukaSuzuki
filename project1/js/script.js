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
  $('#infoModal').modal('show');
}).addTo(map);

L.easyButton('fa-brands fa-wikipedia-w', function (btn, map) {
  $('#wikiModal').modal('show');
}).addTo(map);

L.easyButton('fa-cloud-sun', function (btn, map) {
  $('#weatherModal').modal('show');
}).addTo(map);

L.easyButton('fa-sterling-sign', function (btn, map) {
  $('#currencyModal').modal('show');
}).addTo(map);

L.easyButton('fa-radio', function (btn, map) {
  $('#newsModal').modal('show');
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

getUserLocation();

function getUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        $.ajax({
          url: './php/getCountryCode.php',
          data: {
            lat: lat,
            lng: lng,
          },
          success: function (result) {
            var userCountryCode = result.data.countryCode;
            // Update dropdown list
            $('#countrySelect').val(userCountryCode).trigger('change');
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('error:', textStatus, errorThrown);
          },
        });
      },
      function (error) {
        console.error('Error Code = ' + error.code + ' - ' + error.message);
      }
    );
  } else {
    console.log('Geolocation is not supported.');
  }
}

var countryBorderLayer;
var countryCode;
var capital;

//On change, add country border, update map, update modals
$('#countrySelect').on('change', function () {
  // Get the selected country code
  countryCode = $(this).val();

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

  updateInfoModal();
  updateWikiModal();
});

function updateInfoModal() {
  $.ajax({
    url: './php/getCountryInfo.php',
    type: 'GET',
    data: { countryCode: countryCode },
    dataType: 'json',
    success: function (result) {
      if (result && result['data'] && result['data'][0]) {
        capital = result['data'][0]['capital'];
        $('#txtContinent').html(result['data'][0]['continentName']);
        $('#txtCapital').html(capital);
        $('#txtCurrencyCode').html(result['data'][0]['currencyCode']);
        $('#txtPopulation').html(result['data'][0]['population']);
        $('#txtArea').html(result['data'][0]['areaInSqKm']);

        updateWeatherModal(countryCode, capital);
      } else {
        console.error('Invalid data structure received:', result);
      }
    },
    error: function (jqXHR, textStatus, error) {
      alert(jqXHR.textStatus);
    },
  });
}

function updateWikiModal() {
  var countryName = $('#countrySelect option:selected').text();
  $.ajax({
    url: './php/getWikiPage.php',
    type: 'GET',
    dataType: 'json',
    data: { countryName: countryName },
    success: function (result) {
      if (result.status.code === '200' && result.data) {
        $('#txtSummary').text(result.data.summary);
        $('#txtWiki').html(
          '<a href="https://' +
            result.data.wikipediaUrl +
            '" target="_blank">Wikipedia Link</a>'
        );
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
}

function updateWeatherModal(countryCode, capital) {
  $.ajax({
    url: './php/getWeatherForecast.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
      city: capital,
    },
    success: function (response) {
      let forecastHtml = '';
      for (let i = 0; i < 4; i++) {
        const dayForecast = response.data[i];
        forecastHtml += `<div class="forecast-day">
          <h5>${dayForecast.datetime}</h5>
          <p>Max Temp: ${dayForecast.max_temp}°C</p>
          <p>Min Temp: ${dayForecast.min_temp}°C</p>
          <p>${dayForecast.weather.description}</p>
        </div>`;
      }
      $('#weatherInfo').html(forecastHtml);
    },
    error: function (xhr, status, error) {
      console.error(
        'An error occurred while fetching the weather forecast:',
        error
      );
    },
  });
}
