// script.js
let booksLoaded = false;
let animationDelay = 0;

document.addEventListener('DOMContentLoaded', function() {
  if (booksLoaded) return;
  
  // Show loading state
  const container = document.getElementById('books-container');
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Memuat data buku...</p>
    </div>
  `;

  fetch('data/books.json', {
    cache: 'force-cache',
    headers: {
      'Cache-Control': 'max-age=3600'
    }
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(books => {
    booksLoaded = true;
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    books.forEach((book, index) => {
      const card = createBookCard(book, index);
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
    initTooltips();
  })
  .catch(error => {
    console.error('Fetch error:', error);
    container.innerHTML = `
      <div class="alert alert-danger col-12">
        <i class="bi bi-exclamation-triangle-fill"></i> Gagal memuat data: ${error.message}<br>
        <button onclick="window.location.reload()" class="btn btn-sm btn-outline-danger mt-2">
          Coba Lagi
        </button>
      </div>
    `;
  });
});

function createBookCard(book, index) {
  const card = document.createElement('div');
  card.className = 'col-md-4 mb-4 book-card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  // Format authors
  const authorsHtml = book.authors?.map(author => 
    `${author.name}${author.chapters?.length ? ` (Bab ${author.chapters.join(', ')})` : ''}`
  ).join('<br>') || 'Penulis tidak tersedia';
  
  // Format additional links
  const additionalLinks = [
    book.google_books_link ? createBadgeLink('Google Books', book.google_books_link, 'info') : '',
    book.academia_link ? createBadgeLink('Academia', book.academia_link, 'primary') : '',
    book.researchgate_link ? createBadgeLink('ResearchGate', book.researchgate_link, 'success') : ''
  ].filter(Boolean).join('');

  card.innerHTML = `
    <div class="card h-100">
      <div class="book-cover-container">
        <img src="${book.cover}?v=${new Date().getTime()}" 
             class="book-cover"
             alt="Cover ${book.title}"
             loading="lazy"
             decoding="async"
             onerror="this.onerror=null;this.src='assets/images/default-cover.jpg?v=${new Date().getTime()}'">
      </div>
      <div class="card-body">
        <h5 class="card-title" title="${book.title}">${book.title}</h5>
        <div class="card-text">
          <div class="mb-2"><strong>Penulis:</strong><br>${authorsHtml}</div>
          <div><strong>Penerbit:</strong> ${book.publisher || '-'}</div>
          <div><strong>Tahun:</strong> ${book.year || '-'}</div>
          <div><strong>ISBN:</strong> ${book.isbn || '-'}</div>
        </div>
      </div>
      <div class="card-footer bg-white">
        <div class="link-badges">${additionalLinks}</div>
        ${book.sales_link ? 
          `<a href="${book.sales_link}" class="btn btn-primary btn-sm mt-2" target="_blank">
            <i class="bi bi-cart3"></i> Beli Buku
          </a>` : 
          `<button class="btn btn-outline-secondary btn-sm mt-2" disabled>
            <i class="bi bi-slash-circle"></i> Tidak Tersedia
          </button>`}
      </div>
    </div>
  `;
  
  return card;
}

function createBadgeLink(text, href, type) {
  return `
    <a href="${href}" target="_blank" 
       class="badge bg-${type} me-1 mb-1 text-decoration-none"
       data-bs-toggle="tooltip" data-bs-placement="top" title="Buka di ${text}">
      ${text}
    </a>
  `;
}

function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
