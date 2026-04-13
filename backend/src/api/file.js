const express = require('express');
const router = express.Router();
const cors = require('cors');
const file_controller = require("../controller/file.controller");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4300'],
  credentials: true
};

router.use(cors(corsOptions));
router.options('*', cors(corsOptions));
 
router.post('/get_files', file_controller.get_files);
router.get('/getAllFiles', file_controller.getAllFiles);
router.post('/uploadFile', upload.array('files', 10), file_controller.uploadFile);
router.post('/delete_file', file_controller.delete_file);
router.get('/pdf/:filename', file_controller.get_pdf); 

module.exports = router;