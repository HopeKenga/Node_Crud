const Verification = require('../models/verification.model');
const { userHasPermission } = require("../helpers/permissionChecker");


//Update verification with id
exports.approve = ({req, res}) => {
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
            //Update Role in the database
            Verification.approve(req.id, (err, data) => {
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

//Update verification with id
exports.decline = ({req, res}) => {
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
            //Update Role in the database
            Verification.decline(req.id, (err, data) => {
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