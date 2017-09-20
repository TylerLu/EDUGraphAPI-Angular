/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from './user'


@Component({
    moduleId: module.id,
    selector: 'schools-list',
    host: {},
    templateUrl: 'school.component.template.html',
    styleUrls: []
})

export class SchoolComponent implements OnInit {



    constructor(
        private router: Router) {
    }

    ngOnInit() {
        
    }


}