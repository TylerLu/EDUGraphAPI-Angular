import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'header',
    templateUrl: '/app/header/header.component.template.html',
    styleUrls: ['app/css/bootstrap.min.css','app/css/Site.css']
})

export class Header implements OnInit {
    @Input() isAuthenticated: boolean;

    urlParts: string[];
    ifShowContextMenu: boolean;

    constructor(private router: Router) { }

    ngOnInit() {
        this.initUrlParts();
        this.ifShowContextMenu = false;
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
        this.ifShowContextMenu = !(this.ifShowContextMenu);
    }
    
}