document.addEventListener('DOMContentLoaded', function() {
  fetch('data/books.json')
    .then(response => {
      if (!response.ok) throw new Error('Network error');
      return response.json();
    })
    .then(books => {
      const container = document.getElementById('books-container');
      container.innerHTML = ''; // Clear container first
      
      books.forEach(book => {
        const img = new Image();
        img.src = book.cover;
        
        img.onload = () => {
          const bookCard = `
            <div class="col-md-4 mb-4">
              <div class="card book-card h-100">
                <img src="${book.cover}" class="card-img-top book-cover" 
                     alt="${book.title}" 
                     style="height: 300px; object-fit: contain;">
                <div class="card-body">
                  <h5 class="card-title">${book.title}</h5>
                  <p class="card-text">
                    <strong>ISBN:</strong> ${book.isbn}
                  </p>
                  ${book.sales_link ? 
                    `<a href="${book.sales_link}" class="btn btn-primary" target="_blank">Beli Buku</a>` : 
                    '<button class="btn btn-secondary" disabled>Tidak Tersedia</button>'}
                </div>
              </div>
            </div>
          `;
          container.innerHTML += bookCard;
        };
        
        img.onerror = () => {
          const bookCard = `
            <div class="col-md-4 mb-4">
              <div class="card book-card h-100">
                <img src="assets/images/default-cover.jpg" class="card-img-top book-cover" 
                     alt="Cover default" 
                     style="height: 300px; object-fit: contain;">
                <!-- ... konten card lainnya ... -->
              </div>
            </div>
          `;
          container.innerHTML += bookCard;
        };
      });
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('books-container').innerHTML = `
        <div class="alert alert-danger col-12">
          Gagal memuat data. Error: ${error.message}
        </div>
      `;
    });
});
