require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// Set up Morgan to use the custom format with the request body token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Define custom token to log request body
morgan.token("body", (req) => JSON.stringify(req.body));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const length = persons.length;
const currentDate = new Date();

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phone-book has info for ${length} people</p>
    <p>${currentDate}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.error("Error fetching persons:", error);
      response.status(500).send("Internal Server Error");
    });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;

  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (persons.find((person) => person.name === newPerson.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      console.error("Error saving person:", error);
      response.status(500).send("Internal Server Error");
    });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);
  if (!persons.find((person) => person.id === id)) {
    return response.status(404).json({
      error: "person not found",
    });
  }
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
