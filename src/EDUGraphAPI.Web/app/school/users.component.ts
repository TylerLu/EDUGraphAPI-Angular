/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import { UserModel, StudentModel, TeacherModel } from './user'
import { ClassesModel } from './classes';
import { MapUtils } from '../utils/jsonhelper'
import { SchoolService } from './school.service';
import { UserPhotoService } from '../services/userPhotoService';

class UsersViewModel {

    private static cache = {};
    private userPhotoService: any;
    private schoolService: any;
    private id: string;

    constructor(id: string, userPhotoService: any, schoolService: any) {
        this.id = id;
        this.userPhotoService = userPhotoService;
        this.schoolService = schoolService;
    }

    users: UserModel[] = new Array<UserModel>();
    nextLink: string;
    curPage: number = 1;
    isGettingData: boolean = false;
    showNoData: boolean = false;

    getData(usersGetter: (id: string, nextLink: string) => any) {
        if (this.isGettingData) {
            return;
        }
        this.isGettingData = true;
        usersGetter(this.id, this.nextLink)
            .subscribe((result) => {
                if (this.nextLink) {
                    this.curPage += 1;
                }
                this.isGettingData = false;
                this.nextLink = result["@odata.nextLink"];
                result.value.forEach((obj) => {
                    const model: UserModel = MapUtils.deserialize(UserModel, obj);
                    this.users.push(model);
                    const userId: string = model.O365UserId;
                    var cachedItem = UsersViewModel.cache[userId];
                    if (!cachedItem) {
                        cachedItem = UsersViewModel.cache[userId] = { queue: new Array<UserModel>(model) };
                        this.userPhotoService.getUserPhotoUrl(userId)
                            .then(url => {
                                cachedItem["data"] = url;
                                cachedItem.queue.forEach(user => { user.Photo = url; });
                            });
                    }
                    else if (!cachedItem.data) {
                        cachedItem.queue.push(model);
                    }
                    else {
                        model.Photo = cachedItem.data;
                    }
                });
                this.showNoData = this.users.length == 0;
            },
            (error) => {
                this.isGettingData = false;
            });
    }

    getStudentsInMyClassesData(myclasses) {
        myclasses.forEach((obj) => {
            const model: ClassesModel = MapUtils.deserialize(ClassesModel, obj);
            this.schoolService
                .getClassById(model.ObjectId)
                .subscribe((result) => {
                    let users = result.members.filter(user => MapUtils.deserialize(UserModel, user).ObjectType == 'Student');
                    users.forEach((obj) => {
                        var user = MapUtils.deserialize(UserModel, obj);
                        if (this.users.filter(c => c.O365UserId == user.O365UserId).length == 0) {
                            this.users.push(user);
                            const userId: string = user.O365UserId;
                            var cachedItem = UsersViewModel.cache[userId];
                            if (!cachedItem) {
                                cachedItem = UsersViewModel.cache[userId] = { queue: new Array<UserModel>(user) };
                                this.userPhotoService.getUserPhotoUrl(userId)
                                    .then(url => {
                                        cachedItem["data"] = url;
                                        cachedItem.queue.forEach(user => { user.Photo = url; });
                                    });
                            }
                            else if (!cachedItem.data) {
                                cachedItem.queue.push(model);
                            }
                            else {
                                user.Photo = cachedItem.data;
                            }
                        }
                    });
                });
        });
    }



    changePage(usersGetter: (id: string, nextLink: string) => any, isNext: boolean) {
        if (isNext) {
            if (this.curPage * 12 < this.users.length) {
                this.curPage += 1;
            }
            else if (this.nextLink) {
                this.getData(usersGetter);
            }
        }
        else {
            if (this.curPage > 1) {
                this.curPage -= 1;
            }
        }
    }
}

@Component({
    moduleId: module.id,
    selector: '',
    templateUrl: 'users.component.template.html',
    styleUrls: []
})

export class UsersComponent implements OnInit {

    private sub: any;

    school: SchoolModel;
    view: string = "users";
    usersModel: UsersViewModel;
    studentsModel: UsersViewModel;
    teachersModel: UsersViewModel;
    studentsInMyClassesModel: UsersViewModel;
    isTeacher: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        @Inject('schoolService') private schoolService: SchoolService,
        @Inject('userPhotoService') private userPhotoService: UserPhotoService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const objectId: string = params['id'];
            const Id: string = params['id2'];
            this.schoolService
                .getSchoolById(objectId)
                .subscribe((result) => {
                    this.school = MapUtils.deserialize(SchoolModel, result);

                });
            this.schoolService
                .getMe()
                .subscribe((result) => {
                    var me = MapUtils.deserialize(UserModel, result);
                    if (me.ObjectType == 'Teacher')
                    {
                        this.isTeacher = true;
                        if (!this.studentsInMyClassesModel) {
                            this.studentsInMyClassesModel = new UsersViewModel(Id, this.userPhotoService, this.schoolService);
                        }
                        this.schoolService.getMyClasses(Id)
                            .subscribe((result) => {
                                let classes = result.filter(section => MapUtils.deserialize(ClassesModel, section).SchoolId == Id);
                                this.studentsInMyClassesModel.getStudentsInMyClassesData(classes);
                            });
                    }
                })
            if (!this.usersModel) {
                this.usersModel = new UsersViewModel(objectId, this.userPhotoService, this.schoolService);
            }
            if (!this.studentsModel) {
                this.studentsModel = new UsersViewModel(Id, this.userPhotoService, this.schoolService);
            }
            if (!this.teachersModel) {
                this.teachersModel = new UsersViewModel(Id, this.userPhotoService, this.schoolService);
            }

            this.usersModel.getData(this.schoolService.getUsers.bind(this.schoolService));
            this.studentsModel.getData(this.schoolService.getStudents.bind(this.schoolService));
            this.teachersModel.getData(this.schoolService.getTeachers.bind(this.schoolService));
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    switchView(view: string, hash: string) {
        location.hash = hash;
        this.view = view;
    }

    changePage(userType: string, model: UsersViewModel, isNext: boolean) {
        let usersGetter: (id: string, nextLink: string) => any;
        switch (userType) {
            case "users":
                usersGetter = this.schoolService.getUsers.bind(this.schoolService);
                break;
            case "teachers":
                usersGetter = this.schoolService.getTeachers.bind(this.schoolService);
                break;
            case "students":
                usersGetter = this.schoolService.getStudents.bind(this.schoolService);
                break;
            default:
                return;
        }
        model.changePage(usersGetter, isNext);
    }
}