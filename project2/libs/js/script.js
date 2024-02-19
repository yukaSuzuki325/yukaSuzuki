const getAllPersonnel = () => {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;
        const cardsContainer = $('#employee-cards');
        cardsContainer.empty();

        data.forEach((employee) => {
          const cardHtml = `
                      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                          <div class="card h-100">
                              <div class="card-body">
                                  <h4 class="card-title mb-3">${employee.lastName}, ${employee.firstName}</h4>
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

const getAllDepartments = () => {
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;
        const tableBody = $('#departmentTable tbody');
        tableBody.empty();
        const headers = `<tr>
        <th>Department</th>
        <th>Location</th>
        <th>Personnel</th>
        <th> Actions</th>
        </tr>`;
        tableBody.append(headers);

        // Loop through each department and append a row to the table
        data.forEach((department) => {
          const rowHtml = `
                  <tr>
                      <td>${department.Department}</td>
                      <td>${department.Location}</td>
                      <td>${department.Personnel}</td>
                      <td>
                          <button class="btn btn-lg text-success" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.id}>
                              <i class="fa fa-pencil"></i>
                          </button>
                          <button class="btn btn-lg text-success deleteDepartmentBtn" data-id=${department.id}>
                              <i class="fa fa-trash"></i>
                          </button>
                      </td>
                  </tr>
              `;
          tableBody.append(rowHtml);
        });
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

getAllDepartments();

const getAllLocations = () => {
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;
        const tableBody = $('#locationsTable tbody');
        tableBody.empty();
        const headers = `<tr>        
        <th>Location</th>
        <th>Personnel</th>
        <th> Actions</th>
        </tr>`;
        tableBody.append(headers);

        // Loop through each location and append a row to the table
        data.forEach((location) => {
          const rowHtml = `
                  <tr>                      
                      <td>${location.Location}</td>
                      <td>${location.Personnel}</td>
                      <td>
                          <button class="btn btn-lg text-success" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${location.id}>
                              <i class="fa fa-pencil"></i>
                          </button>
                          <button class="btn btn-lg text-success deleteDepartmentBtn" data-id=${location.id}>
                              <i class="fa fa-trash"></i>
                          </button>
                      </td>
                  </tr>
              `;
          tableBody.append(rowHtml);
        });
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

getAllLocations();

$('#searchInp').on('keyup', function () {
  const searchTerm = $(this).val().toLowerCase();

  // Filter employee cards based on the name
  $('.card').each(function () {
    const name = $(this).find('.card-title').text().toLowerCase();

    if (name.includes(searchTerm)) {
      $(this).parent().show();
    } else {
      $(this).parent().hide();
    }
  });
});

//Toggle class 'active' on Personnel, Departments and Locations tabs
$('#departmentsBtn').click(function () {
  $('#departmentsBtn').addClass('active');
  $('#personnelBtn').removeClass('active');
  $('#locationsBtn').removeClass('active');
});

$('#locationsBtn').click(function () {
  $('#locationsBtn').addClass('active');
  $('#personnelBtn').removeClass('active');
  $('#departmentsBtn').removeClass('active');
});

$('#personnelBtn').click(function () {
  $('#personnelBtn').addClass('active');
  $('#locationsBtn').removeClass('active');
  $('#departmentsBtn').removeClass('active');
});

$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    // Refresh personnel table
    getAllPersonnel();
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      // Refresh department table
      getAllDepartments();
    } else {
      // Refresh location table
      getAllLocations();
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
