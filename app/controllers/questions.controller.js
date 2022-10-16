const { userHasPermission } = require("../helpers/permissionChecker");
const Question = require("../models/questions.model");

//create a new question
exports.create = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Create an Question
    const question = new Question({
        question : req.question,
        q_type : req.q_type,
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            Question.create(question, req.options, (err, data) => {
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
            Question.getAll((err, data) => {
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

// Get a single question with id
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
            Question.getById(req.id, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while getting single question."
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

//Update question with id
exports.update = ({req, res}) => {
    //Validate request
    if(!req) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Update an Question
    const question = new Question({
        question : req.question,
        q_type : req.q_type,
        is_deleted : req.is_deleted || 0,
        creation_datetime : req.creation_datetime || new Date(),
        modification_datetime : req.modification_datetime || new Date(),
    });
    
    //check if user has permissions to display all things
    async function checkPermission() {
        const hasPermission = await userHasPermission(req.admin_id, req.module_id);
        if(hasPermission === true) {
            //Update Question in the database
            Question.update(req.id, question, req.options, (err, data) => {
                if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while updating a question."
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

// Delete an question with id
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
            Question.delete(req.id, (err, data) => {
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