const Things = require("../models/things.model");
const { userHasPermission } = require("../helpers/permissionChecker");
// Create and Save a new Thing
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create a Thing
    const things = new Things({
        things_name: req.things_name,
        status: req.status || 0,
        is_deleted: req.is_deleted || 0,
        creation_datetime: req.creation_datetime || new Date(),
        modification_datetime: req.modification_datetime || new Date(),
        deletion_datetime: req.deletion_datetime || "0000-00-00 00:00:00"
    });
    //Save Interests in the database
    //check if user has permissions to create things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Things.create(things, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Like."
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

// Get all things
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
            Things.getAll((err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Like."
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

// Get a single thing with thingId
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
                Things.getById(req.id, (err, data) => {
                    if(err)
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Like."
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

//Update thing with thingId
exports.update = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create a Thing
    const things = new Things({
        things_name: req.things_name,
        status: req.status || 0,
        is_deleted: req.is_deleted || 0,
        creation_datetime: req.creation_datetime || new Date(),
        modification_datetime: req.modification_datetime || new Date(),
        deletion_datetime: req.deletion_datetime || "0000-00-00 00:00:00"
    });

    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Things.update(req.id, things, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Like."
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

// Delete a thing with thingId
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
                 //Delete Things from the database
                Things.delete(req.id, (err, data) => {
                    if(err)
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Like."
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
