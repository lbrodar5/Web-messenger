import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit{
  @Input() message!: Message;
  date = "";
  constructor(protected authService : AuthService){}
  
  ngOnInit(): void {
    this.date = new Date(this.message.date).toLocaleString("de-DE",{year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'});
  }
}