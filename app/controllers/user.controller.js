const User = require("../models/user.model");
const { userHasPermission } = require("../helpers/permissionChecker");

// Create and Save a new User
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create a User
    const user = new User({
        first_name : req.first_name || "",
        last_name : req.last_name || "",
        user_name : req.req_name || "",
        is_quick : req.is_quick,
        profile_pic : req.profile_pic,
        cover_pic : req.cover_pic,
        gender : req.gender,
        things_id : req.things_ids,
        profile_status : req.profile_status,
        birth_date : req.birth_date,
        country_name : req.country_name,
        country_code : req.country_code,
        phone_no : req.phone_no,
        wallet : req.wallet,
        pin : req.pin,
        email_id : req.email_id,
        status : req.status,
        verification_status : req.verification_status,
        mobile_code : req.mobile_code,
        is_verify : req.is_verify,
        device_type : req.device_type,
        device_id : req.device_id,
        is_blocked : req.is_blocked,
        countpiemates : req.countpiemates,
        countfollowers : req.countfollowers,
        countfollowing : req.countfollowing,
        push_enable : req.push_enable,
        is_vibrate : req.is_vibrate,
        is_deleted : req.is_deleted,
        is_boost : req.is_boost,
        is_online : req.is_online,
        is_read : req.is_read,
        from_piemates : req.from_piemates,
        from_anyone : req.from_anyone,
        is_typing : req.is_typing,
        last_login : req.last_login,
        is_deleted: req.is_deleted || 0,
        creation_datetime: req.creation_datetime || new Date(),
        modification_datetime: req.modification_datetime || new Date(),
    });
    //Save Comment in the database
    User.create(user, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else res.send(data);
    });
}

//Update the User things
exports.updateThings = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Save Password in the database
    User.things(req.user_id, req.things_ids, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else res.send(data);
    });
}

//Update the User privacy settings
exports.updatePrivacy = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create a User
    const user = new User({
        is_vibrate : req.is_vibrate,
        is_online : req.is_online,
        is_read : req.is_read,
        from_piemates : req.from_piemates,
        from_anyone : req.from_anyone,
        is_typing : req.is_typing,
        modification_datetime: req.modification_datetime || new Date(),
    });
    //Save Comment in the database
    User.privacy(req.user_id, user, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else res.send(data);
    });
}

//Update the User password
exports.updatePassword = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Save Password in the database
    User.password(req.user_id, req.password, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else res.send(data);
    });
}

//Getting blocked users
exports.blockedUsers = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Save Password in the database
    User.blocked(req.user_id, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else res.send(data);
    });
}

//Getting users by contact
exports.usersByContact = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Save User By Contact in the database
    User.contact(req.user_id, req.contacts, (err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else res.send(data);
    });
}

//Getting all users in the system
exports.getAllUsers = ({req, res}) => {
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
            //Get users in the database
            User.all((err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the User."
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