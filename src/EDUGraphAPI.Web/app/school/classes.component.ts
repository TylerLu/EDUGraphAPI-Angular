import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import { MapUtils } from '../services/jsonhelper'
import { UserModel } from './user'
import { ClassesModel } from './classes';


@Component({
    selector: '',
    templateUrl: '/app/school/classes.component.template.html',
    styleUrls: []
})

export class ClassesComponent implements OnInit {
    private sub: any;
    schoolGuId: string;
    schoolId: string;
    classesArray: ClassesModel[] = [];
    myClassesArray: ClassesModel[] = [];
    tempClassesArray: ClassesModel[]=[];
    school: SchoolModel;
    nextLink: string;
    isGettingData: boolean = false;

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

            this.getClasses();
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

    gotoMyClasses() {
        this.router.navigate(['/myclasses', this.schoolGuId, this.schoolId]);
    }
    gotoDetail(objectId: string) {
        setTimeout(() =>
        {
            this.router.navigate(['/classdetail', this.schoolGuId, objectId]);
        }, 100);
    }

    loadMore() {
        this.getClasses();
    }

    getClasses() {
        if (this.isGettingData) {
            return;
        }
        this.isGettingData = true;
        this.schoolService
            .getClasses(this.schoolId, this.nextLink)
            .subscribe((result) => {
                this.isGettingData = false;
                this.nextLink = result["odata.nextLink"];
                if (this.classesArray === undefined) {
                    this.classesArray = [];
                }
                result.value.forEach((obj) => { this.classesArray.push(MapUtils.deserialize(ClassesModel, obj)); });
                this.schoolService.getMyClasses(this.schoolId)
                    .subscribe((result) => {
                        if (this.myClassesArray === undefined) {
                            this.myClassesArray = [];
                        }
                        result.forEach((obj) => {
                            this.tempClassesArray.push(MapUtils.deserialize(ClassesModel, obj));
                        });
                        this.tempClassesArray.forEach((obj) => {
                            this.schoolService
                                .getClassById(obj.ObjectId)
                                .subscribe((result) => {
                                    var classObj = MapUtils.deserialize(ClassesModel, result);
                                    classObj.Users = []; //MapUtils.deserialize(UserModel[], result);
                                    result.members.forEach((obj) => {
                                        classObj.Users.push(MapUtils.deserialize(UserModel, obj));
                                    });
                                    this.myClassesArray.push(classObj);
                                    this.classesArray.forEach((objofAllClasses) => {
                                        if (classObj.ObjectId == objofAllClasses.ObjectId &&
                                            classObj.ObjectType == "Group" && classObj.EducationObjectType == "Section") {
                                            objofAllClasses.IsMyClasses = true;
                                            objofAllClasses.Users = classObj.Users;
                                            }
                                    });
                                });
                        });

                    });
            });
    }
}
