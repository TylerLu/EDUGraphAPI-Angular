/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
var https = require('https');


export function queryUsers(url: string, tenantId: string, clientId: string, accessToken: string, users: any) {
    
    if (!url) {
        return users;
    }
    else {
        var host = 'graph.microsoft.com';
        //var path = 'https://graph.microsoft.com/v1.0/users/delta?$select=jobTitle,department,mobilePhone';
        var nextUrl = url;
        

        var options = {
            method: 'GET',
            host: host,
            path: nextUrl,
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };

        var request = https.get(options, function (res) {

            var json = '';
            res.on('data', function (chunk) {
                json += chunk;
            });
            res.on('end', function () {
                if (res.statusCode === 200) {
                    try {
                        var data = JSON.parse(json);
                       
                        for (var i = 0; i < data.value.length; i++) {
                            var isRemoved = false;
                            if (data.value[i]["removed"])
                                isRemoved = true;
                            users.push({
                                "id": data.value[i]["id"], "department": data.value[i]["department"], "jobTitle": data.value[i]["jobTitle"],
                                "mobilePhone": data.value[i]["mobilePhone"], "isRemoved": isRemoved
                            });
                        }
                        if (data["@odata.nextLink"]) {
                            nextUrl = data["@odata.nextLink"];
                            queryUsers(nextUrl, tenantId, clientId, accessToken, users);
                        }


                    } catch (e) {
                        console.log('Error parsing JSON!');
                    }
                } else {
                    console.log('Status:', res.statusCode);
                }
            });


        }).on('error', (e) => {
            console.error(e);
        });



        var a = 1;
    }



}