const sql = require("./db");
// constructor
const Meal = function(meal) {
    this.c_id = meal.c_id;
    this.user_id = meal.user_id;
    this.meal_pic = meal.meal_pic;
    this.meal_name = meal.meal_name;
    this.meal_desc = meal.meal_desc;
    this.meal_qty = meal.meal_qty;
    this.meal_price = meal.meal_price;
    this.currency = meal.currency;
    this.expire_date = meal.expire_date;
    this.available_from = meal.available_from;
    this.available_to = meal.available_to;
    this.pickup_address = meal.pickup_address;
    this.response_time = meal.response_time;
    this.delivery_time = meal.delivery_time;
    this.delivery_fee = meal.delivery_fee;
    this.delivery_method = meal.delivery_method;
    this.pickup_lat = meal.pickup_lat;
    this.pickup_long = meal.pickup_long;
    this.is_hide = meal.is_hide;
    this.is_reported = meal.is_reported;
    this.report_by = meal.report_by;
    this.is_always = meal.is_always;
    this.reporting_text = meal.reporting_text;
    this.is_deleted = meal.is_deleted;
    this.creation_datetime = meal.creation_datetime;
    this.modification_datetime = meal.modification_datetime;
    this.deletion_datetime = meal.deletion_datetime;
}
//Creating a new meal
Meal.create = (newMeal, result) => {
    async function createMeal() {
        try {
            let rows = 0;
            await sql.query("INSERT INTO meal_master SET ?", newMeal, (err, res) => {
                if (err) {
                    result(null, {"lang": "EN", "message": "Meal creation failure", "success": 0});
                    return;
                }
                rows = res.insertId;
            });
            result(null, {id: rows, ...newMeal});
        } catch (err) {
            result(err, null);
        }
    }
    createMeal();
}
module.exports = Meal;