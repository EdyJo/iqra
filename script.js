document.addEventListener('DOMContentLoaded', function() {
  fetch('data/books.json')
    .then(response => response.json())
    .then(books => {
      const container = document.getElementById('books-container');
      
      books.forEach(book => {
        const bookCard = `
          <div class="col-md-4 mb-4">
            <div class="card book-card h-100">
              <img src="${book.cover}" class="card-img-top book-cover" alt="${book.title}" onerror="this.src='assets/images/default-cover.jpg'">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text flex-grow-1">
                  <strong>ISBN:</strong> ${book.isbn}
                </p>
                ${book.sales_link ? 
                  `<a href="${book.sales_link}" class="btn btn-primary btn-buy mt-auto" target="_blank">Beli Buku</a>` : 
                  '<button class="btn btn-secondary mt-auto" disabled>Tidak Tersedia</button>'}
              </div>
            </div>
          </div>
        `;
        container.innerHTML += bookCard;
      });
    })
    .catch(error => {
      console.error('Error loading books:', error);
      document.getElementById('books-container').innerHTML = `
        <div class="alert alert-danger col-12">
          Gagal memuat data buku. Silakan coba lagi nanti.
        </div>
      `;
    });
});
