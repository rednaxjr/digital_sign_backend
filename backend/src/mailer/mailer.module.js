const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');
const { join } = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: join(__dirname, './template'),
        defaultLayout: false,
    },
    viewPath: join(__dirname, './template'),
    extName: '.hbs',
}));

module.exports = transporter;