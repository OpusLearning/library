let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = Date.now(); // Add this line
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }`;
  };
}

function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  newBook.id = Date.now(); // Use timestamp as a simple unique id
  myLibrary.push(newBook);
  saveBooks();
}

function createBookCard(book) {
  const template = document.getElementById("book-card-template");
  const bookCard = template.content.cloneNode(true).firstElementChild;

  const titleElement = bookCard.querySelector(".book-title");
  const authorElement = bookCard.querySelector(".book-author");
  const pagesElement = bookCard.querySelector(".book-pages");
  const readElement = bookCard.querySelector(".book-read");

  if (titleElement) titleElement.textContent = book.title;
  if (authorElement) authorElement.textContent = `Author: ${book.author}`;
  if (pagesElement) pagesElement.textContent = `Pages: ${book.pages}`;
  if (readElement)
    readElement.textContent = book.read ? "Read" : "Not read yet";

  const menuButton = bookCard.querySelector(".menu-button");
  if (menuButton) {
    menuButton.setAttribute("data-book-id", book.id); // Ensure each book has a unique id
  }

  const toggleReadLink = bookCard.querySelector(".toggle-read");
  if (toggleReadLink) {
    toggleReadLink.addEventListener("click", (e) => {
      e.preventDefault();
      book.read = !book.read;
      if (readElement)
        readElement.textContent = book.read ? "Read" : "Not read yet";
      saveBooks();
    });
  }

  const deleteLink = bookCard.querySelector(".delete-book");
  if (deleteLink) {
    deleteLink.addEventListener("click", (e) => {
      e.preventDefault();
      const index = myLibrary.indexOf(book);
      if (index > -1) {
        myLibrary.splice(index, 1);
        saveBooks();
        displayBooks();
      }
    });
  }

  return bookCard;
}

function displayBooks() {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";
  for (let book of myLibrary) {
    const bookCard = createBookCard(book);
    bookList.appendChild(bookCard);
  }
}

// Global event listener for menu buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("menu-button")) {
    e.stopPropagation();
    const menuContent = e.target.nextElementSibling;

    // Close all other open menus
    document.querySelectorAll(".menu-content.show").forEach((menu) => {
      if (menu !== menuContent) {
        menu.classList.remove("show");
      }
    });

    // Toggle the clicked menu
    menuContent.classList.toggle("show");
  } else if (!e.target.closest(".menu-content")) {
    // Close all menus when clicking outside
    document.querySelectorAll(".menu-content.show").forEach((menu) => {
      menu.classList.remove("show");
    });
  }
});

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = this.elements["title"].value;
  const author = this.elements["author"].value;
  const pages = this.elements["pages"].value;
  const read = this.elements["read"].checked;

  addBookToLibrary(title, author, pages, read);
  this.reset();
  modal.style.display = "none";
  displayBooks();
});

displayBooks();

// Make sure this function is defined
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(myLibrary));
}

// Make sure to load books when the page loads
function loadBooks() {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  myLibrary = books.map(
    (book) => new Book(book.title, book.author, book.pages, book.read)
  );
}

// Call loadBooks and displayBooks when the page loads
loadBooks();
displayBooks();
