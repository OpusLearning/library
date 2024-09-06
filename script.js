let MyLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }`;
  };
}

function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  MyLibrary.push(newBook);
}

function displayBooks() {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  for (let book of MyLibrary) {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    const bookInfo = document.createElement("p");
    bookInfo.textContent = book.info();
    gridItem.appendChild(bookInfo);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    const toggleReadButton = document.createElement("button");
    toggleReadButton.textContent = book.read ? "Mark Unread" : "Mark Read";
    toggleReadButton.className = "toggle-read-btn";

    deleteButton.addEventListener("click", function () {
      MyLibrary = MyLibrary.filter((b) => b !== book);
      displayBooks();
      alert(`${book.title} deleted`);
    });

    toggleReadButton.addEventListener("click", function () {
      MyLibrary = MyLibrary.map((b) => {
        if (b === book) {
          return { ...b, read: !b.read }; //! switches the boolean
        }
        return b;
      });
      displayBooks();
      alert(`${book.title} marked as ${book.read ? "unread" : "read"}`);
    });

    gridItem.appendChild(deleteButton);
    gridItem.appendChild(toggleReadButton);
    gridContainer.appendChild(gridItem);
  }
}

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
  const pages = parseInt(this.elements["pages"].value);
  const read = this.elements["read"].checked;

  addBookToLibrary(title, author, pages, read);
  displayBooks();
  this.reset();
  modal.style.display = "none";
});

displayBooks();
