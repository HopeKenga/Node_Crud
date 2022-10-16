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
const Foodcategory = function(foodcategory) {
    this.parent_id = foodcategory.parent_id;
    this.category_name = foodcategory.category_name;
    this.status = foodcategory.status;
    this.is_deleted = foodcategory.is_deleted;
    this.creation_datetime = foodcategory.creation_datetime;
    this.modification_datetime = foodcategory.modification_datetime;
    this.deletion_datetime = foodcategory.deletion_datetime;
}

//Adding a new foodcategory
Foodcategory.create = (newFoodcategory, result) => {
    //adding a foodcategory
    async function createFoodcategory() {
        try {
            const rows = await knex('food_category_master').insert(newFoodcategory);
            result(null, { lang: 'EN', message: 'Added Foodcategory Successfully', success: 1, data: {id: rows[0] , ...newFoodcategory}});
        } catch (err) {
            result(err, null);
        }
    }
    createFoodcategory();
}

//Getting all foodcategory
Foodcategory.getAll = (result) => {
    //getting all foodcategory
    async function getAllFoodcategory() {
        try {
            const foodcategory = await knex('food_category_master').where({is_deleted: 0}).select();
            result(null, { lang: 'EN', message: 'All Foodcategories', success: 1, data: foodcategory });
        } catch (err) {
            result(err, null);
        }
    }
    getAllFoodcategory();
}

//Getting foodcategory by id
Foodcategory.getById = (id, result) => {
    //getting foodcategory by id
    async function getFoodcategoryById() {
        try {
            const foodcategory = await knex('food_category_master').where({id: id}).select();
            result(null, { lang: 'EN', message: 'Foodcategory', success: 1, data: foodcategory });
        } catch (err) {
            result(err, null);
        }
    }
    getFoodcategoryById();
}

//Update foodcategory by id
Foodcategory.update = (id, newFoodcategory, result) => {
    //updating foodcategory
    async function updateFoodcategory() {
        try {
            const foodcategory = await knex('food_category_master').where({id: id}).update(newFoodcategory);
            result(null, { lang: 'EN', message: 'Foodcategory Updated Successfully', success: 1, data: foodcategory });
        } catch (err) {
            result(err, null);
        }
    }
    updateFoodcategory();
}

//Delete foodcategory by id
Foodcategory.delete = (id, result) => {
    //deleting foodcategory
    async function deleteFoodcategory() {
        try {
            const foodcategory = await knex('food_category_master').where({id: id}).update(
                {
                    is_deleted: 1,
                    deletion_datetime: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'Foodcategory Deleted Successfully', success: 1, data: foodcategory });
        } catch (err) {
            result(err, null);
        }
    }
    deleteFoodcategory();
}

//Hiding and Unhiding of foodcategory by id
Foodcategory.hideUnhide = (id, result) => {
    //checking if post is already hidden by user
    async function checkHide() {
        const check = await knex('food_category_master').where({
            id: id
        }).select();
        if (check[0].status === 0) {
            unHide()
        } else {
            createHide()
        }
    }
    //hiding a post
    async function createHide() {
        try {
            //change status of food category
            const hidefoodcategory =  await knex('food_category_master')
                .where({id: id})
                .update(
                    {
                        status: 0,
                    }
                )
                result(null, {message: 'food category hidden successfully'});
        } catch (error) {
            result(error, null);
        }

    }

    //unhiding a post
    async function unHide() {
        try {
            const hidefoodcategory =  await knex('food_category_master')
                .where({id: id})
                .update(
                    {
                        status: 1,
                    }
                )
                result(null, {message: 'food category unhidden successfully'});
        } catch(error) {
            result(error, null)
        }
    }

    checkHide();
}

module.exports = Foodcategory