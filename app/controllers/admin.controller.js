const md5 = require("md5");
const { userHasPermission } = require("../helpers/permissionChecker");
const Admin = require("../models/admin.model");

//create a new admin
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create an Admin
    const admin = new Admin({
        full_name : req.full_name,
        email_id : req.email_id,
        username : req.username,
        phone : req.phone,
        password : md5(req.password),
        status : req.status || 1,
        role_group : req.role_group,
        addedBy : req.addedBy,
        last_login : req.last_login || "0000-00-00 00:00:00",
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
        deletion_datetime : req.deletion_datetime || "0000-00-00 00:00:00",
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Admin.create(admin, (err, data) => {
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
            Admin.getAll((err, data) => {
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

// Get a single admin with id
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
            Admin.getById(req.id, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while getting single admin."
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

//Update admin with id
exports.update = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Update an Admin
    const admin = new Admin({
        full_name : req.full_name,
        email_id : req.email_id,
        user_name : req.user_name,
        phone : req.phone,
        password : md5(req.password),
        role_group : req.role_group,
        addedBy : req.addedBy,
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
        deletion_datetime : req.deletion_datetime || "0000-00-00 00:00:00",
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            //Update Admin in the database
            Admin.update(req.id, admin, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while updating a admin."
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

// Delete an admin with id
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
            //Delete Foodcategory from the database
            Admin.delete(req.id, (err, data) => {
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