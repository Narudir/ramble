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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var ChatService = (function () {
    function ChatService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.wsUrl = 'ws://rambleserver-narudir.rhcloud.com:8000/ws/';
        this.url = 'http://rambleserver-narudir.rhcloud.com/get_clientid/';
        this.CryptoJS = require("crypto-js/crypto-js.js");
    }
    ChatService.prototype.setParams = function (username, room, password) {
        this.username = username;
        this.password = password;
        var data = {
            username: username,
            room: room
        };
        this.clientIdObservable = this.http
            .post(this.url, JSON.stringify(data), { headers: this.headers })
            .map(function (res) { return res.json().client_id; })
            .catch(function (error) {
            console.log("There has been an error while sending a request to the server.");
            console.log(error);
            return Observable_1.Observable.of('');
        });
    };
    ChatService.prototype.setClientId = function (id) {
        if (id === '') {
            console.log("No client id has been returned from the server");
        }
        else {
            this.serverMsgs = this.observeServer(id);
            this.manageMessages();
        }
    };
    ChatService.prototype.observeServer = function (id) {
        var _this = this;
        this.websocket = new WebSocket(this.wsUrl + id);
        this.websocket.onopen = function (evt) {
            console.log('Connection established');
        };
        this.websocket.onclose = function (evt) {
            console.log("Connection closed");
        };
        return Observable_1.Observable.create(function (observer) {
            _this.websocket.onmessage = function (evt) {
                observer.next(evt);
            };
        });
    };
    ChatService.prototype.manageMessages = function () {
        var _this = this;
        var usersSubj = new BehaviorSubject_1.BehaviorSubject([]);
        var users = [];
        var messagesSubj = new BehaviorSubject_1.BehaviorSubject([]);
        var messages = [];
        this.serverMsgs
            .map(function (info) { return JSON.parse(info.data); })
            .subscribe(function (message) {
            var messageObj = {};
            switch (message.msgtype) {
                case 'connect':
                    messageObj = {
                        type: 'connect',
                        message: message.payload
                    };
                    messages = messagesSubj.getValue();
                    messages.push(messageObj);
                    messagesSubj.next(messages);
                    setTimeout(_this.scroll, 0);
                    break;
                case 'join':
                    messageObj = {
                        type: 'join',
                        nick: message.username,
                        message: message.payload
                    };
                    messages = messagesSubj.getValue();
                    messages.push(messageObj);
                    messagesSubj.next(messages);
                    setTimeout(_this.scroll, 0);
                    break;
                case 'leave':
                    messageObj = {
                        type: 'leave',
                        nick: message.username,
                        message: message.payload
                    };
                    messages = messagesSubj.getValue();
                    messages.push(messageObj);
                    messagesSubj.next(messages);
                    setTimeout(_this.scroll, 0);
                    break;
                case 'username_list':
                    users.length = 0;
                    for (var i = 0; i < message.payload.length; i++) {
                        users.push(message.payload[i]);
                    }
                    usersSubj.next(users);
                    break;
                default:
                    messages = messagesSubj.getValue();
                    messageObj = {
                        type: 'message',
                        nick: message.username,
                        message: message.payload,
                        time: message.time,
                        class: 'received'
                    };
                    if (message.username == _this.username) {
                        messageObj['class'] = 'sent';
                    }
                    else {
                        messageObj['class'] = 'received';
                        setTimeout(_this.notification, 0);
                    }
                    if (typeof _this.password !== 'undefined') {
                        var bytes = _this.CryptoJS.AES.decrypt(message.payload, _this.password);
                        var plaintext = '';
                        try {
                            plaintext = bytes.toString(_this.CryptoJS.enc.Utf8);
                        }
                        catch (err) {
                            return;
                        }
                        if (plaintext == '') {
                            return;
                        }
                        else {
                            messageObj['message'] = plaintext;
                            messages.push(messageObj);
                            messagesSubj.next(messages);
                        }
                    }
                    else {
                        messages.push(messageObj);
                        messagesSubj.next(messages);
                    }
                    setTimeout(_this.scroll, 0);
            }
            ;
        });
        this.messagesObs = messagesSubj.asObservable();
        this.usersObs = usersSubj.asObservable();
    };
    ChatService.prototype.sendMessage = function (message) {
        var text_msg_obj = {
            "msgtype": "text",
            "payload": message
        };
        var jmsg = JSON.stringify(text_msg_obj);
        this.websocket.send(jmsg);
    };
    ChatService.prototype.scroll = function () {
        var out = document.getElementById("message_container");
        out.scrollTop = out.scrollHeight;
    };
    ChatService.prototype.notification = function () {
        var audio = new Audio("../sounds/notification.mp3");
        audio.play();
    };
    ChatService = __decorate([
        core_1.Injectable(),
        __metadata('design:paramtypes', [http_1.Http])
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map