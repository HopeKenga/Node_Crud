var nodemailer = require('nodemailer');
knex = require('knex')({
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
const Email = function(email) {
    //
};
//Sending emails to users
Email.emailUsers = (users,subject, message, result) => {
    //getting emails from user_master
    async function getEmails() {
        const emails = await knex('user_master').select('email_id').whereIn('user_id', users);
        const email_ids = emails.map(email => email.email_id);

        return email_ids
    }
    //sending emails to users
    async function sendEmails() {
        try {
            const emails = await getEmails();
            //change emails from array email to string
            const email_ids = emails.join(',');
              // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: `${process.env.MAIL_HOST}`,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: `${process.env.MAIL_USER}`,
                pass: `${process.env.MAIL_PASSWORD}`, 
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: `${process.env.MAIL_FROM}`, // sender address
                to: `${email_ids}`, // list of receivers
                subject: `${subject}`, // Subject line
                text: `${message}`, // plain text body
            });

            result(null, { lang: 'EN', message: 'Email sent successfully', success: 1, data: {users: email_ids}});
        } catch (err) {
            result(err, null);
        }
    }
    sendEmails();
}

module.exports = Email