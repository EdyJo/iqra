// Tambahkan variabel global untuk menandai sudah di-load
let booksLoaded = false;

document.addEventListener('DOMContentLoaded', function() {
  if (booksLoaded) return;
  booksLoaded = true;
  
  fetch('data/books.json', {
    headers: {
      'Cache-Control': 'max-age=3600' // Cache 1 jam
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Network error');
    return response.json();
  })
  .then(books => {
    const container = document.getElementById('books-container');
    container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    books.forEach(book => {
      // Format penulis dan bab
      const authorsHtml = book.authors?.map(author => 
        `${author.name} (Bab ${author.chapters.join(', ')})`
      ).join('<br>') || 'Penulis tidak tersedia';
      
      // Format link tambahan
      const additionalLinks = [
        book.google_books_link ? `<a href="${book.google_books_link}" target="_blank" class="badge bg-info me-1 mb-1">Google Books</a>` : '',
        book.academia_link ? `<a href="${book.academia_link}" target="_blank" class="badge bg-primary me-1 mb-1">Academia.edu</a>` : '',
        book.researchgate_link ? `<a href="${book.researchgate_link}" target="_blank" class="badge bg-success mb-1">ResearchGate</a>` : ''
      ].filter(link => link).join(' ');

      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML = `
        <div class="card h-100">
          <img src="${book.cover}?v=1.0" class="card-img-top book-cover" 
               alt="${book.title}" 
               loading="lazy"
               decoding="async"
               onerror="this.src='assets/images/default-cover.jpg'">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">
              <strong>Penulis:</strong><br>${authorsHtml}<br><br>
              <strong>Penerbit:</strong> ${book.publisher || 'Tidak tersedia'}<br>
              <strong>Kota:</strong> ${book.city || 'Tidak tersedia'}<br>
              <strong>Tahun:</strong> ${book.year || 'Tidak tersedia'}<br>
              <strong>ISBN:</strong> ${book.isbn || 'Tidak tersedia'}
            </p>
          </div>
          <div class="card-footer bg-white">
            ${additionalLinks}
            ${book.sales_link ? 
              `<a href="${book.sales_link}" class="btn btn-primary btn-sm mt-2 d-block" target="_blank">Beli Buku</a>` : 
              '<button class="btn btn-secondary btn-sm mt-2 d-block" disabled>Tidak Tersedia</button>'}
          </div>
        </div>
      `;
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
    
    // Aktifkan tooltip untuk semua badge
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('books-container').innerHTML = `
      <div class="alert alert-danger col-12">
        Gagal memuat data: ${error.message}
      </div>
    `;
  });
});
