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

const infoBtn = L.easyButton(
  'fa-info',
  function (btn, map) {
    $('#infoModal').modal('show');
  },
  'Contry overview'
).addTo(map);

const weatherBtn = L.easyButton(
  'fa-cloud-sun',
  function (btn, map) {
    $('#weatherModal').modal('show');
  },
  'Weather forecast'
).addTo(map);

const newsBtn = L.easyButton(
  'fa-radio',
  function (btn, map) {
    $('#newsModal').modal('show');
  },
  'Latest local news'
).addTo(map);

const recipeBtn = L.easyButton(
  'fa-utensils',
  function (btn, map) {
    $('#recipeModal').modal('show');
  },
  'Recipes of local dishes'
).addTo(map);

const currencyBtn = L.easyButton(
  'fa-sterling-sign',
  function (btn, map) {
    $('#currencyModal').modal('show');
  },
  'Currency converter'
).addTo(map);

const wikiBtn = L.easyButton(
  'fa-brands fa-wikipedia-w',
  function (btn, map) {
    $('#wikiModal').modal('show');
  },
  'Wikipedia link'
).addTo(map);

infoBtn.button.style.padding = '0px';
weatherBtn.button.style.padding = '0px';
newsBtn.button.style.padding = '0px';
recipeBtn.button.style.padding = '0px';
currencyBtn.button.style.padding = '0px';
wikiBtn.button.style.padding = '0px';

//Markers
var parkMarker = L.ExtraMarkers.icon({
  icon: 'fa-solid fa-tree',
  svg: true,
  markerColor: '#b7d6b9',
  iconColor: '#0e7c61',
  shape: 'circle',
  prefix: 'fa',
});

var airportMarker = L.ExtraMarkers.icon({
  icon: 'fa-solid fa-plane',
  svg: true,
  markerColor: '#9dc1d1',
  iconColor: '#00308F',
  shape: 'circle',
  prefix: 'fa',
});

var museumMarker = L.ExtraMarkers.icon({
  icon: 'fa-solid fa-building-columns',
  svg: true,
  markerColor: '#f5bcc6',
  iconColor: '#b0376d',
  shape: 'circle',
  prefix: 'fa',
});

var markers = L.markerClusterGroup();

