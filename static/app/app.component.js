"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var chat_service_1 = require('./chat.service');
var Ramble = (function () {
    function Ramble(fb, chatService) {
        this.fb = fb;
        this.chatService = chatService;
        this.idReceived = false;
        this.privateSelected = false;
        this.globalSelected = false;
        this.CryptoJS = require("crypto-js/crypto-js.js");
        var passRegex = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{10,}";
        this.privateConnectionForm = fb.group({
            username: [null, forms_1.Validators.required],
            password: [null,
                forms_1.Validators.compose([
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(10),
                    forms_1.Validators.maxLength(30),
                    forms_1.Validators.pattern(passRegex)
                ])
            ],
            room: [null, forms_1.Validators.required]
        });
        this.globalConnectionForm = fb.group({
            username: [null, forms_1.Validators.required]
        });
        this.chatForm = fb.group({
            message: [null, forms_1.Validators.required]
        });
    }
    Ramble.prototype.initParams = function (roomType) {
        var _this = this;
        if (roomType == 'private') {
            this.username = this.privateConnectionForm.controls["username"].value;
            this.room = this.privateConnectionForm.controls["room"].value;
            this.password = this.privateConnectionForm.controls["password"].value;
        }
        else {
            this.username = this.globalConnectionForm.controls["username"].value;
            this.room = 'global';
        }
        this.chatService.setParams(this.username, this.room, this.password);
        this.chatService.clientIdObservable
            .subscribe(function (id) {
            _this.chatService.setClientId(id);
            _this.messages = _this.chatService.messagesObs;
            _this.users = _this.chatService.usersObs;
            _this.checkId(id);
        }, function (error) { return console.log("Error callback: " + error); });
    };
    Ramble.prototype.checkId = function (id) {
        if (id == '') {
            return;
        }
        else {
            this.idReceived = true;
        }
    };
    Ramble.prototype.showPrivateForm = function () {
        this.privateSelected = !this.privateSelected;
    };
    Ramble.prototype.showGlobalForm = function () {
        this.globalSelected = !this.globalSelected;
    };
    Ramble.prototype.initiatePrivateConnectionForm = function (valid) {
        if (valid) {
            this.initParams('private');
        }
    };
    Ramble.prototype.initiateGlobalConnectionForm = function (valid) {
        if (valid) {
            this.initParams('public');
        }
    };
    Ramble.prototype.chatKeyEnter = function (valid) {
        this.sendMessage();
    };
    Ramble.prototype.sendMessage = function () {
        var message = this.chatForm.controls["message"].value;
        if (typeof this.password !== 'undefined') {
            var cipherMessage = this.CryptoJS.AES.encrypt(message, this.password);
            this.chatService.sendMessage(cipherMessage.toString());
        }
        else {
            this.chatService.sendMessage(message);
        }
        this.chatForm.reset();
    };
    Ramble.prototype.toggleUsers = function () {
        if (document.getElementById("mySidenav").style.width == "0px" || document.getElementById("mySidenav").style.width == "") {
            document.getElementById("mySidenav").style.width = "150px";
            document.getElementById("users_button").className += " active";
        }
        else {
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("users_button").classList.remove("active");
        }
    };
    Ramble.prototype.toggleChat = function () {
        if (document.getElementById("ramble-app-container").style.height == "0px" || document.getElementById("ramble-app-container").style.height == "") {
            document.getElementById("ramble-app-container").style.height = '520px';
            document.getElementById("ramble-app-container").style.border = "1px solid black";
            if (document.getElementById("top-bar") != null) {
                document.getElementById("top-bar").style.background = "#666";
            }
        }
        else {
            document.getElementById("ramble-app-container").style.height = "0px";
            document.getElementById("ramble-app-container").style.border = "0px";
            if (document.getElementById("top-bar") != null) {
                document.getElementById("top-bar").style.background = "transparent";
            }
        }
    };
    Ramble = __decorate([
        core_1.Component({
            selector: 'ramble',
            moduleId: module.id,
            templateUrl: 'ramble.html',
            animations: [
                core_1.trigger('fadeIn', [
                    core_1.transition(':enter', [
                        core_1.style({ opacity: 0 }),
                        core_1.animate('300ms 300ms', core_1.style({ opacity: 1 }))
                    ]),
                ])
            ]
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder, chat_service_1.ChatService])
    ], Ramble);
    return Ramble;
}());
exports.Ramble = Ramble;
//# sourceMappingURL=app.component.js.map