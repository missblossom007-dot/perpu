let currentPage = 1;
let currentSearch = '';
let currentCategory = 'all';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const select = document.getElementById('categoryFilter');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load books
async function loadBooks(page = 1) {
    try {
        const params = new URLSearchParams({
            page,
            limit: 20,
            search: currentSearch,
            category: currentCategory
        });
        
        const response = await fetch(`/api/books?${params}`);
        const data = await response.json();
        
        displayBooks(data.books);
        displayPagination(data.page, data.totalPages);
        updateStats(data.books.length, data.total);
        
        currentPage = page;
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksGrid').innerHTML = '<p class="loading">Error memuat data</p>';
    }
}

function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    
    if (books.length === 0) {
        grid.innerHTML = '<p class="loading">Tidak ada buku ditemukan</p>';
        return;
    }
    
    grid.innerHTML = books.map(book => `
        <div class="book-card">
            <div onclick="showBookDetail(${book.id})">
                <img src="${book.cover || 'https://via.placeholder.com/250x300?text=No+Cover'}" 
                     alt="${book.title}" 
                     class="book-cover"
                     onerror="this.src='https://via.placeholder.com/250x300?text=No+Cover'">
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <span class="book-category">${book.category}</span>
                    <div class="book-price">Rp ${book.price.toLocaleString('id-ID')}</div>
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${book.id}, '${book.title.replace(/'/g, "\\'")}', ${book.price}, '${book.cover}', '${book.author.replace(/'/g, "\\'")}', '${book.driveLink}')">
                + Tambah ke Keranjang
            </button>
        </div>
    `).join('');
}

function displayPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    if (currentPage > 1) {
        html += `<button onclick="loadBooks(${currentPage - 1})">← Prev</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" 
                     onclick="loadBooks(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span>...</span>';
        }
    }
    
    if (currentPage < totalPages) {
        html += `<button onclick="loadBooks(${currentPage + 1})">Next →</button>`;
    }
    
    pagination.innerHTML = html;
}

function updateStats(showing, total) {
    document.getElementById('resultCount').textContent = showing;
    document.getElementById('totalCount').textContent = total;
}

function searchBooks() {
    currentSearch = document.getElementById('searchInput').value;
    currentCategory = document.getElementById('categoryFilter').value;
    loadBooks(1);
}

// Enter key untuk search
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });
});

async function showBookDetail(bookId) {
    try {
        const response = await fetch(`/api/books/${bookId}`);
        const book = await response.json();
        
        const modal = document.getElementById('bookModal');
        const detail = document.getElementById('bookDetail');
        
        detail.innerHTML = `
            <div style="display: flex; gap: 2rem;">
                <img src="${book.cover || 'https://via.placeholder.com/300x400?text=No+Cover'}" 
                     style="width: 300px; height: 400px; object-fit: cover; border-radius: 10px;"
                     onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'">
                <div style="flex: 1;">
                    <h2>${book.title}</h2>
                    <p><strong>Penulis:</strong> ${book.author}</p>
                    <p><strong>Kategori:</strong> ${book.category}</p>
                    <p><strong>Harga:</strong> Rp ${book.price.toLocaleString('id-ID')}</p>
                    <p style="margin-top: 1rem;">${book.description}</p>
                    ${book.driveLink ? `
                        <a href="${book.driveLink}" target="_blank" 
                           style="display: inline-block; margin-top: 1rem; padding: 1rem 2rem; 
                                  background: #667eea; color: white; text-decoration: none; 
                                  border-radius: 5px; font-weight: bold;">
                            📥 Lihat di Google Drive
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading book detail:', error);
    }
}

function closeBookDetail() {
    document.getElementById('bookModal').style.display = 'none';
}

function showRequestForm() {
    document.getElementById('requestModal').style.display = 'block';
}

function closeRequestForm() {
    document.getElementById('requestModal').style.display = 'none';
}

async function submitRequest(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Request berhasil dikirim! Kami akan menghubungi Anda segera.');
            closeRequestForm();
            event.target.reset();
        }
    } catch (error) {
        console.error('Error submitting request:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const bookModal = document.getElementById('bookModal');
    const requestModal = document.getElementById('requestModal');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (event.target === bookModal) {
        closeBookDetail();
    }
    if (event.target === requestModal) {
        closeRequestForm();
    }
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
}

// Cart functions
function addToCart(id, title, price, cover, author, driveLink) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        alert('Buku sudah ada di keranjang!');
        return;
    }
    
    cart.push({ id, title, price, cover, author, driveLink });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Buku berhasil ditambahkan ke keranjang!');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
}

function showCart() {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">Keranjang kosong</p>';
        cartTotal.innerHTML = '';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.cover || 'https://via.placeholder.com/80x100?text=No+Cover'}" 
                 onerror="this.src='https://via.placeholder.com/80x100?text=No+Cover'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div style="color: #666; font-size: 0.9rem;">${item.author}</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
        </div>
    `).join('');
    
    cartTotal.innerHTML = `Total: Rp ${total.toLocaleString('id-ID')}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('checkoutCount').textContent = cart.length;
    document.getElementById('checkoutTotal').textContent = total.toLocaleString('id-ID');
    
    closeCart();
    document.getElementById('checkoutModal').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

async function submitCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData);
    
    const orderData = {
        ...customerData,
        books: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        bookCount: cart.length
    };
    
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success with download links
            showDownloadLinks(result.books);
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            closeCheckout();
            event.target.reset();
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
}

function showDownloadLinks(books) {
    const modal = document.getElementById('downloadModal');
    const content = document.getElementById('downloadContent');
    
    content.innerHTML = `
        <h2 style="color: #10b981; margin-bottom: 1rem;">✅ Pesanan Berhasil!</h2>
        <p style="margin-bottom: 1rem;">Terima kasih! Berikut link Google Drive untuk ${books.length} buku yang Anda pesan:</p>
        <div style="max-height: 400px; overflow-y: auto; background: #f9f9f9; padding: 1rem; border-radius: 5px;">
            ${books.map((book, index) => `
                <div style="margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 5px;">
                    <strong>${index + 1}. ${book.title}</strong><br>
                    <small style="color: #666;">${book.author}</small><br>
                    <a href="${book.driveLink}" target="_blank" 
                       style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; 
                              background: #667eea; color: white; text-decoration: none; 
                              border-radius: 5px; font-size: 0.9rem;">
                        📥 Download dari Google Drive
                    </a>
                </div>
            `).join('')}
        </div>
        <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
            💡 Link juga telah dikirim ke email Anda. Simpan link ini untuk akses di kemudian hari.
        </p>
        <button onclick="closeDownloadModal()" 
                style="width: 100%; padding: 1rem; background: #10b981; color: white; 
                       border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 1rem;">
            Tutup
        </button>
    `;
    
    modal.style.display = 'block';
}

function closeDownloadModal() {
    document.getElementById('downloadModal').style.display = 'none';
}

// Initialize
loadCategories();
loadBooks();
updateCartCount();
