var express = require('express');
var config = require('./src/config');
var routes = require('./src/routes');
var cors = require('cors');
var path = require('path');

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4300', 'https://stech.wheba-services.net'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(config); 
app.use('/uploaded_files', express.static(path.join(process.cwd(), 'uploaded_files'))); 
app.use("/api", routes); 


app.use('/', express.static(path.join(__dirname, './public/frontend/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/frontend/browser/index.html'));
});


//local prod
// app.get('/*', (req, res) => {
//   res.sendFile('./src/views/index.html', { root: __dirname });
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });
});

app.listen(process.env.PORT, () => {
  console.log("Running in Port:" + process.env.PORT);
});