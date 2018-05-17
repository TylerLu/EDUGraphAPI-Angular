/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import { Constants } from './constants'
import { X509Certificate } from './X509Certificate'
import { AuthenticationContext, TokenResponse, ErrorResponse } from 'adal-node';

const cert = new X509Certificate('./app_only_cert.pfx', 'J48W23RQeZv85vj');
const certificate = cert.getPrivateKey();
const thumbprint = cert.getThumbprint();

export function getAppOnlyAccessTokenAsync(tenantId: string, clientId: string, resource: string): Promise<TokenResponse | ErrorResponse> {

    var authorityUrl = Constants.AadInstance + tenantId;
    var context = new AuthenticationContext(authorityUrl);

    return new Promise(function (resolve, reject) {
        context.acquireTokenWithClientCertificate(resource, clientId, certificate, thumbprint, function (err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}