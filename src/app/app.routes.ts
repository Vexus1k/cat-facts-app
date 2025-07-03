import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CatFactsComponent } from './components/cat-facts/cat-facts.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cat-facts', component: CatFactsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
