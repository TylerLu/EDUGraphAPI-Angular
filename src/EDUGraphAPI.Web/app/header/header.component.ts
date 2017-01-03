import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'header',
    templateUrl: 'header.component.template.html',
})

export class Header implements OnInit {
    @Input() isAuthenticated: boolean;

    urlParts: string[];
    ifShowContextMenu: boolean;
    fullName: string;

    constructor(private router: Router, @Inject('me') private meService, @Inject('auth') private authService) { }

    ngOnInit() {
        this.initUrlParts();
        this.ifShowContextMenu = false;
        this.initFullName();
    }

    initUrlParts() {
        var parts = window.location.pathname.split('/');
        var result = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] != '')
                result.push(parts[i]);
        }
        this.urlParts = result; 
    }

    getSchoolId() {
        if (this.urlParts.length ==2 && this.urlParts[0] == "Schools")
            return this.urlParts[1];
        return '';
    }
    

    //isSchoolsPage() {
    //    return this.urlParts.length == 1 && this.urlParts[0] == "Schools";
    //}

    isClassesPage() {
        //return this.urlParts.length == 3 && this.urlParts[0] == "Schools" && this.urlParts[2] == "Classes"; 
        return this.urlParts.length == 3 && this.urlParts[0].toLowerCase() == "classes";
    }

    isTeacherStudentsPage() {
        return this.urlParts.length == 3 && this.urlParts[0] == "Schools" && this.urlParts[2] == "Users";
    }

    isAdmin() {
        return this.urlParts.length == 1 && this.urlParts[0] == "Admin";
    }

    //ifShowHome() {
    //    return this.isAuthenticated;
    //}

    ifShowClassesTeacherStudents() {
        return this.isClassesPage() || this.isTeacherStudentsPage();
    }


    showContextMenu() {
        let isLogin = false;
        for (var i = 0; i < this.urlParts.length; i++) {
            if (this.urlParts[i].toLowerCase() == "login")
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
            });
    }
    
}