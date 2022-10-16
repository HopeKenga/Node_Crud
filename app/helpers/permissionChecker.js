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

async function userHasPermission(admin_id=0, module_id=0) {
    try {
        const admin = await knex('admin').where({admin_id: admin_id}).select();
        if(admin && admin.length <= 0) {
            return {success: 0, message:"User is not an admin"}
        } else {
            const role_group = admin[0].role_group;

            const permissionDetails = await knex('role_permission_master').where({group_id: role_group}).select();
            const permission_set = JSON.parse(permissionDetails[0].permission_set);
            const modulePermissions = Object.keys(permission_set);
            //check if module is in the modulePermissions
            const permission  = modulePermissions.includes(`${module_id}`);
            if(permission) {
                return true;
            }
            else {
                return false;
            }
        }
    } catch (err) {
        return {success: 0, error: err}
    }
}


module.exports = { userHasPermission };