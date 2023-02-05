const User = require("../../models/User");

async function createUser() {
  return new User({}).save();
}

module.exports = {
  createUser,
};
