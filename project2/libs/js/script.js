const getAllPersonnel = () => {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;
        const cardsContainer = $('#employee-cards');
        cardsContainer.empty(); // Clear existing cards

        data.forEach((employee) => {
          const cardHtml = `
                      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                          <div class="card h-100">
                              <div class="card-body">
                                  <h5 class="card-title">${employee.firstName} ${employee.lastName}</h5>
                                  <p class="card-text"><strong>Department:</strong> ${employee.department}</p>
                                  <p class="card-text"><strong>Location:</strong> ${employee.location}</p>
                                  <p class="card-text"><strong>Email:</strong> ${employee.email}</p>
                              </div>
                              <div class="card-footer d-flex justify-content-end">
                              <button type="button" class="btn " data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="23">
                              <i class="fa-solid fa-pencil fa-fw text-success"></i>
                            </button>
                            <button type="button" class="btn  deletePersonnelBtn" data-id="23">
                              <i class="fa-solid fa-trash fa-fw text-success"></i>
                            </button>
                              </div>
                          </div>
                      </div>
                  `;
          cardsContainer.append(cardHtml);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

getAllPersonnel();

$('#searchInp').on('keyup', function () {
  // your code
});

$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    // Refresh personnel table
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      // Refresh department table
    } else {
      // Refresh location table
    }
  }
});

$('#filterBtn').click(function () {
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
});

$('#addBtn').click(function () {
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
});

$('#personnelBtn').click(function () {
  // Call function to refresh personnel table
});

$('#departmentsBtn').click(function () {
  // Call function to refresh department table
});

$('#locationsBtn').click(function () {
  // Call function to refresh location table
});

$('#editPersonnelModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $('#editPersonnelEmployeeID').val(result.data.personnel[0].id);

        $('#editPersonnelFirstName').val(result.data.personnel[0].firstName);
        $('#editPersonnelLastName').val(result.data.personnel[0].lastName);
        $('#editPersonnelJobTitle').val(result.data.personnel[0].jobTitle);
        $('#editPersonnelEmailAddress').val(result.data.personnel[0].email);

        $('#editPersonnelDepartment').html('');

        $.each(result.data.department, function () {
          $('#editPersonnelDepartment').append(
            $('<option>', {
              value: this.id,
              text: this.name,
            })
          );
        });

        $('#editPersonnelDepartment').val(
          result.data.personnel[0].departmentID
        );
      } else {
        $('#editPersonnelModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editPersonnelModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

// Executes when the form button with type="submit" is clicked

$('#editPersonnelForm').on('submit', function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data
});
