//*Function to get books from API
async function getBooks() {
    let url = 'https://striveschool-api.herokuapp.com/books';
    let response = await fetch(url);
    let books = await response.json();
    return books;
}
  


let cartArray = [];//*Array to store the books in the cart used by addCart function and removeCart function
let currentPage = 1; //* Pagina corrente



//*Class Book with the constructor and the getter for create the card of the book to put in a row and or in the cart
class Book {
    constructor(asin, title, category, img, price) {
        this.asin = asin;
        this.title = title;
        this.category = category;
        this.img = img;
        this.price = price;
    }
    get  createCard() {
        let card = document.createElement('div');
        card.classList.add('card', 'col-6', 'col-md-4', 'col-lg-3');

        let imgElement = document.createElement('img');
        imgElement.classList.add('img-fluid');
        imgElement.src = this.img;

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = this.title;

        let cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = this.category;

        let cardPrice = document.createElement('p');
        cardPrice.classList.add('card-text');
        cardPrice.innerText = this.price + '€';

        //*Button to remove the visibility of the book in the cart
        let displayNone = document.createElement('div');
        displayNone.innerHTML = '<i class="bi bi-eye-slash"></i>';
        displayNone.classList.add('removeVisibility');
        displayNone.addEventListener('click', () => {
            card.remove();
        });

        let newDiv = document.createElement('div');

        let cardButton = document.createElement('button');
        cardButton.classList.add('btn','btn-outline-success', 'rounded-pill', 'btn-block', 'add-cart');
        cardButton.innerText = 'Add to cart';
        cardButton.addEventListener('click', function(event){
            addCart(event.target);
        });

        //*Button details to open a new tab with the details of the book
        let detailsCard = document.createElement('a');
        detailsCard.classList.add('text-dark', 'me-2');
        detailsCard.innerHTML = '<i class="bi bi-three-dots"></i>';
        detailsCard.href = './details/dettagli.html' + `?id=${this.asin}`;
        detailsCard.target = '_blank';



        let i = document.createElement('i');
        i.classList.add('fas','fa-cart-plus', 'ms-2');
        cardButton.appendChild(i);

        newDiv.appendChild(cardButton);
        newDiv.appendChild(detailsCard);
        newDiv.classList.add('d-flex', 'justify-content-between','fs-2', 'align-items-center', 'mt-2');

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(displayNone);
        cardBody.appendChild(newDiv);

        card.appendChild(imgElement);
        card.appendChild(cardBody);
        return card;
    }
}




//*function to set the total price of the cart
function setPrice() {
    let totalPrice = document.getElementById('total-price');
    
    if (cartArray.length === 0) {
      totalPrice.innerText = '0 €';
    } else {
      let price = 0;
      cartArray.forEach(book => {
        price += parseFloat(book.price);
      });
      totalPrice.innerText = price.toFixed(2) + ' €';
    }
  }
  




//*Function for delete all books from the cart. Call in HTML
function deleteAllBooksCart() {
    let cart = document.getElementById('cart');
    cart.innerHTML = '';
    cartArray = [];
    let empty = document.getElementById('empty');
    empty.classList.remove('d-none');
    renderBooks();
    setPrice();
}




//*Function to remove books from the cart use the Book class for create cart item. Call by AddCart function
function removeCart(button) {
    let cart = document.getElementById('cart');
    let bookCard = button.closest('.card');
    let title = bookCard.querySelector('.card-title');

    cartArray = cartArray.filter(item => item.title !== title.innerText);
    cart.innerHTML = '';
    cartArray.forEach(book => {
        let card = book.createCard;
        card.querySelector('a').remove();
        card.querySelector('.removeVisibility').remove();
        let cardButton = card.querySelector('button');
        cardButton.classList.remove('btn-outline-success');
        cardButton.classList.add('btn-outline-danger');
        cardButton.innerText = 'Remove from cart';
        cardButton.addEventListener('click', function(event) {
            removeCart(event.target);
        });
        cart.appendChild(card);
    });

    renderBooks(); // Aggiorna la visualizzazione dei libri dopo la rimozione sul root
    setPrice();
    
    if (cartArray.length === 0) {
        let empty = document.getElementById('empty');
        empty.classList.remove('d-none');
    }
}



