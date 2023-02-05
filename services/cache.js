const mongoose = require("mongoose");
const redis = require("redis");
const { promisify } = require("util");
const keys = require("../config/dev");
const redisURL = keys.redisURL;
const client = redis.createClient({
  legacyMode: true,
  redisURL,
});
client.hget = promisify(client.hget);
async function startServer() {
  await client.connect();
}
client.on("connect", function () {
  console.log("Connecting to redis");
});

client.on("ready", function () {
  console.log("Redis is ready to be used");
});

client.on("end", function () {
  console.log("Clinet is disconnect ");
});

client.on("error", function (err) {
  console.log(err.message);
});
startServer();

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (oprtions = {}) {
  this.useCahce = true;
  this.hashKey = JSON.stringify(oprtions.key || "");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCahce) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  const cacheValue = await client.hget(this.hashKey, key);
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }
  const results = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(results));
  client.expire(this.hashKey, 100000);
  return results;
};

function deleteHash(hashKey) {
  client.del(JSON.stringify(hashKey));
}

module.exports = {
  deleteHash,
};
