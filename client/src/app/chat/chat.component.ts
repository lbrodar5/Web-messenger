import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessengerService } from '../services/messenger.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Contact } from '../models/contact.model';
import { faArrowLeft, faEllipsisVertical, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule, FontAwesomeModule, RouterModule, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  faArrowLeft = faArrowLeft;
  faEllipsisVertical = faEllipsisVertical;
  faPaperPlane = faPaperPlane;

  id !:string;
  input = "";
  contact !: Contact;
  getMessageSub !: Subscription;
  src = "assets/default.jpg";

  constructor (
    protected messengerService : MessengerService,
    protected authService : AuthService,
    private route : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = <string>this.route.snapshot.paramMap.get('id');
    this.contact = this.messengerService.contacts.find(contact => contact._id === this.id ) as Contact;
    this.messengerService.getMessages(this.contact.chat).subscribe();
    this.getMessageSub = this.messengerService.getMessage().subscribe();
    this.src = this.messengerService.url + "/api/getProfilePicture/" + this.contact.user;
  }

  sendMessage(){
    if(this.input) {
      this.messengerService.sendMessage(this.input,this.id).subscribe();
      this.input = "";
    }
  }

  ngOnDestroy(): void {
    this.getMessageSub.unsubscribe();
  }
}
