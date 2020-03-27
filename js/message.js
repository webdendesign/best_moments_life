'use strict';
(function () {
  var mainElement = document.querySelector('main');

  var onSuccess = function () {
    var similarSuccessElement = document.querySelector('#success')
      .content
      .querySelector('.success');

    var successMessageElement = similarSuccessElement.cloneNode(true);
    var fragment = document.createDocumentFragment();

    fragment.appendChild(successMessageElement);
    mainElement.appendChild(fragment);

    var clozeElement = mainElement.querySelector('.success__button');

    clozeElement.addEventListener('click', function () {
      closeSuccessMessage();
    });

    document.addEventListener('keydown', onSuccessMessageEscPress);
    document.addEventListener('click', onSuccessMessageClickClose);

    document.querySelector('.success__inner').addEventListener('click', function (evt) {
      evt.stopPropagation();
    });
  };

  var onSuccessMessageEscPress = function (evt) {
    if (evt.keyCode === window.util.KeyCodeButton.esc) {
      closeSuccessMessage();
    }
  };

  var onSuccessMessageClickClose = function () {
    closeSuccessMessage();
  };

  var closeSuccessMessage = function () {
    var successMessageElement = document.querySelector('.success');

    successMessageElement.remove();

    document.removeEventListener('keydown', onSuccessMessageEscPress);
    document.removeEventListener('click', onSuccessMessageClickClose);
  };

  var closeErrorMessage = function () {
    var errorMessageElement = document.querySelector('.error');

    errorMessageElement.remove();

    document.removeEventListener('keydown', onErrorMessageEscPress);
    document.removeEventListener('click', onErrorMessageClickClose);
  };

  var onErrorMessageEscPress = function (evt) {
    if (evt.keyCode === window.util.KeyCodeButton.esc) {
      closeErrorMessage();
    }
  };

  var onErrorMessageClickClose = function () {
    closeErrorMessage();
  };

  var onError = function (errorMessage) {
    var similarErrorElement = document.querySelector('#error')
      .content
      .querySelector('.error');

    var errorMessageElement = similarErrorElement.cloneNode(true);
    errorMessageElement.querySelector('.error__title').textContent = errorMessage;
    var fragment = document.createDocumentFragment();
    fragment.appendChild(errorMessageElement);
    mainElement.appendChild(fragment);
    var clozeButtonElement = document.querySelector('.error__button');

    clozeButtonElement.addEventListener('click', function () {
      closeErrorMessage();
    });

    document.addEventListener('keydown', onErrorMessageEscPress);
    document.addEventListener('click', onErrorMessageClickClose);
    document.querySelector('.error__inner').addEventListener('click', function (evt) {
      evt.stopPropagation();
    });
  };

  window.message = {
    showError: onError,
    showSuccess: onSuccess,
  };
})();
