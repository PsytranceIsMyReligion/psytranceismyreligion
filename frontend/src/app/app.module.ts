import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }  from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListComponent } from './components/list/list.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatOptionModule,
   MatSelectModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule,
  MatDividerModule, MatSnackBarModule, MatAutocompleteModule,MatSidenavModule,
  MatListModule,MatStepperModule,MatDatepickerModule,MatRadioModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { NavigationComponent } from './components/navigation/navigation.component';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";
import { LandingComponent } from './components/landing/landing.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingGuard} from './guards/landing.guard';
import { ROUTES } from './routes/app.routes';
import { RegisterComponent } from './components/register/register.component';
import { MapComponent } from './components/map/map.component';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("315354469236603")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("793868332939-gm2ov87opcq217snn9g285k3nq97i81h.apps.googleusercontent.com")
        }
      ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    NavigationComponent,
    LandingComponent,
    RegisterComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,MatFormFieldModule, MatInputModule, MatOptionModule,
    MatSelectModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule,
    MatDividerModule, MatSnackBarModule,MatAutocompleteModule,MatSidenavModule,MatListModule,
    SocialLoginModule,MatStepperModule,MatDatepickerModule,MatRadioModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [
    AuthGuard,
    LandingGuard,
    UserService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }],
  bootstrap: [AppComponent]
})


export class AppModule { }
