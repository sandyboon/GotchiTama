$(document).ready(function () {
  $('img').click(createPet);
});

function createPet() {
  // get user's input to assign a petname and then do a post call back to the server
  const petName = $('#petName').val();
  if (petName === 'undefined' || petName.trim().length === 0) {
    // we can not create the pet
    // make the image go red
    console.log('Pet Name can not be empty');
  } else {
    const petType = $(this).attr('data-pet-type');
    $.post('/api/pet', {
      name: petName,
      type: petType,
    }).done(function (response) {
      console.log('pet created..' + response);
      window.location = '/';
    });
  }
}
