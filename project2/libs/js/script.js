let departmentSelect;
let locationSelect;

//////// READ operation //////////

const getAllPersonnel = () => {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        populatePersonnelTable(data);

        $('.preloader-container').fadeOut('slow');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

getAllPersonnel();

const populatePersonnelTable = (data) => {
  $('#personnelTable').empty();
  $('#personnelTable').html('<tbody>');

  var rows = '';

  data.forEach(function (employee, index) {
    rows += `
    <tr class="employeeRow">
                <td class="align-middle text-nowrap employeeName">
                ${employee.lastName}, ${employee.firstName}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                ${employee.department}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                ${employee.location}
                </td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">
                ${employee.email}
                </td>
                <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm rowBtn" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id=${employee.id}>
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm rowBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id=${employee.id}>
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>
    `;
  });

  $('#personnelTable').append(rows + '</tbody>');
};

const getAllDepartments = () => {
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        //Populate departments table

        $('#departmentTable').empty();
        $('#departmentTable').html('<tbody>');

        var rows = '';

        data.forEach((department) => {
          rows += `
                  <tr>
                    <td class="align-middle text-nowrap departmentColumn">${department.Department}</td>
                    <td class="align-middle text-nowrap d-none d-md-table-cell">${department.Location}</td>                                          
                    <td class="align-middle text-end text-nowrap">
                    <button
                    type="button"
                    class="btn btn-primary btn-sm rowBtn"
                    data-bs-toggle="modal"
                    data-bs-target="#editDepartmentModal"
                    data-id=${department.id}
                  >
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm rowBtn"
                    data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal"
                    data-id=${department.id}
                  >
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>   
                          
                      </td>
                  </tr>
              `;
        });
        $('#departmentTable').append(rows + '</tbody>');
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

// getAllDepartments();

const getAllLocations = () => {
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        //Populate locations table
        $('#locationsTable').empty();
        $('#locationsTable').html('<tbody>');

        var rows = '';

        data.forEach((location) => {
          // rows += `
          //         <tr>
          //             <td class="align-middle text-nowrap">${location.Location}</td>
          //             <td class="align-middle text-end text-nowrap">
          //                 <button type="button" class="btn btn-primary btn-sm editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
          //                     <i class="fa fa-pencil"></i>
          //                 </button>
          //                 <button type="button" class="btn btn-primary btn-sm editLocationBtn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id=${location.id}>
          //                     <i class="fa fa-trash"></i>
          //                 </button>
          //             </td>
          //         </tr>
          //     `;

          rows += `
          <tr>
              <td class="align-middle text-nowrap">
              ${location.Location}
              </td>
              <td class="align-middle text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm editLocationBtn rowBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id=${location.id}>
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm deleteLocationBtn rowBtn"  data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id=${location.id}>
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#locationsTable').append(rows + '</tbody>');
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

// getAllLocations();

//Search input
$('#searchInp').on('keyup', function () {
  const searchTerm = $(this).val().toLowerCase();

  // Filter employee rows based on the input
  $('.employeeRow').each(function () {
    const name = $(this).find('.employeeName').text().toLowerCase();

    if (name.includes(searchTerm)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});

//Toggle class 'active' on Personnel, Departments and Locations tabs
$('#personnelBtn').click(function () {
  $(this).addClass('active').find('i, span').removeClass('text-primary');
  $('#locationsBtn')
    .removeClass('active')
    .find('i, span')
    .addClass('text-primary');
  $('#departmentsBtn')
    .removeClass('active')
    .find('i, span')
    .addClass('text-primary');
  $('#filterBtn').attr('disabled', false);
  // Call function to refresh personnel table
  getAllPersonnel();
});

$('#departmentsBtn').click(function () {
  $(this).addClass('active').find('i, span').removeClass('text-primary');
  $('#personnelBtn')
    .removeClass('active')
    .find('i, span')
    .addClass('text-primary');
  $('#locationsBtn')
    .removeClass('active')
    .find('i, span')
    .addClass('text-primary');
  $('#filterBtn').attr('disabled', true);
  // Call function to refresh department table
  getAllDepartments();
});

$('#locationsBtn').click(function () {
  $(this).addClass('active').find('i, span').removeClass('text-primary');
  $('#personnelBtn')
    .removeClass('active')
    .find('i, span')
    .addClass('text-primary');
  $('#departmentsBtn')
    .removeClass('active')
    .find('i, span')
    .addClass('text-primary');
  $('#filterBtn').attr('disabled', true);
  // Call function to refresh location table
  getAllLocations();
});

//Refresh button event listner
$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    // Refresh personnel table
    $('#searchInp').val('');
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

//Filter button functionality

$('#filterBtn').click(function () {
  // Show filter modal
  $('#filterModal').modal('show');
  $('#filterModalAlarm').hide();
});

$('#filterModal').on('show.bs.modal', function (e) {
  //Get all locations and populate options in the location select options
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        $('#locationSelect').empty();
        $('#locationSelect').append(
          $('<option>', {
            value: 'all',
            text: 'All',
          })
        );

        $.each(data, function (index, location) {
          $('#locationSelect').append(
            $('<option>', {
              value: location.id,
              text: location.Location,
            })
          );
        });
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });

  // Get all departments and populate department select options
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        console.log(data);

        $('#departmentSelect').empty();
        $('#departmentSelect').append(
          $('<option>', {
            value: 'all',
            text: 'All',
          })
        );

        $.each(data, function (index, department) {
          $('#departmentSelect').append(
            $('<option>', {
              value: department.id,
              text: department.Department,
            })
          );
        });

        //Reset the values of selects to default
        $('#departmentSelect').val($('#departmentSelect option:first').val());
        $('#locationSelect').val($('#locationSelect option:first').val());
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
});

//When a department/location is selected, call a function to make a AJAX call to filter personnel by department and location

$('#departmentSelect').on('change', function () {
  departmentSelect = $(this).val();
  $('#locationSelect').val('all');
  locationSelect = 'all';

  getFilteredPersonnel(departmentSelect, locationSelect);
});

$('#locationSelect').on('change', function () {
  locationSelect = $(this).val();
  $('#departmentSelect').val('all');
  departmentSelect = 'all';

  getFilteredPersonnel(departmentSelect, locationSelect);
});

const getFilteredPersonnel = (departmentSelect, locationSelect) => {
  $('#filterModalAlarm').hide();
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

        populatePersonnelTable(data);
      } else {
        $('#personnelTable').empty();
        $('#filterModalAlarm').show();
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
};

//////// CREATE operation /////////

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

//Add an employee

$('#addEmployeeModal').on('show.bs.modal', function () {
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        // Populate department options in the select
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
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR);
      alert('Data not available');
    },
  });
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

//Add a department

$('#addDepartmentModal').on('show.bs.modal', function () {
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        const data = result.data;

        //Populate locations in the select element
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

//Add a location

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

///////// UPDATE operation /////////////

//Update an employee record
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
        $('.okBtn').hide();

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
        $('.okBtn').show();

        $('#editPersonnelModal').on('hide.bs.modal', function () {
          $('.alert-success').remove();
          $('#editPersonnelForm, .editPersonnelBtn').show();
          $('.okBtn').hide();
        });

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
        $('.okBtn').hide();

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
        $('.okBtn').show();

        $('#editDepartmentModal').on('hide.bs.modal', function () {
          $('.alert-success').remove();
          $('#editDepartmentForm, .editDepartmentBtn').show();
          $('.okBtn').hide();
        });

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

//Update a location record

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
        $('.okBtn').hide();
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
        $('.okBtn').show();

        $('#editLocationModal').on('hide.bs.modal', function () {
          $('.alert-success').remove();
          $('#editLocationForm, .editLocationBtn').show();
          $('.okBtn').hide();
        });

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

/////////// DELETE operation //////////////

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

      if (resultCode == 200) {
        $('.deletePersonnelOkBtn').hide();
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
        $('.okBtn').show();

        $('#deletePersonnelModal').on('hide.bs.modal', function () {
          $('.alert-success').remove();
          $('#deletePersonnelForm, .deletePersonnelBtn').show();
          $('.okBtn').hide();
        });

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

      if (resultCode == 200 && result.data.department[0].personnelCount === 0) {
        $('#deleteDepartmentID').val(result.data.department[0].id);
        $('#deleteDepartmentName').html(result.data.department[0].name);
        $('.okBtn').hide();
      } else if (
        resultCode == 200 &&
        result.data.department[0].personnelCount !== 0
      ) {
        //If the department has employees, alert the user
        $('#deleteDepartmentAlarm').html(
          '<div class="mb-3 ms-2 numberOfPersonnel">Number of personnel: ' +
            result.data.department[0].personnelCount +
            '</div>' +
            '<div class="alert alert-danger" role="alert">A department with personnel cannot be deleted.</div>'
        );

        $('#deleteDepartmentForm, .deleteDepartmentBtn').hide();
        $('.okBtn').show();

        $('#deleteDepartmentModal').on('hide.bs.modal', function () {
          $('.alert-danger, .numberOfPersonnel').remove();
          $('#deleteDepartmentForm, .deleteDepartmentBtn').show();
          $('.okBtn').hide();
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
        $('.okBtn').show();

        $('#deleteDepartmentModal').on('hide.bs.modal', function (e) {
          $('.alert-success').remove();
          $('#deleteDepartmentForm, .deleteDepartmentBtn').show();
          $('.okBtn').hide();
        });

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

      if (resultCode == 200 && result.data.location[0].departmentCount === 0) {
        $('#deleteLocationID').val(result.data.location[0].id);
        $('#deleteLocationName').html(result.data.location[0].name);
      } else if (
        resultCode == 200 &&
        result.data.location[0].departmentCount !== 0
      ) {
        //If the location has departments, alert the user
        $('#deleteLocationAlarm').html(
          '<div class="ms-2 mb-3 numberOfDepartments">Number of departments: ' +
            result.data.location[0].departmentCount +
            '</div>' +
            "<div class='alert alert-danger' role='alert'>A location that has departments cannot be deleted.</div>"
        );
        $('#deleteLocationForm, .deleteLocationBtn').hide();
        $('.okBtn').show();

        $('#deleteLocationModal').on('hide.bs.modal', function () {
          $('.alert-danger, .numberOfDepartments').remove();
          $('.okBtn').hide();
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
        $('.okBtn').show();

        $('#deleteLocationModal').on('hide.bs.modal', function (e) {
          $('.alert-success').remove();
          $('#deleteLocationForm, .deleteLocationBtn').show();
          $('.okBtn').hide();
        });

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
