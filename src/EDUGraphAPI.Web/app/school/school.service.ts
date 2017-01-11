﻿import { Injectable, Inject } from '@angular/core';
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

@Injectable()
export class SchoolService {
    private files = [];
    private urlBase: string = Constants.AADGraphResource + '/' + Constants.TenantId;

    constructor(private http: Http, @Inject('auth') private authService, @Inject('data') private dataService: DataService) {
    }


    /**
     * Retrieves all schools.
     * Reference URL: https://msdn.microsoft.com/office/office365/api/school-rest-operations#get-all-schools
     */
    getSchools(): Observable<SchoolModel[]> {
        return this.dataService.getArray<SchoolModel>(this.urlBase + "/administrativeUnits?api-version=beta");
    }

    /**
	 * Retrieves school by id.
     * @param  {string} id Identification of the school
     * Reference URL: https://msdn.microsoft.com/office/office365/api/school-rest-operations#get-a-school.
	 */
    getSchoolById(id: string): Observable<SchoolModel> {
        return this.dataService.getObject(this.urlBase + '/administrativeUnits/' + id + '?api-version=beta');
    }
    /**
    * Retrieves all classes of a school.
    * @param  {string} schoolId Identification of the school
    * @param  {string} nextLink next link in the previous response for next page
    * Reference URL: https://msdn.microsoft.com/office/office365/api/school-rest-operations#get-sections-within-a-school.
    */
    getClasses(schoolId: string, nextLink: string): Observable<PagedCollection<ClassesModel>> {
        //https://graph.windows.net/64446b5c-6d85-4d16-9ff2-94eddc0c2439/groups?api-version=beta&$filter=extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Section'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'10001'
        let url: string = this.urlBase + "/groups?api-version=beta&$top=12&$filter=extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Section'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId + "'" +
            (nextLink ? "&" + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<ClassesModel>(url);
    }
    /**
     * Get current user's information from AD
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/teacher-rest-operations
     */
    getMe(): Observable<UserModel> {
        return this.dataService.getObject<UserModel>(this.urlBase + "/me?api-version=1.5");
    }

    /**
     * Get current users's classes.
     * @param schoolId
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/section-rest-operations
     */
    getMyClasses(schoolId: string): Observable<ClassesModel[]> {
        return this.dataService.getArray<ClassesModel>(this.urlBase + "/me/memberOf?api-version=1.5");
    }

    /**
    * Get a section by using the object_id.
    * Reference URL: https://msdn.microsoft.com/office/office365/api/section-rest-operations#get-a-section.
    * @param classId The Object ID of the section group in Azure Active Directory.
    * <returns></returns>
     */
    getClassById(classId: string): Observable<ClassesModel> {
        return this.dataService.getObject<ClassesModel>(this.urlBase + "/groups/" + classId + "?api-version=beta&$expand=members");
    }

    getClassMembers(classId: string): Observable<UserModel> {
        return this.dataService.getObject<UserModel>(this.urlBase + "/groups/" + classId + "/members?api-version=1.5");
    }

    /**
     * Get all users of a school.
     * @param  {string} schoolId Identification of the school
     * @param  {string} nextLink next link in the previous response for next page
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getUsers(schoolId: string, nextLink: string): Observable<PagedCollection<UserModel>> {
        var url = this.urlBase + "/administrativeUnits/" + schoolId + "/members?api-version=beta&$top=12" +
            (nextLink ? "&" + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<UserModel>(url);
    }

    /**
     * Get all students of a school.
     * @param  {string} schoolId Identification of the school
     * @param  {string} nextLink next link in the previous response for next page
     * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getStudents(schoolId: string, nextLink: string): Observable<PagedCollection<StudentModel>> {
        var url = this.urlBase +
            "/users?api-version=1.5&$filter=extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId +
            "'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Student'&$top=12" +
            (nextLink ? '&' + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<StudentModel>(url);
    }

    /**
     * Get all teachers of a school.
    * @param  {string} schoolId Identification of the school
    * @param  {string} nextLink next link in the previous response for next page
    * Reference URL: https://msdn.microsoft.com/en-us/office/office365/api/school-rest-operations#get-school-members
     */
    getTeachers(schoolId: string, nextLink: string): Observable<PagedCollection<TeacherModel>> {
        var url = this.urlBase + "/users?api-version=1.5&$filter=extension_fe2174665583431c953114ff7268b7b3_Education_SyncSource_SchoolId%20eq%20'" + schoolId +
            "'%20and%20extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType%20eq%20'Teacher'&$top=12" +
            (nextLink ? '&' + GraphHelper.getSkipToken(nextLink) : '');
        return this.dataService.getPagedCollection<TeacherModel>(url);
    }

    /**
     * Get all documents from OneDrive.
     * @param classId
     * Reference URL: https://dev.onedrive.com/items/list.htm.
     */
    getDocuments(classId: string): Observable<Document[]> {
        var url = Constants.MSGraphResource + "/v1.0/groups/" + classId + "/drive/root/children";
        return this.dataService.getArray<Document>(url);
    }

    getOneDriveWebURl(classId: string): Observable<string> {
        var url = Constants.MSGraphResource + "/v1.0/groups/" + classId + "/drive/root";
        return this.dataService.getObject<string>(url);
    }

    /**
     * Get a group's conversations.
     * @param classId
     * Reference URL: https://graph.microsoft.io/en-us/docs/api-reference/v1.0/api/group_list_threads.
     */
    getConversations(classId: string): Observable<Conversation[]> {
        var url = Constants.MSGraphResource + "/v1.0/" + Constants.TenantId + "/groups/" + classId + "/conversations";
        return this.dataService.getArray<Conversation>(url);
    }

    getSeatingArrangements(classId: string): Observable<SeatingArrangement[]> {
        var url = "/api/schools/seatingArrangements/" + classId +"?t=" + new Date().getTime();
        return this.dataService.getObject<SeatingArrangement[]>(url);
    }

    saveSeatingArrangement(classId: string, seatingArrangements: SeatingArrangement[]): any {
        var url = "/api/schools/seatingArrangements/" + classId;
        return this.dataService.post(url, seatingArrangements);
    }
}