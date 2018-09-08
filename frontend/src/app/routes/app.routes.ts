import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { LandingGuard } from '../guards/landing.guard';
import { LandingComponent } from '../components/landing/landing.component';
import { ListComponent } from '../components/list/list.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { RegisterComponent } from '../components/register/register.component';
export const ROUTES: Routes = [
    { path: 'landing', component: LandingComponent},
    { path: 'register/:mode', component: RegisterComponent },
    { path: 'nav', canActivate: [AuthGuard], component: NavigationComponent,
      children: [
        { path: 'list',   canActivate: [AuthGuard], component: ListComponent },
        { path: 'edit/:id',   canActivate: [AuthGuard], component: RegisterComponent },
    ],
    },
    { path: '**', redirectTo : 'landing', pathMatch : 'full'},
];