//Populate country options in select element
$.ajax({
  url: './php/getCountryOptions.php',
  type: 'GET',
  dataType: 'json',
  success: function (result) {
    if (result.status.code === '200') {
      var select = $('#countrySelect');
      $.each(result.data, function (index, country) {
        select.append($('<option>').val(country.iso_a2).text(country.name));
      });
    } else {
      alert('Unable to populate countries');
    }
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
var countryName;
var ratesObj;
var parkMarkers = L.layerGroup().addTo(map);
var airportMarkers = L.layerGroup().addTo(map);
var museumMarkers = L.layerGroup().addTo(map);
var parkMarkersCluster = L.markerClusterGroup();
var airportMarkersCluster = L.markerClusterGroup();
var museumMarkersCluster = L.markerClusterGroup();

// Initialize the clusters on the map
map.addLayer(parkMarkersCluster);
map.addLayer(airportMarkersCluster);
map.addLayer(museumMarkersCluster);

$('#amount').on('keyup', calcResult);
$('#fromCurrency, #toCurrency').on('change', calcResult);

//On change, add country border, update map, markers and modals
$('#countrySelect').on('change', function () {
  $('.loader-container').show();
  // Get the selected country code
  countryCode = $(this).val();
  countryName = $('#countrySelect option:selected').text();

  // Clear the existing country border layer
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
    success: function (result) {
      if (result.status.code === '200') {
        countryBorderLayer = L.geoJSON(result.data, {
          style: {
            color: '#FF7F50',
            weight: 4,
            opacity: 1,
          },
        }).addTo(map);

        map.fitBounds(countryBorderLayer.getBounds());
      } else {
        alert(result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(textStatus);
    },
  });

  // Fetch and update park markers
  $.ajax({
    url: './php/getParks.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      if (result.status.code === 200) {
        clearAndAddMarkers(
          result.data,
          parkMarkersCluster,
          parkMarker,
          'Parks'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(textStatus);
    },
  });

  // Fetch and update airport markers
  $.ajax({
    url: './php/getAirports.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      if (result.status.code === 200) {
        clearAndAddMarkers(
          result.data,
          airportMarkersCluster,
          airportMarker,
          'Airports'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(textStatus);
    },
  });

  // Fetch and update museum markers
  $.ajax({
    url: './php/getMuseums.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      if (result.status.code === 200) {
        clearAndAddMarkers(
          result.data,
          museumMarkersCluster,
          museumMarker,
          'Museums'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(textStatus);
    },
  });

  updateInfoModal();
  updateNewsModal(countryCode);
  updateWikiModal();

  setTimeout(function () {
    $('.loader-container').fadeOut(2500, function () {
      $(this).css('display', 'none');
    });
  }, 2500);
});

function clearAndAddMarkers(data, markerClusterGroup, markerIcon, overlayName) {
  // Clear existing overlays and markers
  layerControl.removeLayer(markerClusterGroup);
  markerClusterGroup.clearLayers();

  // Create markers and add them to the cluster group
  data.forEach(function (item) {
    var marker = L.marker([item.lat, item.lng], { icon: markerIcon });
    marker.bindPopup(item.name);
    markerClusterGroup.addLayer(marker);
  });

  // Add the cluster group and overlay
  map.addLayer(markerClusterGroup);
  layerControl.addOverlay(markerClusterGroup, overlayName);
}

function updateInfoModal() {
  $.ajax({
    url: './php/getCountryInfo.php',
    type: 'GET',
    data: { countryCode: countryCode },
    dataType: 'json',
    success: function (result) {
      if (result.status.code === 200) {
        var capital = result['data'][0]['capital'];
        var demonym = result['data'][0]['demonyms'].eng.f;
        var currencyCode = result['data'][0]['currencyCode'];

        var languages = result['data'][0]['languages'];
        var languageHtml = languages[0];
        if (languages.length > 1) {
          for (let i = 1; i < languages.length; i++) {
            languageHtml += `, ${languages[i]}`;
          }
        }

        $('#txtOfficialName').html(result['data'][0]['officialName']);
        $('#txtContinent').html(result['data'][0]['continents']);
        $('#txtCapital').html(capital);
        $('#txtPopulation').html(
          numeral(result['data'][0]['population']).format('0,0')
        );
        $('#txtArea').html(numeral(result['data'][0]['area']).format('0,0'));
        $('#txtLanguage').html(languageHtml);
        $('#txtCurrencyCode').html(currencyCode);

        updateWeatherModal(countryCode, capital, countryName);
        updateRecipeModal(demonym);
        updateCurrencyModal(currencyCode);
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
      if (result.status.code === '200') {
        var summaryText = result.data.summary;

        var wikipediaLink =
          '<a href="https://' +
          result.data.wikipediaUrl +
          '" target="_blank"> Read more on Wikipedia</a>';
        summaryText = summaryText + wikipediaLink;
        $('#txtSummary').html(summaryText);
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

function updateWeatherModal(countryCode, city, countryName) {
  $.ajax({
    url: './php/testWeatherForecast.php',
    type: 'GET',
    dataType: 'json',
    data: {
      countryCode: countryCode,
      city: city,
    },
    success: function (result) {
      if (result.status.code === 200) {
        let today = new Date();
        let todayWeatherHtml = '';
        let forecastHtml = '';

        // Today's weather
        const todayForecast = result.data.forecast[0];
        const todayIconFileName = todayForecast.weather.icon + '.png';
        const todayIconPath = './assets/weatherbit-icons/' + todayIconFileName;
        const windSpeedMPH = todayForecast.wind_spd * 2.23694;

        todayWeatherHtml = `
  <div class="today-forecast d-flex align-items-center">
    <img src="${todayIconPath}" alt="${
          todayForecast.weather.description
        }" class="weather-icon me-5" />
    <div class="d-flex flex-column align-items-center">      
      <h3><strong>${todayForecast.app_max_temp}°C</strong></h3>
      <h5 class="mt-2">${todayForecast.app_min_temp}°C</h5>
      <h5 class="mt-1 text-nowrap">${windSpeedMPH.toFixed(0)} mph</h5>
    </div>
  </div>
`;

        $('#todayWeather').html(todayWeatherHtml);
        $('#weatherModalLabel').html(city + ', ' + countryName);
        $('#weatherDescription').html(todayForecast.weather.description);

        // Three-day forecast
        for (let i = 1; i < 4; i++) {
          const forecast = result.data.forecast[i];
          const iconFileName = forecast.weather.icon + '.png';
          const iconPath = './assets/weatherbit-icons/' + iconFileName;

          forecastHtml += `
    <div class="col">
      <div class="forecast-day">
        <h5><strong>${Date.parse(forecast.datetime).toString(
          'ddd dS'
        )}</strong></h5>
        <img src="${iconPath}" alt="${
            forecast.weather.description
          }" class="weather-icon" />
        <h5 class="fw-semibold">${forecast.app_max_temp}°C</h5>
        <p>${forecast.app_min_temp}°C</p>
      </div>
    </div>
  `;
        }

        $('#forecastRow').html(
          `<div class="d-flex justify-content-between">${forecastHtml}</div>`
        );
      } else {
        $('#today-text').hide();
        $('#weatherDescription').html(
          '<div class="weather-unavailable">Weather forecast is unavailable.</div>'
        );
      }
    },

    error: function (xhr, status, error) {
      console.error(
        'An error occurred while fetching the weather forecast:',
        error
      );
      $('#today-text').hide();
      $('#weatherDescription').html(
        '<div class="weather-unavailable">Weather forecast is unavailable.</div>'
      );
    },
  });
}

function updateNewsModal(countryCode) {
  $.ajax({
    url: './php/getNews.php',
    type: 'GET',
    data: { countryCode: countryCode },
    dataType: 'json',
    success: function (result) {
      if (result.status.code === 200) {
        if (result.data.length === 0) {
          // No articles found
          $('#newsArticles').html('<p>No news articles available.</p>');
        } else {
          // Articles found
          var articlesHtml = '';
          for (var i = 0; i < result.data.length; i++) {
            var article = result.data[i];
            articlesHtml +=
              '<table class="table table-borderless">' +
              '<tr>' +
              '<td rowspan="2" width="50%">' +
              '<img class="img-fluid rounded mx-auto d-block" src="' +
              article.image_url +
              '" alt="' +
              article.title +
              '">' +
              '</td>' +
              '<td>' +
              '<a href="' +
              article.link +
              '" class="fw-bold fs-6 text-black" target="_blank">' +
              article.title +
              '</a>' +
              '</td>' +
              '</tr>' +
              '<tr>' +
              '<td class="align-bottom pb-0">' +
              '<p class="fw-light fs-6 mb-1">' +
              article.creator +
              '</p>' +
              '</td>' +
              '</tr>' +
              '</table>' +
              '<hr>';
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

function updateRecipeModal(demonym) {
  $.ajax({
    url: './php/getRecipes.php',
    type: 'GET',
    data: { demonym: demonym },
    dataType: 'json',
    success: function (result) {
      if (result.status.code === 200) {
        if (result.data.length > 0) {
          var recipesHtml = '';
          result.data.forEach(function (recipe, index) {
            recipesHtml +=
              '<div class="recipe-item mb-3">' +
              '<h4 class="recipe-title">' +
              recipe.title +
              '</h4>' +
              '<p class="recipe-servings">' +
              recipe.servings +
              '</p>' +
              '<h6>Instructions</h6><p class="recipe-instructions">' +
              recipe.instructions +
              '</p>' +
              '</div>';
          });
          $('#recipes').html(recipesHtml);
        } else {
          // No recipes found
          $('#recipes').html('<p>No recipes available.</p>');
        }
      } else {
        $('#recipes').html('<p>Error: ' + result.status.description + '</p>');
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      $('#recipes').html('<p>Error loading recipes.</p>');
    },
  });
}

function updateCurrencyModal(currencyCode) {
  $.ajax({
    url: './php/getCurrencyRates.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code === 200) {
        var currenciesCodes = Object.keys(result['data']['rates']);
        ratesObj = result['data']['rates'];
        var fromCurrencySelect = $('#fromCurrency');
        var toCurrencySelect = $('#toCurrency');
        fromCurrencySelect.empty();
        toCurrencySelect.empty();

        for (let i = 0; i < currenciesCodes.length; i++) {
          fromCurrencySelect.append(
            $('<option></option>')
              .val(currenciesCodes[i])
              .html(currenciesCodes[i])
              .prop('selected', currenciesCodes[i] === 'GBP')
          );

          toCurrencySelect.append(
            $('<option></option>')
              .val(currenciesCodes[i])
              .html(currenciesCodes[i])
              .prop('selected', currenciesCodes[i] === currencyCode)
          );
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('An error occurred: ' + textStatus);
    },
  });
}

function calcResult() {
  var amount = parseFloat($('#amount').val());

  var fromCurrency = $('#fromCurrency').val();
  var toCurrency = $('#toCurrency').val();

  var fromRate = ratesObj[fromCurrency];
  var toRate = ratesObj[toCurrency];

  var convertedAmount = (amount / fromRate) * toRate;
  console.log(convertedAmount);

  $('#resultBox').val(convertedAmount.toFixed(2));
}
