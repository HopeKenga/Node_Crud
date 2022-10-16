const Report = require('../models/report.model.js');
// Create and Save a new Report
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create a Report
    const report = new Report({
        report_name: req.report_name,
        is_deleted: req.is_deleted || 0,
        creation_datetime: req.creation_datetime || new Date(),
        modification_datetime: req.modification_datetime || new Date(),
        deletion_datetime: req.deletion_datetime || "0000-00-00 00:00:00"
    });
    //Save Report in the database
    Report.create(report, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Report."
            });
        else res.send(data);
    });
}
//Get All Reports in the database
exports.findAll = ({req, res}) => {
    Report.getAll((err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving reports."
        });
        else res.send(data);
    });
};