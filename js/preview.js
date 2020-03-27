'use strict';
(function () {
  var MAX_COMMENTS_ARR = 5;

  var bigPictureElement = document.querySelector('.big-picture');
  var singleCommentElement = bigPictureElement.querySelector('.social__comment');
  var commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

  var renderComments = function (arr) {
    var fragmentComment = document.createDocumentFragment();
    arr.forEach(function (it) {
      var newComment = singleCommentElement.cloneNode(true);
      newComment.querySelector('.social__text').textContent = it.message;
      newComment.querySelector('.social__picture').src = it.avatar;
      newComment.querySelector('.social__picture').alt = it.name;
      fragmentComment.appendChild(newComment);
    });

    return fragmentComment;
  };

  var showComments = function (arr) {
    var commentCountElement = bigPictureElement.querySelector('.social__comment-count');
    if (arr.length > MAX_COMMENTS_ARR) {
      commentsLoaderElement.classList.remove('hidden');
      commentCountElement.textContent = MAX_COMMENTS_ARR + ' из ' + arr.length + ' комментариев';
      var shortCommentsArr = (arr.slice()).slice(0, MAX_COMMENTS_ARR);

      var onLoaderClick = function () {
        commentsLoaderElement.classList.add('hidden');
        commentCountElement.textContent = arr.length + ' из ' + arr.length + ' комментариев';
        shortCommentsArr = arr;
        window.util.removeOldChildrens('.social__comment');
        bigPictureElement.querySelector('.social__comments').appendChild(renderComments(shortCommentsArr));
        commentsLoaderElement.removeEventListener('click', onLoaderClick);
      };

      commentsLoaderElement.addEventListener('click', onLoaderClick);

      return shortCommentsArr;
    } else {
      commentsLoaderElement.classList.add('hidden');
      commentCountElement.textContent = arr.length + ' из ' + arr.length + ' комментариев';
      return arr;
    }
  };

  var renderBigPictures = function (obj) {
    bigPictureElement.classList.remove('hidden');
    bigPictureElement.querySelector('.big-picture__img img').src = obj.url;
    bigPictureElement.querySelector('.likes-count').textContent = obj.likes;
    bigPictureElement.querySelector('.social__caption').textContent = obj.description;
    bigPictureElement.querySelector('.social__comments').innerHTML = '';
    bigPictureElement.querySelector('.social__comments').appendChild(renderComments(showComments(obj.comments)));

    var buttonClozeElement = bigPictureElement.querySelector('#picture-cancel');
    buttonClozeElement.addEventListener('click', function () {
      bigPictureElement.classList.add('hidden');
    });

    var closeBigPicture = function () {
      bigPictureElement.classList.add('hidden');
      document.removeEventListener('keydown', onBigPictureEscPress);
    };

    var onBigPictureEscPress = function (evt) {
      if (evt.keyCode === window.util.KeyCodeButton.esc) {
        closeBigPicture();
      }
    };

    document.addEventListener('keydown', onBigPictureEscPress);
  };

  window.preview = renderBigPictures;
})();
