import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { ContactComponent } from '../contact/contact.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../services/auth.service';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule, ContactComponent, FontAwesomeModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{

  faUserPlus : any = faUserPlus;
  faMessage : any = faMessage;

  username = "";
  getMessageSub !: Subscription;
  newContactSub !: Subscription;
  addContactSub !: Subscription;

  src = "assets/default.jpg";

  constructor(
    protected messengerService : MessengerService,
    protected authService : AuthService
  ) {}
  

  ngOnInit(): void {
    if(this.authService.user.value.profilePicture !== ""){
      this.src= this.messengerService.url + "/api/getProfilePicture/" + this.authService.user.value.username;
    }
    this.getMessageSub = this.messengerService.getMessage().subscribe();
    this.newContactSub = this.messengerService.newContact().subscribe(
      data => console.log(data)
    );
  }

  addContact() {
    this.messengerService.addContact(this.username).subscribe();
    this.username = "";
  }

  ngOnDestroy(): void {
    this.getMessageSub.unsubscribe();
    this.newContactSub.unsubscribe();
    if(this.addContactSub) this.addContactSub.unsubscribe();
  }
}
