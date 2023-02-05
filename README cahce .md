# AdvancedNodeStarter

Starting project for a course on Advanced Node @ Udemy

/\*
app.get("/api/blogs", requireLogin, async (req, res) => {
const redis = require("redis");
const client = redis.createClient({
legacyMode: true,
});
async function startServer() {
await client.connect();
}
startServer();

    // the fun below take a callback function but we better work with promissing
    //so we will use util to get function called promisfy that convert any functhin
    //as call back to a promise
    //const cachedBlogs = client.get(req.user.id , (err,value)=>{avoid call back });
    const util = require("util");
    //overwrite client to get to make it asa promise
    client.get = util.promisify(client.get);
    const cachedBlogs = await client.get(req.user.id);
    if (cachedBlogs) {
      console.log("from cache");
      return res.send(JSON.parse(cachedBlogs));
    }
    const blogs = await Blog.find({ _user: req.user.id });
    console.log("getting from server");
    client.set(req.user.id, JSON.stringify(blogs));
    res.send(blogs);

});\*/

this code below for explanation
const exec = mongoose.Query.prototype.exec;
//add function cahce to the query and make it chain so i can choose which query i want to cahce

mongoose.Query.prototype.cache = function () {
//this refer to the current query
this.useCahce = true;
return this; // return this -> return thre query that has useCahce = true to finally move to exec func //
};

mongoose.Query.prototype.exec = async function () {
if (!this.useCahce) {
// return the reults from mongo
return exec.apply(this, arguments); // execute the function
}
//here i can add code for the exec which responsable for executing the query
//this code will run berofe executing any query before this query sent off to mongo
console.log("i am about to run a query");
const key = JSON.stringify(
//make the key jsin coz redis doesnot store obj must be json
Object.assign({}, this.getQuery(), {
collection: this.mongooseCollection.name,
})
);
// get the key and check if redis has the data as a cheched
const cacheValue = await client.get(key);
if (cacheValue) {
console.log("Return from redis");
const doc = JSON.parse(cacheValue);
// doc here is a raw model i need to get the data using model refrring to the actual data using new this.model(doc)
return Array.isArray(doc)
? doc.map((d) => new this.model(d))
: new this.model(doc);
}
// call the exec fnction to run the code using the refrence
const results = await exec.apply(this, arguments); //this refer to the query
console.log("Returnin from mongo");
client.set(key, JSON.stringify(results), "EX", 10);
return results;
};

/////////////////////////////
// here i will change the cach to ba hash cache mean
user id {
key : get blogs,
key : get one blog
key :cr page
}
why i would do that ? i wil do it when user add new blog so i will erase the all cahce using the code below
use hset hget for using hash key
