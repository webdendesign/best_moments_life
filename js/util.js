'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;

  var removeOldChildrens = function (childrensClass) {
    var childrensElement = document.querySelectorAll(childrensClass);
    if (childrensElement.length) {
      for (var i = 0; i < childrensElement.length; i++) {
        childrensElement[i].remove();
      }
    }
  };

  var KeyCodeButton = {
    esc: 27,
    enter: 13,
    left: 37,
    right: 39,
  };

  function randomReshuffleArr(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    KeyCodeButton: KeyCodeButton,
    randomReshuffleArr: randomReshuffleArr,
    debounce: debounce,
    removeOldChildrens: removeOldChildrens,
  };
})();
