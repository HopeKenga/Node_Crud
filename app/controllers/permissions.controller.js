const { userHasPermission } = require("../helpers/permissionChecker");
const Permissions = require("../models/permissions.model");

//create a new permissions
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create a role permission
    const permissions = new Permissions({
        group_id : req.group_id,
        permission_set : req.permission_set,
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
        deletion_datetime : req.deletion_datetime || null,
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Permissions.permissions(req.modules, permissions, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating an interest."
                    });
                else res.send(data);
            });
        }
        else {
            return res.status(403).send({
                success: 0,
                message: "You are not authorized to perform this action."
            })
        }
    }
    checkPermission();
}