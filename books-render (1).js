document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('booksGrid');
  var list = document.getElementById('booksList');
  var detail = document.getElementById('bookDetail');
  var introBlock = document.querySelector('.books-intro-block');
  if (!grid || !detail || typeof booksData === 'undefined') return;

  function statusLine(book) {
    if (book.status === 'reading') return 'Currently Reading';
    return 'Read: ' + book.readDate + ' &bull; Rating: ' + book.rating;
  }

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

  function renderList() {
    if (!list) return;
    list.innerHTML = '';
    booksData.forEach(function (book, i) {
      var entry = document.createElement('div');
      entry.className = 'entry cover-entry';
      entry.innerHTML =
        '<img src="' + book.cover + '" alt="' + book.title + ' cover">' +
        '<div class="details">' +
          '<h3><a href="#' + book.slug + '">' + book.title + '</a></h3>' +
          '<p class="byline">' + book.author + '</p>' +
          '<p class="stats">' + statusLine(book) + '</p>' +
          '<p class="note">' + book.preview + '</p>' +
        '</div>';
      list.appendChild(entry);
      if (i < booksData.length - 1) {
        var hr = document.createElement('hr');
        hr.className = 'entry-divider';
        list.appendChild(hr);
      }
    });
  }

  function renderDetail(slug) {
    var book = booksData.find(function (b) { return b.slug === slug; });
    if (!book) {
      showList();
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
          '<p class="book-detail-meta">' + book.author + '</p>' +
          '<p class="book-detail-status">' + statusLine(book) + '</p>' +
          '<div class="book-detail-thoughts">' + thoughtsHtml + '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('bookDetailClose').addEventListener('click', function (e) {
      e.preventDefault();
      window.location.hash = '';
      showList();
    });

    grid.hidden = true;
    if (list) list.hidden = true;
    if (introBlock) introBlock.hidden = true;
    detail.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function showList() {
    detail.hidden = true;
    detail.innerHTML = '';
    grid.hidden = false;
    if (list) list.hidden = false;
    if (introBlock) introBlock.hidden = false;
  }

  function route() {
    var slug = window.location.hash.replace('#', '');
    if (slug) {
      renderDetail(slug);
    } else {
      showList();
    }
  }

  function enableDragScroll() {
    var isDown = false;
    var startX, scrollLeft, moved;

    grid.addEventListener('mousedown', function (e) {
      isDown = true;
      moved = false;
      grid.classList.add('dragging');
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });

    window.addEventListener('mouseup', function () {
      isDown = false;
      grid.classList.remove('dragging');
    });

    grid.addEventListener('mouseleave', function () {
      isDown = false;
      grid.classList.remove('dragging');
    });

    grid.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - grid.offsetLeft;
      var walk = x - startX;
      if (Math.abs(walk) > 5) moved = true;
      grid.scrollLeft = scrollLeft - walk;
    });

    grid.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  renderGrid();
  renderList();
  enableDragScroll();
  route();
  window.addEventListener('hashchange', route);
});
