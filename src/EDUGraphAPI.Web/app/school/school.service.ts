﻿/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { GraphHelper } from '../utils/graphHelper'
import { PagedCollection } from '../models/common/pagedCollection';
import { SchoolModel } from '../school/school';
import { Constants } from '../constants';
import { UserModel, StudentModel, TeacherModel } from '../school/user';
import { ClassesModel } from '../school/classes';
import { Document, OneDrive } from './document';
import { Conversation } from './conversation';
import { SeatingArrangement } from './seatingarrangements';
import { DataService } from '../services/dataService';
import { AuthHelper } from "../authHelper/authHelper";

@Injectable()
export class SchoolService {

    private files = [];
    private urlBase: string = Constants.MSGraphResource + '/beta';

    constructor(
        private http: Http,
        @Inject('auth') private authService: AuthHelper,
        @Inject('data') private dataService: DataService) {
    }

    /**
     * Retrieves all schools
     * Reference URL: https://msdn.microsoft.com/office/office365/api/school-rest-operations#get-all-schools
     */
    getSchools(): Observable<any[]> {
        return this.dataService.getArray<any>(this.urlBase + "/administrativeUnits");
    }

    /**
	 * Retrieves a school by id
     * @param  {string} id Identification of the school
     * Reference URL: https://msdn.microsoft.com/office/office365/api/school-rest-operations#get-a-school.
	 */
    getSchoolById(id: string): Observable<any> {
        return this.dataService.getObject(this.urlBase + '/administrativeUnits/' + id );
    }
    /**
     * Retrieves classes of a school
     * @param  {string} schoolId Identification of the school
     * @param  {string} nextLink next link in the previous response for next page
     * Reference URL: https://msdn.microsoft.com/office/office365/api/school-rest-operations#get-sections-within-a-school.
     */
    getClasses(schoolId: string, nextLink: string): Observable<PagedCollection<any>> {
        let url: string = this.urlBase + "/groups?$top=12&$filter=extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Section'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId + "'" +
            (nextLink ? "&" + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<any>(url);
    }
    /**
     * Get current user's information
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/teacher-rest-operations
     */
    getMe(): Observable<any> {
        return this.dataService.getObject<any>(this.urlBase + "/me");
    }

    /**
     * Get current user's classes
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/section-rest-operations
     */
    getMyClasses(schoolId: string): Observable<any[]> {
        return this.dataService.getArray<any>(this.urlBase + "/me/memberOf");
    }

    /**
     * Get a section
     * Reference URL: https://msdn.microsoft.com/office/office365/api/section-rest-operations#get-a-section.
     * @param classId The Object ID of the section
     */
    getClassById(classId: string): Observable<any> {
        return this.dataService.getObject<any>(this.urlBase + "/groups/" + classId + "?$expand=members");
    }

    /**
     * Get members of a class
     * @param classId The Object ID of the section
     */
    getClassMembers(classId: string): Observable<PagedCollection<any>> {
        return this.dataService.getPagedCollection<any>(this.urlBase + "/groups/" + classId + "/members");
    }

    /**
     * Get users of a school
     * @param  {string} schoolId Identification of the school
     * @param  {string} nextLink next link in the previous response for next page
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getUsers(schoolId: string, nextLink: string): Observable<PagedCollection<any>> {
        var url = this.urlBase + "/administrativeUnits/" + schoolId + "/members?$top=12" +
            (nextLink ? "&" + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<any>(url);
    }

    /**
     * Get students of a school
     * @param  {string} schoolId Identification of the school
     * @param  {string} nextLink next link in the previous response for next page
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getStudents(schoolId: string, nextLink: string): Observable<PagedCollection<any>> {
        var url = this.urlBase +
            "/users?$filter=extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId +
            "'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Student'&$top=12" +
            (nextLink ? '&' + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<any>(url);
    }

    /**
     * Get teachers of a school
     * @param  {string} schoolId Identification of the school
     * @param  {string} nextLink next link in the previous response for next page
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getTeachers(schoolId: string, nextLink: string): Observable<PagedCollection<any>> {
        var url = this.urlBase + "/users?$filter=extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId +
            "'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Teacher'&$top=12" +
            (nextLink ? '&' + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<any>(url);
    }

    /**
     * Get all teachers of a school
     * @param  {string} schoolId Identification of the school
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getAllTeachers(schoolId: string): Observable<any[]> {
        var url = this.urlBase + "/users?$filter=extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId +
            "'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Teacher'"
        return this.dataService.getArray<any>(url);
    }


    /**
     * Get documents of a class
     * Reference URL: https://dev.onedrive.com/items/list.htm.
     */
    getDocuments(classId: string): Observable<any[]> {
        var url = Constants.MSGraphResource + "/v1.0/groups/" + classId + "/drive/root/children";
        return this.dataService.getArray<any>(url);
    }

    getOneDriveWebURl(classId: string): Observable<string> {
        var url = Constants.MSGraphResource + "/v1.0/groups/" + classId + "/drive/root";
        return this.dataService.getObject<string>(url);
    }

    /**
     * Get conversations of a class
     * Reference URL: https://graph.microsoft.io/en-us/docs/api-reference/v1.0/api/group_list_threads.
     */
    getConversations(classId: string): Observable<any[]> {
        var url = Constants.MSGraphResource + "/v1.0/" + Constants.TenantId + "/groups/" + classId + "/conversations";
        return this.dataService.getArray<any>(url);
    }

    getSeatingArrangements(classId: string): Observable<SeatingArrangement[]> {
        var url = "/api/schools/seatingArrangements/" + classId + "?t=" + new Date().getTime();
        return this.dataService.getObject<SeatingArrangement[]>(url);
    }

    saveSeatingArrangement(classId: string, seatingArrangements: SeatingArrangement[]): any {
        var url = "/api/schools/seatingArrangements/" + classId + "?t=" + new Date().getTime();
        return this.dataService.post(url, seatingArrangements);
    }

    addUserToSectionMembers(classId: string, userId: string): Observable<any> {
        let data = { "@odata.id": "https://graph.microsoft.com/v1.0/users/" + userId };
        return this.dataService.postToGraph(`${Constants.MSGraphResource}/v1.0/groups/${classId}/members/$ref`, data);
    }

    addUserToSectionOwners(classId: string, userId: string): Observable<any> {
        let data = { "@odata.id": "https://graph.microsoft.com/v1.0/users/" + userId };
        return this.dataService.postToGraph(`${Constants.MSGraphResource}/v1.0/groups/${classId}/owners/$ref`, data);
    }
}