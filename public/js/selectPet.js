$(document).ready(function () {
  $('#done').attr('disabled', true);
  $('img').click(selectImage);
  $('#done').click(createPet);
  $('#petName').keydown(checkAndEnableDoneBtn);
  $('#petName').keypress(checkAndEnableDoneBtn);
});

function checkAndEnableDoneBtn() {
  const petName = $('#petName').val();
  if (petNameIsNotEmpty(petName) && getAlreadySelectImage().length > 0) {
    $('#done').removeAttr('disabled');
  } else if (
    !petNameIsNotEmpty(petName) &&
    $('#done').attr('disabled') !== 'true'
  ) {
    $('#done').attr('disabled', true);
  }
}

function selectImage() {
  const previouslySelectedImg = getAlreadySelectImage();
  if (previouslySelectedImg.length > 0) {
    previouslySelectedImg.attr(
      'style',
      switchSelectionStyle(previouslySelectedImg.attr('style'))
    );
    previouslySelectedImg.attr('data-is-selected', 'false');
  }

  const selectedImage = $(this);
  if (
    previouslySelectedImg.attr('data-pet-type') !==
    selectedImage.attr('data-pet-type')
  ) {
    selectedImage.attr(
      'style',
      switchSelectionStyle(selectedImage.attr('style'))
    );
    selectedImage.attr('data-is-selected', 'true');
    // check if user has provided a pet name
    const petName = $('#petName').val();
    if (petNameIsNotEmpty(petName)) {
      $('#done').removeAttr('disabled');
    }
  }
}

function switchSelectionStyle(selectImageStyle) {
  selectImageStyle = selectImageStyle.includes('background-color')
    ? removeBackGroundColor(selectImageStyle)
    : addBackGroundColor(selectImageStyle);

  return selectImageStyle;
}

function addBackGroundColor(selectImageStyle) {
  return selectImageStyle.concat(' background-color: #f5ec42');
}

function removeBackGroundColor(selectImageStyle) {
  return selectImageStyle.slice(
    0,
    selectImageStyle.indexOf('background-color: #f5ec42')
  );
}

function getAlreadySelectImage() {
  return $("img[data-is-selected='true']");
}

function createPet() {
  // get user's input to assign a petname and then do a post call back to the server
  const petName = $('#petName').val();
  if (petNameIsNotEmpty(petName)) {
    const petType = getAlreadySelectImage().attr('data-pet-type');
    $.post('/api/pet', {
      name: petName,
      type: petType,
    }).done(function (response) {
      console.log('pet created..' + response);
      window.location = '/';
    });
    console.log('Pet Name can not be empty');
  }
}

function petNameIsNotEmpty(petName) {
  return petName !== 'undefined' && petName.trim().length > 0;
}
