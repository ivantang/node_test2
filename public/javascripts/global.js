// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //user name click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    //add user button click
    $('#btnAddUser').on('click', addUser);

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

    //stick our user data array into a suerlist variable in the global object
    userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User info
function showUserInfo(event) {
  //prevent link from firing
  event.preventDefault();

  //retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // get index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

  // get our user object
  var thisUserObject = userListData[arrayPosition];

  //populate info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};

//add user
function addUser(event) {
  event.preventDefault();

  // basic validation
  // increase errorCount variable if fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // if yes compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('addUser fieldset input#inputUserEmail').val(),
      'fullname': $('addUser fieldset input#inputUserFullname').val(),
      'age': $('addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    //use ajax to post object to adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response) {
      // check for successful (blank) response
      if (response.msg === '') {
        // clear form inputUserAge
        $('addUser fieldset input').val('')
      }
    })
  }

}
