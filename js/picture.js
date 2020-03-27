'use strict';
(function () {
  var RANDOM_PHOTOS_NUMBER = 10;
  var URL_LOAD = 'https://js.dump.academy/kekstagram/data';

  var picturesElement = document.querySelector('.pictures');
  var filterElement = document.querySelector('.img-filters');
  var popularFilterElement = document.querySelector('#filter-popular');
  var randomFilterElement = document.querySelector('#filter-random');
  var discussedFilterElement = document.querySelector('#filter-discussed');
  var filterButtons = [popularFilterElement, randomFilterElement, discussedFilterElement];

  var renderPhoto = function (descAndPhoto) {
    var similarPhotosElement = document.querySelector('#picture')
      .content
      .querySelector('.picture');
    var userPhotosElement = similarPhotosElement.cloneNode(true);

    userPhotosElement.querySelector('.picture__img').src = descAndPhoto.url;
    userPhotosElement.querySelector('.picture__likes').textContent = descAndPhoto.likes;
    userPhotosElement.querySelector('.picture__comments').textContent = descAndPhoto.comments.length;
    userPhotosElement.addEventListener('click', function () {
      window.preview(descAndPhoto);
    });

    return userPhotosElement;
  };

  var renderUserPhotos = window.util.debounce(function (dataPhoto) {
    var fragment = document.createDocumentFragment();
    dataPhoto.forEach(function (it) {
      fragment.appendChild(renderPhoto(it));
    });

    picturesElement.appendChild(fragment);
  });

  var updatePhotos = function (arr) {
    if (filterButtons[0].classList.contains('img-filters__button--active')) {
      return arr;
    }

    if (filterButtons[1].classList.contains('img-filters__button--active')) {
      return window.util.randomReshuffleArr(arr.slice()).slice(0, RANDOM_PHOTOS_NUMBER);
    }

    if (filterButtons[2].classList.contains('img-filters__button--active')) {
      var discussedPhotosArr = arr.slice().sort(function (first, second) {
        if (first.comments.length < second.comments.length) {
          return 1;
        } else if (first.comments.length > second.comments.length) {
          return -1;
        } else {
          return 0;
        }
      });

      return discussedPhotosArr;
    }
    return arr;
  };

  var onFilterClick = function (buttonsArr, index, photoObjects) {
    buttonsArr.forEach(function (it) {
      if (it.classList.contains('img-filters__button--active')) {
        it.classList.remove('img-filters__button--active');
      }
    });

    buttonsArr[index].classList.add('img-filters__button--active');
    window.util.removeOldChildrens('.picture');
    renderUserPhotos(updatePhotos(photoObjects));
  };

  var setupFilter = function (photoObjects) {
    filterElement.classList.remove('img-filters--inactive');
    filterButtons[1].addEventListener('click', function () {
      onFilterClick(filterButtons, 1, photoObjects);
    });
    filterButtons[2].addEventListener('click', function () {
      onFilterClick(filterButtons, 2, photoObjects);
    });
    filterButtons[0].addEventListener('click', function () {
      onFilterClick(filterButtons, 0, photoObjects);
    });
  };

  var onSuccess = function (data) {
    var photoObjects = data;
    renderUserPhotos(photoObjects);
    setupFilter(photoObjects);
  };

  window.backend('GET', URL_LOAD, onSuccess, window.message.showError);
})();
