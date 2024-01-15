$(document).ready(function () {
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
        console.log('success');
        console.log(JSON.stringify(result));

        if (result.status.name == 'ok') {
          $('#txtOcean').html(result['data']['name']);
        }
      },
      error: function (jqXHR, textStatus, error) {
        console.log('Error occured:' + error);
      },
    });
  });

  //   $('#neighbourhood-submit').click(function () {});

  //   $('neighbourhood-submit').click(function () {});
});
