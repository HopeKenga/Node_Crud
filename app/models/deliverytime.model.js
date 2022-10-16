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
const Deliverytime = function(deliverytime) {
    this.alias = deliverytime.alias;
    this.time = deliverytime.time;
    this.is_deleted = deliverytime.is_deleted;
    this.creation_datetime = deliverytime.creation_datetime;
    this.modification_datetime = deliverytime.modification_datetime;
};

//Adding a new deliverytime
Deliverytime.create = (newDeliverytime, result) => {
    //adding a foodcategory
    async function createDeliverytime() {
        try {
            const rows = await knex('delivery_time_master').insert(newDeliverytime);
            result(null, { lang: 'EN', message: 'Added Deliverytime Successfully', success: 1, data: {id: rows[0] , ...newDeliverytime}});
        } catch (err) {
            result(err, null);
        }
    }
    createDeliverytime();
}

//Getting all deliverytime
Deliverytime.getAll = (result) => {
    //getting all deliverytime
    async function getAllDeliverytimes() {
        try {
            const deliverytime = await knex('delivery_time_master').where({is_deleted: 0}).select();
            result(null, { lang: 'EN', message: 'All Delivery times', success: 1, data: deliverytime });
        } catch (err) {
            result(err, null);
        }
    }
    getAllDeliverytimes();
}

//Getting deliverytime by id
Deliverytime.getById = (id, result) => {
    //getting deliverytime by id
    async function getDeliverytimeById() {
        try {
            const deliverytime = await knex('delivery_time_master').where({id: id}).select();
            result(null, { lang: 'EN', message: 'Deliverytime', success: 1, data: deliverytime });
        } catch (err) {
            result(err, null);
        }
    }
    getDeliverytimeById();
}

//Update deliverytime by id
Deliverytime.update = (id, newDeliverytime, result) => {
    //updating deliverytime
    async function updateDeliverytime() {
        try {
            const deliverytime = await knex('delivery_time_master').where({id: id}).update(newDeliverytime);
            result(null, { lang: 'EN', message: 'Deliverytime Updated Successfully', success: 1, data: deliverytime });
        } catch (err) {
            result(err, null);
        }
    }
    updateDeliverytime();
}

//Delete deliverytime by id
Deliverytime.delete = (id, result) => {
    //deleting deliverytime
    async function deleteDeliverytime() {
        try {
            const deliverytime = await knex('delivery_time_master').where({id: id}).update(
                {
                    is_deleted: 1,
                }
            );
            result(null, { lang: 'EN', message: 'Deliverytime Deleted Successfully', success: 1, data: deliverytime });
        } catch (err) {
            result(err, null);
        }
    }
    deleteDeliverytime();
}

module.exports = Deliverytime;