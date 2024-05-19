import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:"",redirectTo:"/auth", pathMatch: 'full'},
    {path:"auth", component: AuthComponent},
    {path:"home", component: HomeComponent, canActivate: [authGuard]},
    {path:"chat/:id", component: ChatComponent, canActivate: [authGuard]},
    {path:"profile", component: ProfileComponent, canActivate: [authGuard]}
];
