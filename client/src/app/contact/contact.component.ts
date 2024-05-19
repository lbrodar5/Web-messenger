import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model';
import { CommonModule } from '@angular/common';
import { MessengerService } from '../services/messenger.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  @Input() contact!: Contact;
  date = "";
  src = "";

  constructor(private messengerService : MessengerService){}

  ngOnInit(): void {
  this.src = this.messengerService.url + "/api/getProfilePicture/" + this.contact.user;
  if(this.contact.lastMessage.date) {
      this.date = new Date(this.contact.lastMessage.date).toLocaleString("de-DE",{year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'});
    }
  }

}
