const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {InfluxDB} = require('@influxdata/influxdb-client');
const {url} = require('../env')
const auth = require('../middleware/auth');
const axios = require('axios');

router.get("/", auth, function (req, res) {

    const authToken = jwt.decode(req.header('x-auth-token'));
    const org = authToken.org;
    const token = authToken.influxToken;
    var buckets = [];
    axios.get(`${url}/api/v2/buckets?org=${org}`, {
        headers: {
            "Authorization" : `Token ${token}`
        }
    })
      .then(function (response) {
        // handle success
        console.log(response.data.buckets);
        res.json(response.data.buckets);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

});

module.exports = router;