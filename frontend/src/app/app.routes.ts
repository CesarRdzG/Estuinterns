import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { RegisterPage } from './pages/auth-pages/register-page/register-page';
import { LoginPage } from './pages/auth-pages/login-page/login-page';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'home', component: HomePage },
    { path: '**', redirectTo: 'register' }
];
