/// <reference path="../../node_modules/bingmaps/scripts/MicrosoftMaps/Microsoft.Maps.d.ts" />
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SchoolModel} from './school'
import { SchoolService } from './school.service';
import { BingMapService } from '../services/bingMapService'
import { MapUtils } from '../services/jsonhelper'
import { UserModel } from './user'
import { SvcConsts } from '../SvcConsts/SvcConsts'


@Component({
    moduleId: module.id,
    selector: 'schools-list',
    host: {
        '(document:click)': 'showMap($event)',
    },
    templateUrl: 'school.component.template.html',
    styleUrls: []
})

export class SchoolComponent implements OnInit {
    schools: SchoolModel[];
    me: UserModel;
    mySchool: SchoolModel;
    tempSchools: SchoolModel[] = [];
    areAccountsLinked: boolean;
    isLocalAccount: boolean;

    constructor( @Inject('schoolService') private schoolService: SchoolService, private router: Router, @Inject('me') private meService) {
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
                                school.IsMySchool = true;
                                this.mySchool = school;
                            }
                            BingMapService.getLatitudeAndLongitude(school.State, school.City, school.Address).then((location) => {
                                school.Latitude = location.Latitude;
                                school.Longitude = location.Longitude;
                            });
                        });
                        this.schools.sort((n1, n2) => {
                            if (n1.IsMySchool) {
                                return -1;
                            }
                            if (n2.IsMySchool) {
                                return 1;
                            }
                            return n1.DisplayName > n2.DisplayName ? 1 : (n1.DisplayName < n2.DisplayName ? -1 : 0);
                        });
                    });
            });
        this.initLocalAndLinkedState();
    }

    initLocalAndLinkedState() {
        this.meService.getCurrentUser()
            .subscribe((user) => {
                this.areAccountsLinked = user.areAccountsLinked;
            });

        this.isLocalAccount = this.meService.isLocalAccount();
    }

    gotoClasses(school: SchoolModel) {
        setTimeout(() => {
            this.router.navigate(['classes', school.ObjectId, school.SchoolId]);
        }, 100);
    }

    gotoUsers(school: SchoolModel) {
        setTimeout(() => {
            this.router.navigate(['users', school.ObjectId, school.SchoolId]);
        }, 100);
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

        const latitude: string = element.attr("latitude");
        const longitude: string = element.attr("longitude");
        if (latitude && longitude) {
            var map = new Microsoft.Maps.Map(myMap[0], {
                credentials: SvcConsts.BING_MAP_KEY,
                center: new Microsoft.Maps.Location(latitude, longitude),
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
