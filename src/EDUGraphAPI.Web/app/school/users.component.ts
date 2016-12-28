import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import {UserModel, StudentModel, TeacherModel} from './user'
import { MapUtils } from '../services/jsonhelper'

class UsersViewModel {
    users: UserModel[];
    nextLink: string;
    curPage: number = 1;
    isGettingData: boolean = false;
    getData(schoolService: any, id: string) {
        if (this.isGettingData) {
            return;
        }
        this.isGettingData = true;
        schoolService
            .getUsers(id, this.nextLink)
            .subscribe((result) => {
                if (this.nextLink) {
                    this.curPage += 1;
                }
                this.isGettingData = false;
                this.nextLink = result["odata.nextLink"];
                if (this.users === undefined) {
                    this.users = new Array<UserModel>();
                }
                result.value.forEach((obj) => { this.users.push(MapUtils.deserialize(UserModel, obj)); });
            });
    }
}

class StudentsViewModel extends UsersViewModel {
    users: StudentModel[];
    getData(schoolService: any, id: string) {
        if (this.isGettingData) {
            return;
        }
        this.isGettingData = true;
        schoolService
            .getStudents(id, this.nextLink)
            .subscribe((result) => {
                if (this.nextLink) {
                    this.curPage += 1;
                }
                this.isGettingData = false;
                this.nextLink = result["odata.nextLink"];
                if (this.users === undefined) {
                    this.users = new Array<StudentModel>();
                }
                result.value.forEach((obj) => { this.users.push(MapUtils.deserialize(StudentModel, obj)); });
            });
    }
}

class TeachersViewModel extends UsersViewModel {
    users: TeacherModel[];
    getData(schoolService: any, id: string) {
        if (this.isGettingData) {
            return;
        }

        this.isGettingData = true;
        schoolService
            .getTeachers(id, this.nextLink)
            .subscribe((result) => {
                if (this.nextLink) {
                    this.curPage += 1;
                }
                this.isGettingData = false;
                this.nextLink = result["odata.nextLink"];
                if (this.users === undefined) {
                    this.users = new Array<TeacherModel>();
                }
                result.value.forEach((obj) => { this.users.push(MapUtils.deserialize(TeacherModel, obj)); });
            });
    }
}

@Component({
    selector: '',
    templateUrl: '/app/school/users.component.template.html',
    styleUrls: []
})

export class UsersComponent implements OnInit {
    private sub: any;
    schoolGuId: string;
    schoolId: string;
    school: SchoolModel;
    view: string = "users";
    usersModel: UsersViewModel = new UsersViewModel();
    studentsModel: StudentsViewModel = new StudentsViewModel();
    teachersModel: TeachersViewModel = new TeachersViewModel();

    constructor( @Inject('schoolService') private schoolService
        , private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.schoolGuId = params['id'];
            this.schoolId = params['id2'];
            this.schoolService
                .getSchoolById(this.schoolGuId)
                .subscribe((result) => {
                    this.school = MapUtils.deserialize(SchoolModel, result);
                });

            this.usersModel.getData(this.schoolService, this.schoolGuId);
            this.studentsModel.getData(this.schoolService, this.schoolId);
            this.teachersModel.getData(this.schoolService, this.schoolId);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    switchView(view: string) {
        this.view = view;
    }

    changePage(model: UsersViewModel, isNext: boolean) {
        let id: string = this.schoolGuId;
        if (model instanceof StudentsViewModel || model instanceof TeachersViewModel) {
            id = this.schoolId;
        }
        if (isNext) {
            if (model.curPage * 12 < model.users.length) {
                model.curPage += 1;
            }
            else if (model.nextLink) {
                model.getData(this.schoolService, id);
            }
        }
        else {
            if (model.curPage > 1) {
                model.curPage -= 1;
            }
        }
    }
}
