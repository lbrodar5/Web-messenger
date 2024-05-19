import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule, NgForm} from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit{
  mode = "Login";
  oppositeMode = "Signup"
  constructor(protected authService : AuthService ){}

  ngOnInit(): void {
    //this.authService.checkLocalStroage();
  }

  changeMode() {
    let temp = this.mode
    this.mode = this.oppositeMode;
    this.oppositeMode = temp;
    this.authService.error = "";
  }

  onSubmit(form : NgForm) {
    if (this.mode === "Login") {
      this.authService.login(form.value).subscribe();
    } else {
      this.authService.signup(form.value).subscribe();
    }
  }

}
