"use strict";

var _express = _interopRequireDefault(require("express"));

var _books = _interopRequireDefault(require("./books.js"));

var _middleware = require("./middleware.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = 3000;
app.use(_express["default"].json());
app.use(_middleware.timeLogger);
app.use(_middleware.requestLogger);
app.use(_middleware.requestModifier); // app.use(checkToken);

app.set("view engine", "ejs");
app.set("views", "./views"); //routes / URL / utama kita method GET

app.get("/profile", function (req, res) {
  res.render("profile", {
    name: "John Doe"
  });
});
app.get("/web/books", function (req, res) {
  res.render("books", {
    books: _books["default"]
  });
});
app.get("/books", function (req, res) {
  console.log();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(_books["default"]));
});
app.get("/books/:id", function (req, res) {
  var id = parseInt(req.params.id);

  var book = _books["default"].find(function (b) {
    return b.id === id;
  });

  if (book) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(book));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      error: "Book not found"
    }));
  }
});
app.get("/search", function (req, res) {
  if (req.query.title) {
    var title = req.query.title.toLowerCase();

    var searchedBooks = _books["default"].filter(function (b) {
      return b.title.toLowerCase().includes(title);
    });

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(searchedBooks));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      error: "No search criteria provided"
    }));
  }
}); //POST

app.post("/books", function (req, res) {
  var newBook = req.body;

  _books["default"].push(newBook);

  res.setHeader("Content-Type", "application/json");

  if (newBook) {
    res.writeHead(201);
    res.end(JSON.stringify({
      success: true,
      message: "Book added successfully",
      data: _books["default"]
    }));
  } else {
    res.writeHead(500);
    res.end(JSON.stringify({
      error: "Failed to add book"
    }));
  }
}); //PUT

app.put("/books/:id", function (req, res) {
  var id = parseInt(req.params.id);

  var bookIndex = _books["default"].findIndex(function (b) {
    return b.id === id;
  });

  if (bookIndex !== -1) {
    Object.assign(_books["default"][bookIndex], req.body);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: "Book updated successfully",
      data: _books["default"][bookIndex]
    }));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(JSON.stringify({
      error: "Book not found"
    }));
  }
}); //Delete

app["delete"]("/books/:id", function (req, res) {
  var id = parseInt(req.params.id);

  var bookIndex = _books["default"].findIndex(function (b) {
    return b.id === id;
  });

  if (bookIndex !== -1) {
    _books["default"].splice(bookIndex, 1);

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: "Book deleted successfully",
      data: _books["default"]
    }));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(JSON.stringify({
      error: "Book not found"
    }));
  }
});
app["delete"]();
app.use(function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(405);
  res.end(JSON.stringify({
    error: "Method Not Allowed"
  }));
});
app.listen(port, function () {
  console.log("Server running at http://localhost:".concat(port, "/"));
});
//# sourceMappingURL=index.dev.js.map
