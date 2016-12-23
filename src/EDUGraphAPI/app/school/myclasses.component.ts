import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import { MapUtils } from '../services/jsonhelper'
import { UserModel } from './user'
import { ClassesModel } from './classes';


@Component({
    selector: '',
    templateUrl: '/app/school/myclasses.component.template.html',
    styleUrls: []
})

export class MyClassesComponent implements OnInit {
    schoolGuId: string;
    schoolId: string;
    private sub: any;
    classesArray: ClassesModel[];
    myClassesArray: ClassesModel[];
    school: SchoolModel;

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
            this.schoolService.getMyClasses(this.schoolId)
                .subscribe((result) => {
                    this.myClassesArray = [];
                    result.forEach((obj) => { this.myClassesArray.push(MapUtils.deserialize(ClassesModel, obj)); });
                    this.myClassesArray.forEach((obj) => {
                        obj.IsMyClasses = true;
                    });
                    this.classesArray = this.myClassesArray;
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

    gotoAllClasses() {
        this.router.navigate(['classes', this.schoolGuId, this.schoolId]);
    }

}
