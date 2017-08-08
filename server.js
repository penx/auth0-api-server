/**
 * Created by frederickmacgregor on 03/08/2017.
 */
"use strict";
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const DynamoDB = require('./app/DB_connection');

const port = process.env.PORT || 8080;



const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://gorillagorilla.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://api.abcinc.com/timesheets',
    issuer: "https://gorillagorilla.eu.auth0.com/",
    algorithms: ['RS256']
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.post('/timesheets/upload', jwtAuthz(['read:timesheets']), (req, res, next)=>{
    console.log("req.body", req.body);

    return res.send("Timesheet uploaded by user" + req.body.user_id + " " + req.body.hours + " hours");
    
});

app.listen(port);