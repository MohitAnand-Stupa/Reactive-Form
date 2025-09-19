import { Routes } from '@angular/router';
import { UserFormComponent } from './components/user-form/user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user-form', pathMatch: 'full' },
  { path: 'user-form', component: UserFormComponent}
];
