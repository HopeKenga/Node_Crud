module.exports = app => {
    const reports = require("../controllers/report.controller");
    var router = require("express").Router();
    //Create a new Report
    router.post("/", reports.create);
    router.post("/get", reports.findAll);
    app.use('/api/reports', router);
}