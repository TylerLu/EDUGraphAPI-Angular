import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { SvcConsts } from '../SvcConsts/SvcConsts'
import { AboutMeModel } from './aboutme';
import { ClassesModel } from '../school/classes';
import { ColorEntity } from '../models/common/colorEntity';

@Injectable()
export class AboutMeService {
    private graphUrlBase: string = SvcConsts.AAD_Graph_RESOURCE + '/' + SvcConsts.TENANT_ID;

    constructor(private http: Http, @Inject('auth') private authService, @Inject('data') private dataService) {
    }

    /**
     * Get current users's classes.
     * Reference URL: 
     */
    getMe(): any {
        return this.dataService.get("/api/users/me")
            .map((response: Response): AboutMeModel => <AboutMeModel>response.json());
    }

    /**
     * Get current users's classes.
     * Reference URL: 
     */
    getMyClasses(): any {
        return this.dataService.get(this.graphUrlBase + "/me/memberOf?api-version=1.5")
            .map((response: Response): ClassesModel[] => {
                var classes: ClassesModel[] = new Array<ClassesModel>();
                var groups: any[] = <any[]>response.json().value;
                groups.forEach((group) => {
                    if (group["objectType"] === "Group" && group["extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType"] === "Section") {
                        classes.push(group);
                    }
                });
                return classes;
            });
    }

    /**
     * Get current users's classes.
     * Reference URL: 
     */
    updateFavoriteColor(color: ColorEntity): any {
        return this.dataService.post("/api/users/updateFavoriteColor")
            .map((response: Response): ClassesModel[] => {
                var classes: ClassesModel[] = new Array<ClassesModel>();
                var groups: any[] = <any[]>response.json().value;
                groups.forEach((group) => {
                    if (group["objectType"] === "Group" && group["extension_fe2174665583431c953114ff7268b7b3_Education_ObjectType"] === "Section") {
                        classes.push(group);
                    }
                });
                return classes;
            });
    }
}