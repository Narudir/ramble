import { Injectable }              from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable }              from 'rxjs/Observable';
import { Observer }                from 'rxjs/Observer';
import { BehaviorSubject }         from 'rxjs/BehaviorSubject';


@Injectable()
export class ChatService{
  constructor(private http: Http) { }
  private username: string;
  private password: string;
  private headers = new Headers({'Content-Type': 'application/json'});
  private wsUrl = 'ws://localhost:8888/ws/';
  private url = 'http://localhost:8888/get_clientid/';
  private websocket: any;
  private CryptoJS = require("crypto-js/crypto-js.js");
  public clientIdObservable: Observable<string>;
  private serverMsgs: Observable<MessageEvent>;
  public messagesObs: Observable<string[]>;
  public messagesJLObs: Observable<string[]>;
  public messagesConnObs: Observable<string[]>;
  public usersObs: Observable<string[]>;


  public setParams(username: string, room: string, password: string): void {
    this.username = username;
    this.password = password;

    let data = {
      username: username,
      room: room
    };

    this.clientIdObservable = this.http
      .post(this.url, JSON.stringify(data), {headers: this.headers})
      .map((res: Response) => res.json().client_id)
      .catch(error => {
        console.log("There has been an error while sending a request to the server.");
        console.log(error);
        return Observable.of('');
      });
  }


  public setClientId(id: string): void {
    if (id === ''){
      console.log("No client id has been returned from the server");
    } else {
      this.serverMsgs = this.observeServer(id);
      this.manageMessages();
    }
  }


  public observeServer(id:string): Observable<MessageEvent>{
    this.websocket = new WebSocket(this.wsUrl + id);
    this.websocket.onopen = (evt: MessageEvent) => {
      console.log('Connection established');
    };

    this.websocket.onclose = (evt: MessageEvent) => {
      console.log("Connection closed");
    };

    return Observable.create((observer: Observer<MessageEvent>) => {
      this.websocket.onmessage = (evt: MessageEvent) => {
        observer.next(evt);
      };
    })
  }


  private manageMessages(): void {
    let usersSubj = new BehaviorSubject([]);
    let users: Array<string> = [];
    let messagesSubj = new BehaviorSubject([]);
    let messages: Array<any> = [];
    this.serverMsgs
      .map(info => JSON.parse(info.data))
      .subscribe (message => {
        let messageObj = {};
        switch (message.msgtype) {
          case 'connect':
            messageObj = {
              type: 'connect',
              message: message.payload
            };
            messages = messagesSubj.getValue();
            messages.push(messageObj);
            messagesSubj.next(messages);
            setTimeout(this.scroll, 0);
            break;
          case 'join':
            messageObj = {
              type: 'join',
              nick: message.username,
              message: message.payload
            };
            messages= messagesSubj.getValue();
            messages.push(messageObj);
            messagesSubj.next(messages);
            setTimeout(this.scroll, 0);
            break;
          case 'leave':
            messageObj = {
              type: 'leave',
              nick: message.username,
              message: message.payload
            };
            messages= messagesSubj.getValue();
            messages.push(messageObj);
            messagesSubj.next(messages);
            setTimeout(this.scroll, 0);
            break;
          case 'username_list':
            users.length = 0;
            for (let i = 0; i < message.payload.length; i++) {
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
            }
            if (message.username == this.username) {
              messageObj['class'] = 'sent';
            } else {
              messageObj['class'] = 'received';
            }
            if (typeof this.password !== 'undefined') {
              let bytes  = this.CryptoJS.AES.decrypt(message.payload, this.password);
              let plaintext = '';
              try {
                plaintext = bytes.toString(this.CryptoJS.enc.Utf8);
              } catch (err) {
                return;
              }
              if (plaintext == '') {
                return;
              } else {
                messageObj['message'] = plaintext;
                messages.push(messageObj);
                messagesSubj.next(messages);
              }
            } else {
              messages.push(messageObj);
              messagesSubj.next(messages);
            }
            setTimeout(this.scroll, 0);
      };
    }
  );
    this.messagesObs = messagesSubj.asObservable();
    this.usersObs = usersSubj.asObservable();
  }


  public sendMessage(message: string) {
    let text_msg_obj = {
      "msgtype": "text",
      "payload": message
    }
    let jmsg = JSON.stringify(text_msg_obj);
    this.websocket.send(jmsg);
  }

  private scroll(): void {
      var out = document.getElementById("message_container");
      out.scrollTop = out.scrollHeight;
  }
}
