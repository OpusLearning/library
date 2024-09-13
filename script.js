class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = Date.now(); // Add this line
  }
  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }`;
  }
}

class Library {
  constructor() {
    this.books = [];
  }
  addBook(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    newBook.id = Date.now();
    this.books.push(newBook);
    this.saveBooks();
  }

  removeBook(id) {
    const index = this.books.findIndex((book) => book.id === id);
    if (index > -1) {
      this.books.splice(index, 1);
      this.saveBooks();
    }
  }

  toggleReadStatus(id) {
    const book = this.books.find((book) => book.id === id);
    if (book) {
      book.read = !book.read;
      this.saveBooks();
    }
  }

  saveBooks() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }

  loadBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    this.books = books.map(
      (book) => new Book(book.title, book.author, book.pages, book.read)
    );
  }
}

class UI {
  constructor(library) {
    this.library = library;
    this.bookList = document.getElementById("bookList");
    this.modal = document.getElementById("myModal");
    this.bookForm = document.getElementById("bookForm");
    this.addBookBtn = document.getElementById("myBtn");
    this.closeModalBtn = document.getElementsByClassName("close")[0];
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => this.handleGlobalClick(e));
    this.bookForm.addEventListener("submit", (e) => this.handleFormSubmit(e));
    this.addBookBtn.addEventListener("click", () => this.openModal());
    this.closeModalBtn.addEventListener("click", () => this.closeModal());
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });
  }

  createBookCard(book) {
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
      menuButton.setAttribute("data-book-id", book.id);
    }

    const toggleReadLink = bookCard.querySelector(".toggle-read");
    if (toggleReadLink) {
      toggleReadLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.library.toggleReadStatus(book.id);
        this.displayBooks();
      });
    }

    const deleteLink = bookCard.querySelector(".delete-book");
    if (deleteLink) {
      deleteLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.library.removeBook(book.id);
        this.displayBooks();
      });
    }

    return bookCard;
  }

  displayBooks() {
    this.bookList.innerHTML = "";
    for (let book of this.library.books) {
      const bookCard = this.createBookCard(book);
      this.bookList.appendChild(bookCard);
    }
  }

  handleGlobalClick(e) {
    if (e.target.classList.contains("menu-button")) {
      e.stopPropagation();
      const menuContent = e.target.nextElementSibling;

      document.querySelectorAll(".menu-content.show").forEach((menu) => {
        if (menu !== menuContent) {
          menu.classList.remove("show");
        }
      });

      menuContent.classList.toggle("show");
    } else if (!e.target.closest(".menu-content")) {
      document.querySelectorAll(".menu-content.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.elements["title"].value;
    const author = form.elements["author"].value;
    const pages = form.elements["pages"].value;
    const read = form.elements["read"].checked;

    this.library.addBook(title, author, pages, read);
    form.reset();
    this.closeModal();
    this.displayBooks();
  }

  openModal() {
    this.modal.style.display = "block";
  }

  closeModal() {
    this.modal.style.display = "none";
  }
}

const library = new Library();
const ui = new UI(library);

library.loadBooks();
ui.displayBooks();
