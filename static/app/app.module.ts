import './rxjs-extensions';
import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { ReactiveFormsModule }     from '@angular/forms';
import { HttpModule }              from '@angular/http';



import { Ramble }                  from './app.component';
import { ChatService }             from './chat.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    Ramble,
  ],
  providers: [
              ChatService
             ],
  bootstrap:    [ Ramble ]
})
export class AppModule { }
