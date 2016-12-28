exports.creds = {
    // Required
    identityMetadata: 'https://login.microsoftonline.com/canvizEDU.onmicrosoft.com/.well-known/openid-configuration',
    // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/.well-known/openid-configuration'
    //
    // or you can use the common endpoint
    // 'https://login.microsoftonline.com/common/.well-known/openid-configuration'
    // To use the common endpoint, you have to either set `validateIssuer` to false, or provide the `issuer` value.

    // Required, the client ID of your app in AAD  
    clientID: '37443f61-5fe1-4a1b-8778-e251b3df885b',

    // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token' 
    responseType: 'code',

    // Required
    responseMode: 'form_post',

    // Required, the reply URL registered in AAD for your app
    redirectUrl: 'https://localhost:44380/auth/openid/return',

    // Required if we use http for redirectUrl
    allowHttpForRedirectUrl: true,

    // Required if `responseType` is 'code', 'id_token code' or 'code id_token'. 
    // If app key contains '\', replace it with '\\'.
    clientSecret: 'tOLEM54ZpFh5gXpJRX2SbSsemQ0IhyBClWjl4IwzMQc=',

    // Required to set to false if you don't want to validate issuer
    validateIssuer: true,

    // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata
    issuer: ['https://sts.windows.net/268da1a1-9db4-48b9-b1fe-683250ba90cc/'],

    // Required to set to true if the `verify` function has 'req' as the first parameter
    passReqToCallback: true,

    // Optional. The additional scope you want besides 'openid', for example: ['email', 'profile'].
    scope: null,

    // Optional, 'error', 'warn' or 'info'
    loggingLevel: 'info',

    // Optional. The lifetime of nonce in session, the default value is 3600 (seconds).
    nonceLifetime: null,
};

// Optional.
// If we want to get access_token for a particular resource, you can specify the resource here.
// Note that 'responseType' should be 'code', 'code id_token' or 'id_token code'.
exports.resourceURL = 'https://graph.windows.net';

// The url you need to go to destroy the session with AAD
exports.destroySessionUrl = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https://localhost:44380';

// If you want to use the mongoDB session store for session middleware; otherwise we will use the default
// session store provided by express-session.
// Note that the default session store is designed for development purpose only.
exports.useMongoDBSessionStore = true;

// If you want to use mongoDB, provide the uri here for the database.
exports.databaseUri = 'mongodb://localhost/OIDCStrategy';

// How long you want to keep session in mongoDB.
exports.mongoDBSessionMaxAge = 24 * 60 * 60;  // 1 day (unit is second)