const express = require("express");
const morgan = require("morgan");
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())

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
    `<p>Phonebook has info for ${length} people</p>
    <p>${currentDate}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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
  const person = {
    id: getRandomInt(10000),
    name: newPerson.name,
    number: newPerson.number,
  };
  persons = persons.concat(person);

  response.status(200).send("Person added");
  // response.json(person);
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

const PORT = 3002;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
