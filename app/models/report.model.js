const sql = require("./db");
// constructor
const Report = function(report) {
    this.report_name = report.report_name;
    this.is_deleted = report.is_deleted;
    this.creation_datetime = report.creation_datetime;
    this.modification_datetime = report.modification_datetime;
    this.deletion_datetime = report.deletion_datetime;
};
//Adding a report
Report.create = (newReport, result) => {
    sql.query("INSERT INTO report_post_master SET ?", newReport, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, {"lang": "EN", "message": "Pie reported successfully", "success": 1, "data": 1});
    })
}
Report.getAll = result => {
    sql.query("SELECT id, report_name FROM report_post_master", (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      result(null, res);
    });
  };
module.exports = Report;