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
const Question = function(question) {
    this.question = question.question;
    this.q_type = question.q_type;
    this.is_deleted = question.is_deleted;
    this.creation_datetime = question.creation_datetime;
    this.modification_datetime = question.modification_datetime;
};

//Adding a new question
Question.create = (newQuestion, options = null, result) => {
    //adding a question
    async function createQuestion() {
        try {
            const question = await knex('questions_master').insert(newQuestion);
            if(newQuestion.q_type == '2') {
                for (var i = 0; i < options?.length; i++) {
                    const option = await knex('question_multichoice_master').insert({
                        q_id: question[0],
                        objective: options[i],
                        is_deleted: 0,
                        creation_datetime: new Date(),
                        modification_datetime: new Date()
                    });    
                }
    
            }
            result(null, { lang: 'EN', message: 'Added Question Successfully', success: 1, data: {id: question[0] , ...newQuestion}});
        } catch (err) {
            result(err, null);
        }
    }
    createQuestion();
}

//Getting all questions
Question.getAll = (result) => {
    //getting all qustions
    async function getAllQuestion() {
        try {
            const questions = await knex('questions_master').where({is_deleted: 0}).select();
            const questionIds = _.map(questions, (el) => el.id);
            //get all options for each question
            const options = await knex('question_multichoice_master').whereIn('q_id', questionIds).where({is_deleted: 0}).select();
            //merge options with questions
            const questionsWithOptions = _.map(questions, (el) => {
                const optionsForQuestion = _.filter(options, {q_id: el.id});
                return {
                    ...el,
                    options: optionsForQuestion
                }
            })
            result(null, { lang: 'EN', message: 'All Questions', success: 1, data: questionsWithOptions });
        } catch (err) {
            result(err, null);
        }
    }
    getAllQuestion();
}

//Getting question by id
Question.getById = (id, result) => {
    //getting question by id
    async function getQuestionsById() {
        try {
            const question = await knex('questions_master').where({id: id}).select();
            const option = await knex('question_multichoice_master').where({q_id: id, is_deleted: 0}).select();
            const questionWithOptions = {
                ...question[0],
                options: option
            }
            result(null, { lang: 'EN', message: 'Question', success: 1, data: questionWithOptions });
        } catch (err) {
            result(err, null);
        }
    }
    getQuestionsById();
}

//Update question by id
Question.update = (id, newQuestion, options = null, result) => {
    //updating question
    async function updateQuestion() {
        try {
            //check if question had multiplechoices
            const notUpdated = await knex('questions_master').where({id: id}).select();
            if(notUpdated[0].q_type == '2') {
                //delete options for question
                const options = await knex('question_multichoice_master').where({q_id: id}).update({
                    is_deleted: 1,
                })
            }
            const question = await knex('questions_master').where({id: id}).update(newQuestion);
            if(newQuestion.q_type == '2') {
                for (var i = 0; i < options?.length; i++) {
                    const option = await knex('question_multichoice_master').insert({
                        q_id: id,
                        objective: options[i],
                        is_deleted: 0,
                        creation_datetime: new Date(),
                        modification_datetime: new Date()
                    });    
                }
    
            }
            result(null, { lang: 'EN', message: 'Question Updated Successfully', success: 1, data: question });
        } catch (err) {
            result(err, null);
        }
    }
    updateQuestion();
}

//Delete question by id
Question.delete = (id, result) => {
    //deleting question
    async function deleteQuestion() {
        try {
            const question = await knex('questions_master').where({id: id}).update(
                {
                    is_deleted: 1,
                }
            );
            //delete options for question
            const options = await knex('question_multichoice_master').where({q_id: id}).update({
                is_deleted: 1,
            })
            result(null, { lang: 'EN', message: 'Question Deleted Successfully', success: 1, data: question });
        } catch (err) {
            result(err, null);
        }
    }
    deleteQuestion();
}

module.exports = Question;