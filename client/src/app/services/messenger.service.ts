import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {tap } from 'rxjs';
import { Contact } from '../models/contact.model';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessengerService{
  url = "http://localhost:3000"
  constructor(
    protected socket : Socket,
    private http: HttpClient,
    private authService: AuthService
  ) {
    socket.on('connect', () => {
      console.log("Socket connected.");
      this.socketId = socket.ioSocket.id;
      this.getContacts().subscribe();
    });
  }

  socketId = "";
  contacts : Contact[] = [];
  contact : Contact = {_id:"",user: "", lastMessage: { message:"",username:"",date:0},chat:""};
  messages : Message[] = [];

  addContact(username : string) {
    return this.http.post(this.url+"/api/addContact", {id: this.authService.user.value._id, username: username}).pipe(
      tap(data => {
        console.log(data);
      })
    );
  }


  getContacts() {
    return this.http.get<any>(this.url+"/api/getContacts/"+ this.authService.user.value._id +"/"+ this.socketId).pipe(
      tap((data) => {
        if(data.error) {
          console.log(data.error)
        } else {
          this.contacts = data.slice();
          this.contacts = this.contacts.sort((a,b) => b.lastMessage.date - a.lastMessage.date);
          console.log(this.contacts);
        }
        })
      );
  }

  getMessages(id: string) {
    return this.http.get<Message[]>(this.url+"/api/getMessages/"+id).pipe(
      tap(messages=> {
        this.contact = <Contact>this.contacts.find(contact => contact.chat === id);
        this.messages = messages.sort((a,b) => b.date - a.date);
      })
    );
  }

  sendMessage(message: string, contactId: string) {
    return this.http.put(this.url+"/api/sendMessage",{id: this.authService.user.value._id, message:message,contactId: contactId}).pipe(
      tap(data => {
        console.log(data);
      })
    );
  }

  removeContact(id : string) {
    return this.http.delete(this.url+"/api/removeContact/"+id).pipe(
      tap(data => {
        console.log(data);
      })
    );
  }

  changeProfilePicture(id : string, file : any) {
    const formData: FormData = new FormData();
    formData.append("file",file);
    formData.append("id", id); 

    return this.http.post<any>(this.url+"/api/changeProfilePicture",formData).pipe(
      tap(data => {
        console.log(data);
      })
    );
  }

  //socket
  getMessage() {
    return this.socket.fromEvent<any>("message").pipe(
      tap(data => {
        let message = data.messageObj;
        this.contacts = this.contacts.map( contact => {
          if(data._id === contact.chat) {
            contact.lastMessage = message;
          }
          return contact;
        })
        if(data._id === this.contact.chat) {
          this.messages  = [message, ...this.messages]
        }
        this.contacts = this.contacts.sort((a,b) => b.lastMessage.date - a.lastMessage.date);
      })
    );
  }

  newContact() {
    return this.socket.fromEvent<Contact>("newcontact").pipe(
      tap((contact : Contact)=> {
        this.contacts = [contact, ...this.contacts];
        this.socket.emit('join',{_id: contact._id});
      })
    )
  }

  contactRemoved() {
    return this.socket.fromEvent("removeContact").pipe(
      tap(data => {
        console.log(data);
      })
    )
  }

  removeAllLiseners(){
    this.socket.removeAllListeners();
  }

  logoff() {
    this.socket.disconnect();
  }

}
