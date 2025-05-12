document.addEventListener('DOMContentLoaded', function() {
  fetch('data/books.json')
    .then(response => response.json())
    .then(books => {
      const container = document.getElementById('books-container');
      
      books.forEach(book => {
        const bookCard = `
          <div class="col-md-4">
            <div class="card book-card">
              <img src="images/${book.cover}" class="card-img-top book-cover" alt="${book.title}">
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
// Ganti bagian card-text dengan:
<p class="card-text">
  <strong>ISBN:</strong> ${book.isbn}<br>
  ${book.sales_link ? `<a href="${book.sales_link}" class="btn btn-primary btn-buy" target="_blank">Beli Buku</a>` : ''}
</p>
                <a href="${book.sales_link}" class="btn btn-primary btn-buy" target="_blank">Beli Buku</a>
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
        <div class="alert alert-danger">
          Gagal memuat data buku. Silakan coba lagi nanti.
        </div>
      `;
    });
});
