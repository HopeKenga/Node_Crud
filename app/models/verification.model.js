const knex = require('knex')({
    client: 'mysql',
    version: '5.7',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'twitter'
    }
  });

const multer = require('multer');

// constructor
const Verification = function(verification) {
    this.user_id = verification.user_id;
    this.status = verification.status;
    this.phone = verification.phone;
    this.location = verification.location;
    this.nok_id = verification.nok_id;
    this.relationship = verification.relationship;
    this.id_type = verification.id_type;
    this.address_proof = verification.address_proof;
    this.id_front = verification.id_front;
    this.id_back = verification.id_back;
    this.passport = verification.passport;
    this.reason = verification.reason;
    this.timestamp = verification.timestamp;
}

//Approving a verification
Verification.approve = (id, result) => {
    async function approveVerification () {
        try {
            const form = await knex('form').where({id: id}).update(
                {
                    status: 2,
                    timestamp: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'Verification Approved Successfully', success: 1});
        } catch (error) {
            result(err, null)
        }
    }
    approveVerification()
}

//Approving a verification
Verification.decline = (id, result) => {
    async function declineVerification () {
        try {
            const form = await knex('form').where({id: id}).update(
                {
                    status: 3,
                    timestamp: new Date()
                }
            );
            result(null, { lang: 'EN', message: 'Verification Declined Successfully', success: 1});
        } catch (error) {
            result(err, null)
        }
    }
    declineVerification()
}

module.exports = Verification;