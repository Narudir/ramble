import { Component, trigger, state, style, transition, animate, Injectable} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable }                         from 'rxjs/Observable';
import { Observer }                           from 'rxjs/Observer';
import { BehaviorSubject }                    from 'rxjs/BehaviorSubject';

import { ChatService }                        from './chat.service';


@Component({
  selector: 'ramble',
  moduleId: module.id,
  templateUrl: 'ramble.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity:0}),
        animate('300ms 300ms', style({opacity:1}))
      ]),
    ])
  ]
})


export class Ramble {
  private privateConnectionForm: FormGroup;
  private globalConnectionForm: FormGroup;
  private chatForm: FormGroup;
  private idReceived: boolean = false;
  private privateSelected: boolean = false;
  private globalSelected: boolean = false;
  private messages: Observable<string[]>;
  private users: Observable<string[]>;
  private username: string;
  private room: string;
  private password: string;
  private CryptoJS = require("crypto-js/crypto-js.js");


  constructor(private fb: FormBuilder,
              private chatService: ChatService) {

                let passRegex = `(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*]).{10,}`;
                this.privateConnectionForm = fb.group({
                  username: [null, Validators.required],
                  password: [null,
                              Validators.compose([
                                Validators.required,
                                Validators.minLength(10),
                                Validators.maxLength(30),
                                Validators.pattern(passRegex)
                              ])
                            ],
                  room:     [null, Validators.required]

                });
                this.globalConnectionForm = fb.group({
                  username: [null, Validators.required]
                });
                this.chatForm = fb.group({
                  message: [null, Validators.required]
                });
  }

  private initParams(roomType: string): void {
    if (roomType == 'private') {
      this.username = this.privateConnectionForm.controls["username"].value;
      this.room = this.privateConnectionForm.controls["room"].value;
      this.password = this.privateConnectionForm.controls["password"].value;
    } else {
      this.username = this.globalConnectionForm.controls["username"].value;
      this.room = 'global';
    }
    this.chatService.setParams(this.username, this.room, this.password);
    this.chatService.clientIdObservable
      .subscribe(
        id => { this.chatService.setClientId(id);
                this.messages = this.chatService.messagesObs;
                this.users = this.chatService.usersObs;
                this.checkId(id);
              },
        error => console.log("Error callback: " + error)
      );
  }


  private checkId(id: string): void {
    if (id == '') {
      return;
    } else {
      this.idReceived = true;
    }
  }


  private showPrivateForm(): void {
    this.privateSelected = !this.privateSelected;
  }


  private showGlobalForm(): void {
    this.globalSelected = !this.globalSelected;
  }


  private initiatePrivateConnectionForm(valid: boolean): void {
    if (valid) {
      this.initParams('private');
    }
  }

  private initiateGlobalConnectionForm(valid: boolean): void {
    if (valid) {
      this.initParams('public');
    }
  }


  private chatKeyEnter(valid: boolean): void {
    this.sendMessage();
  }


  private sendMessage(): void {
    let message = this.chatForm.controls["message"].value;
    if (typeof this.password !== 'undefined') {
      let cipherMessage = this.CryptoJS.AES.encrypt(message, this.password);
      this.chatService.sendMessage(cipherMessage.toString());
    } else {
      this.chatService.sendMessage(message);
    }
    this.chatForm.reset();
  }

  private toggleUsers(): void {
    if (document.getElementById("mySidenav").style.width == "0px" || document.getElementById("mySidenav").style.width == "") {
      document.getElementById("mySidenav").style.width = "150px";
      document.getElementById("users_button").className += " active";
    } else {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("users_button").classList.remove("active");
    }
  }

  private toggleChat(): void {
    if (document.getElementById("ramble-app-container").style.height == "0px" ||  document.getElementById("ramble-app-container").style.height == "") {
       document.getElementById("ramble-app-container").style.height = '520px';
       document.getElementById("ramble-app-container").style.border = "1px solid black";
       if (document.getElementById("top-bar") != null) {
         document.getElementById("top-bar").style.background = "#666";
       }
    } else {
       document.getElementById("ramble-app-container").style.height = "0px";
       document.getElementById("ramble-app-container").style.border = "0px";
       if (document.getElementById("top-bar") != null) {
         document.getElementById("top-bar").style.background = "transparent";
       }
    }
  }

}
