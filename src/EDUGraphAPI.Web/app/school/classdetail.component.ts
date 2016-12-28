/// <reference path="../../node_modules/bingmaps/scripts/MicrosoftMaps/Microsoft.Maps.d.ts" />
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
import { Component, OnInit, Inject, OnDestroy, AfterViewChecked  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolModel } from './school'
import { MapUtils } from '../services/jsonhelper'
import { UserModel } from './user'
import { ClassesModel } from './classes';
import { Document, OneDrive } from './document';
import { Conversation } from './conversation';
import { SeatingArrangement } from './seatingarrangements'


@Component({
    selector: '',
    templateUrl: '/app/school/classdetail.component.template.html',
    styleUrls: []
})

export class ClassDetailComponent implements OnInit, AfterViewChecked  {
    schoolGuId: string;
    private sub: any;
    school: SchoolModel;
    classObjectId: string;
    me: UserModel;
    classEntity: ClassesModel;
    documents: Document[] = [];
    favoriteColor: string = "";
    oneDriveURL: string = "";
    conversations: Conversation[] = [];
    seatingArrangements: SeatingArrangement[] = [];
    newseatingArrangements: SeatingArrangement[] = [];
    seatingsCount = [];
    isEditing: boolean = false;
    dragId: string = "";

    constructor( @Inject('schoolService') private schoolService
        , private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        for (var i = 1; i <= 36; i++) {
            this.seatingsCount.push(i);
        }
        this.sub = this.route.params.subscribe(params => {
            this.iniData(params);
        });
    }

