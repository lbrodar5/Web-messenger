import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { MessengerService } from '../services/messenger.service';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit  {
  faArrowLeft = faArrowLeft;
  src = "assets/default.jpg";
  file !: any;

  constructor(protected authService : AuthService, protected messengerService : MessengerService){}

  ngOnInit(): void {
    if(this.authService.user.value.profilePicture !== ""){
      this.src= this.messengerService.url + "/api/getProfilePicture/" + this.authService.user.value.username;
    }
  }

  onFileSelected(event : any){
    const file:File = event.target.files[0];
    this.messengerService.changeProfilePicture(this.authService.user.value._id,file).subscribe( data => {
      this.authService.user.value.profilePicture = data.id;
      this.src= this.messengerService.url + "/api/getProfilePicture/" + this.authService.user.value.username;
    })
  }
  
}
