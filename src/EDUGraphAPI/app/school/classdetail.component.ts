import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import { MapUtils } from '../services/jsonhelper'

@Component({
    selector: '',
    templateUrl: '/app/school/classdetail.component.template.html',
    styleUrls: []
})

export class ClassDetailComponent implements OnInit {
    schoolGuId: string;
    private sub: any;
    school: SchoolModel;
    classObjectId: string;

    constructor( @Inject('schoolService') private schoolService
        , private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.schoolGuId = params['id'];
            this.classObjectId = params['id2'];
            this.schoolService
                .getSchoolById(this.schoolGuId)
                .subscribe((result) => {
                    this.school = MapUtils.deserialize(SchoolModel, result);
                });


        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    gotoMyClasses() {
        //this.router.navigate(['/myclasses', this.schoolGuId, this.schoolId]);
    }

}