//*Function to add books to the cart use the Book class for create cart item. Function call by getter on the Book class
function addCart(button) {
    let empty = document.getElementById('empty');
    empty.classList.add('d-none');

    let cart = document.getElementById('cart');
    cart.innerHTML = '';
    let bookCard = button.closest('.card'); //! Search the closest parent with the class card in DOM(like querySelector)
    let title = bookCard.querySelector('.card-title');
    let category = bookCard.querySelector('.card-text');
    let price = bookCard.querySelector('.card-text:nth-child(3)');
    let img = bookCard.querySelector('img');
    let details = bookCard.querySelector('a');

    let book = new Book(details.href, title.innerText, category.innerText, img.src, price.innerText);
    bookCard.classList.add('in-cart'); // Aggiungi la classe "in-cart"
    book.price = book.price.replace('€', ''); 
    cartArray.push(book);
    setPrice();

    cartArray.forEach(book => {
        let card = book.createCard;
        //*remove the visibility of the book in the cart and change the button
        card.querySelector('a').remove();
        card.querySelector('.removeVisibility').remove();
        let cardButton = card.querySelector('button');
        cardButton.classList.remove('btn-outline-success');
        cardButton.classList.add('btn-outline-danger');
        cardButton.innerText = 'Remove from cart';
        cardButton.addEventListener('click', function(event) {
            removeCart(event.target);
        });
        cart.appendChild(card);
    });

}





//*Function for change the page
function goToPage(page) {
    currentPage = page;
    renderBooks();
}


//*Function to go to the previous page
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
    }
}
  


//*Function to go to the next page
function goToNextPage() {
    let totalPages = localStorage.getItem('totalPages');//*get the total pages from the localStorage store in the browser
    if(currentPage < totalPages){
        currentPage++;
        renderBooks();
    }
}
  
  


//*Function to generate the pagination links
function generatePaginationLinks(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const link = document.createElement('li');
        link.classList.add('page-item','page-link');
        link.innerText = i;
        link.addEventListener('click', function() {
            goToPage(i);
        });

        paginationContainer.appendChild(link);
    }
    localStorage.setItem('totalPages', totalPages);
}


//*Function to initialize the pagination
function initializePagination() {
    getBooks().then(books => {
        const totalPages = Math.ceil(books.length / 8); // Calcola il numero totale di pagine
        generatePaginationLinks(totalPages);
    });
}
  




function renderBooks() {
    getBooks().then(books => {
      let root = document.getElementById('root');
      root.innerHTML = '';
  
      const itemsPerPage = 8; // Numero di libri per pagina
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const booksToRender = books.slice(startIndex, endIndex);
  
      booksToRender.forEach(book => {
        let bookCard = new Book(book.asin, book.title, book.category, book.img, book.price);
        let card = bookCard.createCard;
        if (cartArray.some(item => item.title === bookCard.title)) {
          card.classList.add('in-cart');
        }
        root.appendChild(card);
      });
    });
}
  






///*Function to search books on the page use the Book class and the getBooks for API request
function searchBooks() {
    getBooks().then(books => { 
        let search = document.getElementById('searchInput').value;
        let filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
        let root = document.getElementById('root');
        root.innerHTML = '';
        filteredBooks.forEach(book => {
            let bookCard = new Book(book.asin, book.title, book.category, book.img, book.price);
            root.appendChild(bookCard.createCard);
        });
    });
}



///*Main function call the renderBooks function and add the event listener to the search book only if the value is more than 3 characters
function main(){
    renderBooks();
    initializePagination();
    setPrice();
    document.getElementById('searchInput').addEventListener('keyup', function(){    
        const searchValue = this.value.trim();//*trim remove spaces in the value
        if(searchValue.length < 3) {
            renderBooks();
        }else if (searchValue.length >= 3) {
            searchBooks();
        }
    });
    
}

  


window.onload = main;