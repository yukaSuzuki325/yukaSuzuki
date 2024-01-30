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

L.easyButton('fa-cloud-sun', function (btn, map) {
  $('#weatherModal').modal('show');
}).addTo(map);

L.easyButton('fa-sterling-sign', function (btn, map) {
  $('#currencyModal').modal('show');
}).addTo(map);

L.easyButton('fa-brands fa-wikipedia-w', function (btn, map) {
  $('#wikiModal').modal('show');
}).addTo(map);

L.easyButton('fa-clock', function (btn, map) {
  $('#timeZoneModal').modal('show');
}).addTo(map);

//Populate country options in select element
$.ajax({
  url: './php/getCountryCode.php',
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
