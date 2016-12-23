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
    schoolGuId: string;
    schoolId: string;
    private sub: any;
    classesArray: ClassesModel[];
    myClassesArray: ClassesModel[];
    school: SchoolModel;
    nextLink: string;

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
        this.router.navigate(['/classdetail', this.schoolGuId, objectId]);
    }

    loadMore() {
        this.getClasses();
    }

    getClasses() {
        this.schoolService
            .getClasses(this.schoolId, this.nextLink)
            .subscribe((result) => {
                this.nextLink = result["odata.nextLink"];
                if (this.classesArray === undefined) {
                    this.classesArray = [];
                }
                result.value.forEach((obj) => { this.classesArray.push(MapUtils.deserialize(ClassesModel, obj)); });
                this.classesArray.forEach((obj) => {
                    obj.CombinedCourseNumber = obj.CourseName.substring(0, 3).toUpperCase();
                    var regexp = new RegExp(/\d+/);
                    var dd = obj.CourseName.match(regexp);
                    if (dd != null) {
                        obj.CombinedCourseNumber += dd[0];
                    }
                });
                this.schoolService.getMyClasses(this.schoolId)
                    .subscribe((result) => {
                        if (this.myClassesArray === undefined) {
                            this.myClassesArray = [];
                        }
                        result.forEach((obj) => { this.myClassesArray.push(MapUtils.deserialize(ClassesModel, obj)); });
                        this.classesArray.forEach((objofAllClasses) => {
                            this.myClassesArray.forEach((objofMyClasses) => {
                                if (objofMyClasses.ObjectId == objofAllClasses.ObjectId &&
                                    objofMyClasses.ObjectType == "Group" && objofMyClasses.EducationObjectType == "Section") {
                                    objofAllClasses.IsMyClasses = true;
                                }
                            });
                        });
                    });
            });
    }
}
