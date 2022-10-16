const _ = require('lodash');
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
const Permissions = function(permission) {
    this.group_id = permission.group_id;
    this.permission_set = permission.permission_set;
    this.is_deleted = permission.is_deleted;
    this.creation_datetime = permission.creation_datetime;
    this.modification_datetime = permission.modification_datetime;
    this.deletion_datetime = permission.deletion_datetime;
};

//giving role permissions
Permissions.permissions = (modules, newPermissions, result) => {
    //adding a permission
    async function getModulePermission() {
        try {
            const modulePermissions = [];      
            const modulePermission = {};
     
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                const permissions = await knex('module_master').where({id: module}).select();
                const set = [1, permissions[0].permission_sets]
                modulePermissions.push(set);
                modulePermission[module] = set;
            }
            return modulePermission;
            // result(null, modulePermission);
            // result(null, { lang: 'EN', message: 'Module Permissions', success: 1, data: {id: rows[0] , ...newPermissions}});
        } catch (err) {
            result(err, null);
        }
    }

    async function addPermissions() {
        try {
            const permissions = await getModulePermission();
            combinedPermissions = {
                ...newPermissions,
                permission_set: permissions
            }
            const rows = await knex('role_permission_master').insert(combinedPermissions);
            result(null, { lang: 'EN', message: 'Added Permissions Successfully', success: 1, data: {id: rows[0] , ...combinedPermissions}});
        } catch (err) {
            result(err, null);
        }
    }
    addPermissions();
}

module.exports = Permissions;