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

// constructor
const Responsetime = function(responsetime) {
    this.alias = responsetime.alias;
    this.time = responsetime.time;
    this.is_deleted = responsetime.is_deleted;
    this.creation_datetime = responsetime.creation_datetime;
    this.modification_datetime = responsetime.modification_datetime;
};

//Adding a new responsetime
Responsetime.create = (newResponsetime, result) => {
    //adding a foodcategory
    async function createResponsetime() {
        try {
            const rows = await knex('response_time_master').insert(newResponsetime);
            result(null, { lang: 'EN', message: 'Added Responsetime Successfully', success: 1, data: {id: rows[0] , ...newResponsetime}});
        } catch (err) {
            result(err, null);
        }
    }
    createResponsetime();
}

//Getting all responsetime
Responsetime.getAll = (result) => {
    //getting all responsetime
    async function getAllResponsetimes() {
        try {
            const responsetime = await knex('response_time_master').where({is_deleted: 0}).select();
            result(null, { lang: 'EN', message: 'All Delivery times', success: 1, data: responsetime });
        } catch (err) {
            result(err, null);
        }
    }
    getAllResponsetimes();
}

//Getting responsetime by id
Responsetime.getById = (id, result) => {
    //getting responsetime by id
    async function getResponsetimeById() {
        try {
            const responsetime = await knex('response_time_master').where({id: id}).select();
            result(null, { lang: 'EN', message: 'Responsetime', success: 1, data: responsetime });
        } catch (err) {
            result(err, null);
        }
    }
    getResponsetimeById();
}

//Update responsetime by id
Responsetime.update = (id, newResponsetime, result) => {
    //updating responsetime
    async function updateResponsetime() {
        try {
            const responsetime = await knex('response_time_master').where({id: id}).update(newResponsetime);
            result(null, { lang: 'EN', message: 'Responsetime Updated Successfully', success: 1, data: responsetime });
        } catch (err) {
            result(err, null);
        }
    }
    updateResponsetime();
}

//Delete responsetime by id
Responsetime.delete = (id, result) => {
    //deleting responsetime
    async function deleteResponsetime() {
        try {
            const responsetime = await knex('response_time_master').where({id: id}).update(
                {
                    is_deleted: 1,
                }
            );
            result(null, { lang: 'EN', message: 'Responsetime Deleted Successfully', success: 1, data: responsetime });
        } catch (err) {
            result(err, null);
        }
    }
    deleteResponsetime();
}

module.exports = Responsetime;