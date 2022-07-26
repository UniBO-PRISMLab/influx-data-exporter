const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const {InfluxDB} = require('@influxdata/influxdb-client')
const token = '07Vp2OK2ePBU7w8JSk0yZCWf5ZLIQB0N6EXwipEqWsd0V0y5t-KhaDfekWXvwRbIE15YC86BV0WQmofEcvrCiA=='
const org = 'ORG2'
const bucket = 'example'
const {url} = require('../env')
const {Point} = require('@influxdata/influxdb-client');
const auth = require('../middleware/auth')
var User = require("../user")
var user = new User().getInstance();
// You can generate a Token from the "Tokens Tab" in the UI
/*const token = 'XR6n9ROy8iQoiqHi_cMR4NFVpkypyzoE4zbmUeOF4Rl9nAmb5_vU-yuVJJzepPFI7tb2P_TSn96oSzbr86a5Cw=='
const org = 'cocco.ale99@gmail.com'
const bucket = 'example'*/
//https://eu-central-1-1.aws.cloud2.influxdata.com


router.post("/", auth, function (req, res) {

    const authToken = jwt.decode(req.header('x-auth-token'));
    const org = authToken.org;
    const token = authToken.influxToken;
    
    const query = req.body.query;
    
    const client = new InfluxDB({url: url, token: token})
    const queryApi = client.getQueryApi(org)
    var data = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        
        const o = tableMeta.toObject(row)
        data.push(o)
        console.log(
          `${o._time} ${o._measurement} : ${o._field}=${o._value} y=${o.y} z=${o.z}`
        )
        
      },
      error(error) {
        console.error(error)
        console.log('Finished ERROR')
      },
      complete() {
        console.log('Finished SUCCESS')
        res.json(
            data
        );
      }
    }) 
});

module.exports = router;