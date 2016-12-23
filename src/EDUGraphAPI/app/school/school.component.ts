/// <reference path="../../node_modules/bingmaps/scripts/MicrosoftMaps/Microsoft.Maps.d.ts" />
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SchoolModel} from './school'
import { MapUtils } from '../services/jsonhelper'
import { UserModel } from './user'


@Component({
    selector: 'schools-list',
    host: {
        '(document:click)': 'showMap($event)',
    },
    templateUrl: '/app/school/school.component.template.html',
    styleUrls: []
})

export class SchoolComponent implements OnInit {

    schools: SchoolModel[];
    me: UserModel;
    mySchool: SchoolModel;
    tempSchools: SchoolModel[]=[];

    constructor( @Inject('schoolService') private schoolService, private router: Router) {
        
     }

    ngOnInit() {

        this.schoolService
            .getMe()
            .subscribe((result) => {
                this.me = MapUtils.deserialize(UserModel, result);
                this.schoolService
                    .getSchools()
                    .subscribe((result) => {
                        this.schools = [];
                        result.forEach((school) => { this.schools.push(MapUtils.deserialize(SchoolModel, school)); })
                        this.schools.forEach((school) => {
                            if (this.me.SchoolId == school.SchoolId) {
                                school.isMySchool = true;
                                school.mySchoolClass = "td-green";
                                this.mySchool = school;
                            } else {
                                this.tempSchools.push(school);
                            }
                        });
                        this.schools = [];
                        if (this.mySchool){
                            this.schools.push(this.mySchool);
                        }
                        this.tempSchools.sort((n1, n2) => {
                            if (n1.DisplayName > n2.DisplayName) {
                                return 1;
                            }
                            if (n1.DisplayName < n2.DisplayName) {
                                return -1;
                            }

                            return 0;
                        }).forEach((school) => {
                            this.schools.push(school);
                        });
                    });
            });
    }
    gotoClasses(school: SchoolModel) {
        this.router.navigate(['classes', school.ObjectId, school.SchoolId]);
    }
    gotoUsers(objectId: string) {
        this.router.navigate(['users', objectId]);
    }

    showMap(event) {
        const target = event.target || event.srcElement || event.currentTarget;
        if ($(target).closest("#myMap").length == 1) {
            return;
        }

        const element = $(target).closest("a.bingMapLink");
        const myMap = $(".schools #myMap");
        if (element.length == 0) {
            myMap.offset({ top: 0, left: 0 }).hide();
            return;
        }

        const lat: string = element.attr("lat");
        const lon: string = element.attr("lon");
        const key: string = $(".schools input#BingMapKey").val();
        if (lat && lon && key) {
            var map = new Microsoft.Maps.Map(myMap[0], {
                credentials: key,
                center: new Microsoft.Maps.Location(lat, lon),
                mapTypeId: Microsoft.Maps.MapTypeId.road,
                showMapTypeSelector: false,
                zoom: 10
            });
            var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
            map.entities.push(pushpin);

            var offset = element.offset();
            myMap.offset({ top: offset.top - 50, left: offset.left + 50 }).css({ width: "200px", height: "200px" }).show();
        }
    }
}
