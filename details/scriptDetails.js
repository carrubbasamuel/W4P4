
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

}









/*


<div class="card">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
  </div>
  <img src="..." class="card-img-bottom" alt="...">
</div>




*/