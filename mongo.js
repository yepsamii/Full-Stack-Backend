const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://abrahmansw:${password}@cluster0.j9pek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
  important: true,
});

if (!name || !number) {
  console.log("Phonebook: ");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
