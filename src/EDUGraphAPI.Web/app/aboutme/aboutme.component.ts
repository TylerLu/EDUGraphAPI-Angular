import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { UserInfo } from '../models/common/userInfo';
import { AboutMeModel } from './aboutme';
import { ClassesModel } from '../school/classes';
import { MapUtils } from '../utils/jsonHelper';
import { Constants } from '../constants';

@Component({
    moduleId: module.id,
    selector: '',
    templateUrl: 'aboutme.component.template.html',
    styles: []
})

export class AboutMe implements OnInit {

    model: AboutMeModel = new AboutMeModel();

    constructor(
        @Inject('aboutMeService') private aboutMeservice,
        private route: ActivatedRoute,
        private router: Router) {
        this.model.FavoriteColors = Constants.FavoriteColors;
    }

    ngOnInit() {
        this.aboutMeservice
            .getMe()
            .subscribe((data) => {
                let user: UserInfo = new UserInfo();
                user.readFromJson(data);
                this.model.UserName = (user.firstName + " " + user.lastName).trim();
                this.model.MyFavoriteColor = user.favoriteColor || this.model.FavoriteColors[0].Value;
                this.model.IsLinked = user.areAccountsLinked();
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
    }

    updateFavoriteColor() {
        this.aboutMeservice.updateFavoriteColor(this.model.MyFavoriteColor).then((response) => {
            this.model.SaveSucceeded = response.ok;
        });
    }
}