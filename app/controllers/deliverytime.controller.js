const { userHasPermission } = require("../helpers/permissionChecker");
const Deliverytime = require("../models/deliverytime.model");

//create a new deliverytime
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create an Deliverytime
    const deliverytime = new Deliverytime({
        alias : req.alias,
        time : req.time,
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Deliverytime.create(deliverytime, (err, data) => {
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
            Deliverytime.getAll((err, data) => {
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

// Get a single deliverytime with id
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
            Deliverytime.getById(req.id, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while getting single deliverytime."
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

//Update deliverytime with id
exports.update = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Update an Deliverytime
    const deliverytime = new Deliverytime({
        alias : req.alias,
        time : req.time,
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            //Update Deliverytime in the database
            Deliverytime.update(req.id, deliverytime, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while updating a deliverytime."
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

// Delete an deliverytime with id
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
            Deliverytime.delete(req.id, (err, data) => {
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