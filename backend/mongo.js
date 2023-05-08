const mongoose = require("mongoose");
require("dotenv").config();

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

if (process.argv.length > 5) {
  console.log(
    "Please provide maximum of 3 arguments: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = process.env.Mongo_DB;

mongoose.connect(url),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
});

const PhoneNumber = mongoose.model("PhoneNumber", phoneSchema);

const phone = new PhoneNumber({
  name,
  number,
});

process.argv.length > 3
  ? phone.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
  : PhoneNumber.find({}).then(() => {
      console.log(`${phone.name} ${phone.number}`);
    });
