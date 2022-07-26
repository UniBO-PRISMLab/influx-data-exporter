// http://localhost:53711/ 
// Use Express
var express = require("express");
// Use body-parser
//var bodyParser = require('body-parser')
const path = require('path');
// Create new instance of the express server
var app = express();
const cors = require('cors');
const auth = require('./routers/auth');
const data = require('./routers/data');
const buckets = require('./routers/buckets');
// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs

app.use(cors());
app.options('*', cors())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
 
// parse application/json
app.use(express.json())
 
// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
app.use("/",express.static(path.join(__dirname, 'src')));

app.use('/api/auth', auth);
app.use('/api/data', data);
app.use('/api/buckets', buckets)
// Init the server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
