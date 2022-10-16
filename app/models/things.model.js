knex = require('knex')({
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
const Things = function(things) {
    this.things_name = things.things_name;
    this.status = things.status;
    this.is_deleted = things.is_deleted;
    this.creation_datetime = things.creation_datetime;
    this.modification_datetime = things.modification_datetime;
    this.deletion_datetime = things.deletion_datetime;
}

//Adding a new things
Things.create = (newThings, result) => {
    //adding a things
    async function createThings() {
        try {
            const rows = await knex('things_master').insert(newThings);
            result(null, { lang: 'EN', message: 'Added Interest Successfully', success: 1, data: {id: rows[0] , ...newThings}});
        } catch (err) {
            result(err, null);
        }
    }
    createThings();
}

//Getting all things
Things.getAll = (result) => {
    //getting all things
    async function getAllThings() {
        try {
            const things = await knex('things_master').where({is_deleted: 0}).select();
            result(null, { lang: 'EN', message: 'All Interests', success: 1, data: things });
        } catch (err) {
            result(err, null);
        }
    }
    getAllThings();
}

//Getting things by id
Things.getById = (id, result) => {
    //getting things by id
    async function getThingsById() {
        try {
            const things = await knex('things_master').where({id: id}).select();
            result(null, { lang: 'EN', message: 'Interest', success: 1, data: things });
        } catch (err) {
            result(err, null);
        }
    }
    getThingsById();
}

//Update things by id
Things.update = (id, newThings, result) => {
    //updating things
    async function updateThings() {
        try {
            const things = await knex('things_master').where({id: id}).update(newThings);
            result(null, { lang: 'EN', message: 'Interest Updated Successfully', success: 1, data: things });
        } catch (err) {
            result(err, null);
        }
    }
    updateThings();
}

//Delete things by id
Things.delete = (id, result) => {
    //deleting things
    async function deleteThings() {
        try {
            const things = await knex('things_master').where({id: id}).update(
                {
                    is_deleted: 1,
                    deletion_datetime: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'Interest Deleted Successfully', success: 1, data: things });
        } catch (err) {
            result(err, null);
        }
    }
    deleteThings();
}

module.exports = Things