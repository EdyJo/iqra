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
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML = `
        <div class="card book-card h-100">
          <img src="${book.cover}?v=1.0" class="card-img-top book-cover" 
               alt="${book.title}" 
               loading="lazy"
               decoding="async">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">
              <strong>ISBN:</strong> ${book.isbn}
            </p>
          </div>
        </div>
      `;
      fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('books-container').innerHTML = `
      <div class="alert alert-danger">
        Gagal memuat data: ${error.message}
      </div>
    `;
  });
});
