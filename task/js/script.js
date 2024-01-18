$(document).ready(function () {
  //Event handler for Ocean API
  $('#ocean-submit').click(function () {
    $.ajax({
      url: 'php/apiList.php',
      type: 'POST',
      dataType: 'json',
      data: {
        oceanLat: $('#ocean-latitude').val(),
        oceanLng: $('#ocean-longitude').val(),
      },
      success: function (result) {
        console.log(JSON.stringify(result));

        if (result.status.name == 'ok') {
          $('#txtOcean').html(result['data']['name']);
        }
      },
      error: function (jqXHR, textStatus, error) {
        if (jqXHR.status === 400) {
          alert(
            'Bad request: ' +
              jqXHR.responseJSON.status.description +
              ' Please enter values.'
          );
        } else {
          console.log('Error occured:' + error);
        }
      },
    });
  });

  //Event handler for neighbourhood API
  $('#neighbourhood-submit').click(function () {
    console.log($('#neighbourhood-latitude').val());
    $.ajax({
      url: 'php/apiList.php',
      type: 'POST',
      dataType: 'json',
      data: {
        neighbourLat: $('#neighbourhood-latitude').val(),
        neighbourLng: $('#neighbourhood-longitude').val(),
      },
      success: function (result) {
        console.log(JSON.stringify(result));

        if (result.status.name == 'ok') {
          $('#txtNeighbour').html(result['data']['city']);
        }
      },
      error: function (jqXHR, textStatus, error) {
        if (jqXHR.status === 400) {
          alert(
            'Bad request: ' +
              jqXHR.responseJSON.status.description +
              ' Please enter valid values.'
          );
        } else {
          console.log('Error occured:' + error);
        }
      },
    });
  });

  //Event handler for findNearbyPlaceName API
  $('#populated-submit').click(function () {
    $.ajax({
      url: 'php/apiList.php',
      type: 'POST',
      dataType: 'json',
      data: {
        populatedLat: $('#populated-latitude').val(),
        populatedLng: $('#populated-longitude').val(),
      },
      success: function (result) {
        console.log(JSON.stringify(result));

        if (result.status.name == 'ok') {
          $('#txtPopulatedPlace').html(result['data'][0]['name']);
        }
      },
      error: function (jqXHR, textStatus, error) {
        if (jqXHR.status === 400) {
          alert(
            'Bad request: ' +
              jqXHR.responseJSON.status.description +
              ' Please enter values.'
          );
        } else {
          console.log('Error occured:' + error);
        }
      },
    });
  });
});
