// UserInfo
export interface UserInfoAttributes {
    id?: string;
    givenName?: string;
    surname?: string;
    mail?: string;
    userPrincipalName?: string;
    roles?: Array<string>;
}

//TenantInfo
export interface TenantInfoAttributes {
    id?: string;
    Name?: string;
}