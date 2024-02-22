let departmentSelect;
let locationSelect;

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
                      <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                          <div class="card h-100 mx-6">
                              <div class="card-body">
                                  <h4 class="card-title mb-3">${employee.lastName}, ${employee.firstName}</h4>
                                  <p class="card-text">${employee.department}</p>
                                  <p class="card-text">${employee.location}</p>
                                  <p class="card-text">${employee.email}</p>
                              </div>
                              <div class="card-footer d-flex justify-content-end">
                              <button type="button" class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${employee.id}>
                              <i class="fa-solid fa-pencil fa-fw text-secondary"></i>
                            </button>
                            <button type="button" class="btn btn-lg  deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id=${employee.id}>
                              <i class="fa-solid fa-trash fa-fw text-secondary"></i>
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

        // Populate department options in the filter options
        const select = $('#departmentFilter');
        select.empty();

        select.append(
          $('<option>', {
            value: 'all',
            text: 'Select department',
          })
        );

        $.each(data, function (index, department) {
          select.append(
            $('<option>', {
              value: department.id,
              text: department.Department,
            })
          );
        });

        // Populate department options in the add employee modal
        const addEmployeeselect = $('#addEmployeeDepartment');
        addEmployeeselect.empty();

        $.each(data, function (index, department) {
          addEmployeeselect.append(
            $('<option>', {
              value: department.id,
              text: department.Department,
            })
          );
        });

        //Update Departments tab
        const tableBody = $('#departmentTable tbody');
        tableBody.empty();
        const headers = `<tr>
        <th>Department</th>
        <th>Location</th>
        <th>Personnel</th>
        <th> Actions</th>
        </tr>`;
        tableBody.append(headers);

        data.forEach((department) => {
          const rowHtml = `
                  <tr>
                      <td>${department.Department}</td>
                      <td>${department.Location}</td>
                      <td id="personnelInDepartment">${department.Personnel}</td>
                      <td>
                          <button class="btn btn-lg text-secondary" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=${department.id}>
                              <i class="fa fa-pencil"></i>
                          </button>
                          <button class="btn btn-lg text-secondary" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal"data-id=${department.id}>
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
        console.log(data);

        //Populate options in the location filter
        const select = $('#locationFilter');
        select.empty();

        select.append(
          $('<option>', {
            value: 'all',
            text: 'Select location',
          })
        );

        $.each(data, function (index, location) {
          select.append(
            $('<option>', {
              value: location.id,
              text: location.Location,
            })
          );
        });

        //Populate locations in add department modal
        const addDepartmentSelect = $('#addDepartmentSelect');
        addDepartmentSelect.empty();

        $.each(data, function (index, location) {
          addDepartmentSelect.append(
            $('<option>', {
              value: location.id,
              text: location.Location,
            })
          );
        });

        //Update location tab
        const tableBody = $('#locationsTable tbody');
        tableBody.empty();
        const headers = `<tr>        
        <th>Location</th>
        <th>Department</th>
        <th>Actions</th>
        </tr>`;
        tableBody.append(headers);

        // Loop through each location and append a row to the table
        data.forEach((location) => {
          const rowHtml = `
                  <tr>                      
                      <td>${location.Location}</td>
                      <td>${location.Department}</td>
                      <td>
                          <button class="btn btn-lg text-secondary editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                              <i class="fa fa-pencil"></i>
                          </button>
                          <button class="btn btn-lg text-secondary editLocationBtn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id=${location.id}>
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

//Refresh button event listner
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

$('#filterOptions').hide();

$('#filterBtn').click(function () {
  $('#filterOptions').toggle();
});

$('#departmentFilter').on('change', function () {
  departmentSelect = $(this).val();
  getFilteredPersonnel(departmentSelect, locationSelect);
});

$('#locationFilter').on('change', function () {
  locationSelect = $(this).val();
  getFilteredPersonnel(departmentSelect, locationSelect);
});

const getFilteredPersonnel = (departmentSelect, locationSelect) => {
  $.ajax({
    url: 'libs/php/getFilteredPersonnel.php',
    type: 'POST',
    dataType: 'json',
    data: {
      department: departmentSelect,
      location: locationSelect,
    },
    success: function (result) {
      if (result.status.code == 200 && result.data.length) {
        const data = result.data;
        console.log(data);
        const cardsContainer = $('#employee-cards');
        cardsContainer.empty();

        data.forEach((employee) => {
          const cardHtml = `
                      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                          <div class="card h-100 mx-6">
                              <div class="card-body">
                                  <h4 class="card-title mb-3">${employee.lastName}, ${employee.firstName}</h4>
                                  <p class="card-text"><strong>Department:</strong> ${employee.department}</p>
                                  <p class="card-text"><strong>Location:</strong> ${employee.location}</p>
                                  <p class="card-text"><strong>Email:</strong> ${employee.email}</p>
                              </div>
                              <div class="card-footer d-flex justify-content-end">
                              <button type="button" class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${employee.id}>
                              <i class="fa-solid fa-pencil fa-fw text-secondary"></i>
                            </button>
                            <button type="button" class="btn btn-lg  deletePersonnelBtn" data-id=${employee.id}>
                              <i class="fa-solid fa-trash fa-fw text-secondary"></i>
                            </button>
                              </div>
                          </div>
                      </div>
                  `;
          cardsContainer.append(cardHtml);
        });
      } else {
        const cardsContainer = $('#employee-cards');
        cardsContainer.empty();
        const messageHtml = `
        <div class="d-flex flex-column align-items-center"><p class="">There were no personnel who matched the criteria</p></div>
        `;
        cardsContainer.append(messageHtml);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

$('#addBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    $('#addEmployeeModal').modal('show');
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      $('#addDepartmentModal').modal('show');
    } else {
      $('#addLocationModal').modal('show');
    }
  }
});

$('#addEmployeeForm').submit(function (e) {
  e.preventDefault();
  const firstName = $('#addEmployeeFirstName').val();
  const lastName = $('#addEmployeeLastName').val();
  const jobTitle = $('#addEmployeeJobTitle').val();
  const email = $('#addEmployeeEmailAddress').val();
  const departmentID = $('#addEmployeeDepartment').val();
  $.ajax({
    url: 'libs/php/insertEmployee.php',
    type: 'POST',
    dataType: 'json',
    data: {
      firstName,
      lastName,
      jobTitle,
      email,
      departmentID,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#addEmployeeModal').modal('hide');
        getAllPersonnel();
        // Clear the input fields
        $('#addEmployeeFirstName').val('');
        $('#addEmployeeLastName').val('');
        $('#addEmployeeJobTitle').val('');
        $('#addEmployeeEmailAddress').val('');
        // Reset the dropdown by setting its value to the first option
        $('#addEmployeeDepartment').val(
          $('#addEmployeeDepartment option:first').val()
        );
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

$('#addDepartmentForm').submit(function (e) {
  e.preventDefault();
  const name = $('#addDepartmentName').val();
  const locationID = $('#addDepartmentSelect').val();
  $.ajax({
    url: 'libs/php/insertDepartment.php',
    type: 'POST',
    dataType: 'json',
    data: {
      name,
      locationID,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#addDepartmentModal').modal('hide');
        getAllDepartments();
        // Clear the input field
        $('#addDepartmentName').val('');
        // Reset the dropdown value to the first option
        $('#addDepartmentSelect').val(
          $('#addDepartmentSelect option:first').val()
        );
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

$('#addLocationForm').submit(function (e) {
  e.preventDefault();
  const name = $('#addLocationName').val();
  $.ajax({
    url: 'libs/php/insertLocation.php',
    type: 'POST',
    dataType: 'json',
    data: {
      name,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#addLocationModal').modal('hide');
        getAllLocations();
        // Clear the input field
        $('#addLocationName').val('');
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

$('#personnelBtn').click(function () {
  // Call function to refresh personnel table
  getAllPersonnel();
});

$('#departmentsBtn').click(function () {
  // Call function to refresh department table
  getAllDepartments();
});

$('#locationsBtn').click(function () {
  // Call function to refresh location table
  getAllLocations();
});

//Update an employee
$('#editPersonnelModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'libs/php/getPersonnelByID.php',
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
  e.preventDefault();
  const firstName = $('#editPersonnelFirstName').val();
  const lastName = $('#editPersonnelLastName').val();
  const jobTitle = $('#editPersonnelJobTitle').val();
  const email = $('#editPersonnelEmailAddress').val();
  const departmentID = $('#editPersonnelDepartment').val();
  const employeeID = $('#editPersonnelEmployeeID').val();
  $.ajax({
    url: 'libs/php/updateEmployee.php',
    type: 'POST',
    dataType: 'json',
    data: {
      firstName,
      lastName,
      jobTitle,
      email,
      departmentID,
      employeeID,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#editPersonnelSuccess').html(
          "<div class='alert alert-success' role='alert'>Record successfully updated.</div>"
        );
        $('#editPersonnelForm, .editPersonnelBtn').hide();
        setTimeout(function () {
          $('#editPersonnelModal').hide();
          $('.alert-success').remove();
          $('#editPersonnelForm, .editPersonnelBtn').show();
        }, 4000);
        getAllPersonnel();
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

//Update a department record
$('#editDepartmentModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'libs/php/getDepartmentByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $('#editDepartmentID').val(result.data.department[0].id);
        $('#editDepartmentName').val(result.data.department[0].name);
        console.log(result.data.location);

        $.each(result.data.location, function () {
          $('#editDepartmentLocation').append(
            $('<option>', {
              value: this.id,
              text: this.name,
            })
          );
        });

        $('#editDepartmentLocation').val(result.data.department[0].locationID);
      } else {
        $('#editDepartmentModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editDepartmentModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

$('#editDepartmentForm').on('submit', function (e) {
  e.preventDefault();
  const name = $('#editDepartmentName').val();
  const location = $('#editDepartmentLocation').val();
  const id = $('#editDepartmentID').val();

  $.ajax({
    url: 'libs/php/updateDepartment.php',
    type: 'POST',
    dataType: 'json',
    data: {
      name,
      location,
      id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#editDepartmentSuccess').html(
          "<div class='alert alert-success' role='alert'>Record successfully updated.</div>"
        );
        $('#editDepartmentForm, .editDepartmentBtn').hide();
        setTimeout(function () {
          $('#editDepartmentModal').hide();
          $('.alert-success').remove();
          $('#editDepartmentForm, .editDepartmentBtn').show();
        }, 5000);
        getAllDepartments();
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

//Update a location
$('#editLocationModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'libs/php/getLocationByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $('#editLocationID').val(result.data.location[0].id);
        $('#editLocationName').val(result.data.location[0].name);
        console.log(result.data.location);
      } else {
        $('#editLocationModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editLocationModal .modal-title').replaceWith('Error retrieving data');
    },
  });
});

$('#editLocationForm').on('submit', function (e) {
  e.preventDefault();
  const name = $('#editLocationName').val();
  const id = $('#editLocationID').val();

  $.ajax({
    url: 'libs/php/updateLocation.php',
    type: 'POST',
    dataType: 'json',
    data: {
      name,
      id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#editLocationSuccess').html(
          "<div class='alert alert-success' role='alert'>Record successfully updated.</div>"
        );
        $('#editLocationForm, .editLocationBtn').hide();
        setTimeout(function () {
          $('#editLocationModal').hide();
          $('.alert-success').remove();
          $('#editLocationForm, .editLocationBtn').show();
        }, 5000);
        getAllLocations();
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

//Delete an employee record
$('#deletePersonnelModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'libs/php/getPersonnelByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'),
    },
    success: function (result) {
      var resultCode = result.status.code;
      console.log(result.data);

      if (resultCode == 200) {
        $('#deletePersonnelID').val(result.data.personnel[0].id);
        $('#deletePersonnelName').html(
          result.data.personnel[0].firstName +
            ' ' +
            result.data.personnel[0].lastName
        );
      } else {
        $('#deletePersonnelModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#deletePersonnelModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

$('#deletePersonnelForm').on('submit', function (e) {
  e.preventDefault();
  const id = $('#deletePersonnelID').val();

  $.ajax({
    url: 'libs/php/deletePersonnelByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#deletePersonnelAlarm').html(
          "<div class='alert alert-success' role='alert'>Record successfully deleted.</div>"
        );
        $('#deletePersonnelForm, .deletePersonnelBtn').hide();
        setTimeout(function () {
          $('#deletePersonnelModal').hide();
          $('.alert-success').remove();
          $('#deletePersonnelForm, .deletePersonnelBtn').show();
        }, 5000);
        getAllPersonnel();
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

//Delete a department record
$('#deleteDepartmentModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'libs/php/getDepartmentByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'),
    },
    success: function (result) {
      var resultCode = result.status.code;
      console.log(result.data);

      if (resultCode == 200 && result.data.department[0].personnelCount === 0) {
        $('#deleteDepartmentID').val(result.data.department[0].id);
        $('#deleteDepartmentName').html(result.data.department[0].name);
      } else if (
        resultCode == 200 &&
        result.data.department[0].personnelCount !== 0
      ) {
        $('#deleteDepartmentAlarm').html(
          "<div class='alert alert-danger' role='alert'>A department with personnel cannot be deleted.</div>"
        );
        $('#deleteDepartmentForm, .deleteDepartmentBtn').hide();

        $('#deleteDepartmentModal').on('hide.bs.modal', function () {
          $('.alert-danger').remove();
          $('#deleteDepartmentForm, .deleteDepartmentBtn').show();
        });
      } else {
        $('#deleteDepartmentModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#deleteDepartmentModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

$('#deleteDepartmentForm').on('submit', function (e) {
  e.preventDefault();
  const id = $('#deleteDepartmentID').val();

  $.ajax({
    url: 'libs/php/deleteDepartmentByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#deleteDepartmentAlarm').html(
          "<div class='alert alert-success' role='alert'>Record successfully deleted.</div>"
        );
        $('#deleteDepartmentForm, .deleteDepartmentBtn').hide();
        setTimeout(function () {
          $('#deleteDepartmentModal').hide();
          $('.alert-success').remove();
          $('#deleteDepartmentForm, .deleteDepartmentBtn').show();
        }, 5000);
        getAllDepartments();
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

//Delete a location record
$('#deleteLocationModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: 'libs/php/getLocationByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'),
    },
    success: function (result) {
      var resultCode = result.status.code;
      console.log(result.data);

      if (resultCode == 200 && result.data.location[0].departmentCount === 0) {
        $('#deleteLocationID').val(result.data.location[0].id);
        $('#deleteLocationName').html(result.data.location[0].name);
      } else if (
        resultCode == 200 &&
        result.data.location[0].locationCount !== 0
      ) {
        $('#deleteLocationAlarm').html(
          "<div class='alert alert-danger' role='alert'>A location that has departments cannot be deleted.</div>"
        );
        $('#deleteLocationForm, .deleteLocationBtn').hide();

        $('#deleteLocationModal').on('hide.bs.modal', function () {
          $('.alert-danger').remove();
          $('#deleteLocationForm, .deleteLocationBtn').show();
        });
      } else {
        $('#deleteLocationModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#deleteLocationModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

$('#deleteLocationForm').on('submit', function (e) {
  e.preventDefault();
  const id = $('#deleteLocationID').val();

  $.ajax({
    url: 'libs/php/deleteLocationByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $('#deleteLocationAlarm').html(
          "<div class='alert alert-success' role='alert'>Record successfully deleted.</div>"
        );
        $('#deleteLocationForm, .deleteLocationBtn').hide();
        setTimeout(function () {
          $('#deleteLocationModal').hide();
          $('.alert-success').remove();
          $('#deleteLocationForm, .deleteLocationBtn').show();
        }, 5000);
        getAllLocations();
      } else {
        alert(
          'We are unable to process your request at the moment. Please try again later'
        );
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});
