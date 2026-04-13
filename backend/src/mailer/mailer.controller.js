const express = require('express')
const router = express.Router();
const connection = require('../../dbconfig/config');
const transporter = require('./mailer.module');


const SendRegistrationEmail = async (req, res, next) => {
    const data = req.body;
    console.log(data)
    try {
        await transporter.sendMail({
            from: '"Suguro Tech Solutions Inc." <alexanderjrcalawag.sugurotech@gmail.com>',
            to: data.email,
            subject: 'Password Change Confirmation',
            template: 'changepass',
            context: {
                name: 'Alexander Calawag'
            }
        });
        return res.status(200).json({
            message: "Email sent successfully"
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            message: "Error sending email",
            error: error.message
        });
    }
};

const SendUserAccount = async (data) => {

    console.log("this is from the user acc")
    try {
        await transporter.sendMail({
            from: '"Suguro Tech Solutions Inc." <alexanderjrcalawag.sugurotech@gmail.com>',
            to: "alexanderjrcalawag@gmail.com",
            subject: 'Account Registration',
            template: 'account_info',
            context: {
                fname: data.fname,
                lname: data.lname,
                url: process.env.url,
                email: data.email,
                password: data.password
            }
        });
         
    } catch (error) {
        console.error("Error sending email:", error);
        
    }

};
module.exports = {
    SendRegistrationEmail,
    SendUserAccount
}