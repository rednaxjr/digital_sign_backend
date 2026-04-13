const cookieParser = require('cookie-parser');
var express = require('express');
var router = express.Router();
const morgan = require('morgan');
require('dotenv').config(); 
var path = require('path'); 

router.use(cookieParser());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));
router.use(morgan('dev'));

router.use('/admin', express.static(path.join(__dirname, '../admin'))); 

module.exports = router;