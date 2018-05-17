/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

export class Constants {

    public static readonly AadInstance = 'https://login.microsoftonline.com/';

    public static readonly ClientId = process.env.ClientId;
    public static readonly clientCertPath = process.env.ClientCertificatePath;
    public static readonly clientCertPassword = process.env.ClientCertificatePassword;
    
    public static readonly MSGraphResource = 'https://graph.microsoft.com'

    public static readonly MySQLHost = process.env.MySQLHost;
    public static readonly MySQLPort = process.env.MySQLPort;
    public static readonly MySQLUser = process.env.MySQLUser;
    public static readonly MySQLPassword = process.env.MySQLPassword;
    public static readonly MySQLDbName = process.env.MySQLDbName;
}