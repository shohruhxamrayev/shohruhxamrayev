document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('booksGrid');
  var detail = document.getElementById('bookDetail');
  var introBlock = document.querySelector('.books-intro-block');
  if (!grid || !detail || typeof booksData === 'undefined') return;

  function renderGrid() {
    grid.innerHTML = '';
    booksData.forEach(function (book) {
      var card = document.createElement('a');
      card.className = 'book-card';
      card.href = '#' + book.slug;
      card.innerHTML =
        '<img class="book-card-cover" src="' + book.cover + '" alt="' + book.title + ' cover">' +
        '<div class="book-card-title">' + book.title + '</div>' +
        '<div class="book-card-author">' + book.author + '</div>';
      grid.appendChild(card);
    });
  }

  function statusLine(book) {
    if (book.status === 'reading') return 'Currently Reading';
    return 'Read: ' + book.readDate + ' &bull; Rating: ' + book.rating;
  }

  function renderDetail(slug) {
    var book = booksData.find(function (b) { return b.slug === slug; });
    if (!book) {
      showGrid();
      return;
    }

    var thoughtsHtml = book.thoughts.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');

    detail.innerHTML =
      '<button class="book-detail-close" id="bookDetailClose">&larr; back to books</button>' +
      '<div class="book-detail-inner">' +
        '<img class="book-detail-cover" src="' + book.cover + '" alt="' + book.title + ' cover">' +
        '<div class="book-detail-text">' +
          '<h3>' + book.title + '</h3>' +
          '<p class="book-detail-meta">By: ' + book.author + '</p>' +
          '<p class="book-detail-status">' + statusLine(book) + '</p>' +
          '<p class="book-detail-summary">' + book.summary + '</p>' +
          '<div class="book-detail-thoughts">' + thoughtsHtml + '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('bookDetailClose').addEventListener('click', function (e) {
      e.preventDefault();
      window.location.hash = '';
      showGrid();
    });

    grid.hidden = true;
    if (introBlock) introBlock.hidden = true;
    detail.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function showGrid() {
    detail.hidden = true;
    detail.innerHTML = '';
    grid.hidden = false;
    if (introBlock) introBlock.hidden = false;
  }

  function route() {
    var slug = window.location.hash.replace('#', '');
    if (slug) {
      renderDetail(slug);
    } else {
      showGrid();
    }
  }

  renderGrid();
  route();
  window.addEventListener('hashchange', route);
});
