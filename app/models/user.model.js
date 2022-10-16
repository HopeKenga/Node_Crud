const md5 = require('md5');
const sql = require("./db");
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
const User = function(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.user_name = user.user_name;
    this.is_quick = user.is_quick;
    this.profile_pic = user.profile_pic;
    this.cover_pic = user.cover_pic;
    this.gender = user.gender;
    this.things_id = user.things_ids;
    this.profile_status = user.profile_status;
    this.birth_date = user.birth_date;
    this.country_name = user.country_name;
    this.country_code = user.country_code;
    this.phone_no = user.phone_no;
    this.wallet = user.wallet;
    this.pin = user.pin;
    this.email_id = user.email_id;
    this.status = user.status;
    this.verification_status = user.verification_status;
    this.mobile_code = user.mobile_code;
    this.is_verify = user.is_verify;
    this.device_type = user.device_type;
    this.device_id = user.device_id;
    this.is_blocked = user.is_blocked;
    this.countpiemates = user.countpiemates;
    this.countfollowers = user.countfollowers;
    this.countfollowing = user.countfollowing;
    this.push_enable = user.push_enable;
    this.is_vibrate = user.is_vibrate;
    this.is_deleted = user.is_deleted;
    this.is_boost = user.is_boost;
    this.is_online = user.is_online;
    this.is_read = user.is_read;
    this.from_piemates = user.from_piemates;
    this.from_anyone = user.from_anyone;
    this.is_typing = user.is_typing;
    this.last_login = user.last_login;
    this.creation_datetime = user.creation_datetime;
    this.modification_datetime = user.modification_datetime;
}
//Updating user interests
User.things = (id, things, result) => {
    //updating things_id in user_master
    async function updateThings() {
        try {
            const update = await knex('user_master').where({user_id: id}).update({things_ids: things});
            //getting the things_id from user_master
            const rows = await knex('user_master').where({user_id: id}).select('things_ids');
            result(null, { lang: 'EN', message: 'Interests Updated', success: 1, data: 1});
        } catch (err) {
            result(err, null);
        }
    }

    updateThings();
}

//updating user privacy settings
User.privacy = (id, newUser, result) => {
    //updating the boolean values in user_master
    async function updatePrivacy() {
        try{
            const rows = await knex('user_master')
            .where({user_id: id})
            .update({
                is_vibrate: newUser.is_vibrate, 
                is_online: newUser.is_online,
                is_read: newUser.is_read, 
                from_piemates: newUser.from_piemates, 
                from_anyone: newUser.from_anyone, 
                is_typing: newUser.is_typing,
                modification_datetime: new Date()
            });
            //get updated user
            const user = await knex('user_master').where({user_id: id});
            result(null, { lang: 'EN', message: 'Updated Privacy', success: 1, data: user});
        }catch(err) {
            result(err, null);
        }
    }
    updatePrivacy();
}

//updating user password
User.password = (id, password, result) => {
    //retrieving the current password from user_master
    async function getPassword() {
        try {
            const rows = await knex('user_master').where({user_id: id});
            //comparing the current password with the password entered by user
            if(rows[0].password === md5(password)) {
                result(null, { lang: 'EN', message: 'You cannot use the same password', success: 0});
            }
            else {
                //updating the password in user_master
                const rows = await knex('user_master')
                .where({user_id: id})
                .update({
                    password: md5(password),
                    modification_datetime: new Date()
                });
                result(null, { lang: 'EN', message: 'Password updated', success: 1});
            }
        } catch (err) {
            result(err, null);
        }
    }
    getPassword();
}

//getting blocked users
User.blocked = (id, result) => {
    //retrieving the blocked users in the pie_mate_master table
    async function getBlocked() {
        try {
            const blocked = await knex('pie_mate_master').where({mate_for: id, status: 1, is_deleted: 0});
            const blockedIds = blocked.map(item => item.mate_by);
            //retrieving the blocked users in the user_master table
            const rows = await knex('user_master')
            .whereIn('user_id', blockedIds)
            .select(
                'user_id',
                'profile_status',
                'countpiemates',
                'profile_pic',
                'first_name',
                'last_name',
                'user_name',
                'verification_status',
                'creation_datetime',
            );

            //check if user follows blocked user in pie_mate_master table
            for(let i = 0; i < rows.length; i++) {
                const follow = await knex('pie_mate_master').where({mate_for: id, mate_by: rows[i].user_id});
                if(follow.length > 0) {
                    rows[i].follow = 1;
                }
                else {
                    rows[i].follow = 0;
                }
            }

            //check if the blocked user is following the user in pie_mate_master table
            for(let i = 0; i < rows.length; i++) {
                const follow = await knex('pie_mate_master').where({mate_by: rows[i].user_id, mate_for: id});
                if(follow.length > 0) {
                    rows[i].followStatus = 1;
                }
                else {
                    rows[i].followStatus = 0;
                }
            }

            result(null, { lang: 'EN', message: 'Blocked users', success: 1, data: rows});
        } catch (err) {
            result(err, null);
        }
    }
    getBlocked();
}

//getting users by contact
User.contact = (id, contacts, result) => {
    //comparing the phone_no with the phone_no in user_master
    async function getContact() {
        try {
            //checking if the user follows any of the users in the phone_no
            const mate = await knex('pie_mate_master').where({mate_for: id, status: 1, is_deleted: 0});
            const mateIds = mate.map(item => item.mate_by);
            const users = await knex('user_master').whereIn('phone_no', contacts).whereNotIn('user_id', mateIds);
            result(null, { lang: 'EN', message: 'Users by contact', success: 1, data: users});
        } catch (err) {
            result(err, null);
        }
    }
    getContact();
}

//fetching all users in the system
User.all = (result) => {
    //retrieving all the users in the user_master table
    async function getAll() {
        try {
            const rows = await knex('user_master').select().orderBy('creation_datetime', 'desc');
            result(null, { lang: 'EN', message: 'All users', success: 1, data: rows});
        } catch (err) {
            result(err, null);
        }
    }
    getAll();
}
module.exports = User;