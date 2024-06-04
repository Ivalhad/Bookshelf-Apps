let books = [];

function addBook(event) {
    event.preventDefault();

    const titleInput = document.querySelector("#inputBookTitle");
    const authorInput = document.querySelector("#inputBookAuthor");
    const yearInput = document.querySelector("#inputBookYear");
    const isCompleteInput = document.querySelector("#inputBookIsComplete");

    const year = parseInt(yearInput.value, 10);

    const newBook = {
        id: +new Date(),
        title: titleInput.value,
        author: authorInput.value,
        year: year,
        isComplete: isCompleteInput.checked,
    };

    books.push(newBook);
    document.dispatchEvent(new Event("bookChanged"));
}

function searchBook(event) {
    event.preventDefault();

    const searchInput = document.querySelector("#searchBookTitle");
    const query = searchInput.value.toLowerCase();

    if (query) {
        displayBooks(
            books.filter((book) => book.title.toLowerCase().includes(query))
        );
    } else {
        displayBooks(books);
    }
}

function markAsRead(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex].isComplete = true;
        document.dispatchEvent(new Event("bookChanged"));
    }
}

function markAsUnread(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex].isComplete = false;
        document.dispatchEvent(new Event("bookChanged"));
    }
}

function deleteBook(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event("bookChanged"));
    }
}

function displayBooks(bookList) {
    const incompleteBookshelfList = document.querySelector(
        "#incompleteBookshelfList"
    );
    const completeBookshelfList = document.querySelector(
        "#completeBookshelfList"
    );

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of bookList) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");

        const bookTitle = document.createElement("h2");
        bookTitle.innerText = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerText = "Penulis: " + book.author;

        const bookYear = document.createElement("p");
        bookYear.innerText = "Tahun: " + book.year;

        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);

        const actionContainer = document.createElement("div");
        actionContainer.classList.add("action");

        const readButton = document.createElement("button");
        readButton.id = book.id;
        readButton.innerText = book.isComplete
            ? "Belum Selesai dibaca"
            : "Selesai dibaca";
        readButton.classList.add("green");
        readButton.addEventListener(
            "click",
            book.isComplete ? markAsUnread : markAsRead
        );

        const deleteButton = document.createElement("button");
        deleteButton.id = book.id;
        deleteButton.innerText = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", deleteBook);

        actionContainer.appendChild(readButton);
        actionContainer.appendChild(deleteButton);
        bookItem.appendChild(actionContainer);

        if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }
    }
}

function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
}

window.addEventListener("load", () => {

    books = JSON.parse(localStorage.getItem("books")) || [];

    displayBooks(books);

    const inputBookForm = document.querySelector("#inputBook");
    const searchBookForm = document.querySelector("#searchBook");

    inputBookForm.addEventListener("submit", addBook);
    searchBookForm.addEventListener("submit", searchBook);
    document.addEventListener("bookChanged", () => {
        saveBooksToLocalStorage();
        displayBooks(books);
    });
});