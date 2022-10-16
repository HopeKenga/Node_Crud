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
const Role = function(role) {
    this.groupName = role.groupName;
    this.is_deleted = role.is_deleted;
    this.deletion_datetime = role.deletion_datetime;
};

//Adding a new role
Role.create = (newRole, result) => {
    //adding a Role
    async function createRole() {
        try {
            const rows = await knex('role_group_master').insert(newRole);
            result(null, { lang: 'EN', message: 'Added Role Successfully', success: 1, data: {id: rows[0] , ...newRole}});
        } catch (err) {
            result(err, null);
        }
    }
    createRole();
}

//Getting all role
Role.getAll = (result) => {
    //getting all role
    async function getAllRoles() {
        try {
            const roles = await knex('role_group_master').where({is_deleted: 0}).select();
            result(null, { lang: 'EN', message: 'All Roles', success: 1, data: roles });
        } catch (err) {
            result(err, null);
        }
    }
    getAllRoles();
}

//Getting role by id
Role.getById = (id, result) => {
    //getting role by id
    async function getRoleById() {
        try {
            const role = await knex('role_group_master').where({group_id: id}).select();
            result(null, { lang: 'EN', message: 'Role', success: 1, data: role });
        } catch (err) {
            result(err, null);
        }
    }
    getRoleById();
}

//Update role by id
Role.update = (id, newRole, result) => {
    //updating role
    async function updateRole() {
        try {
            const role = await knex('role_group_master').where({group_id: id}).update(newRole);
            result(null, { lang: 'EN', message: 'Role Updated Successfully', success: 1, data: role });
        } catch (err) {
            result(err, null);
        }
    }
    updateRole();
}

//Delete role by id
Role.delete = (id, result) => {
    //deleting role
    async function deleteRole() {
        try {
            const role = await knex('role_group_master').where({group_id: id}).update(
                {
                    is_deleted: 1,
                    deletion_datetime: new Date()
                }
            );

            const permission = await knex('role_permission_master').where({group_id: id}).update({
                is_deleted: 1,
                deletion_datetime: new Date()
            })
            result(null, { lang: 'EN', message: 'Role Deleted Successfully', success: 1, data: role });
        } catch (err) {
            result(err, null);
        }
    }
    deleteRole();
}

module.exports = Role;