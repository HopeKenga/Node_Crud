module.exports = app => {
    const posts = require("../controllers/post.controller");
    var router = require("express").Router();
    //Create a new Post
    router.post("/", posts.create);
    // Update a Post with id
    router.post("/:id/hide", posts.update);
    // Retrieve a single Post with user_id
    router.post("/:id", posts.findOne);
    // Retrieve all Posts from the database (with condition).
    router.get("/all", posts.findAll);
    app.use('/api/posts', router);
}