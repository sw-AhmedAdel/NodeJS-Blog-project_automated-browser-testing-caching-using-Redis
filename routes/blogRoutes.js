const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const Blog = mongoose.model("Blog");
const { cleanHash } = require("../middlewares/cleanHash");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });
    res.send(blog);
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id,
    });
    res.send(blogs);
  });

  app.post("/api/blogs", requireLogin, cleanHash, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });
    try {
      if (blog) {
        res.code = 201;
      }
      await blog.save();
      res.code = 201;
      console.log("from post", res.code);
      res.send(blog);
    } catch (err) {
      console.log("error");
      res.send(400, err);
    }
  });
};
