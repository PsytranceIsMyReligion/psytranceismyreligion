import { environment } from './../environments/environment';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS  } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ListComponent } from "./components/list/list.component";
import {
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatDividerModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatSidenavModule,
  MatListModule,
  MatStepperModule,
  MatDatepickerModule,
  MatRadioModule,
  MatChipsModule,
  MatExpansionModule
} from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { ReactiveFormsModule } from "@angular/forms";
import { MemberService } from "./services/member.service";
import { TokenService } from "./services/token.service";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { JwtModule } from "@auth0/angular-jwt";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { WindowModule } from "@progress/kendo-angular-dialog";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { LandingComponent } from "./components/landing/landing.component";
import { AuthGuard } from "./guards/auth.guard";
import { LandingGuard } from "./guards/landing.guard";
import { ROUTES } from "./routes/app.routes";
import { RegisterComponent } from "./components/register/register.component";
import { MapComponent } from "./components/map/map.component";
import { WatchComponent } from "./components/watch/watch.component";
import { LearnComponent } from "./components/learn/learn.component";
import { ListenComponent } from "./components/listen/listen.component";
import { DiscussComponent } from "./components/discuss/discuss.component";
import { RecruitComponent } from "./components/recruit/recruit.component";
import { MemberListResolve } from "./resolvers/member-list.resolve";
import { HomeComponent } from "./components/home/home.component";
import { RegisterResolve } from "./resolvers/register.resolve";
import { WatchResolve } from "./resolvers/watch.resolve";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { ErrorInterceptor } from './interceptors/error.interceptor';
const env = environment;

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "793868332939-fabl9ni7mpbvg900l7rrkf1tesaunal2.apps.googleusercontent.com"
    )
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("315354469236603")
  }
]);

export function provideConfig() {
  return config;
}

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    NavigationComponent,
    LandingComponent,
    RegisterComponent,
    MapComponent,
    WatchComponent,
    LearnComponent,
    ListenComponent,
    DiscussComponent,
    RecruitComponent,
    HomeComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
    SocialLoginModule,
    MatStepperModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    FlexLayoutModule,
    DropDownsModule,
    WindowModule,
    ButtonsModule,
    MatMomentDateModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [env.baseUri],
        blacklistedRoutes: [env.baseUri + "/api/auth"]
      }
    }),
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],

  providers: [
    AuthGuard,
    LandingGuard,
    MemberService,
    TokenService,
    MemberListResolve,
    RegisterResolve,
    WatchResolve,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor, 
      multi: true 
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
