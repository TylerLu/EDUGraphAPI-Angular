import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { AboutMeModel } from './aboutme';
import { ClassesModel } from '../school/classes';
import { MapUtils } from '../services/jsonhelper';
import { SvcConsts } from '../SvcConsts/SvcConsts';


@Component({
    selector: '',
    templateUrl: '/app/aboutme/aboutme.component.template.html',
    styles: []
})

export class AboutMe implements OnInit {
    private sub: any;
    model: AboutMeModel = new AboutMeModel();

    constructor(@Inject('aboutMeService') private aboutMeservice
        , private route: ActivatedRoute, private router: Router) {
        this.model.FavoriteColors = SvcConsts.FavoriteColors;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.aboutMeservice
                .getMe()
                .subscribe((user) => {
                    this.model.UserName = (user.firstName + " " + user.lastName).trim();
                    this.model.MyFavoriteColor = user.favoriteColor;
                    this.model.IsLinked = true;
                });

            this.aboutMeservice
                .getMyClasses()
                .subscribe((result) => {
                    if (this.model.Groups === undefined) {
                        this.model.Groups = new Array<string>();
                    }
                    result.forEach((obj) => {
                        var classModel = MapUtils.deserialize(ClassesModel, obj);
                        this.model.Groups.push(classModel.DisplayName);
                    });
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    updateFavoriteColor() {
        this.aboutMeservice.updateFavoriteColor(this.model.MyFavoriteColor, function () {
        });
    }
}
