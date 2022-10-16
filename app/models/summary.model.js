const knex = require('knex')({
    client: 'mysql',
    version: '5.7',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'tester'
    },
    pool:{min:0, max:5}
  });

  //constructor
    const Summary = function(summary) {

    }

    function getPreviousDay(date = new Date()) {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);
      
        return previous;
      }

    Summary.summary = (result) => {
        //get total users
        async function getTotalUsers() {
            const users = await knex('user_master').count('user_id as total_users').where({is_deleted: 0});
            return users;
        }
        async function getTotalThings() {
            const things = await knex('things_master').count('id as total_things').where({is_deleted: 0});
            return things;
        }

        async function getTotalMealCategory() {
            const categories = await knex('food_category_master').count('id as total_categories').where({is_deleted: 0});
            return categories;
        }

        async function getTotalReportedPies() {
            const reported = await knex('pies_master').count('id as total_reported_pies').where({is_deleted: 0, is_reported: 1});
            return reported;
        }

        async function getTodaysUsers() {
            const p = getPreviousDay();
            const usersCreatedToday = await knex('user_master')
            .count('user_id as total_users_today')
            .where({is_deleted: 0})
            .where('creation_datetime', '>=', p)

            return usersCreatedToday;
        }

        async function getTodaysThings() {
            const p = getPreviousDay();
            const todaythings = await knex('things_master')
            .count('id as total_things')
            .where({is_deleted: 0})
            .where('creation_datetime', '>=', p)

            return todaythings;
        }

        async function getTodaysMealCategory() {
            const p = getPreviousDay();
            const todaycategories = await knex('food_category_master')
            .count('id as total_categories')
            .where({is_deleted: 0})
            .where('creation_datetime', '>=', p)

            return todaycategories;
        }

        async function getTodaysReportedPies() {
            const p = getPreviousDay();
            const todayreported = await knex('pies_master')
            .count('id as total_reported_pies')
            .where({is_deleted: 0, is_reported: 1})
            .where('creation_datetime', '>=', p)

            return todayreported;
        }

        async function getSummary() {
            const totalUsers = await getTotalUsers();
            const totalThings = await getTotalThings();
            const totalMealCategory = await getTotalMealCategory();
            const totalReportedPies = await getTotalReportedPies();
            const usersCreatedToday = await getTodaysUsers();
            const thingsCreatedToday = await getTodaysThings();
            const categoriesCreatedToday = await getTodaysMealCategory();
            const reportedPiesCreatedToday = await getTodaysReportedPies();

            const summary = {
                total_users: totalUsers[0].total_users,
                total_things: totalThings[0].total_things,
                total_categories: totalMealCategory[0].total_categories,
                total_reported_pies: totalReportedPies[0].total_reported_pies,
                total_users_today: usersCreatedToday[0].total_users_today,
                total_things_today: thingsCreatedToday[0].total_things,
                total_categories_today: categoriesCreatedToday[0].total_categories,
                total_reported_pies_today: reportedPiesCreatedToday[0].total_reported_pies
            }

            result(null, summary);
        }
        
        getSummary();
    }

module.exports = Summary;