    iniData(params) {
        this.schoolGuId = params['id'];
        this.classObjectId = params['id2'];

        this.schoolService
            .getSchoolById(this.schoolGuId)
            .subscribe((result) => {
                this.school = MapUtils.deserialize(SchoolModel, result);
            });
        this.schoolService
            .getMe()
            .subscribe((result) => {
                this.me = MapUtils.deserialize(UserModel, result);
            });
        this.schoolService
            .getSeatingArrangements(this.classObjectId)
            .subscribe((result) => {
                result.forEach((obj) => {
                    this.seatingArrangements.push(MapUtils.deserialize(SeatingArrangement, obj));
                });
                this.schoolService
                    .getClassById(this.classObjectId)
                    .subscribe((result) => {
                        this.classEntity = MapUtils.deserialize(ClassesModel, result);
                        this.classEntity.IsMyClasses = true;
                        this.classEntity.Users = [];
                        result.members.forEach((obj) => {
                            var user = MapUtils.deserialize(UserModel, obj);
                            this.classEntity.Users.push(user);
                            if (user.ObjectType == "Teacher") {
                                this.classEntity.Teachers.push(user);
                            }
                            if (user.ObjectType == "Student") {
                                this.classEntity.Students.push(user);
                            }
                        });
                        this.classEntity.Students.forEach((stu) => {
                            this.seatingArrangements.forEach((arrangment) => {
                                if (stu.O365UserId == arrangment.o365UserId) {
                                    stu.IsSeated = true;
                                    stu.SeatingClass = "seated";
                                    stu.SeatingArrangment = arrangment.position;
                                    if (stu.SeatingArrangment != "0") {
                                        stu.ContainerClass = "white";
                                    }
                                    if (this.me.O365UserId == stu.O365UserId) {
                                        stu.ContainerClass = "green";
                                    }
                                }
                            });
                        });
 
                        
                    });
            });
        this.schoolService
            .getDocuments(this.classObjectId)
            .subscribe((result) => {
                result.forEach((obj) => {
                    this.documents.push(MapUtils.deserialize(Document, obj));

                });
            });
        
        this.schoolService
            .getOneDriveWebURl(this.classObjectId)
            .subscribe((result) => {
                this.oneDriveURL = MapUtils.deserialize(OneDrive, result).webUrl;
            });
        this.schoolService
            .getConversation(this.classObjectId)
            .subscribe((result) => {
                result.forEach((obj) => {
                    this.conversations.push(MapUtils.deserialize(Conversation, obj));
                });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    gotoClasses(school: SchoolModel) {
        this.router.navigate(['classes', school.ObjectId, school.SchoolId]);
    }

    ngAfterViewChecked() {
        this.iniTiles();
    }
    iniTiles() {
        $(".deskcontainer:not([ng-reflect-position='0']").each(function () {
            var position = $(this).attr("ng-reflect-position");
            var tile = $(".desktile[ng-reflect-position='" + position + "']")
            $(this).appendTo(tile);
        });


    }
    editseats() {
        this.isEditing = true;
        this.enableDragAndDrop();
        $(".deskclose").show();
        $(".deskcontainer").attr("draggable", "true");
    }

    saveeditseats() {
        var detail = this;
        $(".deskcontainer").each(function () {
            var userid = $(this).attr("ng-reflect-userid");
            if (userid) {
                var position = $(this).attr("ng-reflect-position");
                var arrangement = new SeatingArrangement();
                arrangement.classId = detail.classObjectId;
                arrangement.o365UserId = detail.me.O365UserId;
                arrangement.position = position;
                detail.newseatingArrangements.push(arrangement);
            }
        });
    }

    canceleditseats() {
        this.exitEdit();
        this.cancelEditDesk();
    }

    exitEdit() {
        this.isEditing = false;
        $(".deskclose").hide();
        this.disableDragAndDrop();
    }

    cancelEditDesk() {
    //var id = $(".desktile .deskcontainer.unsaved").appendTo($("#hidtiles")).attr("position", 0).attr("userid");
        //$("#" + id).find(".seated").addClass("hideitem");
        $(".desktile .deskcontainer.unsaved").each(function () {
            $(this).attr("ng-reflect-position", 0)
            var id = $(this).attr("ng-reflect-userid");
            $("#" + id).find(".seated").addClass("hideitem");
            $("#hidtiles").append($(this));
        });
    $("#hidtiles .deskcontainer:not(.unsaved)").each(function (i, e) {
        //$e = $(e);
        var position = $(this).attr("ng-reflect-prev-position");
        $(this).attr("ng-reflect-position", position).removeAttr("ng-reflect-prev-position");
        var id = $(this).attr("ng-reflect-userid");
        $(".desktile[ng-reflect-position=" + position + "]").append($(this));
        $("#" +id ).find(".seated").removeClass("hideitem");
    });
    $(".desktile .deskcontainer[ng-reflect-prev-position]").each(function (i, e) {
        var prevPosition = $(this).attr("ng-reflect-prev-position");
        if (prevPosition == $(this).attr("ng-reflect-position")) {
            return;
        }
        $(this).attr("ng-reflect-position", prevPosition).removeAttr("ng-reflect-prev-position");
        $(".desktile[ng-reflect-position=" + prevPosition + "]").append($(this));
    });
    $("#lstproducts li").attr("draggable", "false");
    $(".deskcontainer").attr("draggable", "false");

}

    enableDragAndDrop() {
        var lstProducts = $('#lstproducts li');
        var detail = this;
        $.each(lstProducts, function (idx, val) {
            var id = $(this).attr("id");
            detail.dragId = id;
            var position = $(".deskcontainer[ng-reflect-userid='" + id + "']").attr("ng-reflect-position");
            if (position == '0') {
                detail.enableDragOnLeft(this, true);
            } else {
                detail.enableDragOnLeft($(this), false).find(".seated").removeClass("hideitem");
            }

        });

        $(".deskcontainer").on('dragstart', function (evt) {
            var id = $(this).attr("ng-reflect-userid");
            $("#" + id).addClass("greenlist");
            var prevPosition = $(this).attr("ng-reflect-prev-position");
            if (!prevPosition) {
                $(this).attr("ng-reflect-prev-position", $(this).attr("ng-reflect-position"));
            }
        });

        $(".desktile").on('drop', function (evt) {
            evt.preventDefault();
            var id = detail.dragId;
            detail.dragId = "";
            if (id.length == 0) {
                id = $(this).find(".deskcontainer").attr("ng-reflect-userid");
            }
            var container = $(this).find(".deskcontainer");
            if (container.length > 0 )
                return;
            $(".greenTileTooltip").remove();
            detail.enableDragOnLeft($("#" + id), false).removeClass("greenlist").find(".seated").removeClass("hideitem");
            $(".deskcontainer[ng-reflect-userid='" + id + "']").addClass("white").appendTo($(this));
            var position = $(this).attr("ng-reflect-position");
            $(this).find(".deskcontainer").attr("ng-reflect-position", position);
        });

        $(".desktile").on('dragenter', function (evt) {
            evt.preventDefault();
            if ($(this).find(".deskcontainer").length == 0 && $('#lstproducts li.greenlist').length > 0) {
                var tooltip = $(".desktile .greenTileTooltip");
                if (tooltip.length == 0) {
                    tooltip = $("<div class='greenTileTooltip'>Place student here</div>")
                }
                tooltip.appendTo($(this));
            }
        }).on("dragend", function (evt) {
            evt.preventDefault();
            $(".greenTileTooltip").remove();
            $(".greenlist").removeClass("greenlist");
            detail.dragId = "";
        });

        //The dragover
        $("#dvright").on('dragover', function (evt) {
            evt.preventDefault();
        });

        $(".deskclose").click(function (evt) {
            evt.preventDefault();
            var parent = $(this).closest(".deskcontainer");
            var id = parent.attr("ng-reflect-userid");
            var user = $("#" + id);
            user.find(".seated").addClass("hideitem");
            detail.enableDragOnLeft(user, true);
            var position = parent.attr("ng-reflect-position");
            parent.attr({ "ng-reflect-prev-position": position, "ng-reflect-position": 0 });
            $("#hidtiles").append(parent);
        });
    }

    disableDragAndDrop() {
        $('#lstproducts li, .deskcontainer').off('dragstart');
        $(".desktile").off('dragenter drop dragend');
        $("#dvright").off('dragover');
        $(".deskclose").off('click');
    }

    enableDragOnLeft(item, enable) {
        item = $(item);
        var detail = this;
        if (typeof (enable) === undefined || enable == true) {
            item.attr("draggable", true);
            item.on('dragstart', function (evt) {
                $(this).addClass("greenlist");
                var id = $(this).attr("id");
                detail.dragId = id;
                evt.originalEvent.dataTransfer.setData("text", "userid:" + id);
            }).on('dragend', function () {
                $(this).removeClass("greenlist");
                $(".greenTileTooltip").remove();
            });
        }
        else {
            item.off("dragstart dragend");
        }
        return item;
    }

}
