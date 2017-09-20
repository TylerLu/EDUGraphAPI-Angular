/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
export class Constants {

    public static readonly Host: string = process.env.WEBSITE_HOSTNAME as string;

      
    // Cookie names
    public static readonly O365Username = "O365Username";
    public static readonly O365Email = "O365Email";

    // Database 
    public static readonly SQLiteDB: string = process.env.SQLiteDB as string;
}


