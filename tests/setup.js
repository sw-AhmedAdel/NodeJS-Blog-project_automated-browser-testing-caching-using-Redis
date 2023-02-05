//jest.setTimeout(30000);
/*We're gonna say just dot set timeout
to be 30,000 like so.
So, notice there is 30,000.
This right here is a duration in milliseconds
and it tells jest how long it should wait
before automatically failing a test.
So, in this case, we're saying wait 30 seconds
before ending any test.*/

/*
i want to create a user to make test but when jest run it will just execute the hader.test so
it has not idea about the user scheam which the user will be saved there and its not connected with mongo
so create a file require the user schema and connect to momgo and forcely make just exexute this file
before each test using pakahe.json file 
*/

require("../models/User");
const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startMongo() {
  await mongoose.connect(keys.mongoURI);
}

async function disconnectMongo() {
  await mongoose.connection.close();
}

beforeAll(async () => {
  await startMongo();
});

afterAll(async () => {
  await disconnectMongo();
  console.log("Connection is closed");
});
