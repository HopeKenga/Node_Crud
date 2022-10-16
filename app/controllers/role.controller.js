const { userHasPermission } = require("../helpers/permissionChecker");
const Role = require("../models/role.model");

//create a new role
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create an Role
    const role = new Role({
        groupName : req.groupName,
        is_deleted : req.is_deleted || 0,
        deletion_datetime : req.deletion_datetime || "0000-00-00 00:00:00",
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Role.create(role, (err, data) => {
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

// Get all admins
exports.getAll = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Role.getAll((err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while getting all admins."
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

// Get a single role with id
exports.getOne = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Role.getById(req.id, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while getting single role."
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

//Update role with id
exports.update = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Update an Role
    const role = new Role({
        groupName : req.groupName,
        is_deleted : req.is_deleted || 0,
        deletion_datetime : req.deletion_datetime || "0000-00-00 00:00:00",
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            //Update Role in the database
            Role.update(req.id, role, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while updating a role."
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

// Delete an role with id
exports.delete = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            //Delete Role from the database
            Role.delete(req.id, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while deleting a foodcategory."
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