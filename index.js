import express from "express";
import books from "./books.js";
import {
  timeLogger,
  requestLogger,
  requestModifier,
  checkToken,
} from "./middleware.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use(timeLogger);
app.use(requestLogger);
app.use(requestModifier);
// app.use(checkToken);

app.set("view engine", "ejs");
app.set("views", "./views");

//routes / URL / utama kita method GET

app.get("/profile", (req, res) => {
  res.render("profile", { name: "John Doe" });
});

app.get("/web/books", (req, res) => {
  res.render("books", { books });
});

app.get("/books", (req, res) => {
  console.log();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(books));
});

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (book) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(book));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Book not found" }));
  }
});

app.get("/search", (req, res) => {
  if (req.query.title) {
    const title = req.query.title.toLowerCase();
    const searchedBooks = books.filter((b) =>
      b.title.toLowerCase().includes(title)
    );
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(searchedBooks));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "No search criteria provided" }));
  }
});

//POST

app.post("/books", (req, res) => {
  const newBook = req.body;
  books.push(newBook);
  res.setHeader("Content-Type", "application/json");

  if (newBook) {
    res.writeHead(201);
    res.end(
      JSON.stringify({
        success: true,
        message: "Book added successfully",
        data: books,
      })
    );
  } else {
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Failed to add book" }));
  }
});

//PUT

app.put("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    Object.assign(books[bookIndex], req.body);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(
      JSON.stringify({
        success: true,
        message: "Book updated successfully",
        data: books[bookIndex],
      })
    );
  } else {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Book not found" }));
  }
});

//Delete

// app.delete("/books/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const bookIndex = books.findIndex((b) => b.id === id);

//   if (bookIndex !== -1) {
//     books.splice(bookIndex, 1);
//     res.setHeader("Content-Type", "application/json");
//     res.writeHead(200);
//     res.end(
//       JSON.stringify({
//         success: true,
//         message: "Book deleted successfully",
//         data: books,
//       })
//     );
//   } else {
//     res.setHeader("Content-Type", "application/json");
//     res.writeHead(404);
//     res.end(JSON.stringify({ error: "Book not found" }));
//   }
// });

app.use((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(405);
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
