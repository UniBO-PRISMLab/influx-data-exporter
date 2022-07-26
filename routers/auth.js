const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {url} = require('../env')
//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXNzaW9AZ21haWwuY29tIiwiZGIiOiJkYjEifQ.bI04HLsEn0LSNsYAvsOSncq3kVPrYDqiEGGGlI34nbg'
//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXNzaW9AZ21haWwuY29tIiwiZGIiOiJkYjEifQ.nMe9dkFsZ0hoHnn_arfFqOHC3Y-IWgxgi8sXbNvViS0'
//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZXNzaW9Db2NjaGllcmkiLCJvcmciOiJNb2Ryb24iLCJpbmZsdXhUb2tlbiI6IjQtOEhLMmZEYnJ5TEJNLVJzTWo1Z3NwWVhwWDFNUzc5R0tCWUozUXpHLWpVNG1hVHVHRFFJMW9UNTRBWGZKbm1BX0w3ZzNlM1NIeG9HM1h3SG5HeG13PT0ifQ.Vpx_SD0kJ0GulY0Ii2aCr8IkRiuHyXYqauZanDctI44'
const {InfluxDB} = require('@influxdata/influxdb-client')
const {
    AuthorizationsAPI,
    OrgsAPI,
    SigninAPI,
    SignoutAPI,
} = require('@influxdata/influxdb-client-apis')


router.post('/', async function (req, res) {
    // sign in using user name and password, remember session cookie(s)
    console.log('*** Signin ***')
    const client = new InfluxDB({url: url })
    const signinApi = new SigninAPI(client)
    const cookies = []
    const ORG = req.body.org
    var influxToken="";
    username= req.body.username;
    password= req.body.password;
    try {
        await signinApi.postSignin(
        {auth: {user: username, password}},
        {
            responseStarted: (headers, status) => {
                console.log("STATUS" + status)
            if (status < 300) {
                const setCookie = headers['set-cookie']
                if (typeof setCookie === 'string') {
                cookies.push(setCookie.split(';').shift())
                console.log(cookies)
                } else if (Array.isArray(setCookie)) {
                setCookie.forEach(c => cookies.push(c.split(';').shift()))
                console.log(setCookie)
                }
            }
            },
        }
        )
    }catch{
        res.status(400).send("Invalid email or password.")
    }

    // authorize communication with session cookies
    const session = {headers: {cookie: cookies.join('; ')}}
    // get all authorization tokens
    console.log('*** GetAuthorizations ***')
    const authorizationAPI = new AuthorizationsAPI(client)
    const authorizations = await authorizationAPI.getAuthorizations({}, session)
    // console.log(JSON.stringify(authorizations?.authorizations, null, 2))
    console.log("START: "+authorizations.authorizations[0].token);
    var hasMyToken = false;
    
    ;(authorizations.authorizations || []).forEach(auth => {
        if(!hasMyToken && auth.org == ORG && auth.status == 'active'){
            
            auth.permissions.forEach( x => {
                if(x.action == 'read' && x.resource.type == 'buckets' && !x.resource.name){
                    influxToken= auth.token;
                    hasMyToken=true;
                }
            })
            
            console.log(' ', auth.description) 
            console.log(' ', auth.org) 
            console.log(' ', auth.status)
            console.log(' ', auth.permissions[0].resource)
        }

    })

    console.log('\nFinished SUCCESS')
    // invalidate the session
    const signoutAPI = new SignoutAPI(client)
    await signoutAPI.postSignout(undefined, session)
    console.log('Signout SUCCESS')
    const token = jwt.sign({ username: username, org: ORG, influxToken: influxToken }, 'myPrivateKey');
    res.json(token);

});

module.exports = router;
