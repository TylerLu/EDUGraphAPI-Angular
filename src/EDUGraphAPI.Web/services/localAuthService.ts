import cryptojs = require('crypto-js');
import express = require('express');
import cache = require('memory-cache');

const secretKey: string = "963F0D4C- 4173 - 4829 - 90D1- 0B57A6E67C46";

export function GetAuthorizationCode(uid: string): string {
    var encryptString = cryptojs.AES.encrypt(uid, secretKey);
    return encryptString.toString();
}

export function GetUserId(authorizationCode: string): string {
    var bytes = cryptojs.AES.decrypt(authorizationCode, secretKey);
    return bytes.toString(cryptojs.enc.Utf8);
}

export function ValidateLogin(req: express.Request, res: express.Response, next: any): void {
    const authorizationCode: string = req.body.authorizationCode || req.query.authorizationCode;
    let isLogin: boolean = false, userId: string;

    if (authorizationCode != null) {
        userId = GetUserId(authorizationCode);
        if (cache.get(userId) != null) {
            isLogin = true;
            req["currentUserId"] = userId;
        }
    }
    
    if (!isLogin)
        res.status(403);
    else
        next();
}