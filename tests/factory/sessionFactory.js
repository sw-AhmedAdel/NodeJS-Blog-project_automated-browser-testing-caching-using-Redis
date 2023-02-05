const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);
const Buffer = require("safe-buffer").Buffer;

function createSession(user) {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  const sessionSig = keygrip.sign("session=" + session);
  return {
    session,
    sessionSig,
  };
}

module.exports = {
  createSession,
};
