'use strict';
(function () {
  var XHR_CODE_SUCCESS = 200;

  var xhrTimeout = 10000;

  var backend = function (method, URL, onSuccess, onError, data) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === XHR_CODE_SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Закончился срок действия запроса');
    });

    xhr.timeout = xhrTimeout;
    xhr.open(method, URL);
    xhr.send(data);
  };

  window.backend = backend;
})();
