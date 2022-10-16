module.exports = app => {
    const allroutes = require("../controllers/allroutes.controller");
    var router = require("express").Router();
    //Switching routes
    router.post("/", allroutes.api);
    app.use('/api/allroutes', router);
}