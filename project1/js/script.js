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
          weight: 4,
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
  updateNewsModal(countryCode);
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

function updateWeatherModal(countryCode, city) {
  $.ajax({
    url: './php/testWeather.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
      city: city,
    },
    success: function (result) {
      let today = new Date();
      let todayWeatherHtml = '';
      let forecastHtml = '';
      let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Today's weather
      const todayForecast = result.forecast[0];
      const todayIconFileName = todayForecast.weather.icon + '.png';
      const todayIconPath = './assets/weatherbit-icons/' + todayIconFileName;

      todayWeatherHtml = `
  <div class="today-forecast d-flex align-items-center">
    <img src="${todayIconPath}" alt="${todayForecast.weather.description}" class="weather-icon me-3" />
    <div class="d-flex flex-column align-items-start">
      <p>${todayForecast.weather.description}</p>
      <p>Max Temp: ${todayForecast.app_max_temp}°C</p>
      <p>Min Temp: ${todayForecast.app_min_temp}°C</p>
      <p class="text-nowrap">Wind Speed: ${todayForecast.wind_spd} m/s</p>
    </div>
  </div>
`;

      $('#todayWeather').html(todayWeatherHtml);

      // Three-day forecast
      for (let i = 1; i < 4; i++) {
        const forecast = result.forecast[i];
        const iconFileName = forecast.weather.icon + '.png';
        const iconPath = './assets/weatherbit-icons/' + iconFileName;

        let forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        // Options for toLocaleDateString to format date as 'Fri 2 Feb'
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        const formattedDate = forecastDate.toLocaleDateString('en-EN', options);

        forecastHtml += `
    <div class="col">
      <div class="forecast-day">
        <h6><strong>${formattedDate}</strong></h6>
        <img src="${iconPath}" alt="${forecast.weather.description}" class="weather-icon" />
        <p>Max Temp: ${forecast.app_max_temp}°C</p>
        <p>Min Temp: ${forecast.app_min_temp}°C</p>
      </div>
    </div>
  `;
      }

      $('#forecastRow').html(
        `<div class="d-flex justify-content-between">${forecastHtml}</div>`
      );
    },

    error: function (xhr, status, error) {
      console.error(
        'An error occurred while fetching the weather forecast:',
        error
      );
      $('#weatherInfo').html(
        '<div class="weather-unavailable">Weather forecast is unavailable.</div>'
      );
    },
  });
}

function updateNewsModal(countryCode) {
  console.log('called');
  $.ajax({
    url: './php/getNews.php',
    type: 'GET',
    data: { countryCode: countryCode },
    dataType: 'json',
    success: function (result) {
      console.log(result);
      if (result.status.description === 'success') {
        if (result.data.length === 0) {
          // No articles found
          $('#newsArticles').html('<p>No news articles available.</p>');
        } else {
          // Articles found
          var articlesHtml = '';
          for (var i = 0; i < result.data.length; i++) {
            var article = result.data[i];
            articlesHtml +=
              '<div class="news-item">' +
              '<h4 class="news-title">' +
              article.title +
              '</h4>' +
              '<img src="' +
              article.image_url +
              '" alt="News Image" class="news-image">' +
              '<p class="news-description">' +
              article.description +
              '</p>' +
              '<a href="' +
              article.article_link +
              '" target="_blank" class="news-link">Read more</a>' +
              '</div>';
          }
          $('#newsArticles').html(articlesHtml);
        }
      } else {
        $('#newsArticles').html(
          '<p>Error: ' + result.status.description + '</p>'
        );
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      $('#newsArticles').html('<p>Error loading news articles.</p>');
    },
  });
}
