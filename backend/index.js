require("dotenv").config();
const http = require("http");

//Middleware
const express = require("express");
// const morgan = require("morgan");
const cors = require("cors");
const Person = require("./modules/persons");

const app = express();
app.use(cors());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// app.use(morgan("combined", Request));

app.use(express.json());
app.use(requestLogger);

// let persons = [
//   {
//     name: "Arto Hellas",
//     number: "040-123456",
//     id: 1,
//   },
//   {
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//     id: 2,
//   },
//   {
//     name: "Dan Abramov",
//     number: "12-43-234345",
//     id: 3,
//   },
//   {
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//     id: 4,
//   },
//   {
//     name: "John Walker",
//     number: "23456778",
//     id: 5,
//   },
//   {
//     name: "Alexander Mcqueen ",
//     number: "435434343",
//     id: 6,
//   },
//   {
//     name: "",
//     number: "",
//     id: 7,
//   },
//   {
//     name: "",
//     number: "",
//     id: 8,
//   },
//   {
//     name: "dkdk",
//     number: "djd",
//     id: 9,
//   },
// ];

// const count = persons.filter((item) => item.name).length;

// app.get("/", (request, response) => {
//   response.send("<h1>Hello You Bad Ass!</h1>");
// });

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `
  The phone book has the info for ${count}
  ${new Date().toString()}
  `
  );
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })

    .catch((error) => error);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
    important: body.important || false,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/person/: id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    runValidators: true,
    context: "query",
    new: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
