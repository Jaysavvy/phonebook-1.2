const mongoose = require("mongoose");
require("dotenv").config();

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

const url = process.env.Mongo_DB;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  content: String,
  phone: String,
  important: Boolean,
});

const PhoneNumber = mongoose.model("PhoneNumber", phoneSchema);

const phone = new PhoneNumber({
  content: "Pappa John",
  phone: "541-234-0875",
  important: true,
});

phone.save().then((result) => {
  console.log("number saved!");
  mongoose.connection.close();
});
