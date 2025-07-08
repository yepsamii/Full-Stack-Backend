if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}



const name = process.argv[3];
const number = process.argv[4];








const person = new Person({
  name: name,
  number: number,
  important: true,
});

if (!name || !number) {
  console.log("Phonebook: ");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
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
