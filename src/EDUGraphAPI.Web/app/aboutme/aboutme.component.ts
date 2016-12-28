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

export class AboutMeComponent implements OnInit {
    private sub: any;
    model: AboutMeModel = new AboutMeModel();

    constructor(@Inject('aboutMeService') private aboutMeservice
        , private route: ActivatedRoute, private router: Router) {
        this.model.FavoriteColors = SvcConsts.FavoriteColors;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
        //    this.aboutMeservice
        //        .getMe()
        //        .subscribe((result) => {
        //            var model: AboutMeModel = MapUtils.deserialize(AboutMeModel, result);
        //            this.model.Username = model.Username;
        //            this.model.MyFavoriteColor = model.MyFavoriteColor;
        //        });
            this.model.IsLinked = true;
            this.model.UserName = "Some User";
            this.model.MyFavoriteColor = "#127605";

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
        //this.aboutMeservice
        //    .updateFavoriteColor()
        //    .subscribe((result) => {
        //        var model: AboutMeModel = MapUtils.deserialize(AboutMeModel, result);
        //        this.model.Username = model.Username;
        //        this.model.MyFavoriteColor = model.MyFavoriteColor;
        //    });
    }
}
