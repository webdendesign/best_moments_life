'use strict';
(function () {
  var ZOOM_DEFAULT = 100;
  var HUNDRED_PERCENT = 100;
  var PIN_MAX_POSITION = 456;
  var PIN_MIN_POSITION = 0;
  var PIN_KEY_STEP = 3;
  var ZOOM_STEP = 25;
  var ZOOM_MAX = 100;
  var ZOOM_MIN = 25;
  var HASHTAGS_LIMIT = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_COMMENT_LENGTH = 140;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var URL_UPLOAD = 'https://js.dump.academy/kekstagram';

  var editImageElement = document.querySelector('.img-upload__overlay');
  var btnUploadElement = document.querySelector('#upload-file');
  var btnCancelElement = editImageElement.querySelector('#upload-cancel');
  var pinElement = editImageElement.querySelector('.effect-level__pin');
  var pinDepthElement = editImageElement.querySelector('.effect-level__depth');
  var prewiewImageElement = editImageElement.querySelector('.img-upload__preview');
  var imageElement = prewiewImageElement.querySelector('img');
  var formElement = document.querySelector('#upload-select-image');
  var effectLevelElement = editImageElement.querySelector('.effect-level');
  var allEffectElement = editImageElement.querySelector('.effects__list');
  var effectDefaultElement = editImageElement.querySelector('#effect-none');
  var zoomInControlElement = editImageElement.querySelector('.scale__control--bigger');
  var zoomOutElement = editImageElement.querySelector('.scale__control--smaller');
  var zoomValueElement = editImageElement.querySelector('.scale__control--value');
  var hashtagsElement = editImageElement.querySelector('.text__hashtags');
  var сommentElement = editImageElement.querySelector('.text__description');
  var formSubmitElement = formElement.querySelector('#upload-submit');

  var actualPhotoEffect = {
    name: 'none',
    unit: '',
    maxValue: 0,
  };

  var photoEffects = [
    {
      name: 'grayscale',
      unit: '',
      maxValue: 1,
      effectClass: 'effects__preview--chrome',
      btnRadioElement: editImageElement.querySelector('#effect-chrome'),
    },
    {
      name: 'sepia',
      unit: '',
      maxValue: 1,
      effectClass: 'effects__preview--sepia',
      btnRadioElement: editImageElement.querySelector('#effect-sepia'),
    },
    {
      name: 'invert',
      unit: '%',
      maxValue: 100,
      effectClass: 'effects__preview--marvin',
      btnRadioElement: editImageElement.querySelector('#effect-marvin'),
    },
    {
      name: 'blur',
      unit: 'px',
      maxValue: 3,
      effectClass: 'effects__preview--phobos',
      btnRadioElement: editImageElement.querySelector('#effect-phobos'),
    },
    {
      name: 'brightness',
      unit: '',
      maxValue: 3,
      effectClass: 'effects__preview--heat',
      btnRadioElement: editImageElement.querySelector('#effect-heat'),
    }
  ];

  var addDefoltEffect = function () {
    effectDefaultElement.checked = true;
    effectLevelElement.classList.add('hidden');
    pinElement.removeEventListener('focus', onPinFocus);
    prewiewImageElement.style.filter = 'none';
  };

  var onEditImageEscPress = function (evt) {
    if (evt.keyCode === window.util.KeyCodeButton.esc) {
      closeEditImage();
    }
  };

  var openEditImage = function () {
    editImageElement.classList.remove('hidden');
    effectLevelElement.classList.add('hidden');
    pinElement.removeEventListener('focus', onPinFocus);
    document.addEventListener('keydown', onEditImageEscPress);
    prewiewImageElement.style.transform = 'scale(' + (ZOOM_DEFAULT / HUNDRED_PERCENT) + ')';
    zoomValueElement.value = ZOOM_DEFAULT + '%';
  };

  var closeEditImage = function () {
    formElement.reset();
    editImageElement.classList.add('hidden');
    zoomValueElement.value = ZOOM_DEFAULT + '%';
    prewiewImageElement.style.transform = 'scale(' + (ZOOM_DEFAULT / HUNDRED_PERCENT) + ')';
    addDefoltEffect();
    document.removeEventListener('keydown', onEditImageEscPress);
  };

  btnUploadElement.addEventListener('change', function () {
    var file = btnUploadElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imageElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

    openEditImage();
  });

  btnCancelElement.addEventListener('click', function () {
    closeEditImage();
  });

  btnCancelElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.KeyCodeButton.enter) {
      closeEditImage();
    }
  });

  var changesSaturationFilter = function (maxFilter) {
    var positionPin = parseFloat(pinElement.style.left);
    return (positionPin * maxFilter) / PIN_MAX_POSITION;
  };

  var renderPhotoEffect = function () {
    var effectSaturation = changesSaturationFilter(actualPhotoEffect.maxValue);
    prewiewImageElement.style.filter = actualPhotoEffect.name + '(' + effectSaturation + actualPhotoEffect.unit + ')';
  };

  var addEffect = function () {
    photoEffects.forEach(function (it) {
      if (effectDefaultElement.checked) {
        addDefoltEffect();
      }
      if (!it.btnRadioElement.checked) {
        prewiewImageElement.classList.remove(it.effectClass);
      }
      if (it.btnRadioElement.checked) {
        pinElement.style.left = pinDepthElement.style.width = PIN_MAX_POSITION + 'px';
        effectLevelElement.classList.remove('hidden');
        pinElement.addEventListener('focus', onPinFocus);
        prewiewImageElement.classList.add(it.effectClass);
        actualPhotoEffect = {
          name: it.name,
          unit: it.unit,
          maxValue: it.maxValue,
        };
        renderPhotoEffect();
      }
    });
  };

  allEffectElement.addEventListener('click', function () {
    addEffect();
  });

  var onPinFocus = function () {
    document.addEventListener('keydown', function () {
      if (event.keyCode === window.util.KeyCodeButton.left) {
        if ((pinElement.offsetLeft) <= PIN_MIN_POSITION) {
          event.preventDefault();
        } else {
          event.preventDefault();
          pinElement.style.left = (pinElement.offsetLeft - PIN_KEY_STEP) + 'px';
          pinDepthElement.style.width = changesSaturationFilter(HUNDRED_PERCENT) + '%';
          renderPhotoEffect();
        }
      }
      if (event.keyCode === window.util.KeyCodeButton.right) {
        if ((pinElement.offsetLeft) >= PIN_MAX_POSITION) {
          event.preventDefault();
        } else {
          event.preventDefault();
          pinElement.style.left = (pinElement.offsetLeft + PIN_KEY_STEP) + 'px';
          pinDepthElement.style.width = changesSaturationFilter(HUNDRED_PERCENT) + '%';
          renderPhotoEffect();
        }
      }
    });
  };

  pinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoordinate = evt.clientX;

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoordinate - moveEvt.clientX;
      startCoordinate = moveEvt.clientX;

      if ((pinElement.offsetLeft - shift) >= PIN_MIN_POSITION && (pinElement.offsetLeft - shift) <= PIN_MAX_POSITION) {
        pinElement.style.left = (pinElement.offsetLeft - shift) + 'px';
        pinDepthElement.style.width = changesSaturationFilter(HUNDRED_PERCENT) + '%';
      } else {
        onPinMouseUp();
      }
    };

    var onPinMouseUp = function () {
      renderPhotoEffect();
      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  var zoomChange = function (zoomStepVar) {
    zoomOutElement.disabled = false;
    zoomInControlElement.disabled = false;
    zoomValueElement.value = parseFloat(zoomValueElement.value) + zoomStepVar + '%';
    prewiewImageElement.style.transform = 'scale(' + (parseFloat(zoomValueElement.value) / HUNDRED_PERCENT) + ')';
  };

  var zoomInChange = function () {
    if (parseFloat(zoomValueElement.value) === ZOOM_MAX) {
      zoomInControlElement.disabled = true;
    } else {
      zoomChange(ZOOM_STEP);
    }
  };

  var zoomOutChange = function () {
    if ((parseFloat(zoomValueElement.value)) === ZOOM_MIN) {
      zoomOutElement.disabled = true;
    } else {
      zoomChange(-ZOOM_STEP);
    }
  };

  zoomInControlElement.addEventListener('click', function () {
    zoomInChange();
  });

  zoomOutElement.addEventListener('click', function () {
    zoomOutChange();
  });

  function verifyDuplicates(arr) {
    var result = [];
    arr.forEach(function (it) {
      if (!result.includes(it.toLowerCase())) {
        result.push(it.toLowerCase());
      }
    });

    return arr.length === result.length;
  }

  var checkCommentValidity = function (commentBlock) {
    if (commentBlock.value.length > MAX_COMMENT_LENGTH) {
      commentBlock.setCustomValidity('Длина комментария не должна превышать 140 символов');
      return false;
    } else {
      commentBlock.setCustomValidity('');
      return true;
    }
  };

  var checkHashtagsValidity = function (hashtags) {
    if (hashtags.length === 1 && hashtags[0] === '') {
      return true;
    }

    if (hashtags.length > HASHTAGS_LIMIT) {
      hashtagsElement.setCustomValidity('Нельзя указывать больше пяти хеш-тегов.');
      return false;
    }

    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i][0] !== '#') {
        hashtagsElement.setCustomValidity('Хеш-тег начинается с символа # (решётка).');
        return false;
      }

      if (!hashtags[i][1]) {
        hashtagsElement.setCustomValidity('Хеш-тег не может состоять только из одной решётки.');
        return false;
      }

      if (hashtags[i].match(/#/g).length > 1) {
        hashtagsElement.setCustomValidity('Хеш-теги разделяются пробелами.');
        return false;
      }

      if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
        hashtagsElement.setCustomValidity('Максимальная длина одного хеш-тега 20 символов, включая решетку.');
        return false;
      }
    }

    if (!verifyDuplicates(hashtags)) {
      hashtagsElement.setCustomValidity('Один и тот же хештег не может быть использован дважды.');
      return false;
    } else {
      hashtagsElement.setCustomValidity('');
      return true;
    }
  };

  var showSuccessMessage = function () {
    closeEditImage();
    window.message.showSuccess();
  };

  var showErrorMessage = function (errorMessage) {
    closeEditImage();
    window.message.showError(errorMessage);
  };

  var addRedFrame = function (validityCheck, inputBlock) {
    inputBlock.style.boxShadow = validityCheck ? 'none' : '0 0 0 6px rgba(223, 30, 30, 0.9)';
  };

  formSubmitElement.addEventListener('click', function (evt) {
    evt.preventDefault();

    var deleteEmptyString = function (element) {
      return element !== '';
    };

    var hashtagsArr = hashtagsElement.value.split(' ').filter(deleteEmptyString);

    var isValid = checkHashtagsValidity(hashtagsArr) && checkCommentValidity(сommentElement);

    if (isValid) {
      window.backend('POST', URL_UPLOAD, showSuccessMessage, showErrorMessage, new FormData(formElement));
      hashtagsElement.style.boxShadow = 'none';
      сommentElement.style.boxShadow = 'none';
    } else {
      hashtagsElement.reportValidity();
      сommentElement.reportValidity();
      addRedFrame(checkHashtagsValidity(hashtagsArr), hashtagsElement);
      addRedFrame(checkCommentValidity(сommentElement), сommentElement);
    }
  });

  hashtagsElement.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });

  сommentElement.addEventListener('keydown', function (evt) {
    evt.stopPropagation();
  });
})();
