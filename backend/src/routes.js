var express = require('express');
var router = express.Router();
const file = require("./api/file");

router.use('/file', file);

router.use((req, res) => { 
  res.status(404).sendFile('./views/404.html', { root: __dirname }); 
});

module.exports = router;