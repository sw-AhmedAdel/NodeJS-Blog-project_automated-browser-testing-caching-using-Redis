const { deleteHash } = require("../services/cache");

async function cleanHash(req, res, next) {
  await next();
  if (res.code) {
    deleteHash(req.user.id);
  }
}
module.exports = {
  cleanHash,
};
