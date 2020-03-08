const express = require('express');
const app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// bodyparser middleware
app.use(express.json());

const routes = require('./routes.js');
routes(app);

let port = process.env.port || 3000;

// listen for requests :)
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
