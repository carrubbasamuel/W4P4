if(window.location.search) {
    let asin = new URLSearchParams(window.location.search);
    asin = asin.get('id');

    //*AJAX call to get the book details
    fetch(`https://striveschool-api.herokuapp.com/books/${asin}`)
    .then(response => response.json())
    .then(book => {
        details(book);
    })
    .catch(err => console.log(err));
}





function details(book) {
    let root = document.querySelector('#root');
    let spinner = document.querySelector('.spinner-grow');
    setTimeout(() => {
        root.innerHTML = '';
        spinner.classList.add('d-none');
        let card = document.createElement('div');
        card.classList.add('card', 'details-card');
        let cardBody = document.createElement('div');
        let h5 = document.createElement('h1');
        h5.innerText = book.title;
        h5.classList.add('card-title','p-3');
        let span = document.createElement('p');
        span.classList.add('card-text', 'fw-bold');
        span.innerText =`Category:  ${book.category}` ;
        let p = document.createElement('p');
        p.classList.add('card-text');
        let lorem = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, sit iste temporibus, maiores rem eum accusantium, facilis dignissimos porro illo quo atque! Tempore sapiente corporis commodi. Reiciendis dolore exercitationem fugiat?";
        p.innerText = lorem;

        let img = document.createElement('img');
        img.classList.add('card-img-right', 'img-fluid');
        img.src = book.img;

        cardBody.appendChild(h5);
        cardBody.appendChild(span);
        cardBody.appendChild(p);
        card.appendChild(cardBody);
        card.appendChild(img);

        root.appendChild(card);
    }, 1000);

}


