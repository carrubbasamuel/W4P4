//*Function to get books from API
async function getBooks() {
    let url = 'https://striveschool-api.herokuapp.com/books';
    let response = await fetch(url);
    let books = await response.json();
    return books;
}
  


let cartArray = [];//*Array to store the books in the cart used by addCart function and removeCart function


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
        displayNone.innerHTML = '<i class="bi bi-eye"></i>';
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

        

        
        //*
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

// Memorizza l'istanza della classe nel localStorage o sessionStorage





//*function to set the total price of the cart
function setPrice(){
    let totalPrice = document.getElementById('total-price');
    if(cartArray.length === 0){
        totalPrice.innerText = '0 €';
    }else{
        let price = 0;
        cartArray.forEach(book => {
            price += parseFloat(book.price);
        });
        totalPrice.innerText = price + ' €';
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
    localStorage.setItem('cartArray', JSON.stringify(cartArray));
    
    
}



///*Function to render books on the page use the Book class and the getBooks for API request
function renderBooks() {
    getBooks().then(books => {
      let root = document.getElementById('root');
      root.innerHTML = '';
  
      books.forEach(book => {
        let bookCard = new Book(book.asin, book.title, book.category, book.img, book.price);
        let card = bookCard.createCard;
        if (cartArray.some(item => item.title === bookCard.title)) {//*Check if the book is in the cart
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