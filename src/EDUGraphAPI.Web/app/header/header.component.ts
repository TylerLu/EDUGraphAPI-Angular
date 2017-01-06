import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../models/common/userinfo';


@Component({
    moduleId: module.id,
    selector: 'header',
    templateUrl: 'header.component.template.html',
})

export class Header implements OnInit {
    @Input() isAuthenticated: boolean;

    //urlParts: string[];
    ifShowContextMenu: boolean;
    fullName: string;
    isAdmin: boolean;

    constructor(private router: Router, @Inject('me') private meService, @Inject('auth') private authService) { }

    ngOnInit() {
        //this.initUrlParts();
        this.ifShowContextMenu = false;
        this.initFullName();
    }

    //initUrlParts() {
    //    var parts = window.location.pathname.split('/');
    //    var result = [];
    //    for (var i = 0; i < parts.length; i++) {
    //        if (parts[i] != '')
    //            result.push(parts[i]);
    //    }
    //    this.urlParts = result; 
    //}

    urlParts() {
        var parts = window.location.pathname.split('/');
        var result = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] != '')
                result.push(parts[i]);
        }
        return result;  
    }

    getSchoolId() {
        let urlParts = this.urlParts();
        if (urlParts.length == 3 && (urlParts[0].toLowerCase() == "classes" || urlParts[0].toLowerCase() == "users"))
            return urlParts[1];
        return '';
    }

    getSchoolIdAlias() {
        let urlParts = this.urlParts();
        if (urlParts.length == 3 && (urlParts[0].toLowerCase() == "classes" || urlParts[0].toLowerCase() == "users"))
            return urlParts[2];
        return '';
    }

    //isSchoolsPage() {
    //    return this.urlParts.length == 1 && this.urlParts[0] == "Schools";
    //}

    isClassesPage() {
        let urlParts = this.urlParts();
        //return this.urlParts.length == 3 && this.urlParts[0] == "Schools" && this.urlParts[2] == "Classes"; 
        return urlParts.length > 0 && urlParts[0].toLowerCase() == "classes";
    }

    isTeacherStudentsPage() {
        let urlParts = this.urlParts();
        if (urlParts.length == 0 || (urlParts[0].toLowerCase() != "users"))
            return false;
        if (urlParts.length >= 2 && urlParts[0].toLowerCase() == "users")
            return true;
        return false;
    }


    //ifShowHome() {
    //    return this.isAuthenticated;
    //}

    ifShowClassesTeacherStudents() {
        return this.isClassesPage() || this.isTeacherStudentsPage();
    }


    showContextMenu() {
        let isLogin = false;
        let urlParts = this.urlParts();
        for (var i = 0; i < urlParts.length; i++) {
            if (urlParts[i].toLowerCase() == "login")
                isLogin = true;
        }
        if (isLogin)
            return;
        this.ifShowContextMenu = !(this.ifShowContextMenu);
    }

    initFullName() {
        this.meService.getCurrentUser()
            .subscribe((user) => {
                this.fullName = user.firstName + " " + user.lastName;
                this.isAdmin = this.isUserAdmin(user);
            });
    }

    isUserAdmin(user:UserInfo): boolean {
        let result = false;
        let roles = user.roles;
        if (roles == undefined || roles == null || roles.length == 0)
            return result;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].toLowerCase() == "admin") {
                result = true;
                break;
            }
        }
        return result;
    }
    
}