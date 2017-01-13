import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import { MapUtils } from '../utils/jsonhelper'
import { UserModel } from './user'
import { ClassesModel } from './classes';
import { SchoolService } from './school.service';

@Component({
    moduleId: module.id,
    selector: '',
    templateUrl: 'myclasses.component.template.html',
    styleUrls: []
})

export class MyClassesComponent implements OnInit {

    schoolGuId: string;
    schoolId: string;
    private sub: any;
    classesArray: ClassesModel[] = [];
    myClassesArray: ClassesModel[] = [];
    school: SchoolModel;
    showNoData: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        @Inject('schoolService') private schoolService: SchoolService) {
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
            this.schoolService.getMyClasses(this.schoolId)
                .subscribe((result) => {
                    this.myClassesArray = [];
                    let tempArray = [];
                    result.forEach((obj) => { tempArray.push(MapUtils.deserialize(ClassesModel, obj)); });
                    tempArray.forEach((obj) => {
                        if (obj.SchoolId == this.schoolId) {
                            this.myClassesArray.push(obj);
                        }
                    });
                    if (this.myClassesArray.length == 0) {
                        this.showNoData = true;
                    }

                    this.myClassesArray.forEach((obj) => {
                        obj.IsMyClasses = true;
                        this.schoolService
                            .getClassById(obj.ObjectId)
                            .subscribe((result) => {
                                var classObj = MapUtils.deserialize(ClassesModel, result);
                                classObj.IsMyClasses = true;
                                classObj.Users = [];
                                result.members.forEach((obj) => {
                                    classObj.Users.push(MapUtils.deserialize(UserModel, obj));
                                });
                                this.classesArray.push(classObj);
                            });
                    });
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    showDetail(classEntity) {
        classEntity.UIHoverShowDetail = true;
    }

    hideDetail(classEntity) {
        classEntity.UIHoverShowDetail = false;
    }

    gotoDetail(objectId: string) {
        setTimeout(() => {
            this.router.navigate(['/classdetail', this.schoolGuId, objectId, this.schoolId]);
        }, 100);
    }

    gotoAllClasses() {
        this.router.navigate(['classes', this.schoolGuId, this.schoolId]);
    }
}