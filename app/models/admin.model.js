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
const Admin = function(admin) {
    this.full_name = admin.full_name;
    this.email_id = admin.email_id;
    this.username = admin.username;
    this.phone = admin.phone;
    this.password = admin.password;
    this.status = admin.status;
    this.role_group = admin.role_group;
    this.addedBy = admin.addedBy;
    this.last_login = admin.last_login;
    this.is_deleted = admin.is_deleted;
    this.creation_datetime = admin.creation_datetime;
    this.modification_datetime = admin.modification_datetime;
    this.deletion_datetime = admin.deletion_datetime;
};

//Adding a new admin
Admin.create = (newAdmin, result) => {
    //adding a foodcategory
    async function createAdmin() {
        try {
            const rows = await knex('admin').insert(newAdmin);
            result(null, { lang: 'EN', message: 'Added Admin Successfully', success: 1, data: {id: rows[0] , ...newAdmin}});
        } catch (err) {
            result(err, null);
        }
    }
    createAdmin();
}

//Getting all admin
Admin.getAll = (result) => {
    //getting all admin
    async function getAllAdmins() {
        try {
            const admins = await knex('admin').where({is_deleted: 0}).select();
            result(null, { lang: 'EN', message: 'All Admins', success: 1, data: admins });
        } catch (err) {
            result(err, null);
        }
    }
    getAllAdmins();
}

//Getting admin by id
Admin.getById = (id, result) => {
    //getting admin by id
    async function getAdminById() {
        try {
            const admin = await knex('admin').where({admin_id: id}).select();
            result(null, { lang: 'EN', message: 'Admin', success: 1, data: admin });
        } catch (err) {
            result(err, null);
        }
    }
    getAdminById();
}

//Update admin by id
Admin.update = (id, newAdmin, result) => {
    //updating admin
    async function updateAdmin() {
        try {
            const admin = await knex('admin').where({admin_id: id}).update(newAdmin);
            result(null, { lang: 'EN', message: 'Admin Updated Successfully', success: 1, data: admin });
        } catch (err) {
            result(err, null);
        }
    }
    updateAdmin();
}

//Delete admin by id
Admin.delete = (id, result) => {
    //deleting admin
    async function deleteAdmin() {
        try {
            const admin = await knex('admin').where({admin_id: id}).update(
                {
                    is_deleted: 1,
                    deletion_datetime: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'Admin Deleted Successfully', success: 1, data: admin });
        } catch (err) {
            result(err, null);
        }
    }
    deleteAdmin();
}

module.exports = Admin;