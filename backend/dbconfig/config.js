const {createPool} = require('mysql2'); 
require('dotenv').config();  
var connection = createPool({
    port: process.env.DB_Port,
    user: process.env.DB_Username,
    host: process.env.DB_Host,
    password: process.env.DB_Password,
    database: process.env.DB_Name,
    connectionLimit: 10,
}) 
module.exports = connection;