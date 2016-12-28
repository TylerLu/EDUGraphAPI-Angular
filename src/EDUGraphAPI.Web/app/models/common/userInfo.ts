import { Organization } from './organization';
export class UserInfo {
    id: string;
    firstName: string;
    lastName: string;
    o365UserId: string;
    o365Email: string;
    email: string;
    favoriteColor: string;
    organization: Organization;
    roles: string[];
}