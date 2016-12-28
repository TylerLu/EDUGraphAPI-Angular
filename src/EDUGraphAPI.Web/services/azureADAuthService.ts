import * as Promise from "bluebird";
import https = require('https');
import querystring = require('querystring');
var config = require('../config');

export function getAccessToeknViaRefreshToken(refreshToken: string): Promise<string> {
    return new Promise<any>((resolve, reject) => {
        var postData = querystring.stringify({
            refresh_token: refreshToken,
            client_id: config.creds.clientID,
            client_secret: config.creds.clientSecret,
            grant_type: "refresh_token"
        });

        var options = {
            hostname: 'login.microsoftonline.com',
            port: 443,
            path: '/canvizEDU.onmicrosoft.com/oauth2/token',
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        var req = https.request(options, function (res) {
            var result = '';
            res.on('data', function (chunk) {
                result += chunk;
            });
            res.on('end', function () {
                console.log(JSON.parse(result).access_token);
                resolve(JSON.parse(result));
            });
            res.on('error', function (err) {
                console.log(err);
                reject(err);
            })
        });

        // req error
        req.on('error', function (err) {
            console.log(err);
            reject(err);
        });

        //send request witht the postData form
        req.write(postData);
        req.end();
    });
}